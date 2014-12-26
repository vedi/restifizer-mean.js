'use strict';

angular.module('core').controller('SidebarController', [
  '$scope',
  '$rootScope',
  'Authentication',
  '$state',
  'Sidebar',
  function ($scope,
            $rootScope,
            Authentication,
            $state,
            Sidebar) {

    $scope.authentication = Authentication;

    $scope.applyContext = function applyContext() {
      if (Sidebar.getCurrentContext()) {
        $scope.contextData = Sidebar.getContextDataFor();
        $scope.sidebarItems = Sidebar.getSidebarFor();
      } else {
        $scope.contextData = {};
        $scope.sidebarItems = [];
      }
      $scope.applySubContext();
    };

    $scope.applySubContext = function applySubContext() {
      if (Sidebar.getCurrentSubContext()) {
        $scope.subSidebarItems = Sidebar.getSubSidebarFor();
      } else {
        $scope.subSidebarItems = [];
      }
    };

    $scope.applyContext();

    $scope.onItemClicked = function onItemClicked(item) {
      $scope.$emit(item.eventKey);
    };

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {

      if (toState.data && toState.data.context) {
        Sidebar.setCurrentContext(toState.data.context);
      } else {
        Sidebar.setCurrentContext(null);
      }
      $scope.applyContext();
    });

    $rootScope.$on('subContextChanged', function (event, subContext) {
      Sidebar.setCurrentSubContext(subContext);
      $scope.applySubContext();
    });
  }
]);
