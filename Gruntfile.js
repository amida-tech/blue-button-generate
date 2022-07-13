/*global module*/

module.exports = function (grunt) {
  var bbg = require('./index');
  var path = require('path');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-coveralls');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-run');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['*.js', '*.json', './lib/*.js', './lib/**/*.js', './test/**/*.js'],
      options: {
        browser: true,
        smarttabs: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        node: true,
        expr: true,
        globals: {
          'it': true,
          'xit': true,
          'xdescribe': true,
          'describe': true,
          'expect': true,
          'before': true,
          'beforeAll': true,
          'after': true,
          'afterAll': true,
          'done': true
        }
      }
    },
    watch: {
      all: {
        files: ['./lib/*.js', './lib/**/*.js', '*.js', './test/**/*.js'],
        tasks: ['default']
      }
    },
    jsbeautifier: {
      beautify: {
        src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/**/*.js', '*.js', 'test/xmlmods/*.json'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      check: {
        src: ['Gruntfile.js', 'lib/*.js', 'lib/**/*.js', 'test/**/*.js', '*.js', 'test/xmlmods/*.json'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    },
    run: {
      test: {
        exec: 'npx jest'
      },
      coverage: {
        exec: 'npx jest --coverage'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '127.0.0.1'
        }
      }
    }
  });

  grunt.registerTask('mkdir-test-temp', 'create test temporary directories', function () {
    grunt.file.mkdir('test/fixtures/files/generated');
  });
  grunt.registerTask('json-to-xml-main', 'converts json files to xml', function (src, dest) {
    grunt.file.recurse(src, function (abspath, rootdir, subdir, filename) {
      var content = grunt.file.read(abspath);
      var json = JSON.parse(content);
      var xml = bbg.generateCCD(json);
      var xmlFilename = path.basename(filename, path.extname(filename)) + '.xml';

      var destPath = subdir ? path.join(dest, subdir, xmlFilename) : path.join(dest, xmlFilename);
      grunt.file.write(destPath, xml);
    });
  });

  //JS beautifier
  grunt.registerTask('beautify', ['jsbeautifier:beautify']);

  // generates xml files from source jsons.
  grunt.registerTask('json-to-xml', ['mkdir-test-temp', 'json-to-xml-main:test/fixtures/json:test/fixtures/files/generated/json_to_xml']);
  // generates xml files from generated jsons.
  grunt.registerTask('re-json-to-xml', ['mkdir-test-temp', 'json-to-xml-main:test/fixtures/files/generated/xml_to_json:test/fixtures/files/generated/re_json_to_xml']);

  // Default task.
  grunt.registerTask('default', ['beautify', 'jshint', 'mkdir-test-temp', 'test']);
  grunt.registerTask('test', ['run:test']);
  grunt.registerTask('coverage', ['run:coverage']);

  grunt.registerTask('commit', ['jshint', 'mkdir-test-temp', 'test']);
  grunt.registerTask('timestamp', function () {
    grunt.log.subhead(Date());
  });
};
