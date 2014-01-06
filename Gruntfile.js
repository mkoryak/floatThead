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
					from: /https:\/\/rawgithub\.com\/mkoryak\/floatThead\/master\//,
					to: '/floatThead/'
				}]
			},
			prod: {
				src: ['./_config.yml'],
				dest: './_config.yml',
				replacements: [{
					from: /http:\/\/localhost:9002\/floatThead\//,
					to: 'https://rawgithub.com/mkoryak/floatThead/master/'
				}]
			}
		},

		uglify: {
			floatThead: {
				src: ['jquery.floatThead.js'],
				dest: 'jquery.floatThead.min.js'
			}
		},

		jekyll: {
			docs: {}
		},


		watch: {
			lib: {
				files: ['./lib/**/*', './*.js'],
				tasks: ['jekyll']
			},
			html: {
				files: ['./*.html', './examples/*.html', './_includes/*.html', './_layouts/*.html'],
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

	// For development - run a server and watch for changes
	grunt.registerTask('sandbox', ['replace:local', 'bgShell:jekyll', 'watch']);

	// Run before pushing to github
	grunt.registerTask('deploy', ['replace:prod', 'uglify']);

	grunt.registerTask('default', function(){
		console.log("")
		console.log("jquery.floatThead.js by Misha Koryak");
		console.log("------------------------------------");
		console.log("To run project in sandbox mode (with file watcher and server) run: grunt sandbox");
		console.log("The sandbox mode requires jekyll - http://jekyllrb.com/");
	})
}
