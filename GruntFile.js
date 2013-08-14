module.exports = function(grunt) {
  grunt.initConfig({
    bower: {
      install: { 
        targetDir: 'src/public'
      }
    },
    compress: {
      main: { 
        options: {
          mode: 'zip',
          archive: 'dist/directorio.zip'
        },
        files: [ 
          {src: ['src/**'], dest: 'directorio'},
          {src: ['*.json'], dest: 'directorio'},
          {src: ['GruntFile.js'], dest: 'directorio'},
          {src: ['scripts/**'], dest:'directorio'}
        ]
      }
    },
    clean: ["dist"]
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.registerTask('install',['bower']);
  grunt.registerTask('default', ['clean','compress']); 
  
}
