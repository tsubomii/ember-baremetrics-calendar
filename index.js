/* jshint node: true */
'use strict';
const fs = require('fs');

const Funnel = require('broccoli-funnel');
const map = require('broccoli-stew').map;
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-baremetrics-calendar',

  included: function(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    while (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    var options = app.options.baremetricsCalendar || {};

    app.import('vendor/Calendar.js');

    if (options.includeStyles !== false) {
      app.import('bower_components/BaremetricsCalendar/public/css/application.css');
    }

    return app;
  },
  treeForVendor: function(defaultTree) {
    const app = this._findHost();
    const assetPath =__dirname + '/' + app.bowerDirectory + '/BaremetricsCalendar/public/js/';

    if (fs.existsSync(assetPath)) {
      let calendarJs = new Funnel(assetPath, {
        files: ['Calendar.js']});
      calendarJs = map(calendarJs,
        (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);
      return new mergeTrees([defaultTree, calendarJs]);
    } else {
      return defaultTree;
    }
  }

};
