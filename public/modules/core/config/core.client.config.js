'use strict';

angular.module('core').run(['$rootScope', '$location', 'Authentication',
	function($rootScope, $location, Authentication) {
		// Define a set of default roles
		var defaultRoles = ['*'];
		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			var neededRoles = (toState.data && toState.data.roles) || defaultRoles;
			if (!_.find(neededRoles, function (neededRole) {
					return neededRole === '*' || Authentication.user.roles.indexOf(neededRole) >= 0;
				})) {
				event.preventDefault();
			}
		});
	}
]);
