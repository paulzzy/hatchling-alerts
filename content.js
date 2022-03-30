// The right sidebar also has a "Timeline", so using data-testid is necessary to disambiguate
const TWEET_TIMELINE_CSS_SELECTOR =
  '[data-testid="primaryColumn"] [aria-label^="Timeline"]';
const TWEETS_CSS_SELECTOR = '[data-testid="tweet"]';
const USERNAME_CSS_SELECTOR = "div[id] > div:nth-child(2) span";
const INDEX_AFTER_AT_SYMBOL = 1;
const observeOptions = { subtree: true, childList: true };

/**
 * Observe the tweet timeline and find new tweets
 */
const newTweetsObserver = new MutationObserver((mutations) =>
  mutations.forEach((mutation) => {
    if (mutation.type !== "childList") {
      return;
    }

    mutation.addedNodes.forEach((addedNode) => {
      // querySelector() has relatively poor performance
      // If the extension is slow, this is a good target for optimization
      const newTweet = addedNode.querySelector(TWEETS_CSS_SELECTOR);
    });
  })
);
newTweetsObserver.observe(document.documentElement, observeOptions);
