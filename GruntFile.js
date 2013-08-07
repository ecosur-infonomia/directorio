module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.initConfig({
    bower: {
      install: { 
        targetDir: 'src/public'
      }
    }
 });

 grunt.registerTask('default', ['bower']); 
}
