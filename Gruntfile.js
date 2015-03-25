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
          'bower_components/nouislider/distribute/jquery.nouislider.all.min.js',              

          // Our JS Files
          'src/js/map.js',
          'src/js/modules/heatmap.js',
          'src/js/modules/hex.js',
          'src/js/modules/path.js',
          'src/js/modules/scatterplot.js',

        ],
        dest: 'src/build/build.js',
      },
    },
    less: {
      development: {
        options: {
          paths: ["css"],
        },
        files: {
          "src/build/style.css": "src/less/style.less",
          "src/css/semantic-ui.css": "bower_components/semantic-ui/dist/semantic.min.css",
          "src/css/animate.css": "bower_components/animate.css/animate.min.css",
          "src/css/nouislider.css": "bower_components/nouislider/distribute/jquery.nouislider.min.css",
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
