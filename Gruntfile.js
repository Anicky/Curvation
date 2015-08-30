module.exports = function (grunt) {
    // Load the plugin that provides the tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        src_js_folder: 'src/js/',
        build_js_folder: 'build/js/',
        pattern_js: '**/*.js',
        src_css_folder: 'src/css/',
        build_css_folder: 'build/css/',
        pattern_css: '**/*.css',

        // JSHint task
        jshint: {
            options: {
                esnext: true,
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                src: '<%= src_js_folder %><%= pattern_js %>'
            }
        },

        // Concatenation task
        concat: {
            js: {
                src: '<%= src_js_folder %><%= pattern_js %>',
                dest: '<%= build_js_folder %><%= pkg.name %>.js'
            },
            css: {
                src: '<%= src_css_folder %><%= pattern_css %>',
                dest: '<%= build_css_folder %><%= pkg.name %>.css'
            }
        },

        // Minification tasks
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
            },
            files: {
                src: '<%= src_js_folder %><%= pattern_js %>',
                dest: '<%= build_js_folder %><%= pkg.name %>.min.js'
            }
        },
        cssmin: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
            },
            files: {
                src: '<%= src_css_folder %><%= pattern_css %>',
                dest: '<%= build_css_folder %><%= pkg.name %>.min.css'
            }
        },

        // Clean task
        clean: {
            js: '<%= build_js_folder %><%= pkg.name %>.js',
            css: '<%= build_css_folder %><%= pkg.name %>.css',
            all: [
                '<%= build_js_folder %><%= pkg.name %>.js',
                '<%= build_css_folder %><%= pkg.name %>.css',
            ]
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
                files: '<%= src_js_folder %><%= pattern_js %>',
                tasks: [
                    'jshint:js',
                    'concat:js',
                    'uglify',
                    'clean:js'
                ]
            },
            css: {
                files: '<%= src_css_folder %><%= pattern_css %>',
                tasks: [
                    'concat:css',
                    'cssmin',
                    'clean:css'
                ]
            }
        }
    });

    // Tasks definition
    grunt.registerTask('default', 'init');
    grunt.registerTask('init', ['jshint', 'concat', 'uglify', 'cssmin', 'clean:all']);
    grunt.registerTask('dev', ['init', 'watch']);
    grunt.registerTask('clean-all', 'clean:all');
};