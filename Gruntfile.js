module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['assets/src/*.js'],
        dest: 'assets/script.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'assets/script.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
      options: {
        paths: ["assets"],
        yuicompress: true
      },
      dist: {
        src: "assets/src/style.less",
        dest: "assets/style.css"
      }
    },
    watch: {
      css: {
        files: ['assets/src/*.css'],
        tasks: ['less']
      },
      js: {
        files: ['assets/src/*.js'],
        tasks: ['concat', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('build', ['less', 'concat', 'uglify']);
  grunt.registerTask('default', ['build']);

};