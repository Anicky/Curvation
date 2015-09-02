module.exports = function (grunt) {
    // Load the plugin that provides the tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        paths: {
            src: {
                folder: 'src/',
                js: '<%= paths.src.folder %>js/**/*.js',
                css: '<%= paths.src.folder %>css/**/*.css'
            },
            dest: {
                folder: 'public/',
                js: '<%= paths.dest.folder %>js/<%= pkg.name %>.js',
                jsMin: '<%= paths.dest.folder %>js/<%= pkg.name %>.min.js',
                css: '<%= paths.dest.folder %>css/<%= pkg.name %>.css',
                cssMin: '<%= paths.dest.folder %>css/<%= pkg.name %>.min.css',
            }
        },

        // Copy task
        copy: {
            index: {
                src: '<%= paths.src.folder %>index.html',
                dest: '<%= paths.dest.folder %>index.html',
            }
        },

        // JSHint task
        jshint: {
            options: {
                esnext: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                src: '<%= paths.src.js %>'
            }
        },

        // Concatenation task
        concat: {
            options: {
                separator: ''
            },
            js: {
                src: '<%= paths.src.js %>',
                dest: '<%= paths.dest.js %>'
            },
            css: {
                src: '<%= paths.src.css %>',
                dest: '<%= paths.dest.cssMin %>'
            }
        },

        // Minification tasks
        uglify: {
            prod: {
                options: {
                    banner: '<%= banner %> ',
                    compress: true,
                    mangle: true,
                    drop_console: true
                },
                src: '<%= paths.src.js %>',
                dest: '<%= paths.dest.jsMin %>'
            },
            dev: {
                options: {
                    banner: '<%= banner %> ',
                    beautify: true,
                    mangle: false,
                    compress: false,
                    drop_console: false,
                    preserveComments: 'all'
                },
                src: '<%= paths.src.js %>',
                dest: '<%= paths.dest.jsMin %>'
            }
        },

        cssmin: {
            files: {
                src: '<%= paths.src.css %>',
                dest: '<%= paths.dest.cssMin %>'
            }
        },

        // Clean task
        clean: {
            js: '<%= paths.dest.js %>',
            css: '<%= paths.dest.css %>',
            all: ['build/**']
        },

        // Watch task
        watch: {
            options: {
                dateFormat: function (time) {
                    grunt.log.writeln('# The watch finished in ' + time + 'ms at ' + (new Date()).toString());
                    grunt.log.writeln('Waiting...');
                }
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            js: {
                files: '<%= paths.src.js %>',
                tasks: [
                    'jshint:js',
                    'concat:js',
                    'uglify:dev',
                    'clean:js'
                ]
            },
            css: {
                files: '<%= paths.src.css %>',
                tasks: [
                    'concat:css',
                    'clean:css'
                ]
            }
        }
    });

    // Tasks definition
    grunt.registerTask('default', 'init');
    grunt.registerTask('build', 'Build the files and watch changes', function (debug) {
        // 'grunt build:prod'
        if (debug === 'prod') {
            var destCss = grunt.config('paths.dest.css');
            grunt.config('concat.css.dest', destCss);

            // Launch the prod tools
            grunt.task.run(['jshint', 'concat', 'uglify:prod', 'cssmin', 'copy', 'clean-src']);
        } else { // 'grunt build'
            // Launch the dev tools
            grunt.task.run(['jshint', 'concat', 'uglify:dev', 'copy', 'clean-src']);
        }
    });
    grunt.registerTask('init', 'build:prod');
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('clean-src', ['clean:js', 'clean:css']);
    grunt.registerTask('clean-all', 'clean:all');
};