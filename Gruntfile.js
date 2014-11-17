/*global module*/

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-blue-button');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['*.js', './lib/*.js', './lib/**/*.js', './test/**/*.js'],
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
                dest: 'browser/dist/<%=pkg.name%>.standalone.js',
                options: {
                    standalone: '<%=pkg.name%>'
                }
            },
            require: {
                src: ['<%=pkg.main%>'],
                dest: 'browser/dist/<%=pkg.name%>.require.js',
                options: {
                    alias: ["<%=pkg.main%>:<%=pkg.name%>"]
                }
            },
            tests: {
                src: ['test/sample_runs/test-generator-ccda_new.js'],
                dest: 'browser/dist/browserified_tests.js',
                external: ['<%=pkg.main%>'],
                options: {
                    transform: ['brfs']
                }
            }
        },
        "blue-button": {
            "gen-json": {
                "src": ['test/fixtures/files/ccda_xml/*'],
                "dest": 'test/fixtures/json',
            }
        }
    });

    grunt.registerTask('mkdir-test-temp', 'create test temporary directories', function () {
        grunt.file.mkdir('test/fixtures/files/generated');
    });

    //JS beautifier
    grunt.registerTask('beautify', ['jsbeautifier:beautify']);

    // Default task.
    grunt.registerTask('default', ['beautify', 'jshint', 'mkdir-test-temp', 'mochaTest']);

    grunt.registerTask('commit', ['jshint', 'mkdir-test-temp', 'mochaTest']);
    grunt.registerTask('mocha', ['mkdir-test-temp', 'mochaTest']);
    grunt.registerTask('timestamp', function () {
        grunt.log.subhead(Date());
    });
};
