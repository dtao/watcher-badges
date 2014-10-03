(function(angular) {

  var WatcherBadges = angular.module('watcherBadges', []);

  function WatcherBadgesDirective($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        createWatcherBadgeStylesheet();

        scope.$on('count-watches', function() {
          clearExistingWatcherBadges();
          countWatchersForElement(element[0]);
        });

        scope.$on('clear-watches', function() {
          clearExistingWatcherBadges();
        });
      }
    };

    function createWatcherBadgeStylesheet() {
      if (document.getElementById('watcher-badge-stylesheet')) {
        return;
      }

      var styleElement = document.createElement('STYLE');
      styleElement.id = 'watcher-badge-stylesheet';
      document.head.appendChild(styleElement);

      var stylesheet = styleElement.sheet;
      stylesheet.insertRule(formatRule('.watcher-badge', {
        // Size and position
        'position': 'absolute',
        'height': '20px',
        'min-width': '20px',
        'text-align': 'center',
        'line-height': '20px',
        'padding': '0 0.5em',
        'box-sizing': 'border-box',
        'z-index': 1000,

        // Style and appearance
        'background-color': 'rgba(0, 0, 0, 0.75)',
        'color': 'white',
        'font-weight': 'bold',
        'border-radius': '10px',
        'transition': 'transform 0.5s',
        'transform': 'scale(1, 1)'
      }), 0);

      stylesheet.insertRule(formatRule('.watcher-badge.appearing', {
        'transform': 'scale(5, 5)'
      }), 1);
    }

    function clearExistingWatcherBadges() {
      var existingWatcherBadges = document.querySelectorAll('.watcher-badge');
      for (var i = existingWatcherBadges.length - 1; i >= 0; --i) {
        existingWatcherBadges[i].parentNode.removeChild(existingWatcherBadges[i]);
      }
    }

    function countWatchersForElement(element, scopes) {
      if (/watcher-badge/.test(element.className)) {
        return;
      }

      scopes || (scopes = createSet());

      var scope = angular.element(element).scope();

      // Only display badges when encountering new scopes.
      if (scopes.add(scope)) {
        var watcherCount = countWatchers(scope);

        if (watcherCount === 0) {
          return;
        }

        addWatcherBadge(element, watcherCount);
      }

      forEach(element.children, function(child) {
        countWatchersForElement(child, scopes);
      });
    }

    function countWatchers(scope) {
      var watcherCount = scope.$$watchers ? scope.$$watchers.length : 0;

      var child = scope.$$childHead;
      while (child) {
        watcherCount += countWatchers(child);
        child = child.$$nextSibling;
      }

      return watcherCount;
    }

    function addWatcherBadge(element, count) {
      var badge = document.createElement('DIV');
      badge.className = 'watcher-badge appearing';

      var position = element.getBoundingClientRect();

      // Size and position
      badge.style.top = (position.top + 5) + 'px';
      badge.style.left = (position.right - 20) + 'px';

      // Actually hide the badge initially.
      badge.style.visibility = 'hidden';

      badge.textContent = count;

      document.body.appendChild(badge);

      // Position the badge after actually inserting it into the DOM so that its
      // width is known.
      badge.style.left = (position.right - badge.clientWidth - 5) + 'px';
      badge.style.visibility = 'visible';

      requestAnimationFrame(function() {
        badge.className = badge.className.replace(/\s*appearing\s*/, '');
      });
    }

    function forEach(collection, fn) {
      var i = 0;
      setTimeout(function next() {
        if (i < collection.length) {
          fn(collection[i++]);
          setTimeout(next, 0);
        }
      }, 0);
    }
  }

  function formatRule(selector, properties) {
    properties = Object.keys(properties).map(function(property) {
      return property + ': ' + properties[property] + ';'
    });

    return selector + '{ ' + properties.join(' ') + ' }';
  }

  function createSet() {
    var items = [];

    var set = {
      add: function(item) {
        if (!set.contains(item)) {
          items.push(item);
          return true;
        }
        return false;
      },

      contains: function(item) {
        for (var i = 0; i < items.length; ++i) {
          if (items[i] === item) {
            return true;
          }
        }
        return false;
      }
    };

    return set;
  }

  WatcherBadges.directive('watcherBadges', WatcherBadgesDirective);

}(angular));
