'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource', 'Restangular', 'ServiceHelper',
	function($resource, Restangular, ServiceHelper) {
		var route = 'users';
		var fields = ['name'];
		var defaults = {
			'name': ''
		};

		return ServiceHelper.createRestfulResource(route, fields, defaults);
	}
]);
