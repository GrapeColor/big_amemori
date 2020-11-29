import { EventEmitter } from 'events';

export default class Monitor extends EventEmitter {
  /**
   * Create a new monitor.
   * @param {number} interval - Interval to fetch posts.
   */
  constructor(interval) {
    super();

    this.lastCheck = new Date();

    setInterval(() => this.check(), interval * 1000);
  }

  /**
   * Check for new posts.
   * @private
   */
  check() {
    this.fetch(this.lastCheck)
      .then(urls => {
        this.lastCheck = new Date();

        /**
         * Emitted every time there is a new post.
         * @event Monitor#newPost
         * @param {string[]} urls - New posts.
         */
        if (urls.length) this.emit('newPosts', urls);
      })
      .catch(console.error);
  }

  /**
   * Fetch new posts.
   * @param {Date} lastCheck - The date when the last post was checked.
   * @returns {Promise.<string[]>}
   * @private
   */
  async fetch(lastCheck) {
    return [];
  }
}
