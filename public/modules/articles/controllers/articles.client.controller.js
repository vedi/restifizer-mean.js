'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Restangular', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Restangular, Articles) {
    $scope.authentication = Authentication;

    $scope.create = function () {
      Articles.post({
        title: this.title,
        content: this.content
      }).then(function (response) {
        $location.path('articles/' + response._id);

        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.remove = function (article) {
      if (article) {
        article.remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.remove().then(function () {
          $location.path('articles');
        });
      }
    };

    $scope.update = function () {
      var article = $scope.article;
      article.patch(_.pick(article, 'title', 'content')).then(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.find = function () {
      $scope.articles = Articles.getList().$object;
    };

    $scope.findOne = function () {
      $scope.article = Articles.one($stateParams.articleId).get().$object;
    };
  }
]);
