### 2.1.4
This release is dedicated to my cat. May he rest in catnip and meats.

new features:
- Added `ariaLabel` function to the config object to give more flexibilty on the values the plugin uses. (doc site updated).

bug fixes:
- #432 - Improve RTL support.
- #440 - Aria label does not work with quotes.

### 2.1.3
Maintenance release. 

bug fixes:
- #409 - inf recursion printing on FireFox
- #385 - bottom offset not respected in 'absolute' mode
- #303 - scrollContainer with other content inside wrapper, header won't scroll out
- #424 - table header fractional width set incorrectly. 

### 2.1.2
Maintenance release. 

bug fixes:
- #363 - scroll container assigned incorrect width because of a jquery 3.2.0 bug

new features:
- bad rtl support (only works with internal scrolling, not window scrolling)

### 2.1.1
I goofed, forgot to build dist last release.

- Removed 'floatContainerOverflow' option, removed `overflow-y:hidden` css from scrollContainer.


### 2.1.0

- #402 HUGE performance improvement if plugin used on multiple tables on the same page. Over **10x faster** startup time
on a page with 39 tables. Big props to [@ineuwirth](https://github.com/ineuwirth) for finding this one!

On a side note, the last release was exactly one year ago. I didn't do this on purpose :)

new features:
- #404 - Adding a 'floatContainerOverflow' option to govern floatContainer CSS
- #402 - performance improvement with many tables on the same page

bug fixes:
- #391 - Fix printing on firefox 
- #399 - Set header size on reflow
- #361 - Works better on iPad Retina
         
### 2.0.2
- fix issue with horizontal scrollbars + reflow breaking header position #345, #355

### 2.0.1

version skipped because of an npm snafu

### 2.0.0

Breaking changes:
- slim version no longer provided. Will use underscore, or shim the things we need
- removed allowing deprecated options from 1.3.x
- moved development version into /src dir and no longer use grunt here


nothing big and exciting in version 2, just semvar and breaking changes.

bug fixes:
- #348 - headers Stay stuck after reposition
- commonjs support works now, i promise

### 1.4.5

- #334 - fix memory leaks from print events
- #335 - absolute position on overflow scrolling was broken if used with `top` option
- added rudementary commonjs support to require jquery

### 1.4.4

- #323 - use css transform (GPU) to float the header. (IE9+)
- #325 - fix bug introduced in 1.4.3 which caused issues on lots of resizing
- #327 - fix bug where reflowed event was being unbound after print

### 1.4.3

- #316 - ie9 cant use matchmedia properly
- #321 - do not require Content Security Policy (CSP) style-src 'unsafe-inline'
- `enableAria` option has been removed. It is now always enabled.


### 1.4.2
bug fixes:
- https://github.com/mkoryak/floatThead/issues/313 - afterPrint not getting called

### 1.4.1
bug fixes:
- https://github.com/mkoryak/floatThead/issues/289 - properly handle overflow:scroll !important
- https://github.com/mkoryak/floatThead/issues/298 - add ability to opt out of 3rd party lib integrations
- https://github.com/mkoryak/floatThead/issues/303 - fix `scrollContainer: true` behavior
- https://github.com/mkoryak/floatThead/issues/299 - fix weirdness when header cells contain tons of content (thanks @cantin for PR)
- https://github.com/mkoryak/floatThead/issues/300 - remember scrollLeft of header when reflowing (thanks @rshah88 for PR)

### 1.4.0
new features:
- https://github.com/mkoryak/floatThead/issues/263 - support for responsive table wrappers
- can now use `scrollContainer:true` to auto-detect scrollParent of the table (something with `overflow != visible`)
- https://github.com/mkoryak/floatThead/issues/68 - support for printing the table (not in crappy IEs though)

bug fixes:
- https://github.com/mkoryak/floatThead/issues/268 - fire 'floatThead' event on destroy


### 1.3.2
- https://github.com/mkoryak/floatThead/issues/264 - header alignments messed up when table within a floated container (when using position:absolute)
- hide more stuff from screen readers that should be hidden
- https://github.com/mkoryak/floatThead/issues/255 - added `reflowed` event, see docs
- removed underscore usage from non-slim build


### 1.3.1
- allow 'useAbsolutePositioning', 'scrollingTop' and 'scrollingBottom' to be used, but yell about it via console.error

### 1.3.0
- renamed 'useAbsolutePositioning' option to `position`. value mappings (old -> new) are: [true -> 'absolute', false -> 'fixed', null -> 'auto']
- renamed 'scrollingTop' to `top` and 'scrollingBottom' to `bottom`
- removed cellTag and debounceResizeMs options
- removed `floatThead-floatContainer` class from the $floatContainer because `floatThead-container` class is already there and it is configurable via `floatContainerClass` option.
- added `autoReflow` option
- https://github.com/mkoryak/floatThead/issues/235 - fix tabindex of the floated header (thanks [robinpoort](https://github.com/robinpoort))
- https://github.com/mkoryak/floatThead/issues/242 - support for multiple tables within a single scrolling div
- https://github.com/mkoryak/floatThead/issues/246 - enableAria:true causes javascript exception when using Colgroup
- fixed  `getRowGroups`, method which was busted when the header was floated
- make grunt work in node 0.12

### 1.2.13

- https://github.com/mkoryak/floatThead/issues/220 - Header and Body alignment problem
- package.json was incorrect
- `autoReflow` option should work better if your browser supports MutationObserver
- added native support for tables within bootstrap3 tabs or jqueryui tabs
- if a tables is hidden, the plugin will not try do anything when you scroll
- the cat is cute

### 1.2.12
Huge thanks to [CoryDuncan](https://github.com/CoryDuncan), [ithielnor](https://github.com/ithielnor), [jurko-gospodnetic](https://github.com/jurko-gospodnetic) and [mhwlng](https://github.com/mhwlng) for your PRs

- https://github.com/mkoryak/floatThead/pull/168 - support for fractional column widths (no more alignment issues!)
- https://github.com/mkoryak/floatThead/pull/175 - having tables within tables wont cause weird issues
- https://github.com/mkoryak/floatThead/issues/165 - Fire an event when the header is floated / unfloated
- https://github.com/mkoryak/floatThead/issues/180 - no space outside of table causes it to always float
- https://github.com/mkoryak/floatThead/pull/185 - inner scrolling doesnt respect container border
- https://github.com/mkoryak/floatThead/issues/186 - can init on a table without thead and later add it
- https://github.com/mkoryak/floatThead/issues/194 - header sizing takes into account border-collapse rules
- bunch of code and stylistic cleanup

### 1.2.11
- now supports perfect-scrollbar plugin
- slightly better mobile safari support
- fix bower.json

### 1.2.10
- play nicely with angularjs if it modifies the DOM behind the scenes
- screen reader support via `enableAria` option
- https://github.com/mkoryak/floatThead/issues/122 - better default options for ie
- https://github.com/mkoryak/floatThead/issues/121 - header layout bug
- https://github.com/mkoryak/floatThead/issues/128 - issues with scrollbar size detection in certain layouts
- https://github.com/mkoryak/floatThead/issues/127 - destroy not removing some elements

### 1.2.9
- **Deprecated the `cellTag` option**, use `headerCellSelector` instead (see docs)
- https://github.com/mkoryak/floatThead/issues/101 - **huge** performance improvement
- https://github.com/mkoryak/floatThead/issues/98 - Border-collapse ignored on scroll
- https://github.com/mkoryak/floatThead/issues/99 - Incorrect scroll width calculation in some cases
- A couple of updates to the `destroy` method that get the table back into a more pristine state

### 1.2.8
- https://github.com/mkoryak/floatThead/issues/82 - table not disappearing when out of view in a certain layout
- https://github.com/mkoryak/floatThead/issues/84 - header not aligned if your scrolling container has a certain height
- https://github.com/mkoryak/floatThead/issues/86 - do not take hidden TRs into account when calculating header height

### 1.2.7
- Changed license over to MIT

### 1.2.6
- **new stuff:**
- added support for tables with existing `<colgroup>` elements
- added a grunt task to build dist to master
- **bug fixes:**
- https://github.com/mkoryak/floatThead/issues/57 - window resize issues on windows
- https://github.com/mkoryak/floatThead/issues/70 - better support for responsive tables
- https://github.com/mkoryak/floatThead/issues/71 - incorrectly unbinding events in destroy
- https://github.com/mkoryak/floatThead/issues/75 - dom leakage in destroy


### 1.2.5
- bug fixes:
- https://github.com/mkoryak/floatThead/issues/66
- https://github.com/mkoryak/floatThead/issues/65
- https://github.com/mkoryak/floatThead/issues/62

### 1.2.4
- better support for really really wide tables
- fixed https://github.com/mkoryak/floatThead/issues/53
- fixed https://github.com/mkoryak/floatThead/issues/56

### 1.2.3

- removed underscore dependency, added a *slim* version which is very slightly smaller and requires underscore
- now supporting a few evil deprecated table attributes that people still use: `cellpadding` and `cellspacing`
- fixed https://github.com/mkoryak/floatThead/issues/52
- fixed https://github.com/mkoryak/floatThead/issues/50
- added floatWrapperClass option
- added copyTableClass option

### 1.2.2

- better support for tables with dynamically hidden columns
- can now set a class on the floating header's container div

### 1.2.1

- fixed issue with caption tag align:bottom
- switched to uglifyjs to minify code

### 1.2.0

- <code>caption</code> tag support
- faster initialization when working with large tables (and small ones)

### 1.1.1

- Fixed bugs introduced in 1.0.0 which caused issues in IE9

### 1.0.0

- Updated code to be jquery 1.9+ compliant
