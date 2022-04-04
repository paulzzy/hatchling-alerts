// The right sidebar also has a "Timeline", so using data-testid is necessary to disambiguate
const TWEET_TIMELINE_CSS_SELECTOR =
  '[data-testid="primaryColumn"] [aria-label^="Timeline"]';
const TWEETS_CSS_SELECTOR = '[data-testid="tweet"]';
const USERNAME_CSS_SELECTOR = "div[id] > div:nth-child(2) span";
const INDEX_AFTER_AT_SYMBOL = 1;
const observeOptions = { subtree: true, childList: true };

/**
 * Observes the Tweet timeline and finds new Tweets
 * @param {MutationRecord[]} mutations
 */
const newTweetsObserver = new MutationObserver((mutations) =>
  mutations.forEach((mutation) => {
    if (mutation.type !== "childList") {
      return;
    }

    mutation.addedNodes.forEach((addedNode) => {
      // `querySelector()` has relatively poor performance
      // If the extension is slow, this is a good target for optimization
      if (addedNode.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const newTweet = addedNode.querySelector(TWEETS_CSS_SELECTOR);
      if (newTweet === null) {
        return;
      }

      const username = findUsername(newTweet);
      getFormattedAccountAge(username).then((age) => {
        console.log(username + " is " + age);
      });
    });
  })
);
newTweetsObserver.observe(document.documentElement, observeOptions);

/**
 * Find the username associated with a Tweet
 * @param {Element} tweet HTML element that represents a Tweet
 * @returns {String} Twitter username
 */
function findUsername(tweet) {
  const usernameNode = tweet.querySelector(USERNAME_CSS_SELECTOR);
  const username = usernameNode.textContent.slice(INDEX_AFTER_AT_SYMBOL);
  return username;
}

/**
 * Get the formatted age of a Twitter account from `background.js`
 * @see calculateFormattedAge in background.js
 * @param {String} username
 */
async function getFormattedAccountAge(username) {
  // Sends `username` to `background.js`, which returns when the account was created
  const age = await browser.runtime.sendMessage(username);
  return age;
}
