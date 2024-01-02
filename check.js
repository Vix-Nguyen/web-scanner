const libraries = {
	jQuery: {
		id: "jquery",
		name: "jQuery",
		url: "http://jquery.com",
		npm: "jquery",
		test: function (win) {
			const jq = win.jQuery || win.$;
			if (jq && jq.fn && jq.fn.jquery) {
				return { version: jq.fn.jquery.replace(/[^\d+.]/g, "") || undefined };
			}
			return false;
		}.toString(),
	},

	React: {
		id: "react",
		name: "React",
		url: "https://reactjs.org/",
		npm: "react",
		test: function (win) {
			function isMatch(node) {
				return node != undefined && node._reactRootContainer != undefined;
			}

			function nodeFilter(node) {
				return isMatch(node)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP;
			}

			const reactRoot = document.querySelector("#react-root");
			const altHasReact = document.querySelector("*[data-reactroot]");
			const bodyReactRoot =
				isMatch(document.body) || isMatch(document.body.firstElementChild);
			const hasReactRoot =
				bodyReactRoot ||
				document
					.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, nodeFilter)
					.nextNode() != undefined;

			if (
				hasReactRoot ||
				(reactRoot && reactRoot.innerText.length > 0) ||
				altHasReact ||
				(win.React && win.React.Component)
			) {
				return { version: (win.React && win.React.version) || undefined };
			}

			return false;
		}.toString(),
	},

	Remix: {
		id: "remix",
		name: "Remix",
		url: "https://remix.run/",
		npm: "remix",
		test: function (win) {
			if (win.__remixContext) {
				return { version: null };
			}
			return false;
		}.toString(),
	},

	"Next.js": {
		id: "next",
		name: "Next.js",
		url: "https://nextjs.org/",
		npm: "next",
		test: function (win) {
			if (win.__NEXT_DATA__ && win.__NEXT_DATA__.buildId) {
				return { version: (win.next && win.next.version) || undefined };
			}
			return false;
		}.toString(),
	},

	Angular: {
		id: "angular",
		name: "Angular",
		url: "https://angular.io/",
		npm: "@angular/core",
		test: function (win) {
			const ngVersion = win.document.querySelector("[ng-version]");
			if (ngVersion) {
				return { version: ngVersion.getAttribute("ng-version") || undefined };
			}

			if (win.ng && win.ng.probe instanceof Function) {
				return { version: undefined };
			}

			return false;
		}.toString(),
	},

	"Ember.js": {
		id: "emberjs",
		name: "Ember.js",
		url: "https://emberjs.com/",
		npm: "ember-source",
		test: function (win) {
			const ember = win.Ember || win.Em;
			if (ember && ember.GUID_KEY) {
				return { version: ember.VERSION || undefined };
			}

			return false;
		}.toString(),
	},
	"Nuxt.js": {
		id: "nuxt",
		name: "Nuxt.js",
		url: "https://nuxtjs.org/",
		npm: "nuxt",
		test: function (win) {
			if (
				win.__NUXT__ ||
				win.$nuxt ||
				[...win.document.querySelectorAll("*")].some(
					(element) => element.__vue__?.nuxt
				)
			) {
				return { version: undefined };
			}

			return false;
		}.toString(),
	},
	"Nuxt.js (Fast path)": {
		id: "nuxt-fast",
		name: "Nuxt.js (Fast path)",
		url: "https://nuxtjs.org/",
		npm: "nuxt",
		test: function (win) {
			if (win.__NUXT__ || win.$nuxt) {
				return { version: undefined };
			}

			return false;
		}.toString(),
	},
	"Moment.js": {
		id: "momentjs",
		name: "Moment.js",
		url: "http://momentjs.com/",
		npm: "moment",
		test: function (win) {
			if (win.moment && (win.moment.isMoment || win.moment.lang)) {
				return { version: win.moment.version || undefined };
			}

			return false;
		}.toString(),
	},
	Gatsby: {
		id: "gatsby",
		name: "Gatsby",
		url: "https://www.gatsbyjs.org/",
		npm: "gatsby",
		test: function (win) {
			if (win.document.querySelector("#___gatsby")) {
				return { version: undefined };
			}
			return false;
		}.toString(),
	},
	Shopify: {
		id: "shopify",
		name: "Shopify",
		url: "https://www.shopify.com/",
		npm: undefined,
		test: function (win) {
			if (win.Shopify && win.Shopify.shop) {
				return { version: undefined };
			}
			return false;
		}.toString(),
	},
	WordPress: {
		id: "wordpress",
		name: "WordPress",
		url: "https://wordpress.org/",
		npm: undefined,
		test: function (win) {
			const hasAPILinkElement = Boolean(
				win.document.querySelector('link[rel="https://api.w.org/"]')
			);
			const hasWPIncludes =
				win.document.querySelectorAll(
					'link[href*="wp-includes"], script[src*="wp-includes"]'
				).length > 0;

			if (!hasAPILinkElement && !hasWPIncludes) {
				return false;
			}

			const generatorMeta = win.document.querySelector(
				'meta[name=generator][content^="WordPress"]'
			);
			const version = generatorMeta
				? generatorMeta.getAttribute("content").replace(/^\w+\s/, "")
				: undefined;

			return { version };
		}.toString(),
	},
	Wix: {
		id: "wix",
		name: "Wix",
		url: "https://www.wix.com/",
		npm: undefined,
		test: function (win) {
			if (
				win.wixPerformanceMeasurements &&
				win.wixPerformanceMeasurements.info
			) {
				return { version: undefined };
			}

			if (win.wixBiSession && win.wixBiSession.info) {
				return { version: undefined };
			}

			return false;
		}.toString(),
	},
	Wiz: {
		id: "wiz",
		name: "Wiz",
		url: "https://github.com/johnmichel/Library-Detector-for-Chrome/pull/147",
		npm: undefined,
		test: function (win) {
			if (win.document.__wizdispatcher) {
				return { version: undefined };
			}
			return false;
		}.toString(),
	},
	"core-js": {
		id: "corejs",
		name: "core-js",
		url: "https://github.com/zloirock/core-js",
		npm: "core-js",
		test: function (win) {
			const shared = win["__core-js_shared__"];
			const core = win.core;
			if (shared) {
				const versions = shared.versions;
				return {
					version: Array.isArray(versions)
						? versions
							.map((it) => `core-js-${it.mode}@${it.version}`)
							.join("; ")
						: undefined,
				};
			}

			if (core) {
				return { version: core.version || undefined };
			}

			return false;
		}.toString(),
	},
	Drupal: {
		id: "drupal",
		name: "Drupal",
		url: "https://www.drupal.org/",
		npm: undefined,
		test: function (win) {
			const generatorMeta = document.querySelector(
				'meta[name="generator"][content^="Drupal"]'
			);

			// Detect Drupal resources patterns
			const resDrupal = /\/sites\/(?:default|all)\/(?:themes|modules|files)/;
			const res = Array.from(
				document.querySelectorAll("link,style,script") || []
			);

			if (
				res.some((s) => resDrupal.test(s.src)) ||
				res.some((s) => resDrupal.test(s.href)) ||
				generatorMeta ||
				(win.Drupal && win.Drupal.behaviors)
			) {
				return { version: undefined };
			}

			return false;
		}.toString(),
	},
	"Guess.js": {
		id: "guessjs",
		name: "Guess.js",
		url: "https://guess-js.github.io/",
		test: function (win) {
			if (win.__GUESS__ && win.__GUESS__.guess) {
				return { version: undefined };
			}
			return false;
		}.toString(),
	},
};

const frameworkList = Object.entries(libraries)
  .map(([key, library]) => {
    const newFn = new Function(`return ${library.test}`)();
    const version = newFn(window);

    if (Boolean(version)) {
      return {
        name: library?.name,
        url: library?.url,
        npm: library?.npm,
        version: version?.version
      };
    }

    return null;
  })
  .filter(Boolean);

return frameworkList;

