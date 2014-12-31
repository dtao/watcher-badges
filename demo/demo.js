var Demo = angular.module('Demo', ['wu.masonry', 'watcherBadges']);

function DemoController($scope, $http) {
  /** @private {!angular.Scope} */
  this.scope_ = $scope;

  /** @private {!angular.$http} */
  this.http_ = $http;

  /** @type {string} */
  this.query = '';

  /** @type {!Array.<!Artist>} */
  this.artists = [];

  /** @type {?Artist} */
  this.currentArtist = null;

  this.lookupArtists([
    'Coldplay',
    'Radiohead',
    'Flaming Lips',
    'Arcade Fire',
    'Beck'
  ]);
}

DemoController.prototype.countWatches = function() {
  this.scope_.$broadcast('count-watches');
};

DemoController.prototype.clearWatches = function() {
  this.scope_.$broadcast('clear-watches');
};

DemoController.prototype.search = function() {
  if (this.query) {
    this.lookupArtist(this.query);
    this.query = '';
  }
};

DemoController.prototype.lookupArtist = function(name) {
  var requestData = {
    api_key: 'S8DDUO8ALSLUMYHEK',
    format: 'json',
    name: name,
    results: 1,
    bucket: ['biographies', 'images', 'urls']
  };

  var artists = this.artists;
  this.http_.get(this.createSearchUrl_(requestData)).success(function(response) {
    var artistData = response.response.artists[0];
    artists.push(new Artist(artistData));
  });
};

DemoController.prototype.lookupArtists = function(names) {
  for (var i = 0; i < names.length; ++i) {
    this.lookupArtist(names[i]);
  }
};

DemoController.prototype.selectArtist = function(artist) {
  this.currentArtist = artist;
};

DemoController.prototype.createSearchUrl_ = function(data) {
  var query = [];
  for (var key in data) {
    this.appendQueryParam_(query, key, data[key]);
  }
  return 'http://developer.echonest.com/api/v4/artist/search?' + query.join('&');
};

DemoController.prototype.appendQueryParam_ = function(query, key, value) {
  if (value instanceof Array) {
    for (var i = 0; i < value.length; ++i) {
      this.appendQueryParam_(query, key, value[i]);
    }
  } else {
    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
  }
};

function Artist(data) {
  /** @type {string} */
  this.name = data.name;

  /**
   * @type {{
   *   text: string,
   *   readMoreLink: string
   * }}
   */
  this.biography = this.findBiography_(data.biographies);

  /** @type {string} */
  this.imageUrl = data.images[0].url;

  /** @type {string} */
  this.artistUrl = data.urls.official_url;
}

Artist.prototype.findBiography_ = function(biographies) {
  var biography = biographies[0];
  for (var i = 0; i < biographies.length; ++i) {
    if (biographies[i].site === 'wikipedia') {
      biography = biographies[i];
      break;
    }
  }

  return {
    text: biography.text,
    readMoreLink: biography.url
  };
};

Demo.controller('DemoController', DemoController);
