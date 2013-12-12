jquery.floatThead v1.2.0
=================

Float the table header without losing your events or styles.  

[DEMOS and Documentation](http://mkoryak.github.io/floatThead/)  
Jekyll templates to generate the docs are in the [gh-pages branch](https://github.com/mkoryak/floatThead/tree/gh-pages)


Another plugin that does this?!
------------

I was fed up the current state of floating header plugins. They either lose your styles or lose your events, or don't support the edge cases.

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
-   IE8, IE9, IE10, FF10+ or Chrome15+.
-   The following meta tag to placate IE: <code>&lt;meta http-equiv="X-UA-Compatible" content="IE=10; IE=9; IE=8; IE=7; IE=EDGE" /&gt;</code>

Demo & Docs:
------------

[DEMOS and Documentation](http://mkoryak.github.io/floatThead/)  

Using with IE9 
--------------
FloatThead will not work properly in IE9 unless you have the following meta tag in the head of the page:  
``` html 
<meta http-equiv="X-UA-Compatible" content="IE=10; IE=9; IE=8; IE=7; IE=EDGE" />
```

With very big tables, you may also run into this exciting bug: http://stackoverflow.com/questions/5805956/internet-explorer-9-not-rendering-table-cells-properly  
Watch for it.

Change Log
----------

### 1.2.0

- <code>caption</code> tag support
- faster initialization when working with large tables (and small ones)

### 1.1.1

- Fixed bugs introduced in 1.0.0 which caused issues in IE9

### 1.0.0

- Updated code to be jquery 1.9+ compliant

License
-------
[CC BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/)