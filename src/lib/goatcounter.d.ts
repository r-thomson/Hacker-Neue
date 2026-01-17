namespace goatcounter {
	interface DataParams {
		/** Page path (without domain) or event name. */
		path?: string | null;

		/** Human-readable title. */
		title?: string | null;

		/** Where the user came from; can be an URL or any string. */
		referrer?: string | null;

		/** Treat the path as an event, rather than a URL. */
		event?: boolean | null;
	}

	/** Don’t do anything on page load. */
	var no_onload: boolean | undefined;

	/** Don’t bind events. */
	var no_events: boolean | undefined;

	/** Allow requests from local addresses. */
	var allow_local: boolean | undefined;

	/** Allow requests when the page is loaded in a frame or iframe. */
	var allow_frame: boolean | undefined;

	/** Customize the endpoint for sending pageviews to. */
	var endpoint: string | undefined;

	/** Send a pageview or event to GoatCounter. */
	function count(vars?: DataParams): void;

	/** Get URL to send to the server. */
	function url(vars?: DataParams): string | undefined;

	/** Determine if this request should be filtered. */
	function filter(): string | false;

	/** Bind a click event to every element with `data-goatcounter-click`. */
	function bind_events(): void;

	/** Get a single query parameter from the current page's URL. */
	function get_query(name: string): string | undefined;
}
