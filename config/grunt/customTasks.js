'use strict';

var shelljs = require('shelljs');
var format = require('string-template');
var request = require('request');

module.exports = function(grunt){
  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    var init = require('./app/config/init')();
    var config = require('./app/config/config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });

  // A task for generating documentation using doxx CLI
  grunt.task.registerTask('doxx:shell', 'documentation', function() {
    var options = {
      ignore: 'tests,views',
      source: 'app',
      dest: grunt.config.process('<%= meta.reports %>') + '/docs/doxx',
      title: 'Documentation'
    };

    var template = './node_modules/doxx/bin/doxx --source {source} --target \'{dest}\' --ignore \'{ignore}\' -t \'{title}\'';
    var command = format(template, options);
    var result = shelljs.exec(command);

    if(result.code === 0){
      grunt.log.ok(this.name + ' - Documentation created successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: something went wrong!');
    }
  });

  // A task for running tests with mocha CLI and doing code coverage with istanbul CLI
  grunt.task.registerTask('istanbul:mocha:cover', 'nodejs code coverage', function() {
    var options = {
      configFile: 'config/.istanbul.yml',
      testFiles: 'app/tests/**/*.js',
    };

    var template = 'istanbul cover --config={configFile} node_modules/.bin/_mocha {testFiles}';
    var command = format(template, options);
    var result = shelljs.exec(command);

    if(result.code === 0){
      grunt.log.ok(this.name + ' - Coverage done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }
  });

  grunt.task.registerTask('robot:test', 'add code coverage after functional tests', function() {
    var url = grunt.option( 'host' ) || 'http://localhost:3000' ;
    var options = {
      output: grunt.config.process('<%= meta.reports %>') + '/robot',
      testFiles: 'app/tests/functional/tests',
      url: url
    };

    var template = 'pybot -d {output}  -v HOST:"{url}" {testFiles} ';
    var command = format(template, options);
    var result = shelljs.exec(command);
    if(result.code === 0){
      grunt.log.ok(this.name + ' - done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }

  });

  grunt.task.registerTask('robot:getCoverage', 'add code coverage after functional tests', function() {
    var host = grunt.option( 'host' ) || 'http://localhost:3000' ;
    var options = {
      output: grunt.config.process('<%= meta.reports %>') + '/coverage/robot',
      url: host + '/coverage/download'
    };

    var template = 'wget {url} && unzip download -d {output}';
    var command = format(template, options);
    var result = shelljs.exec(command);
    if(result.code === 0){
      grunt.log.ok(this.name + ' - done successfully');
    }else{
      grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
    }

  });

  grunt.registerTask('verifyCoverageEndpoint', 'checks for ok response from coverage endpoint', function() {
    var host = grunt.option( 'host' ) || 'http://localhost:3000' ;
    var url =  host + '/coverage';
    var done = this.async();

    request(url, function (error, response, body) {
      if(error) {
        grunt.log.writeln('');
        grunt.fail.fatal(error , 6);
      }
      grunt.log.writeln('\nurl: ', url );
      grunt.log.writeln('response: ', response.statusCode );
      if (response.statusCode >= 400){
        grunt.fail.fatal('coverage endpoint is not available' , 6);
      }else{
        grunt.log.writeln('');
        grunt.log.ok('coverage endpoint is ready' );
      }
      done();
    });

  });

  grunt.registerTask('exit', 'Just exits.', function() {

      var result = shelljs.exec('killall grunt && killall node');
      if(result.code === 0){
        grunt.log.ok(this.name + ' - done successfully');
      }else{
        grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
      }
      process.exit(0);
  });
  grunt.registerTask('startApp', 'starts the server.', function() {

      var result = shelljs.exec('node server.js');
      if(result.code === 0){
        grunt.log.ok(this.name + ' - done successfully');
      }else{
        grunt.log.error(this.name + ' - ERROR: oops. something went wrong!');
      }
      process.exit(0);
  });

};
