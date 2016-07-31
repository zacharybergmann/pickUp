const grunt = require('grunt');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
  clean: ['dist/**'],
  babel: {
    options: {
      sourceMap: true,
      presets: ['es2015']
    },
    dist: {
      // http://rockyj.in/2015/05/24/es6_with_babel_grunt.html
      files: [{
        expand: true,
        cwd: 'src',
        src: ['**/*.js'],
        dest: 'dist',
        ext:'.js'
      }]
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.registerTask('default', [
  'clean',
  'babel'
]);