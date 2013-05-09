(function () {
  'use strict';

  Ember.Handlebars.registerBoundHelper('datetime', function (dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString();
  });

})();
