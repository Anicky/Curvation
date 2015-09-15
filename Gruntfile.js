module.exports = function (grunt) {
    // Load the plugin that provides the tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-spritesmith');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        paths: {
            src: {
                folder: 'src/',
                js: '<%= paths.src.folder %>js/**/*.js',
                css: '<%= paths.src.folder %>css/**/*.css',
                scss: '<%= paths.src.folder %>sass/**/*.scss',
                img: '<%= paths.src.folder %>img/**/*.png',
                index: 'index.html'
            },
            bower: {
                src: 'bower_components/',
                dest: 'public/libs/',
                bootstrap: 'bootstrap/dist/',
                jquery: 'jquery/dist/',
                mainloop: 'MainLoop.js/build/',
                fontawesome: 'font-awesome/'
            },
            dest: {
                folder: 'public/',
                js: '<%= paths.dest.folder %>js/<%= pkg.name %>.js',
                jsMin: '<%= paths.dest.folder %>js/<%= pkg.name %>.min.js',
                css: '<%= paths.dest.folder %>css/<%= pkg.name %>.css',
                cssMin: '<%= paths.dest.folder %>css/<%= pkg.name %>.min.css'
            }
        },

        // Copy task
        copy: {
            index: {
                src: '<%= paths.src.folder %><%= paths.src.index %>',
                dest: '<%= paths.dest.folder %><%= paths.src.index %>'
            },
            bootstrap: {
                files: [
                    {
                        src: '<%= paths.bower.src %><%= paths.bower.bootstrap %>js/bootstrap.min.js',
                        dest: '<%= paths.bower.dest %>bootstrap.min.js'
                    },
                    {
                        src: '<%= paths.bower.src %><%= paths.bower.bootstrap %>css/bootstrap.min.css',
                        dest: '<%= paths.bower.dest %>bootstrap.min.css'
                    }
                ]
            },
            jquery: {
                src: '<%= paths.bower.src %><%= paths.bower.jquery %>jquery.min.js',
                dest: '<%= paths.bower.dest %>jquery.min.js'
            },
            mainloop: {
                src: '<%= paths.bower.src %><%= paths.bower.mainloop %>mainloop.min.js',
                dest: '<%= paths.bower.dest %>mainloop.min.js'
            },
            fontawesome: {
                files: [
                    {
                        src: '<%= paths.bower.src %><%= paths.bower.fontawesome %>css/font-awesome.min.css',
                        dest: '<%= paths.bower.dest %><%= paths.bower.fontawesome %>/css/font-awesome.min.css'
                    },
                    {
                        cwd: '<%= paths.bower.src %><%= paths.bower.fontawesome %>fonts',
                        src: '**.*',
                        dest: '<%= paths.bower.dest %><%= paths.bower.fontawesome %>fonts/',
                        expand: true
                    }
                ]
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
                src: ['<%= paths.dest.cssMin %>', '<%= paths.src.css %>'],
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

        // Clean task
        clean: {
            js: '<%= paths.dest.js %>',
            all: '<%= paths.dest.folder %>**'
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
            sprite: {
                files: '<%= paths.src.img %>',
                tasks: [
                    'sprite'
                ]
            },
            sass: {
                files: '<%= paths.src.scss %>',
                tasks: [
                    'sass:dev'
                ]
            },
            index: {
                files: '<%= paths.src.folder %><%= paths.src.index %>',
                tasks: ['copy:index']
            },
            bower: {
                files: '<%= paths.bower.src %>**/*',
                tasks: ['copy:bootstrap', 'copy:jquery', 'copy:mainloop', 'copy:fontawesome']
            }
        },

        // Make images into sprites
        sprite: {
            all: {
                src: '<%= paths.src.folder %>img/**/*.png',
                dest: '<%= paths.dest.folder %>img/sprite.png',
                destCss: '<%= paths.src.folder %>css/sprites.css'
            }
        },

        cssmin: {
            files: {
                src: '<%= paths.src.css %>',
                dest: '<%= paths.src.folder %>/css/sprites.css'
            }
        },

        // Compile SASS files
        sass: {
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= paths.dest.cssMin %>': '<%= paths.src.scss %>'
                }
            },
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: {
                    '<%= paths.dest.cssMin %>': '<%= paths.src.scss %>'
                }
            }
        }
    });

    // Tasks definition
    grunt.registerTask('default', 'init');
    grunt.registerTask('build', 'Build the files and watch changes', function (debug) {
        // 'grunt build:prod'
        if (debug === 'prod') {
            // Launch the prod tools
            grunt.task.run(['jshint', 'sprite', 'cssmin', 'sass:prod', 'concat', 'uglify:prod', 'copy', 'clean-src']);
        } else { // 'grunt build'
            // Launch the dev tools
            grunt.task.run(['jshint', 'sprite', 'sass:dev', 'concat', 'uglify:dev', 'copy', 'clean-src']);
        }
    });
    grunt.registerTask('init', 'build:prod');
    grunt.registerTask('dev', ['build', 'watch']);
    grunt.registerTask('clean-src', 'clean:js');
    grunt.registerTask('clean-all', 'clean:all');
};
