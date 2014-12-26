'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'eliquid';
  var applicationModuleVendorDependencies = [
    'ngResource',
    'ngCookies',
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'restangular',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.cellNav',
    'ui.grid.selection',
    'ui.grid.infiniteScroll',
    'ui.grid.resizeColumns',
    'ui.select',
    'angularFileUpload',
    'checklist-model'
  ];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  var restangularConfig = function (RestangularProvider) {
    RestangularProvider.setRestangularFields({id: "_id"});
    RestangularProvider.setBaseUrl('api');
  };

  var selectConfig = function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule,
    restangularConfig: restangularConfig,
    selectConfig: selectConfig
  };
})();
