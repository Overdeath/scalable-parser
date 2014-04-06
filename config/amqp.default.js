exports.connectionConfig = { 
	host: 'localhost',
	port: 5672,
	login: 'guest',
	password: 'guest',
	connectionTimeout: 0,
	authMechanism: 'AMQPLAIN',
	vhost: '/',
	noDelay: true,
	ssl: { enabled : false }
};

exports.queueDetails = {
	name: 'parser',
	config: {
		passive: false,
		durable: true,
		exclusive: false,
		autoDelete: false,
		noDeclare: false,
	}
};

exports.exchangeDetails = {
	name: 'tstxchg',
	config: {
		type: 'fanout',
		passive: false,
		durable: true,
		autoDelete: false,
	}
}

exports.publishOptions = {
	deliveryMode: 2,
}