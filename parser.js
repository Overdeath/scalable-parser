var amqp = require('amqp');
var amqpConfig = require('./config/amqp.js');
var request = require('request');
var cheerio = require('cheerio');

//var messageData = require('./doc/amazon.json');

var connection = amqp.createConnection(amqpConfig.connectionConfig);
connection.on('ready', function () {
	console.log("connected;");

	var exc = connection.exchange(amqpConfig.exchangeDetails.name, amqpConfig.exchangeDetails.config, function (exchange) {
	  console.log('Exchange ' + exchange.name + ' is open');
	});

	var q = connection.queue(amqpConfig.queueDetails.name, amqpConfig.queueDetails.config, function (queue) {
  		console.log('Queue ' + queue.name + ' is open');
		q.bind(exc, '#');
		queue.subscribe(processParseJob)
			
	});

});

function processParseJob(message){
	var messageString = message.data.toString();
	var messageData = JSON.parse(messageString);

	if(messageData.target == undefined || messageData.target.url == undefined) {
		return false;
	}

	request(messageData.target.url, function (err, response, body) {
	    if (!err && response.statusCode == 200) {
		    console.log(body);
		    var $ = cheerio.load(body);
		    
		    console.log($(messageData.rules.singleDetector.selector.name).text());
		    console.log(isSinglePage(messageData.rules.singleDetector, $));
	  	}
	});
}

function isSinglePage(detector, cheerio) {
	selectorData = getSelectorData(detector.selector, cheerio);
	if (detector.compareExact != undefined) {
		return getSelectorData == detector.compareExact;
	}
}

function getSelectorData(selector, cheerio) {
	if (selector.name == undefined || selector.name == "") {
		throw new Error('Invalid selector name');
	}
	var selectorName = selector.name;
	if (selector.method == undefined && selector.attr == undefined) {
		selector.method = "text";
	}

	if (selector.method != undefined) {
		switch(selector.method) {
			case "length":
				return cheerio(selectorName).length;
			case "html":
				return cheerio(selectorName).html();
			case "text":
				return cheerio(selectorName).text();
			default:
				throw new Error('Invalid selector method'); 
		}
	} else if(selector.attr != undefined) {
		return cheerio(selectorName).attr(selector.attr);
	}
}