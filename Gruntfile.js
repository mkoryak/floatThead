/*jshint node: true */
/*jshint laxcomma: true */

module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({

		replace: {
			local: {
				src: ['./_config.yml'],
				dest: './_config.yml',
				replacements: [{
					from: /https:\/\/rawgithub\.com\/mkoryak\/floatThead\/master\/dist\/jquery\.floatThead\.min\.js/,
					to: 'http://localhost:9002/floatThead/dist/jquery.floatThead.js'
				}]
			},
			prod: {
				src: ['./_config.yml'],
				dest: './_config.yml',
				replacements: [{
					from: /http:\/\/localhost:9002\/floatThead\/dist\/jquery\.floatThead\.js/,
					to: 'https://rawgithub.com/mkoryak/floatThead/master/dist/jquery.floatThead.min.js'
				}]
			}
		},

    clean: {
      dist: ['dist', 'build'],
      build: ['build']
    },

    concat: {
      options: {
        stripBanners: false
      },
      full: {
        src: [
          'jquery.floatThead.js',
          'jquery.floatThead._.js'
        ],
        dest: 'build/jquery.floatThead.js'
      }
    },

    copy: {
      slim: {
        src:  'jquery.floatThead.js',
        dest: 'build/jquery.floatThead-slim.js'
      },
      slimDist: {
        src:  'jquery.floatThead.js',
        dest: 'dist/jquery.floatThead-slim.js'
      },
      full: {
        src: 'build/jquery.floatThead.js',
        dest: 'dist/jquery.floatThead.js'
      }
    },

		uglify: {
			options: {
				mangle: true,
				compress: true,
				report: true,
				preserveComments: 'some'
			},
			floatTheadSlim: {
				src: ['build/jquery.floatThead-slim.js'],
				dest: 'dist/jquery.floatThead-slim.min.js'
			},
      floatThead: {
				src: ['build/jquery.floatThead.js'],
				dest: 'dist/jquery.floatThead.min.js'
			}
		},

		jekyll: {
			docs: {}
		},


		watch: {
			lib: {
				files: ['./lib/**/*', './*.js', '**/*.less'],
				tasks: ['build', 'jekyll']
			},
			html: {
				files: ['./*.html', './examples/*.html', './tests/*.html', './_includes/*.html', './_layouts/*.html'],
				tasks: ['jekyll']
			}
		},

		bgShell: {
			jekyll: {
				bg: true,
				cmd: 'jekyll serve'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['concat', 'copy',  'uglify']);

	// For development - run a server and watch for changes
	grunt.registerTask('sandbox', ['clean:dist', 'build', 'replace:local', 'bgShell:jekyll', 'watch']);

  // Run before pushing to github
	grunt.registerTask('deploy', ['replace:prod', 'clean:dist', 'build', 'clean:build']);

	// Run jekyll serve without variable replacements
	grunt.registerTask('serve', ['bgShell:jekyll', 'watch']);

	grunt.registerTask('default', function(){
		console.log("");
		console.log("jquery.floatThead.js by Misha Koryak");
		console.log("------------------------------------");
		console.log("To run project in sandbox mode (with file watcher and server) run: grunt sandbox");
		console.log("The sandbox mode requires jekyll - http://jekyllrb.com/");
	})
}
