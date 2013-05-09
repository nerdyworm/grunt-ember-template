(function () {
  'use strict';

  App.Kitten = DS.Model.extend({
    name: DS.attr('string'),
    thumb: DS.attr('string')
  });

})();
