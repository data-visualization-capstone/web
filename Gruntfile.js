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
          'bower_components/semantic-ui/dist/semantic.js',

          // External Libraries (stored in version control)
          // 'lib/xml.min.js', Convert Google KML

          // Our JS Files
          'src/js/api.js',
          'src/js/data.js',
          'src/js/map.js',
          'src/js/plot-heatmap.js',
          'src/js/plot-hex.js',
          'src/js/plot-path.js',
          'src/js/plot-scatterplot.js',

        ],
        dest: 'src/js/app.js',
      },
    },
    less: {
      development: {
        options: {
          paths: ["css"],
        },
        files: {
          "src/css/style.css": "src/less/style.less",
          "src/css/semantic-ui.css": "bower_components/semantic-ui/dist/semantic.min.css",
          "src/css/animate.css": "bower_components/animate.css/animate.min.css"
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
  grunt.registerTask('build', ['concat', 'less']);
};
