'use strict';

var _ = require('underscore'),
    expect = require('expect.js'),
    rewire = require('rewire'),
    App = rewire('../src/App.js');

describe('App', function() {
   var fakeConsole = { log: _.noop },
       revert;

   beforeEach(function() {
      revert = App.__set__({
         console: fakeConsole,
      });
   });

   afterEach(function() {
      revert();
   });

   it('is a class', function() {
      expect(App).to.be.a('function');
      expect(new App()).to.be.an('object');
   });

   describe('_parseMealTextIntoItems', function() {
      var app = new App();

      it('seperates items by line', function() {
         expect(app._parseMealTextIntoItems('Ice Cream')).to.eql([ 'Ice Cream' ]);
         expect(app._parseMealTextIntoItems('Cod\r\nLemon\r\nBread')).to.eql([ 'Cod', 'Lemon', 'Bread' ]);
      });

      it('seperates multiple items on same line', function() {
         expect(app._parseMealTextIntoItems('Potatoes / Ketchup\r\nGranola w/ Cranberries\r\nButter / Jam/Jelly'))
            .to
            .eql([ 'Potatoes', 'Ketchup', 'Granola w/ Cranberries', 'Butter', 'Jam/Jelly' ]);
      });

   });

});
