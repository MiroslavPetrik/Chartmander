module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'js/src/Chartmander.js',
                    'js/src/models/chart.js',
                    'js/src/models/pieChart.js',
                    'js/src/models/barChart.js',
                    'js/src/components/dataset.js',
                    'js/src/components/grid.js',
                    'js/src/components/axis.js',
                    'js/src/components/xaxis.js',
                    'js/src/components/yaxis.js',
                    'js/src/components/element.js',
                    'js/src/components/slice.js',
                    'js/src/components/bar.js',
                    'js/src/components/label.js',
                    'js/src/end.js'
                ],
                dest: 'js/Chartmander.js'
            }
        },
        uglify: {
            options: {
                compress: true
            },
            js: {
                files: {
                    'js/Chartmander.min.js': ['js/Chartmander.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/src/*.js', 'js/src/models/*.js', 'js/src/components/*.js'],
                tasks: ['concat']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat']);
};
