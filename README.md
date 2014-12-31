# watcher-badges

This library is kinda half-baked. Maybe I'll come back and polish it up at some point.

Anyway, it's an Angular module which provides a directive (`watcher-badges`) that listens for two
events:

- `'count-watches'`: Iterates over the DOM under the directive and adds a little "badge" indicating
  how many watchers each element has
- `'clear-watches'`: Clears away all the badges installed from the `'count-watches'` event

Here's what the result looks like:

![watcher-badges screenshot](http://danieltao.com/watcher-badges/screenshot.png)

Demo [here](http://danieltao.com/watcher-badges/).
