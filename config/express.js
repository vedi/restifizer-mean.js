'use strict';

/**
 * Module dependencies.
 */
var
	express = require('express'),
	bytes = require('bytes'),
	log = require('./log')(module),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	mongoStore = require('connect-mongo')({
		session: session
	}),
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path'),
	OAuthifizer = require('oauthifizer'),
	multipart = require('connect-multiparty'),
	Restifizer = require('restifizer').Restifizer;

module.exports = function(db) {
	// Initialize express app
	var app = express();

	app.enable('trust proxy');

	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.jsFiles = config.getJavaScriptAssets();
	app.locals.cssFiles = config.getCSSAssets();

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		morgan.token('resdata', function(req, res) {
			var
				status = res.statusCode,
				color = 32;

			if (status >= 500) color = 31;
			else if (status >= 400) color = 33;
			else if (status >= 300) color = 36;

			if (res.statusCode !== 404 && // NOT_FOUND
				log.levels[log.transports.console.level] <= log.levels.debug) {

				return '\x1b[' + color + 'm\n\treq->\x1b[90m' + (req.body ? ('\n' + JSON.stringify(req.body, null, 2)) : '') +
					'\x1b[' + color + 'm\n\tres<-\x1b[90m' + (res.restfulResult ? ('\n' + JSON.stringify(res.restfulResult, null, 2)) : '') + '\x1b[0m';
			} else {
				return '';
			}
		});
		app.use(morgan('[:date[clf]] :method :url :status :response-time ms - :res[content-length] :resdata'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(function(req, res, next) {
		// Code was taken from here: https://github.com/jshttp/basic-auth/blob/master/index.js
		req = req.req || req;

		var auth = req.headers.authorization;
		if (!auth) return next();

		// malformed
		var parts = auth.split(' ');
		if ('basic' !== parts[0].toLowerCase()) return next();
		if (!parts[1]) return next();
		auth = parts[1];

		// credentials
		auth = new Buffer(auth, 'base64').toString();
		auth = auth.match(/^([^:]*):(.*)$/);
		if (!auth) return next();

		if (!req.body) {
			req.body = {};
		}
		req.body.client_id = auth[1];
		req.body.client_secret = auth[2];

		return next();

	});
	app.use(methodOverride());

	app.use(multipart());

	// Enable jsonp
	app.enable('jsonp callback');

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(OAuthifizer.passport.initialize());
	app.use(OAuthifizer.passport.session());

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

	var AuthDelegate = require('./authDelegate');
	var oAuth2 = new OAuthifizer(new AuthDelegate());
	app.route('/oauth')
		.post(oAuth2.getToken())
	;

	var restifizer = new Restifizer(app, {
		log: log
	});

	restifizer
		.addController(require('../app/controllers/users.restifizer.controller.js'))
		.addController(require('../app/controllers/articles.restifizer.controller.js'))
	;


	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(err.status || 500);
		if (req.accepts('html')) {
			res.render('500', {
				error: err.stack
			});
		} else {
			res.send({ error: err.message });
		}
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404);
		if (req.accepts('html')) {
			res.render('404', {
				url: req.originalUrl,
				error: 'Not Found'
			});
		} else {
			res.send({
				url: req.originalUrl,
				error: 'Not Found'
			});
		}
	});

	return app;
};
