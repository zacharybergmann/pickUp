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
  },
  shell: {
    devServer: {
      command: 'npm run dev'
    }
  },
  watch: {
    scripts: {
      files: 'src/**/*.js',
      tasks: ['default'],
      options: {
        debounceDelay: 500
      }
    }
  }
});

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-eslint');
grunt.registerTask('default', [
  'clean',
  'eslint',
  'babel',
  'shell:devServer'
]);
