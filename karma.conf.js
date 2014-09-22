'use strict';

/**
 * Module dependencies.
 */
var applicationConfiguration = require('./app/config/config');
var grunt = require('grunt');
//get meta data from grunt config
var metaData = grunt.config.getRaw('meta');

var browserNormalize = function(browser) {
	// normalization process to keep a consistent
	// browser name accross different OS
	return browser.toLowerCase().split(/[ /-]/)[0];
};
// Karma configuration
module.exports = function(config) {
	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage', 'threshold'
		//reporters: ['progress'],
		reporters: ['progress', 'coverage', 'junit', 'threshold'],
		basePath: './',
    preprocessors: {
								// source files, that you wanna generate coverage for
								// do not include tests or libraries
								// (these files will be instrumented by Istanbul)
								'public/*.js': ['coverage'],
								'public/modules/*/js/**/*.js': ['coverage']
						},

		coverageReporter: {
			reporters:[
						{
							type : 'lcov',
							dir : metaData.reports + '/coverage/ui',
							subdir: browserNormalize
						},
						{
							type: 'cobertura',
							dir : metaData.reports + '/coverage/ui',
							subdir: browserNormalize
						}
					]

		},
		junitReporter: {
			  outputFile: metaData.reports + '/junit/test-results.xml',
				suite: 'UI'
			},
		// the configure thresholds
		// configure desired thresholds
		// as coverage increases then icrease threshold
    thresholdReporter: {
      statements: 50,
      branches: 45,
      functions: 50,
      lines: 50
    },


		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true
	});
};
