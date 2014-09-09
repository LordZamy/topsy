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

var resources = ['content/tweets', 'content/bulktweets', 'content/streaming', 'content/links',
				'content/photos', 'content/videos', 'content/citations', 'content/conversation',
				'content/tweet', 'content/validate', 'content/location', 'metrics/mentions',
				'metrics/citations', 'metrics/impressions', 'metrics/sentiment', 'metrics/geo',
				'insights/relatedterms', 'insights/influencers', 'insights/author'];

var numResources = resources.length;

topsy.prototype.isValidResource = function(resource) {
	for(var i = 0; i < numResources; i++) {
		if(resource === resources[i]) return true;
	}

	throw new Error('The resource to get does not exist');
};

topsy.prototype.get = function(resource, parameters, callback) {
	this.isValidResource(resource);
	this._get(resource, this._apiFormat, parameters, callback);
};

topsy.prototype._get = function(resource, format, parameters, callback) {
	// change url for content/streaming
	if(resource === 'content/streaming') this._apiBaseUrl = 'http://stream.topsy.com/v2';

	var requestUrlString = this._apiBaseUrl + '/' + resource + '.' + format + '?' + 'apikey=' + this._apiKey;

	// switch back to default url
	if(this._apiBaseUrl !== 'http://api.topsy.com/v2') this._apiBaseUrl = 'http://api.topsy.com/v2';

	for(var key in parameters) {
		var value = parameters[key];

		if(value instanceof Array) {
			value = value.join(',');
		}

		requestUrlString += '&' + key + "=" + encodeURIComponent(value);
	}

	request(requestUrlString, function(err, res, body) {
		if(err) {
			return callback(err, null);
		}

		// error handling status codes at
		// http://api.topsy.com/doc/error-handling/
		var errorMessage;
		switch(res.statusCode) {
			case 400:
				errorMessage = 'Issue with the parameters';
				break;
			case 403:
				errorMessage = 'Permission denied';
				break;
			case 503:
				errorMessage = 'Credit error';
				break;
			case 500:
				errorMessage = 'Internal Error';
				break;
		}

		if(errorMessage) {
			return callback(new Error(errorMessage), null);
		}

		var result;

		try {
			result = JSON.parse(body);
		} catch(e) {
			body = '[' + body.split('\n').toString().slice(0, -1) + ']';
			result = {};
			result.response = JSON.parse(body);
		}

		if(result.response) {
			return callback(null, result.response);
		}
	});
};

module.exports = topsy;
