/*jshint node: true */
/*jshint laxcomma: true */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

module.exports = function(grunt) {

	grunt.initConfig({

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

  grunt.registerTask('jsfiddle', 'A sample task that logs stuff.', function(url, issue) {
    var done = this.async();
    if(arguments.length == 0){
      console.log('This task creates a test from a jsfiddle. To use: grunt jsfiddle:Gp3yV/13:56');
      console.log('Gp3yV/13  -> fiddle');
      console.log('56  -> issue');
      return done()
    }
    issue = issue || "rename-me";
    var rurl = "http://fiddle.jshell.net/"+url+"/show/light";
    console.log("fiddle url:", rurl);
    console.log("issue:", issue);
    var options = {
      url: rurl,
      headers : {
        Origin: 'http://jsfiddle.net',
        Referer: rurl
      }
    };
    request(options, function(err, resp, body) {
      if (err)
        throw err;
      var $ = cheerio.load(body);
      var css = $('style').text();
      var js =  $('script:last-child').text();
      var html = $('body').html();
      html = html.replace(/&apos;/g, "'");
      var out = "---\n\
layout: lite\n\
base_url: './../..'\n\
slug: tests\n\
bootstrap: false\n\
desc: 'TODO description'\n\
issue: "+issue+"\n\
---\n\n";
      out += "<style>"+css+"</style>\n\n\n<script type='text/javascript'>"+js+"</script>\n\n\n\<div id='jsfiddle'>"+html+"</div>"
      fs.writeFileSync('./tests/issue-'+issue+'.html', out);
      console.log('created test html');
      done()
    });
  });

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['concat', 'copy',  'uglify']);

	// For development - run a server and watch for changes
	grunt.registerTask('sandbox', ['clean:dist', 'build', 'bgShell:jekyll', 'watch']);

	// Run jekyll serve without a build
	grunt.registerTask('serve', ['bgShell:jekyll', 'watch']);

	grunt.registerTask('default', function(){
		console.log("");
		console.log("jquery.floatThead.js by Misha Koryak");
		console.log("------------------------------------");
		console.log("To run project in sandbox mode (with file watcher and server) run: grunt sandbox");
		console.log("The sandbox mode requires jekyll 2.x - http://jekyllrb.com/");
		console.log("");
		console.log("commands:");
		console.log("grunt sandbox");
		console.log("grunt jsfiddle ex: grunt jsfiddle:Gp3yV/13:56");
		console.log("grunt serve");
	})
}
