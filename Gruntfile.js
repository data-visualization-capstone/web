module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      // Components installed with bower
      external_libs: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/underscore/underscore.js',
          'bower_components/moment/moment.js',
          'bower_components/d3/d3.js',
          'bower_components/semantic-ui/dist/semantic.js',
          // 'bower_components/leaflet-d3/dist/leaflet-d3.js',
        ],
        dest: 'src/js/bundle.js',
      },
      map: {
        src: [
          'src/js/heatmap/heatmap.js',
          'src/js/heatmap/leaflet-heatmap.js',
          'src/js/heatmap/map.js',
        ],
        dest: 'src/js/map.js'
      },
    },
    less: {
      development: {
        options: {
          paths: ["css"],
        },
        files: {
          "src/css/style.css": "src/less/style.less",
          "src/css/semantic-ui.css": "bower_components/semantic-ui/dist/semantic.css",
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
          'src/js/**/*.js',
        ],
        tasks: ['concat']
      },
      compile_less: {
        files: ['src/less/*.less'],
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
