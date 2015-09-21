module.exports = (grunt) ->
  grunt.initConfig
    clean:
      dist: [
        "dist"
        "build"
      ]
      build: ["build"]

#    coffee:
#      compile:
#        files:
#          "build/jquery.floatThead.dataAPI.js": "jquery.floatThead.dataAPI.coffee"

    concat:
      options:
        stripBanners: false

      full:
        src: [
          "jquery.floatThead.js"
          "jquery.floatThead._.js"
#          "build/jquery.floatThead.dataAPI.js"
        ]
        dest: "build/jquery.floatThead.js"

    copy:
      slim:
        src: "jquery.floatThead.js"
        dest: "build/jquery.floatThead-slim.js"

      slimDist:
        src: "jquery.floatThead.js"
        dest: "dist/jquery.floatThead-slim.js"

      full:
        src: "build/jquery.floatThead.js"
        dest: "dist/jquery.floatThead.js"

    uglify:
      options:
        mangle: true
        compress: {}
        report: true
        preserveComments: "some"

      floatTheadSlim:
        src: ["build/jquery.floatThead-slim.js"]
        dest: "dist/jquery.floatThead-slim.min.js"

      floatThead:
        src: ["build/jquery.floatThead.js"]
        dest: "dist/jquery.floatThead.min.js"



  grunt.loadNpmTasks("grunt-contrib-coffee")
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-concat")
  grunt.loadNpmTasks("grunt-contrib-copy")
  grunt.loadNpmTasks("grunt-contrib-clean")
  grunt.registerTask("build", [
#    "coffee"
    "clean:dist"
    "concat"
    "copy"
    "uglify"
    "clean:build"
  ])

  grunt.registerTask("default", ['build'])
