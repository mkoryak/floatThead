jquery.floatThead v1.3.2
=================
[![woot](http://giant.gfycat.com/AnyGloriousAlpaca.gif "or just click")](http://mkoryak.github.io/floatThead/)

#Documentation & Examples: http://mkoryak.github.io/floatThead/

Float the table header on scroll. No changes to your HTML/CSS are required, it just works. Supports floating the header while scrolling within the window or while scrolling within a container with overflow. 

:heart_eyes_cat:**My cat loves it**:heart_eyes_cat:



###Install

#### Package managers
```bash
bower install floatThead
npm install floatthead
```
#### Download code
[Latest Release (zip)](https://github.com/mkoryak/floatThead/archive/v1.3.2.zip)

#### Via CDN
[http://cdnjs.com/libraries/floatthead/](http://cdnjs.com/libraries/floatthead/)  
[http://www.jsdelivr.com/#!jquery.floatthead](http://www.jsdelivr.com/#!jquery.floatthead)

#### For java people
[Webjar](https://github.com/webjars/floatThead)

### Wrappers 

[angularjs directive](https://github.com/brandon-barker/angular-floatThead) by @brandon-barker

[yii2 framework wrapper](https://github.com/bluezed/yii2-floatThead) by @bluezed

# Things this plugin does:
---------
-   Floats the table header - it remains in viewport as you scroll
-   Works on tables within a scrollable container or whole window scrolling
-   Horizontal or vertical scrolling
-   Doesn't clone the thead - so your events stay bound
-   Doesn't mess with your styles
-   Works on any table
-   Requires no special css
-   Works with libs like [datatables](http://datatables.net), [perfect-scrollbar](http://mkoryak.github.io/floatThead/examples/perfect-scrollbar/), [bootstrap](http://mkoryak.github.io/floatThead/examples/bootstrap3/), and many more
-   Screen reader support
-   Plays nicely with angularjs


# Things this plugin does NOT do:
---------
-  Does not float the footer
-  Does not let you lock the first column like in excel
-  **Safari and mobile safari are not supported**. It might work, or it [might not](https://github.com/mkoryak/floatThead/issues/108), depending on your markup and safari version.  

Common Pitfalls
------
If you use css and html best practices, this plugin will work. If you are stuck in 1999, you better [read this](http://mkoryak.github.io/floatThead/faq/).

How to get help with the floatThead
------------
All issues should be reported through github. If you don't have an account you can make one.  
Providing the following will greatly increase the chances of your issue being resolved quickly:
 - Include the browser and operating system where you are having the problem. If its IE, a screenshot is also nice since I don't have quick access to that abomination.
 - **Provide a jsfiddle that reproduces your issue in its simplest form possible**. If its hard to read your code, you did it wrong.
 - A description of the issue and steps to reproduce
 
I will do my best to help you in a timely manner.
 

Requirements:
-------------

-   jQuery 1.8.x or better (1.9 compliant) (or jQuery 1.7.x and jQuery UI core)

Supported Browsers:
-------------
-   IE8 or better (read [this](http://mkoryak.github.io/floatThead/examples/row-groups/))
-   Chrome, Firefox (all versions from last 3 years)


Using with IE9 
--------------
FloatThead will not work properly in IE9 unless you have the following meta tag in the head of the page:  
``` html 
<meta http-equiv="X-UA-Compatible" content="IE=11; IE=10; IE=9; IE=8; IE=7; IE=EDGE" />
```

With very big tables, you may also run into this exciting bug: http://stackoverflow.com/questions/5805956/internet-explorer-9-not-rendering-table-cells-properly  
Watch for it.

Change Log
----------
### 1.3.2
- https://github.com/mkoryak/floatThead/issues/264 - header alignments messed up when table within a floated container (when using position:absolute)
- hide more stuff from screen readers that should be hidden
- https://github.com/mkoryak/floatThead/issues/255 - added `reflowed` event, see docs
- removed underscore usage from non-slim build


### 1.3.1
- allow 'useAbsolutePositioning', 'scrollingTop' and 'scrollingBottom' to be used, but yell about it via console.error

### 1.3.0
- **Breaking**: renamed 'useAbsolutePositioning' option to `position`. value mappings (old -> new) are: [true -> 'absolute', false -> 'fixed', null -> 'auto']
- **Breaking**: renamed 'scrollingTop' to `top` and 'scrollingBottom' to `bottom`
- **Breaking**: removed cellTag and debounceResizeMs options
- **Breaking**: removed `floatThead-floatContainer` class from the $floatContainer because `floatThead-container` class is already there and it is configurable via `floatContainerClass` option.
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


## Who is using floatThead ?

### [staticsitegenerators.net](http://staticsitegenerators.net/)

### [netdisco](http://netdisco.org)
- http://sourceforge.net/p/netdisco/netdisco-ng/ci/213352d54ee8e71cbca5ae2c1c75696800c4216b/

### [pylyglot](https://github.com/omaciel/pylyglot)  
- https://github.com/omaciel/pylyglot/tree/master/pylyglot/static/js

### [django-sql-explorer](https://github.com/epantry/django-sql-explorer)
- https://github.com/epantry/django-sql-explorer/commit/34ae345325a1e07ff952800fcd6dc5bddac5e3f2- 

### [Yii framework](http://www.yiiframework.com/)
- http://www.yiiframework.com/extension/yii2-grid/
- http://demos.krajee.com/grid-demo 

### [api.tinata.co.uk](http://api.tinata.co.uk/countries)
- https://github.com/tinata/tinatapi/commit/b1cf62dd97a5caa76bafcd5ec3b4f12e6b88f385


*Your site? email me: my last name at gmail*

## Other plugins

There are plenty of other **fixed header** / **floating header** / **scrolling table header** plugins that attempt to do the same thing this plugin does. None of them support both window and overflow scrolling and many of them depend on special css or require that you set the table column widths. Some of them are good and some of them suck. Go ahead and check them out too. 

I have compiled a list here with comments on each one:


| Plugin  | Window Scrolling | Overflow-X Scrolling  | Overflow-Y Scrolling | No Special CSS | Keeps Bound Events | Freeze Columns |
|:-------------:|:-------------:|:-----:|:-------------:|:-------------:|:-----:|:-----:|:-----:|
| [FloatThead](https://github.com/mkoryak/floatThead/)  | yes | yes | yes | yes | yes | no |
| [Fixed-Table-Header](https://github.com/markmalek/Fixed-Header-Table/) | no | yes | no | yes | no | no |
| [jquery.scrollTableBody](https://github.com/nheldman/jquery.scrollTableBody) | no | yes | yes | no | ?? | no |
| [Fixed table rows cols](http://meetselva.github.io/fixed-table-rows-cols) | no | yes | yes | no | ?? | yes |
| [Table Fixed Header](https://github.com/oma/table-fixed-header) | yes | no | no | yes | no | no | 
| [Sticky Table Header](https://github.com/jmosbech/StickyTableHeaders) | yes | no | no | yes | yes | no | 
| [Grid](https://github.com/mmurph211/Grid) | no | yes | yes | yes | yes | no | 


 [Fixed-Table-Header](https://github.com/markmalek/Fixed-Header-Table/)
This is the original. It has been around for ages and it will be the first plugin you find when you start looking. It also has a ton of open unresolved issues. It does not support window scrolling, it does not seem to support y-scrolling withing the container. It loses the events you attached to the thead. Lots of open issues. **Stay away.**

[Fixed table rows cols](http://meetselva.github.io/fixed-table-rows-cols)
Does not support window scrolling. Requires you to specify the column widths for the table. This means that the table will not be able to optimally lay itself out. It does support freezing columns in place. If you need that, this might be the plugin for you.

[jquery.scrollTableBody](https://github.com/nheldman/jquery.scrollTableBody)
Does not support window scrolling. A newcomer to the scene, not a mature project. Has some major issues with cell padding. **Stay away** until issues are resolved. 

[Grid](https://github.com/mmurph211/Grid)
This lib is very different from the rest because its main usecase is to give you a sortable grid. You do not run this plugin on an existing table - you need to provide a json or xml data source. This is a great lightweight replacement for datatables. This may be the plugin for you if you are not converting an existing table.

[Table Fixed Header](https://github.com/oma/table-fixed-header)
This is a window scrolling plugin, does not support overflow scrolling. Does not work properly when the window is resized and the table width changes. Floated header sticks around if you scroll past table. Author welcomes pull requests but does not fix issues. **Stay away**

[Sticky Table Header](https://github.com/jmosbech/StickyTableHeaders)
This is a window scrolling plugin. Does not support overflow scrolling. It is probably the best window scrolling plugin (besides this one). The author seems to fix issues as they arise. 

# Woot

Big thanks to jetbrains for giving me an open source webstorm license for this project. They make the best IDEs.

License
-------
MIT
