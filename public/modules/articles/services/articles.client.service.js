'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource', 'Restangular',
	function($resource, Restangular) {
		Restangular.setBaseUrl('api');
		return Restangular.all('articles');
	}
]);
