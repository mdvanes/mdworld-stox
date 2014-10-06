/* global require, module */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            // dist: {
            //     options: {
            //         config: 'config.rb',
            //         environment: 'production',
            //         force: true, /* overwrite existing/unmodified file */
            //         cssDir: 'css-dist/'
            //     }
            // },
            dev: {
                options: {
                    config: 'config.rb',
                    environment: 'development'
                }
            }
        },
        watch: {
            compass: {
                files: ['_sass/**/*.scss'],
                tasks: ['compass:dev'],
                options: {
                    livereload: 1982,
                }
            },
            jshint: {
                files: [
                    'index.js',
                    'AdminServer.js',
                    'js/**/*.js'
                ],
                tasks: ['jshint'],
                options: {
                    livereload: 1982,
                }
            },
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'index.js',
                'AdminServer.js',
                'js/**/*.js'
            ]
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'index.js'
            }
        },
    });

    // Tasks
    grunt.registerTask('default', ['concurrent']);
};
