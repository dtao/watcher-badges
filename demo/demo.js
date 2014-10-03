var Demo = angular.module('Demo', ['watcherBadges']);

function DemoController($scope) {
  /** @private {!angular.Scope} */
  this.scope_ = $scope;

  /** @type {string} */
  this.description = '';

  /** @type {!Array.<!Todo>} */
  this.todos = [];
}

DemoController.prototype.countWatches = function() {
  this.scope_.$broadcast('count-watches');
};

DemoController.prototype.clearWatches = function() {
  this.scope_.$broadcast('clear-watches');
};

DemoController.prototype.create = function() {
  if (this.description) {
    this.todos.push(new Todo(this.description));
    this.description = '';
  }
};

DemoController.prototype.createMany = function() {
  for (var i = 0; i < 100; ++i) {
    this.todos.push(new Todo(this.randomDescription_()));
  }
};

DemoController.prototype.randomDescription_ = function() {
  var description = '';
  while (description.length < 25) {
    description += String.fromCharCode('a'.charCodeAt(0) + Math.floor(Math.random() * 26));
  }
  return description;
};

function Todo(description) {
  /** @type {string} */
  this.description = description;

  /** @type {boolean} */
  this.finished = false;
}

Todo.prototype.toggle = function() {
  this.finished = !this.finished;
};

Demo.controller('DemoController', DemoController);
