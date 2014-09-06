request = require('request');

var topsy = function(apiKey, apiFormat) {
	if(!apiKey) {
		throw new Error('Please provide an API key for Topsy.');
	}

	if(!(apiFormat === 'json' || apiFormat === 'jsonp' || !!apiFormat)) {
		throw new Error('API format must be json, jsonp or empty.');
	}

	this._apiBaseUrl = 'http://api.topsy.com/v2';
	this._apiFormat = apiFormat || 'json';
	this._apiKey = apiKey;
};
