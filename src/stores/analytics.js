/**
 * Created by arjun on 10/06/17.
 */

class Analytics {
  logEvent(name, attrObj) {
    console.log('logEvent', name, attrObj);
  }
}

export default (analytics = new Analytics());
