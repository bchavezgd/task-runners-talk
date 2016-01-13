module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* path variables */
        paths: {
            src: './_src',
            dist: './_site'
        },

        /* Task Configuration Wrapper */
sass: {
    options: {
        sourceComments: true
    },
    files: {
        src: '<%= paths.src %>/sass/style.sass',
        dest: '<%= paths.dist %>/style.css'
    }
},
        // css post processer.
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 3 versions'
                    }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: '<%= paths.dist %>/style.css',
                dest: '<%= paths.dist %>/style.css'
            }
        },

        watch: {
            dev: {
                files: [
                    '<%= paths.src %>/sass/**/*'
                ],
                tasks: ['sass', 'postcss'],
                options: {
                    livereload: true
                }
            }
        }
    });
    /* load plugins */
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch');

    /* Register Tasks */
    grunt.registerTask("default", ["sass", "postcss"]);
};



