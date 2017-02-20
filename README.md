jquery.floatThead 2.0.3
=================
[![woot](http://giant.gfycat.com/AnyGloriousAlpaca.gif "or just click")](http://mkoryak.github.io/floatThead/)

#Documentation & Examples: http://mkoryak.github.io/floatThead/

Float the table header on scroll. No changes to your HTML/CSS are required, it just works.
Supports floating the header while scrolling within the window or while scrolling within a container with overflow.
Supports responsive tables.


:heart_eyes_cat:**My cat loves it**:heart_eyes_cat:


### Install

#### Package managers
```bash
npm install floatthead
bower install floatThead
```
#### Download code
[Latest Release (zip)](https://github.com/mkoryak/floatThead/archive/2.0.3.zip)

#### Via CDN
[http://cdnjs.com/libraries/floatthead/](http://cdnjs.com/libraries/floatthead/)
[http://www.jsdelivr.com/#!jquery.floatthead](http://www.jsdelivr.com/#!jquery.floatthead)
[https://unpkg.com/floatthead](https://unpkg.com/floatthead)

#### For java people
[Webjar](https://github.com/webjars/floatThead)

### Wrappers

[angularjs directive](https://github.com/brandon-barker/angular-floatThead) by @brandon-barker

[yii2 framework wrapper](https://github.com/bluezed/yii2-floatThead) by @bluezed

# Things this plugin does:
---------
-   Works on tables within a scrollable container or whole window scrolling
-   Works with responsive table wrappers
-   Works with dynamically hidden/added/removed columns
-   Doesn't clone the thead - so your events stay bound
-   Doesn't mess with your styles, and doesnt require any css
-   Works with border-collapse variants, weird margins, padding and borders
-   Works with libs like [datatables](http://datatables.net), [perfect-scrollbar](http://mkoryak.github.io/floatThead/examples/perfect-scrollbar/), [bootstrap3](http://mkoryak.github.io/floatThead/examples/bootstrap3/), and many more
-   Header can be floated with `position:absolute` which adds a wrapper, or `position:fixed` which does not. Both have their pros and cons. By default the best option is chosen based on your configuration


# Things this plugin does NOT do:
---------
-  Does not float the footer
-  Does not let you lock the first column like in excel
-  **Safari and mobile safari are not supported**. It might work, or it [might not](https://github.com/mkoryak/floatThead/issues/108), depending on your markup and safari version.

Common Pitfalls
------
If you use css and html best practices, this plugin will work. If you are stuck in 1999, you better [read the faq](http://mkoryak.github.io/floatThead/faq/).

How to get help with the floatThead
------------
All issues should be reported through github. Coffee/Beer donations are welcome ;)

Requirements:
-------------

-   jQuery 1.8.x or better (1.9 compliant) (or jQuery 1.7.x and jQuery UI core)

Supported Browsers:
-------------
-   IE8 or better (**must read** [this for ANY Internet Exploder integrations](http://mkoryak.github.io/floatThead/examples/row-groups/))
-   Chrome, Firefox (all versions from last 3 years)


Change Log
----------
[see CHANGELOG.md](https://github.com/mkoryak/floatThead/blob/master/CHANGELOG.md)


## Who is using floatThead ?

### [around 45K hits on guthub cod search](https://github.com/search?q=floatThead&ref=reposearch&type=Code&utf8=%E2%9C%93)

### [http://kangax.github.io/compat-table/](http://kangax.github.io/compat-table/es6/)

### [staticsitegenerators.net](http://staticsitegenerators.net/)

### [netdisco](http://netdisco.org)
- http://sourceforge.net/p/netdisco/netdisco-ng/ci/213352d54ee8e71cbca5ae2c1c75696800c4216b/

### [pylyglot](https://github.com/omaciel/pylyglot)
- https://github.com/omaciel/pylyglot/tree/master/pylyglot/static/js

### [django-sql-explorer](https://github.com/epantry/django-sql-explorer)
- https://github.com/epantry/django-sql-explorer/commit/34ae345325a1e07ff952800fcd6dc5bddac5e3f2-


License
-------
MIT
