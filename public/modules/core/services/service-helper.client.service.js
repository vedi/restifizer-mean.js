'use strict';

angular.module('core').factory('ServiceHelper', ['Restangular',
  function (Restangular) {
    this.createRestfulResource = function createRestfulResource(route, fields, defaults) {
      var restResource = Restangular.all(route);
      restResource.fields = fields;
      restResource.defaults = defaults;
      restResource.restangularizeElement = function (parent, element, queryParams) {
        Restangular.restangularizeElement(parent, element, route, queryParams);
      };
      restResource.restangularizeCollection = function (parent, element, queryParams) {
        Restangular.restangularizeCollection(parent, element, route, queryParams);
      };
      return restResource;
    };

    return this;
  }
]);
