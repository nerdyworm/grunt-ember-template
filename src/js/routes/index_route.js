(function () {
  'use strict';

  App.IndexRoute = Ember.Route.extend({
    model: function () {
      return App.Kitten.find();
    }
  });

})();
