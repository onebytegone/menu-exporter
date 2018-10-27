'use strict';

var _ = require('underscore'),
    Q = require('q'),
    moment = require('moment'),
    httpntlm = require('httpntlm'),
    Class = require('class.extend'),
    makeTemplate = require('@silvermine/undertemplate');

module.exports = Class.extend({

   init: function(config) {
      this._config = config;
   },

   fetchAndPutMenu: function() {
      return this._getMenuData()
         .then(this._reformatMenu.bind(this))
         .then(this._putMenuToS3.bind(this));
   },

   _buildMenuURL: function() {
      var urlTemplate = makeTemplate(this._config.endpoint.url);

      return urlTemplate({
         today: moment().format('YYYY-MM-DD'),
         oneMonthFromNow: moment().add(1, 'month').format('YYYY-MM-DD'),
      });
   },

   _getMenuData: function() {
      var opts;

      opts = {
         url: this._buildMenuURL(),
         username: this._config.endpoint.auth.username,
         password: this._config.endpoint.auth.password,
         rejectUnauthorized: false,
      };

      return Q.ninvoke(httpntlm, 'get', opts)
         .then(function(res) {
            if (res.statusCode !== 200) {
               throw new Error('Request to "' + opts.url + '" failed ' + JSON.stringify(res, null, 3));
            }

            return JSON.parse(res.body);
         });
   },

   _reformatMenu: function(menu) {
      return _.map(menu, function(menuForDay) {
         return {
            date: moment(menuForDay.MenuDate).format('YYYY-MM-DD'),
            breakfast: this._extractMeal(menuForDay, 1),
            lunch: this._extractMeal(menuForDay, 2),
            supper: this._extractMeal(menuForDay, 3),
         };
      }.bind(this));
   },

   _extractMeal: function(menuForDay, mealNumber) {
      var rawMealText = menuForDay['Meal' + mealNumber];

      return this._parseMealTextIntoItems(rawMealText);
   },

   _parseMealTextIntoItems: function(mealText) {
      var mealItems = mealText.split('\r\n');

      mealItems = _.reduce(mealItems, function(memo, item) {
         return _.union(memo, item.split(' / '));
      }, []);

      return mealItems;
   },

   _putMenuToS3: function(menu) {
      var jsonMenu = JSON.stringify(menu, null, 3);

      // TODO: put to s3
      console.log(jsonMenu);
      return Q.when();
   },

});
