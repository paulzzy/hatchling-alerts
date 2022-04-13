// Despite appearing to be unused, these are actually necessary for the extension
// `dayjs` uses `globalThis`, so it's called with `globalThis.dayjs`
// See https://stackoverflow.com/questions/71743478/importing-day-js-doesnt-work-in-my-extension-despite-being-usable-in-the-cons
import * as dayjs from "./dayjs@1.11.0/dayjs.min.js";
import * as relativeTime from "./dayjs@1.11.0/relativeTime.js";
import * as updateLocale from "./dayjs@1.11.0/updateLocale.js";

/**
 * Takes a Twitter username and makes a Twitter API request for the UTC datetime
 * that the account was created
 *
 * Mimics the official Twitter client by using the same API token used in `twitter.com`
 * @param {String} username Twitter username
 * @returns {Promise<String>} UTC datetime that the account was created
 */
async function createdAt(username) {
  const CT_ZERO = "ct0";
  const TWITTER_CLIENT_TOKEN =
    "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
  const TWITTER_API_URL = `https://api.twitter.com/1.1/users/show.json?screen_name=${username}`;

  const clientCookie = await browser.cookies.get({
    url: "https://twitter.com",
    name: CT_ZERO,
  });

  const response = await content.fetch(TWITTER_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TWITTER_CLIENT_TOKEN}`,
      "x-csrf-token": clientCookie.value,
    },
  });

  const data = await response.json();

  return data.created_at;
}

/**
 * Calculates the age of a Twitter account and formats it for display in a Tweet
 *
 * Example formatted age: "🐣  1d old"
 * @param {String} username Username of a Twitter account
 * @returns {String} formatted age of the account
 */
async function calculateFormattedAge(username) {
  const NEW_PREFIX = "🐣";
  const OLD_PREFIX = "🐦";

  const twitterApiResponse = await createdAt(username);
  console.log(`${username} was created on ${twitterApiResponse}`);

  globalThis.dayjs.extend(globalThis.dayjs_plugin_relativeTime);
  globalThis.dayjs.extend(globalThis.dayjs_plugin_updateLocale);

  // See https://day.js.org/docs/en/customization/relative-time for
  // documentation on configuring `relativeTime`
  // See https://day.js.org/docs/en/customization/relative-time#relative-time-thresholds-and-rounding
  // and https://day.js.org/docs/en/display/from-now#list-of-breakdown-range
  // for documentation on thresholds and rounding
  const localeConfig = {
    relativeTime: {
      past: "%s old",
      s: `${NEW_PREFIX} <1d`,
      m: `${NEW_PREFIX} <1d`,
      mm: `${NEW_PREFIX} <1d`,
      h: `${NEW_PREFIX} <1d`,
      hh: `${NEW_PREFIX} <1d`,
      d: `${NEW_PREFIX} 1d`,
      dd: `${NEW_PREFIX} %dd`,
      M: `${NEW_PREFIX} 1mo`,
      MM: `${NEW_PREFIX} %dmo`,
      // Accounts younger than or equal to 10 months are considered "new"
      // See https://day.js.org/docs/en/display/from-now#list-of-breakdown-range
      // Honestly the thresholds seem kind of weird, so in the future I might
      // set my own custom thresholds instead of using the default
      y: `${OLD_PREFIX} 1y`,
      yy: `${OLD_PREFIX} %dy`,
    },
  };
  globalThis.dayjs.updateLocale("en", localeConfig);

  const datetimeCreated = globalThis.dayjs(twitterApiResponse);

  const age = datetimeCreated.fromNow();
  return age;
}

browser.runtime.onMessage.addListener(calculateFormattedAge);
