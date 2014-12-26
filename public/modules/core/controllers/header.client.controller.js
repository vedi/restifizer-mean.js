'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus', 'Sidebar',
	function($scope, $rootScope, Authentication, Menus, Sidebar) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.isItemInConext = function(item) {
			return item.link === Sidebar.getCurrentContext();
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
			$scope.searchText = '';
		});

		$scope.searchChanged = function () {
			if ($scope.searchFuture) {
				clearTimeout($scope.searchFuture);
			}
			$scope.searchFuture = setTimeout($scope.search, 1000);
		};

		$scope.search = function () {
			$rootScope.$broadcast('globalSearch', $scope.searchText);
		};
	}
]);
