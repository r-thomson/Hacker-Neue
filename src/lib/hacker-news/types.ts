export type HNItem = HNStory | HNComment | HNJob | HNPoll | HNPollOpt;
export type DeletedHNItem = HNItem & { deleted: true };
export type DeadHNItem = HNItem & { dead: true };

interface Story {
	id: number;
	type: 'story';
	deleted?: false;
	dead?: boolean;
	time: number;
	title: string;
	url?: string;
	text?: string;
	by: string;
	score: number;
	descendants?: number;
	kids?: number[];
}

interface DeletedStory {
	id: number;
	type: 'story';
	deleted: true;
	dead?: boolean;
	time: number;
}

export type HNStory = Story | DeletedStory;

interface Comment {
	id: number;
	type: 'comment';
	deleted?: false;
	dead?: boolean;
	time: number;
	parent: number;
	by: string;
	text: string;
	kids?: number[];
}

interface DeletedComment {
	id: number;
	type: 'comment';
	deleted: true;
	dead?: boolean;
	time: number;
	parent: number;
}

export type HNComment = Comment | DeletedComment;

interface Job {
	id: number;
	type: 'job';
	deleted?: false;
	dead?: boolean;
	time: number;
	title: string;
	url?: string;
	text?: string;
	by: string;
	score: number;
}

interface DeletedJob {
	id: number;
	type: 'job';
	deleted: true;
	dead?: boolean;
	time: number;
}

export type HNJob = Job | DeletedJob;

interface Poll {
	id: number;
	type: 'poll';
	deleted?: false;
	dead?: boolean;
	time: number;
	title: string;
	text?: string;
	by: string;
	score: number;
	parts: number[];
	descendants?: number;
	kids?: number[];
}

interface DeletedPoll {
	id: number;
	type: 'poll';
	deleted: true;
	dead?: boolean;
	time: number;
}

export type HNPoll = Poll | DeletedPoll;

interface PollOpt {
	id: number;
	type: 'pollopt';
	deleted?: false;
	dead?: boolean;
	time: number;
	by: string;
	text: string;
	poll: number;
	score: number;
}

interface DeletedPollOpt {
	id: number;
	type: 'pollopt';
	deleted: true;
	dead?: boolean;
	time: number;
}

export type HNPollOpt = PollOpt | DeletedPollOpt;

export interface HNUser {
	id: string;
	created: number;
	about?: string;
	karma: number;
	submitted?: number[];
}

export type HNList = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';
