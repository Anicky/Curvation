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
                sprite: '<%= paths.dest.folder %>img/sprite.png',
                tmp: '<%= paths.dest.folder %>tmp/'
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
                src: ['<%= paths.dest.tmp %>*.js', '<%= paths.src.js %>'],
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
            tmp: '<%= paths.dest.tmp %>',
            all: '<%= paths.dest.folder %>**',
            prod: ['<%= paths.dest.js %>', '<%= paths.dest.tmp %>'],
            dev: []
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
                tasks: ['jshint:gruntfile'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: '<%= paths.src.js %>',
                tasks: [
                    'jshint:js',
                    'concat:js',
                    'uglify:dev',
                    'clean:js'
                ],
                options: {
                    spawn: false
                }
            },
            sprite: {
                files: '<%= paths.src.img %>',
                tasks: [
                    'sprite'
                ],
                options: {
                    spawn: false
                }
            },
            less: {
                files: '<%= paths.src.less %>',
                tasks: [
                    'less:dev'
                ],
                options: {
                    spawn: false
                }
            },
            index: {
                files: '<%= paths.src.folder %><%= paths.src.index %>',
                tasks: ['copy:index'],
                options: {
                    spawn: false
                }
            }
        },

        cssmin: {
            prod: {
                src: '<%= paths.dest.cssMin %>',
                dest: '<%= paths.dest.cssMin %>'
            },
            dev: {}
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
                destCss: '<%= paths.dest.tmp %>sprites.css'
            }
        },

        browserify: {
            dist: {
                src: ['<%= paths.src.folder %>libs.js'],
                dest: '<%= paths.dest.tmp %>bundle.js'
            }
        }
    });

    // Tasks definition
    grunt.registerTask('default', 'build:prod');
    grunt.registerTask('build', function (target) {
        grunt.task.run([
            'jshint',
            'less:' + target,
            'sprite',
            'browserify',
            'concat',
            'uglify:' + target,
            'cssmin:' + target,
            'copy',
            'clean:' + target]
        );
    });
    grunt.registerTask('dev', ['build:dev', 'watch']);
    grunt.registerTask('clean-all', 'clean:all');
};
