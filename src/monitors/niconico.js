import Monitor from './monitor.js';
import Parser from 'rss-parser';

/**
 * The class that monitors new posts on any niconico tag.
 */
export default class Niconico extends Monitor {
  /**
   * Create a niconico tag monitor.
   * @param {string} tagname - The ID of the YouTube channel to monitor.
   * @param {number} interval - Interval to fetch posts.
   */
  constructor(tagname, interval) {
    super(interval);

    this.url = encodeURI(`https://www.nicovideo.jp/tag/${tagname}?sort=f&rss=2.0`);
    this.parser = new Parser({ headers: { Accept: 'text/html' }});
  }

  /**
   * Fetch a RSS and emit an event as new posts.
   * @param {Date} lastCheck - The date when the last post was checked.
   * @returns {Promise.<string[]>}
   * @private
   */
  async fetch(lastCheck) {
    const feed = await this.parser.parseURL(this.url);
    const urls = feed.items
      .filter(
        item => Date.parse(item.pubDate) > lastCheck.getTime()
      )
      .map(
        item => item.link.replace(/\?.*$/, '')
      );

    return urls;
  }
}
