/**
 * Takes a Twitter username and returns the UTC datetime that the account was created.
 * Mimics the official Twitter client by using the same API token.
 * @param {String} username Twitter username
 * @return {String} UTC datetime that the account was created
 */
async function createdAt(username) {
  const CT_ZERO = "ct0";
  const TWITTER_CLIENT_TOKEN =
    "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
  const TWITTER_API_URL = `https://api.twitter.com/1.1/users/show.json?screen_name=${username}`;

  const cookie = await browser.cookies.get({
    url: "https://twitter.com",
    name: CT_ZERO,
  });

  const response = await content.fetch(TWITTER_API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TWITTER_CLIENT_TOKEN}`,
      "x-csrf-token": cookie.value,
    },
  });

  const data = await response.json();

  console.log(data.created_at);
  return data.created_at;
}
