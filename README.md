<p align="left">
<h1>
    <a href="https://github.com/mkoryak/floatThead/releases">jquery.floatThead</a>
    <a href="https://unpkg.com/floatthead/dist/jquery.floatThead.min.js"><img
            src="http://img.badgesize.io/https://unpkg.com/floatthead/dist/jquery.floatThead.min.js?compression=gzip&style=flat-square"
            alt="Gzip Size"></a>
    <a href="https://www.npmjs.com/package/floatthead"><img src="https://img.shields.io/npm/v/floatthead.svg?style=flat-square"
                                                       alt="NPM Version"></a>
    <a href="https://github.com/mkoryak/floatThead/blob/master/LICENSE"><img
            src="https://img.shields.io/npm/l/floatthead.svg?style=flat-square" alt="License"></a>
</h1>
</p>


[![woot](http://giant.gfycat.com/AnyGloriousAlpaca.gif "or just click")](http://mkoryak.github.io/floatThead/)

## Documentation & Examples: http://mkoryak.github.io/floatThead/

Float the table header on scroll. No changes to your HTML/CSS are required, it just works.
Supports floating the header while scrolling within the window or while scrolling within a container with overflow.
Supports responsive tables.

### Install

#### Package managers
```console
npm install floatthead
bower install floatThead
```
#### Download code
[Latest Release (zip)](https://github.com/mkoryak/floatThead/archive/2.1.3.zip)

#### Via CDN
[https://cdnjs.com/libraries/floatthead/](https://cdnjs.com/libraries/floatthead/)    
[https://www.jsdelivr.com/#!jquery.floatthead](https://www.jsdelivr.com/#!jquery.floatthead)    
[https://unpkg.com/floatthead](https://unpkg.com/floatthead)    

```html
<!-- Latest compiled and minified JavaScript -->
<script src="https://unpkg.com/floatthead"></script>
<script>
  $(() => $('table').floatThead());
</script>
```

#### For java people
[Webjar](https://github.com/webjars/floatThead)

### Wrappers
[vuejs component](https://github.com/tmlee/vue-floatThead) by @tmlee

[angularjs directive](https://github.com/brandon-barker/angular-floatThead) by @brandon-barker

[yii2 framework wrapper](https://github.com/bluezed/yii2-floatThead) by @bluezed

# Things this plugin does:
---------
-   In prod @ big corporations and opensource projects. Maintained. See open issues.
-   Works on tables within a scrollable container or whole window scrolling
-   Works with responsive table wrappers
-   Works with dynamically hidden/added/removed columns
-   Does not clone the thead - so your events stay bound
-   Does what `position:fixed` cannot do (and on browsers that do not support it)
-   Does not mess with your styles, and doesnt require any css (see `fixed` vs `absolute` position modes)
-   Works with border-collapse variants, weird margins, padding and borders
-   Works with libs like [datatables](http://datatables.net), [perfect-scrollbar](http://mkoryak.github.io/floatThead/examples/perfect-scrollbar/), [bootstrap3](http://mkoryak.github.io/floatThead/examples/bootstrap3/), and many more
-   Header can be floated with `position:absolute` which adds a wrapper, or `position:fixed` which does not. Both have their pros and cons. By default the best option is chosen based on your configuration


# Things this plugin does NOT do:
---------
-  Does not float the footer
-  Does not let you lock the first column like in excel
-  **Safari and mobile safari are not supported**. It might work, or it [might not](https://github.com/mkoryak/floatThead/issues/108), depending on your markup and safari version.
-  RTL is not really supported - it might work in overflow scrolling more, if you are lucky. Expects `dir` on `html` element.
-  Layout issues resulting from document zoom not being 100% are not supported.


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

### [Around 128K hits on guthub code search](https://github.com/search?q=floatThead&ref=reposearch&type=Code&utf8=%E2%9C%93)

### [WheresTheGig.com](https://WheresTheGig.com) 
- A free service for the musical community 

### [Google](https://www.youtube.com/watch?v=dQw4w9WgXcQ) 
- Internally, I happen to know...

### [Samsung](https://github.com/Samsung/iotjscode/blob/3d4de15ea32d27dce5885b2c8c9e3a783c846311/www/scripts/app/main.js#L234)
- For the internet of things!

### [compat-table](https://github.com/kangax/compat-table/) 
- https://github.com/kangax/compat-table/blob/gh-pages/jquery.floatThead.min.js
- [online site](http://kangax.github.io/compat-table/es6/) (see floatThead in action here)

### [netdisco](http://netdisco.org)
- http://sourceforge.net/p/netdisco/netdisco-ng/ci/213352d54ee8e71cbca5ae2c1c75696800c4216b/

### [pylyglot](https://github.com/omaciel/pylyglot)
- https://github.com/omaciel/pylyglot/tree/master/pylyglot/static/js

### [django-sql-explorer](https://github.com/groveco/django-sql-explorer)
- https://github.com/groveco/django-sql-explorer#dependencies


License
-------
MIT
