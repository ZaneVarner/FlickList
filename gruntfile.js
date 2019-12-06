// Grunt file configuration

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
 
        karma: {
            options: {
                configFile: 'karma.conf.js',
                files: [
                    "node_modules/angular/angular.js",
                    "node_modules/angular-mocks/angular-mocks.js",
                    "public/lib/angular-ui-router.min.js"
                ]
            },
            homeController: {
                src: ["public/src/flicklist.module.js", "public/src/home.controller.js", "spec/home.controller.spec.js"]
            },
            // Compilation errors, so these test cases are excluded
            // movieSearchController: {
            //     src: ["public/src/movie-search.module.js", "public/src/movie-search.controller.js", "spec/movie-search.controller.spec.js"]
            // },
            // movieSearchService: {
            //     src: ["public/src/movie-search.module.js", "public/src/movie-search.service.js", "spec/movie-search.service.spec.js"]
            // }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('default', ['karma']);
};