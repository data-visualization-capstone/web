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

          // External Libraries (stored in version control)
          'lib/jquery.nouislider.min.js',
          'lib/jquery.daterangepicker.js',
          'lib/xml.min.js',
          
          // Our JS Files
          'js/api.js',
          'js/data.js',
          'js/filtering.js',
          'js/coloring.js',
          'js/graphing.js',
          'js/utils.js',
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
        "css/style.css": "less/style.less"
        }
      }
    },
    watch: {
      
      // Concat files at startup
      options : {
        atBegin: true,
      },

      // Concat all JS
      concat_js: {
        files: [
          'bower_components/**/*.js',
          'js/**/*.js',
        ],
        tasks: ['concat']
      },
      compile_less: {
        files: ['less/*.less'],
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
