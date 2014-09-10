var readline = require('readline');
var Topsy = require('../lib/topsy');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var apiKey;

console.log('WARNING: These tests consume your Topsy API credit.\n');

rl.question('Please enter a Topsy API key.\n', function(answer) {
	apiKey = answer;

	var topsy = new Topsy(apiKey, 'json');

	topsy.get('content/tweets', {q: 'obama', mintime: '1370217600', maxtime: '1370893329', include_metrics: '1'}, function(err, data) {
		if(err) throw err;
		console.log(data);
	});

	topsy.get('content/bulktweets', {q: 'obama'}, function(err, data) {
		if(err) throw err;
		console.log(data);
	});

	topsy.get('content/streaming', {q: 'obama'}, function(err, data) {
		if(err) throw err;
		console.log(data);
	});

	topsy.get('content/links', {q: 'obama', mintime: '1370217600', maxtime: '1370893329'}, function(err, data) {
		if(err) throw err;
		console.log(data);
	});
});
