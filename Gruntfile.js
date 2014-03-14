module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    '_src/core.js',
                    '_src/models/chart.js',
                    '_src/models/pieChart.js',
                    '_src/models/barChart.js',
                    '_src/models/lineChart.js',
                    '_src/components/animatedPart.js',
                    '_src/components/dataset.js',
                    '_src/components/grid.js',
                    '_src/components/axis.js',
                    '_src/components/xaxis.js',
                    '_src/components/yaxis.js',
                    '_src/components/element.js',
                    '_src/components/slice.js',
                    '_src/components/bar.js',
                    '_src/components/point.js',
                    '_src/components/label.js',
                    '_src/components/crosshair.js',
                    '_src/components/tooltip.js',
                    '_src/end.js'
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
                files: ['_src/*.js', '_src/models/*.js', '_src/components/*.js'],
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
