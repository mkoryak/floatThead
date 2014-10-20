// @preserve jQuery.floatThead 1.2.9dev - http://mkoryak.github.io/floatThead/ - Copyright (c) 2012 - 2014 Misha Koryak
// @license MIT

/* @author Misha Koryak
 * @projectDescription lock a table header in place while scrolling - without breaking styles or events bound to the header
 *
 * Dependencies:
 * jquery 1.9.0 + [required] OR jquery 1.7.0 + jquery UI core
 *
 * http://mkoryak.github.io/floatThead/
 *
 * Tested on FF13+, Chrome 21+, IE8, IE9, IE10, IE11
 *
 */
(function( $ ) {
  /**
   * provides a default config object. You can modify this after including this script if you want to change the init defaults
   * @type {Object}
   */
  $.floatThead = $.floatThead || {};
  $.floatThead.defaults = {
    cellTag: null, // DEPRECATED - use headerCellSelector instead
    headerCellSelector: 'tr:first>th:visible', //thead cells are this.
    zIndex: 1001, //zindex of the floating thead (actually a container div)
    debounceResizeMs: 10,
    useAbsolutePositioning: true, //if set to NULL - defaults: has scrollContainer=true, doesn't have scrollContainer=false
    scrollingTop: 0, //String or function($table) - offset from top of window where the header should not pass above
    scrollingBottom: 0, //String or function($table) - offset from the bottom of the table where the header should stop scrolling
    scrollContainer: function($table){
      return $([]); //if the table has horizontal scroll bars then this is the container that has overflow:auto and causes those scroll bars
    },
    getSizingRow: function($table, $cols, $fthCells){ // this is only called when using IE,
      // override it if the first row of the table is going to contain colgroups (any cell spans greater then one col)
      // it should return a jquery object containing a wrapped set of table cells comprising a row that contains no col spans and is visible
      return $table.find('tbody tr:visible:first>*:visible');
    },
    floatTableClass: 'floatThead-table',
    floatWrapperClass: 'floatThead-wrapper',
    floatContainerClass: 'floatThead-container',
    copyTableClass: true, //copy 'class' attribute from table into the floated table so that the styles match.
    debug: false //print possible issues (that don't prevent script loading) to console, if console exists.
  };

  var util = window._;

  //browser stuff
  var ieVersion = function(){for(var a=3,b=document.createElement("b"),c=b.all||[];a = 1+a,b.innerHTML="<!--[if gt IE "+ a +"]><i><![endif]-->",c[0];);return 4<a?a:document.documentMode}();
  var isChrome = null;
  var isChromeCheck = function(){
    if(ieVersion){
      return false;
    }
    var $table = $("<table><colgroup><col></colgroup><tbody><tr><td style='width:10px'></td></tbody></table>");
    $('body').append($table);
    var width = $table.find('col').width();
    $table.remove();
    return width == 0;
  };

  var $window = $(window);
  var floatTheadCreated = 0;


  /**
   * @param debounceMs
   * @param cb
   */

  function windowResize(debounceMs, eventName, cb){
    if(ieVersion == 8){ //ie8 is crap: https://github.com/mkoryak/floatThead/issues/65
      var winWidth = $window.width();
      var debouncedCb = util.debounce(function(){
        var winWidthNew = $window.width();
        if(winWidth != winWidthNew){
          winWidth = winWidthNew;
          cb();
        }
      }, debounceMs);
      $window.on(eventName, debouncedCb);
    } else {
      $window.on(eventName, util.debounce(cb, debounceMs));
    }
  }


  function debug(str){
    window.console && window.console && window.console.log && window.console.log(str);
  }

  /**
   * try to calculate the scrollbar width for your browser/os
   * @return {Number}
   */
  function scrollbarWidth() {
    var $div = $( //borrowed from anti-scroll
        '<div style="width:50px;height:50px;overflow-y:scroll;'
        + 'position:absolute;top:-200px;left:-200px;"><div style="height:100px;width:100%">'
        + '</div>'
    );
    $('body').append($div);
    var w1 = $div.innerWidth();
    var w2 = $('div', $div).innerWidth();
    $div.remove();
    return w1 - w2;
  }
  /**
   * Check if a given table has been datatableized (http://datatables.net)
   * @param $table
   * @return {Boolean}
   */
  function isDatatable($table){
    if($table.dataTableSettings){
      for(var i = 0; i < $table.dataTableSettings.length; i++){
        var table = $table.dataTableSettings[i].nTable;
        if($table[0] == table){
          return true;
        }
      }
    }
    return false;
  }
  $.fn.floatThead = function(map){
    map = map || {};
    if(!util){ //may have been included after the script? lets try to grab it again.
      util = window._ || $.floatThead._;
      if(!util){
        throw new Error("jquery.floatThead-slim.js requires underscore. You should use the non-lite version since you do not have underscore.");
      }
    }

    if(ieVersion < 8){
      return this; //no more crappy browser support.
    }

    if(isChrome == null){ //make sure this is done only once no matter how many times you call the plugin fn
      isChrome = isChromeCheck(); //need to call this after dom ready, and now it is.
      if(isChrome){
        //because chrome cant read <col> width, these elements are used for sizing the table. Need to create new elements because they must be unstyled by user's css.
        document.createElement('fthtr'); //tr
        document.createElement('fthtd'); //td
        document.createElement('fthfoot'); //tfoot
      }
    }
    if(util.isString(map)){
      var command = map;
      var ret = this;
      this.filter('table').each(function(){
        var obj = $(this).data('floatThead-attached');
        if(obj && util.isFunction(obj[command])){
          var r = obj[command]();
          if(typeof r !== 'undefined'){
            ret = r;
          }
        }
      });
      return ret;
    }
    var opts = $.extend({}, $.floatThead.defaults || {}, map);

    $.each(map, function(key, val){
      if((!(key in $.floatThead.defaults)) && opts.debug){
        debug("jQuery.floatThead: used ["+key+"] key to init plugin, but that param is not an option for the plugin. Valid options are: "+ (util.keys($.floatThead.defaults)).join(', '));
      }
    });

    this.filter(':not(.'+opts.floatTableClass+')').each(function(){
      var floatTheadId = floatTheadCreated;
      var $table = $(this);
      if($table.data('floatThead-attached')){
        return true; //continue the each loop
      }
      if(!$table.is('table')){
        throw new Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');
      }
      var $header = $table.find('thead:first');
      var $tbody = $table.find('tbody:first');
      if($header.length == 0){
        throw new Error('jQuery.floatThead must be run on a table that contains a <thead> element');
      }
      var headerFloated = false;
      var scrollingTop, scrollingBottom;
      var scrollbarOffset = {vertical: 0, horizontal: 0};
      var scWidth = scrollbarWidth();
      var lastColumnCount = 0; //used by columnNum()
      var $scrollContainer = opts.scrollContainer($table) || $([]); //guard against returned nulls

      var useAbsolutePositioning = opts.useAbsolutePositioning;
      if(useAbsolutePositioning == null){ //defaults: locked=true, !locked=false
        useAbsolutePositioning = opts.scrollContainer($table).length;
      }
      var $caption = $table.find("caption");
      var haveCaption = $caption.length == 1;
      if(haveCaption){
        var captionAlignTop = ($caption.css("caption-side") || $caption.attr("align") || "top") === "top";
      }

      var $fthGrp = $('<fthfoot style="display:table-footer-group;"/>');

      var locked = $scrollContainer.length > 0;
      var wrappedContainer = false; //used with absolute positioning enabled. did we need to wrap the scrollContainer/table with a relative div?
      var $wrapper = $([]); //used when absolute positioning enabled - wraps the table and the float container
      var absoluteToFixedOnScroll = ieVersion <= 9 && !locked && useAbsolutePositioning; //on ie using absolute positioning doesnt look good with window scrolling, so we change positon to fixed on scroll, and then change it back to absolute when done.
      var $floatTable = $("<table/>");
      var $floatColGroup = $("<colgroup/>");
      var $tableColGroup = $table.find('colgroup:first');
      var existingColGroup = true;
      if($tableColGroup.length == 0){
        $tableColGroup = $("<colgroup/>");
        existingColGroup = false;
      }
      var $fthRow = $('<fthrow style="display:table-row;height:0;"/>'); //created unstyled elements
      var $floatContainer = $('<div style="overflow: hidden;"></div>');
      var $newHeader = $("<thead/>");
      var $sizerRow = $('<tr class="size-row"/>');
      var $sizerCells = $([]);
      var $tableCells = $([]); //used for sizing - either $sizerCells or $tableColGroup cols. $tableColGroup cols are only created in chrome for borderCollapse:collapse because of a chrome bug.
      var $headerCells = $([]);
      var $fthCells = $([]); //created elements

      $newHeader.append($sizerRow);
      $table.prepend($tableColGroup);
      if(isChrome){
        $fthGrp.append($fthRow);
        $table.append($fthGrp);
      }

      $floatTable.append($floatColGroup);
      $floatContainer.append($floatTable);
      if(opts.copyTableClass){
        $floatTable.attr('class', $table.attr('class'));
      }
      $floatTable.attr({ //copy over some deprecated table attributes that people still like to use. Good thing poeple dont use colgroups...
        'cellpadding': $table.attr('cellpadding'),
        'cellspacing': $table.attr('cellspacing'),
        'border': $table.attr('border')
      });
      $floatTable.css({
        'borderCollapse': $table.css('borderCollapse'),
        'border': $table.css('border')
      });

      $floatTable.addClass(opts.floatTableClass).css('margin', 0); //must have no margins or you wont be able to click on things under floating table

      if(useAbsolutePositioning){
        var makeRelative = function($container, alwaysWrap){
          var positionCss = $container.css('position');
          var relativeToScrollContainer = (positionCss == "relative" || positionCss == "absolute");
          if(!relativeToScrollContainer || alwaysWrap){
            var css = {"paddingLeft": $container.css('paddingLeft'), "paddingRight": $container.css('paddingRight')};
            $floatContainer.css(css);
            $container = $container.wrap("<div class='"+opts.floatWrapperClass+"' style='position: relative; clear:both;'></div>").parent();
            wrappedContainer = true;
          }
          return $container;
        };
        if(locked){
          $wrapper = makeRelative($scrollContainer, true);
          $wrapper.append($floatContainer);
        } else {
          $wrapper = makeRelative($table);
          $table.after($floatContainer);
        }
      } else {
        $table.after($floatContainer);
      }


      $floatContainer.css({
        position: useAbsolutePositioning ? 'absolute' : 'fixed',
        marginTop: 0,
        top:  useAbsolutePositioning ? 0 : 'auto',
        zIndex: opts.zIndex
      });
      $floatContainer.addClass(opts.floatContainerClass);
      updateScrollingOffsets();

      var layoutFixed = {'table-layout': 'fixed'};
      var layoutAuto = {'table-layout': $table.css('tableLayout') || 'auto'};
      var originalTableWidth = $table[0].style.width || ""; //setting this to auto is bad: #70
      var originalTableMinWidth = $table.css('minWidth') || "";

      function eventName(name){
        return name+'.fth-'+floatTheadId+'.floatTHead'
      }

      function setHeaderHeight(){
        var headerHeight = 0;
        $header.find("tr:visible").each(function(){
          headerHeight += $(this).outerHeight(true);
        });
        $sizerRow.height(headerHeight);
        $sizerCells.height(headerHeight);
      }


      function setFloatWidth(){
        var tableWidth = $table.outerWidth();
        var width = $scrollContainer.width() || tableWidth;
        var floatContainerWidth = $scrollContainer.css("overflow-y") != 'hidden' ? width - scrollbarOffset.vertical : width;
        $floatContainer.width(floatContainerWidth);
        if(locked){
          var percent = 100 * tableWidth / (floatContainerWidth);
          $floatTable.css('width', percent+'%');
        } else {
          $floatTable.width(tableWidth);
        }
      }

      function updateScrollingOffsets(){
        scrollingTop = (util.isFunction(opts.scrollingTop) ? opts.scrollingTop($table) : opts.scrollingTop) || 0;
        scrollingBottom = (util.isFunction(opts.scrollingBottom) ? opts.scrollingBottom($table) : opts.scrollingBottom) || 0;
      }

      /**
       * get the number of columns and also rebuild resizer rows if the count is different then the last count
       */
      function columnNum(){
        var count, $headerColumns;
        if(existingColGroup){
          count = $tableColGroup.find('col').length;
        } else {
          var selector;
          if(opts.cellTag == null && opts.headerCellSelector){ //TODO: once cellTag option is removed, remove this conditional
            selector = opts.headerCellSelector;
          } else {
            selector = 'tr:first>'+opts.cellTag;
          }
          if(util.isNumber(selector)){
            //its actually a row count.
            return selector;
          }
          $headerColumns = $header.find(selector);
          count = 0;
          $headerColumns.each(function(){
            count += parseInt(($(this).attr('colspan') || 1), 10);
          });
        }
        if(count != lastColumnCount){
          lastColumnCount = count;
          var cells = [], cols = [], psuedo = [];
          for(var x = 0; x < count; x++){
            cells.push('<th class="floatThead-col"/>');
            cols.push('<col/>');
            psuedo.push("<fthtd style='display:table-cell;height:0;width:auto;'/>");
          }

          cols = cols.join('');
          cells = cells.join('');

          if(isChrome){
            psuedo = psuedo.join('');
            $fthRow.html(psuedo);
            $fthCells = $fthRow.find('fthtd');
          }

          $sizerRow.html(cells);
          $sizerCells = $sizerRow.find("th");
          if(!existingColGroup){
            $tableColGroup.html(cols);
          }
          $tableCells = $tableColGroup.find('col');
          $floatColGroup.html(cols);
          $headerCells = $floatColGroup.find("col");

        }
        return count;
      }

      function refloat(){ //make the thing float
        if(!headerFloated){
          headerFloated = true;
          if(useAbsolutePositioning){ //#53, #56
            var tableWidth = $table.width();
            var wrapperWidth = $wrapper.width();
            if(tableWidth > wrapperWidth){
              $table.css('minWidth', tableWidth);
            }
          }
          $table.css(layoutFixed);
          $floatTable.css(layoutFixed);
          $floatTable.append($header); //append because colgroup must go first in chrome
          $tbody.before($newHeader);
          setHeaderHeight();
        }
      }
      function unfloat(){ //put the header back into the table
        if(headerFloated){
          headerFloated = false;
          if(useAbsolutePositioning){ //#53, #56
            $table.width(originalTableWidth);
          }
          $newHeader.detach();
          $table.prepend($header);
          $table.css(layoutAuto);
          $floatTable.css(layoutAuto);
          $table.css('minWidth', originalTableMinWidth);
          $table.css('minWidth', $table.width()); //#121
        }
      }
      function changePositioning(isAbsolute){
        if(useAbsolutePositioning != isAbsolute){
          useAbsolutePositioning = isAbsolute;
          $floatContainer.css({
            position: useAbsolutePositioning ? 'absolute' : 'fixed'
          });
        }
      }
      function getSizingRow($table, $cols, $fthCells, ieVersion){
        if(isChrome){
          return $fthCells;
        } else if(ieVersion) {
          return opts.getSizingRow($table, $cols, $fthCells);
        } else {
          return $cols;
        }
      }

      /**
       * returns a function that updates the floating header's cell widths.
       * @return {Function}
       */
      function reflow(){
        var i;
        var numCols = columnNum(); //if the tables columns change dynamically since last time (datatables) we need to rebuild the sizer rows and get new count
        return function(){
          var $rowCells = getSizingRow($table, $tableCells, $fthCells, ieVersion);
          if($rowCells.length == numCols && numCols > 0){
            if(!existingColGroup){
              for(i=0; i < numCols; i++){
                $tableCells.eq(i).css('width', '');
              }
            }
            unfloat();
            var widths = [];
            for(i=0; i < numCols; i++){
              widths[i] = $rowCells.get(i).offsetWidth;
            }
            for(i=0; i < numCols; i++){
              $headerCells.eq(i).width(widths[i]);
              $tableCells.eq(i).width(widths[i]);
            }
            refloat();
          } else {
            $floatTable.append($header);
            $table.css(layoutAuto);
            $floatTable.css(layoutAuto);
            setHeaderHeight();
          }
        };
      }

      function floatContainerBorderWidth(side){
        var border = $scrollContainer.css("border-"+side+"-width");
        var w = 0;
        if (border && ~border.indexOf('px')) {
          w = parseInt(border, 10);
        }
        return w;
      }
      /**
       * first performs initial calculations that we expect to not change when the table, window, or scrolling container are scrolled.
       * returns a function that calculates the floating container's top and left coords. takes into account if we are using page scrolling or inner scrolling
       * @return {Function}
       */
      function calculateFloatContainerPosFn(){
        var scrollingContainerTop = $scrollContainer.scrollTop();

        //this floatEnd calc was moved out of the returned function because we assume the table height doesnt change (otherwise we must reinit by calling calculateFloatContainerPosFn)
        var floatEnd;
        var tableContainerGap = 0;
        var captionHeight = haveCaption ? $caption.outerHeight(true) : 0;
        var captionScrollOffset = captionAlignTop ? captionHeight : -captionHeight;

        var floatContainerHeight = $floatContainer.height();
        var tableOffset = $table.offset();
        var tableLeftGap = 0; //can be caused by border on container (only in locked mode)
        if(locked){
          var containerOffset = $scrollContainer.offset();
          tableContainerGap = tableOffset.top - containerOffset.top + scrollingContainerTop;
          if(haveCaption && captionAlignTop){
            tableContainerGap += captionHeight;
          }
          tableContainerGap -= floatContainerBorderWidth('top');
          tableLeftGap = floatContainerBorderWidth('left');
        } else {
          floatEnd = tableOffset.top - scrollingTop - floatContainerHeight + scrollingBottom + scrollbarOffset.horizontal;
        }
        var windowTop = $window.scrollTop();
        var windowLeft = $window.scrollLeft();
        var scrollContainerLeft =  $scrollContainer.scrollLeft();
        scrollingContainerTop = $scrollContainer.scrollTop();



        return function(eventType){
          if(eventType == 'windowScroll'){
            windowTop = $window.scrollTop();
            windowLeft = $window.scrollLeft();
          } else if(eventType == 'containerScroll'){
            scrollingContainerTop = $scrollContainer.scrollTop();
            scrollContainerLeft =  $scrollContainer.scrollLeft();
          } else if(eventType != 'init') {
            windowTop = $window.scrollTop();
            windowLeft = $window.scrollLeft();
            scrollingContainerTop = $scrollContainer.scrollTop();
            scrollContainerLeft =  $scrollContainer.scrollLeft();
          }
          if(isChrome && (windowTop < 0 || windowLeft < 0)){ //chrome overscroll effect at the top of the page - breaks fixed positioned floated headers
            return;
          }

          if(absoluteToFixedOnScroll){
            if(eventType == 'windowScrollDone'){
              changePositioning(true); //change to absolute
            } else {
              changePositioning(false); //change to fixed
            }
          } else if(eventType == 'windowScrollDone'){
            return null; //event is fired when they stop scrolling. ignore it if not 'absoluteToFixedOnScroll'
          }

          tableOffset = $table.offset();
          if(haveCaption && captionAlignTop){
            tableOffset.top += captionHeight;
          }
          var top, left;
          var tableHeight = $table.outerHeight();

          if(locked && useAbsolutePositioning){ //inner scrolling, absolute positioning
            if (tableContainerGap >= scrollingContainerTop) {
              var gap = tableContainerGap - scrollingContainerTop;
              top = gap > 0 ? gap : 0;
            } else {
              top = wrappedContainer ? 0 : scrollingContainerTop;
              //headers stop at the top of the viewport
            }
            left = tableLeftGap;
          } else if(!locked && useAbsolutePositioning) { //window scrolling, absolute positioning
            if(windowTop > floatEnd + tableHeight + captionScrollOffset){
              top = tableHeight - floatContainerHeight + captionScrollOffset; //scrolled past table
            } else if (tableOffset.top > windowTop + scrollingTop) {
              top = 0; //scrolling to table
              unfloat();
            } else {
              top = scrollingTop + windowTop - tableOffset.top + tableContainerGap + (captionAlignTop ? captionHeight : 0);
              refloat(); //scrolling within table. header floated
            }
            left =  0;
          } else if(locked && !useAbsolutePositioning){ //inner scrolling, fixed positioning
            if (tableContainerGap > scrollingContainerTop || scrollingContainerTop - tableContainerGap > tableHeight) {
              top = tableOffset.top - windowTop;
              unfloat();
            } else {
              top = tableOffset.top + scrollingContainerTop  - windowTop - tableContainerGap;
              refloat();
              //headers stop at the top of the viewport
            }
            left = tableOffset.left + scrollContainerLeft - windowLeft;
          } else if(!locked && !useAbsolutePositioning) { //window scrolling, fixed positioning
            if(windowTop > floatEnd + tableHeight + captionScrollOffset){
              top = tableHeight + scrollingTop - windowTop + floatEnd + captionScrollOffset;
              //scrolled past the bottom of the table
            } else if (tableOffset.top > windowTop + scrollingTop) {
              top = tableOffset.top - windowTop;
              refloat();
              //scrolled past the top of the table
            } else {
              //scrolling within the table
              top = scrollingTop;
            }
            left = tableOffset.left - windowLeft;
          }
          return {top: top, left: left};
        };
      }
      /**
       * returns a function that caches old floating container position and only updates css when the position changes
       * @return {Function}
       */
      function repositionFloatContainerFn(){
        var oldTop = null;
        var oldLeft = null;
        var oldScrollLeft = null;
        return function(pos, setWidth, setHeight){
          if(pos != null && (oldTop != pos.top || oldLeft != pos.left)){
            $floatContainer.css({
              top: pos.top,
              left: pos.left
            });
            oldTop = pos.top;
            oldLeft = pos.left;
          }
          if(setWidth){
            setFloatWidth();
          }
          if(setHeight){
            setHeaderHeight();
          }
          var scrollLeft = $scrollContainer.scrollLeft();
          if(!useAbsolutePositioning || oldScrollLeft != scrollLeft){
            $floatContainer.scrollLeft(scrollLeft);
            oldScrollLeft = scrollLeft;
          }
        }
      }

      /**
       * checks if THIS table has scrollbars, and finds their widths
       */
      function calculateScrollBarSize(){ //this should happen after the floating table has been positioned
        if($scrollContainer.length){
          var sw = $scrollContainer.width(), sh = $scrollContainer.height(), th = $table.height(), tw = $table.width();
          var offseth = sw < tw ? scWidth : 0;
          var offsetv = sh < th ? scWidth : 0;
          scrollbarOffset.horizontal = sw - offsetv < tw ? scWidth : 0;
          scrollbarOffset.vertical =  sh - offseth < th ? scWidth: 0;
        }
      }
      //finish up. create all calculation functions and bind them to events
      calculateScrollBarSize();

      var flow;

      var ensureReflow = function(){
        flow = reflow();
        flow();
      };

      ensureReflow();

      var calculateFloatContainerPos = calculateFloatContainerPosFn();
      var repositionFloatContainer = repositionFloatContainerFn();

      repositionFloatContainer(calculateFloatContainerPos('init'), true); //this must come after reflow because reflow changes scrollLeft back to 0 when it rips out the thead

      var windowScrollDoneEvent = util.debounce(function(){
        repositionFloatContainer(calculateFloatContainerPos('windowScrollDone'), false);
      }, 300);

      var windowScrollEvent = function(){
        repositionFloatContainer(calculateFloatContainerPos('windowScroll'), false);
        windowScrollDoneEvent();
      };
      var containerScrollEvent = function(){
        repositionFloatContainer(calculateFloatContainerPos('containerScroll'), false);
      };


      var windowResizeEvent = function(){
        updateScrollingOffsets();
        calculateScrollBarSize();
        ensureReflow();
        calculateFloatContainerPos = calculateFloatContainerPosFn();
        repositionFloatContainer = repositionFloatContainerFn();
        repositionFloatContainer(calculateFloatContainerPos('resize'), true, true);
      };
      var reflowEvent = util.debounce(function(){
        calculateScrollBarSize();
        updateScrollingOffsets();
        ensureReflow();
        calculateFloatContainerPos = calculateFloatContainerPosFn();
        repositionFloatContainer(calculateFloatContainerPos('reflow'), true);
      }, 1);
      if(locked){ //internal scrolling
        if(useAbsolutePositioning){
          $scrollContainer.on(eventName('scroll'), containerScrollEvent);
        } else {
          $scrollContainer.on(eventName('scroll'), containerScrollEvent);
          $window.on(eventName('scroll'), windowScrollEvent);
        }
      } else { //window scrolling
        $window.on(eventName('scroll'), windowScrollEvent);
      }

      $window.on(eventName('load'), reflowEvent); //for tables with images

      windowResize(opts.debounceResizeMs, eventName('resize'), windowResizeEvent);
      $table.on('reflow', reflowEvent);
      if(isDatatable($table)){
        $table
          .on('filter', reflowEvent)
          .on('sort',   reflowEvent)
          .on('page',   reflowEvent);
      }

      //attach some useful functions to the table.
      $table.data('floatThead-attached', {
        destroy: function(){
          var ns = '.fth-'+floatTheadId;
          unfloat();
          $table.css(layoutAuto);
          $tableColGroup.remove();
          isChrome && $fthGrp.remove();
          if($newHeader.parent().length){ //only if its in the dom
            $newHeader.replaceWith($header);
          }
          $table.off('reflow');
          $scrollContainer.off(ns);
          if (wrappedContainer) {
            if ($scrollContainer.length) {
              $scrollContainer.unwrap();
            }
            else {
              $table.unwrap();
            }
          }
          $table.css('minWidth', originalTableMinWidth);
          $floatContainer.remove();
          $table.data('floatThead-attached', false);

          $window.off(ns);
        },
        reflow: function(){
          reflowEvent();
        },
        setHeaderHeight: function(){
          setHeaderHeight();
        },
        getFloatContainer: function(){
          return $floatContainer;
        },
        getRowGroups: function(){
          if(headerFloated){
            return $floatContainer.find("thead").add($table.find("tbody,tfoot"));
          } else {
            return $table.find("thead,tbody,tfoot");
          }
        }
      });
      floatTheadCreated++;
    });
    return this;
  };
})(jQuery);