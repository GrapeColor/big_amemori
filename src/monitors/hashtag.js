import Monitor from './monitor.js';
import Twitter from 'twitter';

/**
 * The class that monitors new posts on the Twitter hashtag.
 */
export default class Hashtag extends Monitor {
  static client = new Twitter({
    consumer_key       : process.env['TWITTER_CONSUMER_KEY'],
    consumer_secret    : process.env['TWITTER_CONSUMER_SECRET'],
    access_token_key   : process.env['TWITTER_ACCESS_TOKEN'],
    access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET']
  });

  /**
   * Create a hashtag monitor for Twitter users.
   * @param {string} hashtag - The hashtag to get the tweets.
   * @param {number} interval - Interval to fetch posts.
   */
  constructor(hashtag, interval) {
    super(interval);

    this.query = encodeURI(`#${hashtag} exclude:retweets`);
    this.lastID = '';
  }

  /**
   * Fetch a tweet from a hashtag and publish the event as a new post.
   * @param {Date} lastCheck - The date when the last post was checked.
   * @returns {Promise.<string[]>}
   * @private
   */
  async fetch(lastCheck) {
    const tweets = await Hashtag.client.get('search/tweets', {
      q: this.query,
      count: 100,
      since_id: this.lastID.length ? this.lastID : undefined
    });

    const urls = tweets.statuses
      .filter(
        tweet => Date.parse(tweet.created_at) > lastCheck.getTime()
      )
      .map(
        tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
      );

    if (tweets.statuses.length) this.lastID = tweets.statuses[0].id_str;

    return urls;
  }
}
