'use strict';

angular.module('core').factory('Grids', ['uiGridConstants',
  function (uiGridConstants) {
    this.createGridOptions = function createGridOptions($scope, RestfulResource, options) {

      options = _.defaults(options || {}, {
        actionColumn: true,
        withMenu: false,
        actions: {
          view: true,
          edit: true,
          remove: true
        }
      });

      var columnDefs = _.collect(RestfulResource.fields, function (field) {
        var columnDef;
        if (typeof field === 'string') {
          columnDef = {field: field};
        } else {
          columnDef = {
            field: field.name,
            displayName: field.title
          };
          if (field.filter) {
            columnDef.cellFilter = field.filter;
          }
        }
        return columnDef;
      });

      if (options.actionColumn) {
        columnDefs.push({
          name: 'Actions',
          enableSorting: false,
          cellTemplate: '/modules/core/views/actions.cell.template.html',
          width: 80
        });
      }

      var gridOptions = {
        $scope: $scope,
        data: $scope.restfulResources,
        columnDefs: columnDefs,
        infiniteScroll: 20,
        enableRowHeaderSelection: false,
        enableRowSelection: true,
        multiSelect: false,
        useExternalSorting: true,
        actions: options.actions,
      };

      gridOptions.add = function (event) {
        var data = _.clone(RestfulResource.defaults);
        $scope.gridOptions.data.push(data);
      };

      gridOptions.remove = function (rowEntity) {
        if (rowEntity._id) {
          $scope.remove(rowEntity);
        } else {
          for (var i in $scope.gridOptions.data) {
            if ($scope.gridOptions.data[i] === rowEntity) {
              $scope.gridOptions.data.splice(i, 1);
            }
          }
        }
      };

      if (options.withMenu) {
        gridOptions.enableGridMenu = true;
        gridOptions.gridMenuCustomItems = [
          {
            title: 'Add',
            action: gridOptions.add
          },
          {
            title: 'Remove',
            action: function ($event) {
              var selectedRows = $scope.gridApi.selection.getSelectedRows();
              _.each(selectedRows, function (rowEntity) {
                gridOptions.remove(rowEntity);
              });
            }
          }
        ];
      }

      $scope.saveRow = function (rowEntity) {
        var promise;
        if (rowEntity._id !== undefined) {
          promise = RestfulResource.one(rowEntity._id).get()
            .then(function (restfulResource) {
              var delta = {};
              _.each(RestfulResource.fields, function (field) {
                var fieldName;
                if (typeof field === 'string') {
                  fieldName = field;
                } else {
                  fieldName = field.name;
                }

                if (restfulResource[fieldName] !== rowEntity[fieldName]) {
                  delta[fieldName] = rowEntity[fieldName];
                }
              });
              return rowEntity.patch(delta);
            });
        } else {
          RestfulResource.restangularizeElement(null, rowEntity);
          promise = rowEntity.post()
            .then(function (result) {
              var idx = $scope.gridOptions.data.indexOf(rowEntity);
              if (idx >= 0) {
                $scope.gridOptions.data[idx] = result;
              }
            });
        }
        $scope.gridApi.rowEdit.setSavePromise($scope.gridApi.grid, rowEntity, promise);
      };

      $scope.sortChanged = function (grid, sortColumns) {
        if (sortColumns.length > 0) {
          var orderBy = {};
          _.each(sortColumns, function (sortColumn) {
            orderBy[sortColumn.name] = (sortColumn.sort.direction === uiGridConstants.ASC ? 1 : -1);
          });
          $scope.queryParams.orderBy = orderBy;
        } else {
          delete $scope.queryParams.orderBy;
        }
        $scope.find(true);
      };

      gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        if (gridApi.rowEdit) {
          gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }

        gridApi.core.on.sortChanged($scope, $scope.sortChanged);

        if (gridApi.infiniteScroll) {
          gridApi.infiniteScroll.on.needLoadMoreData($scope, function () {
            $scope.find();
            gridApi.infiniteScroll.dataLoaded();
          });
        }
      };


      return gridOptions;
    };

    return this;
  }
]);
