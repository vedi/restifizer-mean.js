'use strict';

module.exports = {
	app: {
		title: 'restifizer-mean.js',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	security: {
		tokenLife: 3600
	},
	port: process.env.PORT || 1338,
	templateEngine: 'swig',
	sessionSecret: '#restifizer-mean.js%MEAN$',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-ui-select/dist/select.css',
				'public/lib/angular-ui-grid/ui-grid.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-ui-grid/ui-grid.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-ui-select/dist/select.js',
				'public/lib/checklist-model/checklist-model.js',
				'public/lib/ng-file-upload/angular-file-upload.js',
				'public/lib/restangular/dist/restangular.js',
				'public/lib/lodash/dist/lodash.js'
			]
		},
		css: [
			'public/tmp/css/*.css',
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
