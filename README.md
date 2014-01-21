jquery.floatThead v1.2.1
=================

Float the table header without special css. This plugin assumes nothing about your table markup and "just works" without losing your events or styles. Supports floating the header while scrolling within the window or while scrolling within a container with overflow. 

Check out the demo / docs page for copious examples:

###[Demos and Docs](http://mkoryak.github.io/floatThead/)  


Jekyll templates to generate the docs are in the [gh-pages branch](https://github.com/mkoryak/floatThead/tree/gh-pages)

[![Donate](http://programmingdrunk.com/donate-coffee.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=SDJJ42BTC46LY&lc=US&item_name=floatThead&currency_code=USD&bn=PP%2dDonationsBF%3adonate%2dcoffee%2epng%3aNonHosted)

Feedback needed on planned features
------------

See: [https://github.com/mkoryak/floatThead/issues/30](https://github.com/mkoryak/floatThead/issues/30)

Install:
--------
Install using [Bower](http://bower.io/):
  
```bash
bower install floatThead
```
  
or download:  
  
- [development version](https://raw.github.com/mkoryak/floatThead/master/jquery.floatThead.js)  
- [production version](https://raw.github.com/mkoryak/floatThead/master/jquery.floatThead.min.js)
  
Features:
---------

-   Floats the table header - so that the user can always see it
-   Supports tables with inner scroll bars, or whole page scrolling
-   Horizontal or vertical scrolling
-   Doesn't clone the thead - so your events stay bound
-   Doesn't mess with your styles
-   Works on any table
-   Requires no special css
-   Works with [datatables](http://datatables.net) out of the box

Requirements:
-------------

-   jQuery 1.8.x or better (1.9 compliant) (or jQuery 1.7.x and jQuery UI core)
-   Underscore.js 1.3 or better
-   IE8, IE9, IE10, IE11, FF10+ or Chrome15+.
-   The following meta tag to placate IE: <code>&lt;meta http-equiv="X-UA-Compatible" content="IE=10; IE=9; IE=8; IE=7; IE=EDGE" /&gt;</code>

Demo & Docs:
------------

[DEMOS and Documentation](http://mkoryak.github.io/floatThead/)  

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

## Other plugins

There are plenty of other **fixed header** / **floating header** / **scrolling table header** plugins that attempt to do the same thing this plugin does. None of them support both window and overflow scrolling and many of them depend on special css or require that you set the table column widths. Some of them are good and some of them suck. Go ahead and check them out too. 

I have compiled a list here with comments on each one:

[Fixed-Table-Header](https://github.com/markmalek/Fixed-Header-Table/)
This is the orignal. It has been around for ages and it will be the first plugin you find when you start looking. It also has a ton of open unresolved issues. It does not support window scrolling, it does not seem to support y-scrolling withing the container. It loses the events you attached to the thead. **Stay away.**

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


License
-------
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)
