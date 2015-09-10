(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  app.route = 'friends';
  app.onMenuSelect = function(){
    console.log('Select', app.route);
  };

})(document);
