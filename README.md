floatThead Documentation
==========

## Using the docs locally

  - install jekyll: http://jekyllrb.com/
  - from the root project dir run `jekyll serve`
  - open `http://localhost:9002/floatThead/` in your browser

## Development / Sandbox mode

This gives you the ability to have a filewatcher recompile the docs site when you make changes.  
Saves a ton of time spent restarting jekyll. 

  - run the following commands in the project root (of the gh-pages branch)
  - `npm install grunt-cli -g`
  - `npm install` 
  - `grunt sandbox` to start the jekyll server and file watcher
  - start making changes and see them immediately in your browser at `http://localhost:9002/floatThead/`
