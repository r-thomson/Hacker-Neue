const apiPrefix = 'https://hacker-news.firebaseio.com/v0/';

// Utility functions
function getURLParam(name) {
	const url = new URL(window.location.href);
	return url.searchParams.get(name);
}

function clearContainer(container) {
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}
}

// Page rendering functions
function loadStoriesPage(type) {
	const postContainer = document.getElementById('postlist');
	
	const maxStories = +localStorage.getItem('prefMaxstories');
	const pageNum = +getURLParam('page') || 1;
	
	// Add the loading indicator while waiting for the stories to be fetched
	clearContainer(postContainer);
	postContainer.appendChild(makeLoadingElement());
	
	const first = maxStories * (pageNum - 1); // Number of the first item on page
	const last = first + maxStories; // Number of the last item on page
	
	// Set the starting value for post counters based on the page number
	document.body.style.counterReset = 'postCounter ' + first;
	
	fetch(apiPrefix+type+'.json')
		.then(response => response.json())
		.then(stories => {
			const promises = stories.slice(first, last).map(item => {
				return fetch(apiPrefix+'/item/'+item+'.json')
					.then(response => response.json());
			});
			return Promise.all(promises);
		})
		.then(stories => {
			clearContainer(postContainer); // Removes the loader 
			stories.forEach(function(item) {
				const postElement = makePostElement(item);
				postContainer.appendChild(postElement);
			});
			
			const nextPage = +pageNum + 1;
			postContainer.appendChild(makePaginationElement(nextPage));
		});
}

function loadItemPage() {
	const id = getURLParam('id');
	const postContainer = document.getElementById('post');
	const commentContainer = document.getElementById('comments');
	
	clearContainer(commentContainer);
	commentContainer.appendChild(makeLoadingElement());
	
	fetch(apiPrefix+'/item/'+id+'.json')
		.then(response => response.json())
		.then(story => {
			postContainer.appendChild(makePostElement(story));
			document.title += ' - ' + story.title;
			
			if (story.text) {
				const textElement = document.createElement('div');
				textElement.classList.add('post-body', 'text-content');
				textElement.innerHTML = story.text;
				postContainer.appendChild(textElement);
			}
			
			return story;
		})
		.then(story => fetchKids(story))
		.then(story => {
			clearContainer(commentContainer);
			if (story.kids) {
				makeComments(story, commentContainer);
			}
		});
		
		// Possibly combine these recursive functions in future
		
		function fetchKids(item) {
			return new Promise(function(resolve, reject) {
				if (!item.kids) {
					return resolve(item);
				}
				
				const promises = item.kids.map(comment => {
					return fetch(apiPrefix+'/item/'+comment+'.json')
						.then(response => response.json())
						.then(response => fetchKids(response));
				});
				
				Promise.all(promises).then(kids => {
					item.kids = kids.filter(i => !i.deleted);;
					return resolve(item);
				});
			});
		}
		
		function makeComments(item, container) {
			item.kids.forEach(function(current) {
				const commentElement = makeCommentElement(current);
				if (current.kids) {
					makeComments(current, commentElement);
				}
				container.appendChild(commentElement);
			});
		}
}

// DOM element creation functions
function makePostElement(post) {
	if (post.type != 'story') {
		console.error('Item ' + post.id + ' is not a post');
	}
	
	const postElement = document.createElement('div');
	postElement.classList.add('post');
	
	const titleH3 = document.createElement('h3');
	const titleA = document.createElement('a');
	titleA.setAttribute('href', (post.url) ? post.url : '/item?id=' + post.id); // to do
	titleA.innerText = post.title;
	postElement.appendChild(titleH3).appendChild(titleA);
	
	if (post.url) {
		const siteSpan = document.createElement('span');
		siteSpan.classList.add('site');
		var url = new URL(post.url);
		url = url.hostname.replace(/.*\.(?=.*\.)/, '');
		siteSpan.innerText = url;
		postElement.appendChild(siteSpan);
	}
	
	const scoreSpan = document.createElement('span');
	scoreSpan.classList.add('score');
	scoreSpan.innerText = post.score;
	scoreSpan.setAttribute('aria-label', 'points');
	postElement.appendChild(scoreSpan);
	
	// Highlight hot posts
	const threshold = localStorage.getItem('prefHighlightthold');
	if (threshold != '-1' && post.score >= threshold) {
		postElement.classList.add('highlight');
	}
	
	const detailsDiv = document.createElement('div');
	detailsDiv.classList.add('details');
	postElement.appendChild(detailsDiv)
	
	if (post.descendants != undefined) {
		const commentsDiv = document.createElement('span');
		commentsDiv.classList.add('comments');
		const commentsA = document.createElement('a');
		commentsA.setAttribute('href', '/item?id=' + post.id);
		commentsA.innerText = post.descendants + ' comment' + (post.descendants === 1 ? '' : 's');
		detailsDiv.appendChild(commentsDiv).appendChild(commentsA);
	}
	
	const infoSpan = document.createElement('span');
	infoSpan.innerText = 'by ' + post.by;
	detailsDiv.appendChild(infoSpan);
	
	infoSpan.innerHTML += ' ';
	infoSpan.appendChild(makeTimeElement(post.time));
	
	return postElement;
}

function makeCommentElement(comment) {
	if (comment.type != 'comment') {
		console.error('Item ' + comment.id + ' is not a comment');
	}
	
	const commentElement = document.createElement('div');
	commentElement.classList.add('comment');
	
	const collapseDiv = document.createElement('div');
	collapseDiv.classList.add('collapse-button');
	collapseDiv.setAttribute('role', 'button');
	collapseDiv.setAttribute('aria-label', 'Collapse/expand comment');
	collapseDiv.innerText = '[-]';
	collapseDiv.setAttribute('onclick', 'collapseComment(this)');
	commentElement.appendChild(collapseDiv);
	
	const detailsDiv = document.createElement('div');
	detailsDiv.classList.add('details')
	detailsDiv.innerText = comment.by;
	commentElement.appendChild(detailsDiv);
	
	detailsDiv.innerHTML += ' ';
	detailsDiv.appendChild(makeTimeElement(comment.time));
	
	const contentDiv = document.createElement('div');
	contentDiv.classList.add('content', 'text-content');
	contentDiv.innerHTML = comment.text;
	commentElement.appendChild(contentDiv);
	
	return commentElement;
}

function makeLoadingElement() {
	const loadingElement = document.createElement('div');
	loadingElement.classList.add('loader');
	loadingElement.innerText = 'Loading';
	return loadingElement;
}

function makeTimeElement(unixtime) {
	const timeElement = document.createElement('time');
	const time = moment.unix(unixtime);
	timeElement.setAttribute('datetime', time.format('YYYY-M-D H:m:s'));
	timeElement.setAttribute('title', time.format('lll'));
	timeElement.innerText = time.fromNow();
	return timeElement;
}

function makePaginationElement(page) {
	const loadingElement = document.createElement('div');
	loadingElement.classList.add('pagination');
	
	const anchor = document.createElement('a');
	anchor.setAttribute('href', '?page=' + page);
	anchor.innerText = 'Next Page';
	loadingElement.appendChild(anchor);
	return loadingElement;
}

// User preferences management
var prefs = {
	defaults: {
		'prefDarkmode': 'false',
		'prefPagewidth': '1',
		'prefCounters': 'false',
		'prefMaxstories': '30',
		'prefHighlightthold': '250'
	},
	
	setDefaults: function(force) {
		for (var item in this.defaults) {
			if (localStorage.getItem(item) == null || force) {
				localStorage.setItem(item, this.defaults[item]);
			}
		}
	},
	
	togglePref: function(name) {
		if (localStorage.getItem(name) == 'false') {
			localStorage.setItem(name, 'true');
		} else {
			localStorage.setItem(name, 'false');
		}
		this.applyPagePrefs();
	},
	
	setPref: function(name, value) {
		localStorage.setItem(name, value.toString());
		this.applyPagePrefers();
	},
	
	applyPagePrefs : function() {
		const body = document.body;
		const bodyPrefs = ['prefDarkmode', 'prefCounters', 'prefPagewidth'];
		
		for (item of bodyPrefs) {
			body.dataset[item] = localStorage.getItem(item);
		}
	}
}

document.addEventListener('DOMContentLoaded', function(e) {
	prefs.setDefaults(false);
	prefs.applyPagePrefs();
});

function initPrefsForm() {
	const form = document.querySelector('form.preferences');
	const formAssociations = {
		'input-darkmode': 'prefDarkmode',
		'input-counters': 'prefCounters',
		'input-pagewidth': 'prefPagewidth',
		'input-maxstories': 'prefMaxstories',
		'input-highlightscore': 'prefHighlightthold'
	}
	
	for (var item in formAssociations) {
		switch (form.elements[item].type) {
			case 'checkbox':
				form.elements[item].checked = localStorage.getItem(formAssociations[item]) == 'true';
				break;
			case 'select-one':
				form.elements[item].value = localStorage.getItem(formAssociations[item]);
				break;
		}
	}
}

function collapseComment(button) {
	var element = button;
	while (!element.classList.contains('comment')) {
		element = element.parentNode;
		if (element == document) {
			return;
		}
	}
	
	element.classList.toggle('collapsed');
	
	if (element.classList.contains('collapsed')) {
		button.innerText = '[+]';
	} else {
		button.innerText = '[-]';
	}
}
