/*global module*/

module.exports = function (grunt) {
    var bbg = require('./index');
    var path = require('path');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-blue-button');

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
                    'describe': true,
                    'before': true,
                    'after': true,
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
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    timeout: '10000',
                    recursive: true
                },
                src: ['test/**/*.js'],
                generator: ['test/sample_runs/*.js']
            }
        },
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                src: 'coverage/lcov.info',

                // When true, grunt-coveralls will only print a warning rather than
                // an error, to prevent CI builds from failing unnecessarily (e.g. if
                // coveralls.io is down). Optional, defaults to false.
                force: false
            },
            //your_target: {
            // Target-specific LCOV coverage file
            //src: 'coverage-results/extra-results-*.info'
            //},
        },
        coverage: {
            options: {
                thresholds: {
                    'statements': 50,
                    'branches': 25,
                    'lines': 50,
                    'functions': 50
                },
                dir: 'coverage/',
                root: '.'
            }
        },
        browserify: {
            standalone: {
                src: ['<%=pkg.main%>'],
                dest: 'dist/<%=pkg.name%>.standalone.js',
                external: ['blue-button'],
                options: {
                    standalone: '<%=pkg.name%>'
                }
            },
            require: {
                src: ['<%=pkg.main%>'],
                dest: 'dist/<%=pkg.name%>.js',
                options: {
                    external: ['blue-button', 'blue-button-xml'],
                    alias: ["<%=pkg.main%>:<%=pkg.name%>"]
                }
            },
            tests: {
                src: ['test/sample_runs/test-gen-parse-gen.js'],
                dest: 'dist/mocha_tests.js',
                options: {
                    external: ['blue-button', 'blue-button-xml'],
                    transform: ['brfs']
                }
            }
        },
        "blue-button": {
            "gen-json": {
                "src": ['test/fixtures/files/ccda_xml/*', 'test/fixtures/files/cms_txt/*'],
                "dest": 'test/fixtures/json',
            },
            "re-gen-json": {
                "src": ['test/fixtures/files/generated/json_to_xml/*'],
                "dest": 'test/fixtures/files/generated/xml_to_json'
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '127.0.0.1'
                }
            }
        },
        'mocha_phantomjs': {
            all: {
                options: {
                    urls: [
                        'http://127.0.0.1:8000/dist/mocha_runner.html'
                    ]
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
    grunt.registerTask('default', ['beautify', 'jshint', 'mkdir-test-temp', 'mochaTest', 'browser-test']);

    grunt.registerTask('browser-test', ['browserify:require', 'browserify:tests', 'connect', 'mocha_phantomjs']);

    grunt.registerTask('commit', ['jshint', 'mkdir-test-temp', 'mochaTest']);
    grunt.registerTask('mocha', ['mkdir-test-temp', 'mochaTest']);
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });
};
