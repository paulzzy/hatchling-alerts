/**
 * Observes the Tweet timeline and finds new Tweets
 * @param {MutationRecord[]} mutations
 */
const newTweetsObserver = new MutationObserver((mutations) => {
  const TWEETS_CSS_SELECTOR = '[data-testid="tweet"]';
  const INDICATE_MODIFIED = "hatchling-alerts.modified";

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
      if (newTweet === null || newTweet.hasAttribute(INDICATE_MODIFIED)) {
        return;
      }

      const username = findUsername(newTweet);
      getFormattedAccountAge(username).then((age) => {
        addDateToTweet(newTweet, age);
      });

      newTweet.setAttribute(INDICATE_MODIFIED, "true");
    });
  });
});

const observeOptions = { subtree: true, childList: true };
newTweetsObserver.observe(document.documentElement, observeOptions);

/**
 * Find the username associated with a Tweet
 * @param {Element} tweet HTML element that represents a Tweet
 * @returns {String} Twitter username
 */
function findUsername(tweet) {
  const USERNAME_CSS_SELECTOR = "div[id] > div:nth-child(2) span";
  const INDEX_AFTER_AT_SYMBOL = 1;

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

/**
 *
 * @param {Element} tweet HTML element that represents a Tweet
 * @param {String} age formatted age of the account
 */
function addDateToTweet(tweet, age) {
  const MIDDLE_DOT = "·";
  const MIDDLE_DOT_CSS_SELECTOR =
    "div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-child(2)";
  const DEEP_CLONE = true;

  const middleDot = tweet.querySelector(MIDDLE_DOT_CSS_SELECTOR);
  const secondMiddleDot = middleDot.cloneNode(DEEP_CLONE);
  const ageNode = middleDot.cloneNode(DEEP_CLONE);
  secondMiddleDot.firstChild.textContent = MIDDLE_DOT;
  ageNode.firstChild.textContent = age;

  const infoBar = middleDot.parentElement;

  infoBar.appendChild(secondMiddleDot);
  infoBar.appendChild(ageNode);
}
