module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // }

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
          'js/data.js',
          'js/filtering.js',
          'js/coloring.js',
          'js/graphing.js',
        ],
        dest: 'js/app.js',
      },
    },
  });

  // Load plugs
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

};
