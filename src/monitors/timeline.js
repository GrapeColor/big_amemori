import Monitor from './monitor.js';
import Twitter from 'twitter';

/**
 * The class that monitors new posts on the Twitter user's timeline.
 */
export default class Timeline extends Monitor {
  static client = new Twitter({
    consumer_key       : process.env['TWITTER_CONSUMER_KEY'],
    consumer_secret    : process.env['TWITTER_CONSUMER_SECRET'],
    access_token_key   : process.env['TWITTER_ACCESS_TOKEN'],
    access_token_secret: process.env['TWITTER_ACCESS_TOKEN_SECRET']
  });

  /**
   * Create a timeline monitor for Twitter users.
   * @param {string} username - The user name to get the timeline.
   * @param {number} interval - Interval to fetch posts.
   */
  constructor(username, interval) {
    super(interval);

    this.username = username;
    this.lastID = '';
  }

  /**
   * Fetch a tweet from a timeline and publish the event as a new post.
   * @param {Date} lastCheck - The date when the last post was checked.
   * @returns {Promise.<string[]>}
   * @private
   */
  async fetch(lastCheck) {
    const tweets = await Timeline.client.get('statuses/user_timeline', {
      screen_name: this.username,
      count: 100,
      since_id: this.lastID.length ? this.lastID : undefined
    });

    const urls = tweets
      .filter(
        tweet => Date.parse(tweet.created_at) > lastCheck.getTime()
      )
      .map(
        tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
      );

    if (tweets.length) this.lastID = tweets[0].id_str;

    return urls
  }
}
