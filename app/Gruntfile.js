module.exports = function (grunt) {
    // Load the plugin that provides the tasks
    require('jit-grunt')(grunt, {
        sprite: 'grunt-spritesmith'
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        paths: {
            src: {
                folder: 'src/',
                js: ['<%= paths.src.folder %>js/shared/*.js', '<%= paths.src.folder %>js/client/*.js'],
                css: '<%= paths.src.folder %>css/**/*.css',
                less: '<%= paths.src.folder %>less/**/*.less',
                img: '<%= paths.src.folder %>img/**/*.png',
                index: 'index.html'
            },
            dest: {
                folder: 'dist/',
                js: '<%= paths.dest.folder %>js/<%= pkg.name %>.js',
                jsMin: '<%= paths.dest.folder %>js/<%= pkg.name %>.min.js',
                css: '<%= paths.dest.folder %>css/<%= pkg.name %>.css',
                cssMin: '<%= paths.dest.folder %>css/<%= pkg.name %>.min.css',
                sprite: '<%= paths.dest.folder %>img/sprite.png'
            }
        },

        // Copy task
        copy: {
            index: {
                src: '<%= paths.src.folder %><%= paths.src.index %>',
                dest: '<%= paths.dest.folder %><%= paths.src.index %>'
            },
            fonts: {
                expand: true,
                cwd: 'node_modules/font-awesome/fonts/',
                src: '**',
                flatten: true,
                dest: '<%= paths.dest.folder %>fonts/'
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
                src: ['<%= paths.dest.folder %>tmp/*.js', '<%= paths.src.js %>'],
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
                src: '<%= paths.dest.js %>',
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
                src: '<%= paths.dest.js %>',
                dest: '<%= paths.dest.jsMin %>'
            }
        },

        // Clean task
        clean: {
            js: '<%= paths.dest.js %>',
            tmp: '<%= paths.dest.folder %>tmp',
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
            less: {
                files: '<%= paths.src.less %>',
                tasks: [
                    'less:dev'
                ]
            },
            index: {
                files: '<%= paths.src.folder %><%= paths.src.index %>',
                tasks: ['copy:index']
            }
        },

        cssmin: {
            files: {
                src: '<%= paths.dest.cssMin %>',
                dest: '<%= paths.dest.cssMin %>'
            }
        },

        // Compile LESS files
        less: {
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= paths.dest.cssMin %>': '<%= paths.src.less %>'
                }
            },
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: {
                    '<%= paths.dest.cssMin %>': '<%= paths.src.less %>'
                }
            }
        },

        // Compile images to sprite and make associate css file
        sprite: {
            all: {
                src: '<%= paths.src.img %>',
                dest: '<%= paths.dest.sprite %>',
                imgPath: '../img/sprite.png',
                destCss: '<%= paths.dest.folder %>tmp/sprites.css'
            }
        },

        browserify: {
                dist: {
                    src: ['<%= paths.src.folder %>libs.js'],
                    dest: '<%= paths.dest.folder %>tmp/bundle.js'
                }
        }
    });

    // Tasks definition
    grunt.registerTask('default', 'init');
    grunt.registerTask('build', 'Build the files and watch changes', function (debug) {
        // 'grunt build:prod'
        if (debug === 'prod') {
            // Launch the prod tools
            grunt.task.run(['jshint', 'less:prod', 'sprite', 'browserify', 'concat', 'uglify:prod', 'cssmin', 'copy', 'clean-src']);
        } else { // 'grunt build'
            // Launch the dev tools
            grunt.task.run(['jshint', 'less:dev', 'sprite', 'browserify', 'concat', 'uglify:dev', 'copy', 'clean-src']);
        }
    });
    grunt.registerTask('init', 'build:prod');
    grunt.registerTask('dev', ['build', 'browserify', 'watch']);
    grunt.registerTask('clean-src', ['clean:js', 'clean:tmp']);
    grunt.registerTask('clean-all', 'clean:all');
};
