'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    fingerprint: {
        exclude: ['images/']
    },
    hinting: false,
    storeConfigInMeta: false    
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

// MDB BOOTSTRAP PRO 4.5.3:BEGIN 
  app.import('vendor/mdb/css/bootstrap.min.css');
  app.import('vendor/mdb/css/mdb.min.css');
  app.import('vendor/mdb/css/style.css');
  

  app.import('vendor/mdb/css/mdb.pro.min.css');
  app.import('vendor/mdb/js/jquery-3.3.1.min.js');
       
  app.import('vendor/mdb/js/popper.min.js');
  app.import('vendor/mdb/js/mdb.min.js');
  
  app.import('vendor/mdb/js/mdb.pro.min.js');
  // MDB BOOTSTRAP PRO 4.5.3:END

  //SWEETALERT: BEGIN
  app.import('vendor/sweet/sweetalert.min.js');
  //SWEETALERT: END 

  return app.toTree(); 
};
