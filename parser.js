var amqp = require('amqp');
var amqpConfig = require('./config/amqp.js');

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
}