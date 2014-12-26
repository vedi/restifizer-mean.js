'use strict';

//Menu service used for managing menus
angular.module('core').service('Sidebar', [

  function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];

    this.contexts = {};
    this.sidebar = {};
    this.subSidebar = {};

    this.currentContext = null;
    this.currentSubContext = null;

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }

      return false;
    };

    this.addContext = function (context, title, reuse) {
      var contextItems = this.sidebar[context];
      if (contextItems) {
        if (reuse) {
          return this;
        } else {
          throw new Error('Context ' + context + ' already exists');
        }
      }
      this.contexts[context] = {title: title};
      this.sidebar[context] = [];
      return this;
    };

    this.addItem = function (context, title, url, icon, roles) {
      var contextItems = this.sidebar[context];
      if (!contextItems) {
        contextItems = this.sidebar[context] = [];
      }
      contextItems.push({
        title: title,
        url: '/' + url,
        icon: icon,
        roles: roles || this.defaultRoles,
        shouldRender: shouldRender
      });
      return this;
    };

    this.addSubItem = function (context, subContext, title, icon, eventKey, roles) {
      var contexts;
      if (!_.isArray(context)) {
        contexts = [context];
      } else {
        contexts = context;
      }

      _.each(contexts, function (context) {
        var subContexts = this.subSidebar[context];
        if (!subContexts) {
          subContexts = this.subSidebar[context] = {};
        }
        var subSidebar = subContexts[subContext];
        if (!subSidebar) {
          subSidebar = subContexts[subContext] = [];
        }
        subSidebar.push({
          title: title,
          icon: icon,
          eventKey: eventKey,
          roles: roles || this.defaultRoles,
          subContext: subContext,
          shouldRender: shouldRender
        });
      }, this);
      return this;
    };

    this.getContextDataFor = function (context) {
      context = context || this.currentContext;
      if (!context) {
        throw new Error('Wrong context');
      }
      return this.contexts[context];
    };

    this.getSidebarFor = function getSidebarFor(context) {
      context = context || this.currentContext;
      if (!context) {
        throw new Error('Wrong context');
      }
      return this.sidebar[context];
    };

    this.getSubSidebarFor = function getSubSidebarFor(context, subContext) {
      context = context || this.currentContext;
      subContext = subContext || this.currentSubContext;
      if (context && subContext && this.subSidebar[context]) {
        return this.subSidebar[context][subContext];
      }

      return null;
    };

    this.setCurrentContext = function (context) {
      this.currentContext = context;
    };

    this.getCurrentContext = function () {
      return this.currentContext;
    };

    this.setCurrentSubContext = function (subContext) {
      this.currentSubContext = subContext;
    };

    this.getCurrentSubContext = function () {
      return this.currentSubContext;
    };
  }
]);
