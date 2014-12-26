'use strict';

angular.module('core').factory('ControllerHelper', ['$location',
  function ($location) {
    this.create = function create($scope, RestfulResource, options) {
      if (!$scope) {
        $scope = {};
      }
      options = _.defaults(options || {}, {
        path: undefined,
        pageSize: 25,
        post: undefined
      });
      $scope.restfulResources = [];
      $scope.queryParams = {};
      $scope.find = function (force) {
        var page;
        if (force) {
          page = 1;
          $scope.restfulResources.length = 0;
        } else {
          if ($scope.lastPage === -1) {
            return;
          }
          page = ($scope.lastPage || 0) + 1;
        }
        $scope.queryParams.page = page;
        $scope.queryParams.per_page = options.pageSize;
        RestfulResource.getList($scope.queryParams)
          .then(function (result) {
            if (options.post) {
              _.each(result, options.post);
            }
            $scope.restfulResources.push.apply($scope.restfulResources, result);
            if (result.length > 0) {
              $scope.lastPage = page;
            } else {
              $scope.lastPage = -1;
            }
          },
          $scope.errorHandler);

        return $scope.restfulResources;
      };

      $scope.getListPath = function getListPath() {
        return options.path;
      };

      $scope.getViewPath = function getViewPath(id) {
        return options.path + '/' + id;
      };

      $scope.getEditPath = function getEditPath(id) {
        return options.path + '/' + id + '/edit';
      };

      $scope.remove = function (entity) {
        if (confirm('Do you want to remove the record?') === true) {
          if (entity) {
            RestfulResource.one(entity._id).remove().then(function () {
              for (var i in $scope.restfulResources) {
                if ($scope.restfulResources[i] === entity) {
                  $scope.restfulResources.splice(i, 1);
                }
              }
            }, $scope.errorHandler);
          } else {
            RestfulResource.one($scope.restfulResource._id).remove().then(function () {
              $location.path($scope.getListPath());
            }, $scope.errorHandler);
          }
        }
      };

      $scope.dynamicQ = function (q) {
        if (q && q.length > 0) {
          $scope.queryParams.q = q;
        } else {
          if ($scope && $scope.queryParams) {
            delete $scope.queryParams.q;
          }
        }
        return $scope.find(true);
      };

      $scope.errorHandler = function (errorResponse) {
        $scope.error = errorResponse.data.message;
      };

      if ($scope.$on) {
        $scope.$on('globalSearch', function (event, data) {
          $scope.dynamicQ(data);
        });
      }

      return $scope;
    };

    return this;
  }
]);
