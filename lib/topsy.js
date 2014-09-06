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

topsy.prototype._get = function(resource, format, parameters, callback) {
	var self = this;

	var requestUrlString = this._apiBaseUrl + '/' + resource + '.' + format + '?' + 'apikey=' + this._apiKey;

	for(var key in parameters) {
		var value = parameters[key];

		if(value instanceof Array) {
			value = value.join(',');
		}

		requestUrlString += '&' + key + "=" + encodeURIComponent(value);
	}

	request(requestUrlString, function(err, res, body) {
		if(err) {
			return callback(err, undefined);
		}

		var errorMessage;
		switch(response.statusCode) {
			case 400:
				errorMessage = 'Issue with the parameters';
				break;
			case  403:
				errorMessage = 'Permission denied';
				break;
			case 503:
				errorMessage = 'Credit error';
				break;
			case 500:
				errorMessage = 'Internal Error';
				break;
		}
	});
};
