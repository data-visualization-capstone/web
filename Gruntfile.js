module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
        
          // External Libraries
          'bower_components/jquery/dist/jquery.js',
          'bower_components/underscore/underscore.js',
          'bower_components/moment/moment.js',
          'bower_components/d3/d3.js',
          
          // Our JS Files
          'js/api.js',
          'js/data.js',
          'js/filtering.js',
          'js/coloring.js',
          'js/graphing.js',
        ],
        dest: 'js/app.js',
      },
    },
    less: {
      development: {
        options: {
          paths: ["css"],
        },
        files: {
        "css/style.css": "css/style.less"
        }
      }
    },
    watch: {
      concat_js: {
        files: [
          'bower_components/**/*.js',
          'js/**/*.js',
        ],
        tasks: ['concat']
      },
      compile_less: {
        files: ['css/*.less'],
        tasks: ['less']
      },
    },
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};
