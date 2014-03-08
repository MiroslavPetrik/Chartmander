module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            js: {
                src: [
                    'js/src/Chartmander.js',
                    'js/src/models/chart.js',
                    'js/src/models/pieChart.js',
                    'js/src/components/dataset.js',
                    'js/src/components/element.js',
                    'js/src/components/slice.js',
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
            files: ['js/*'],
            tasks: ['concat']
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat']);
};
