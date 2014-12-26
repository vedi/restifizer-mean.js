'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

  function () {
    var _this = this;

    _this._data = {
      user: window.user,
      isAdmin: function () {
        return _this._data.user && _this._data.user.roles && _this._data.user.roles.indexOf('admin') >= 0;
      },
      isSeller: function () {
        return _this._data.user && _this._data.user.roles && _this._data.user.roles.indexOf('seller') >= 0;
      },
      isMe: function (id) {
        return _this._data.user._id === id;
      }
    };

    return _this._data;
  }
]);
