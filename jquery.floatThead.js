/**
 * jQuery.floatThead
 * Copyright (c) 2012 Misha Koryak - https://github.com/mkoryak/floatThead
 * Licensed under Creative Commons Attribution-NonCommercial 3.0 Unported - http://creativecommons.org/licenses/by-sa/3.0/
 * Date: 11/02/12
 *
 * @projectDescription lock a table header in place while scrolling - without breaking styles or events bound to the header
 *
 * Dependancies:
 * jquery 1.8.0 + [required] OR jquery 1.7.0 + jquery UI core
 * underscore.js 1.3.0 + [required]
 *
 * http://notetodogself.blogspot.com
 * http://programmingdrunk.com/floatThead/
 *
 * Tested on FF13+, Chrome 21, IE9, IE8, IE7 (but tables with colspans are not supported in ie7)
 *
 * @author Misha Koryak
 * @version 0.8.3
 */
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name jquery.floatThead.min.js
// ==/ClosureCompiler==
(function( $ ) {

    
/**
 * provides a default config object. You can modify this after including this script if you want to change the init defaults
 * @type {Object}
 */
$.floatThead = {
    defaults: {
        cellTag: 'th',
        zIndex: 1001, //zindex of the floating thead (actually a container div)
        debounceResizeMs: 1,
        scrollingTop: 0, //String or function($table) - offset from top of window where the header should not pass above
        //TODO: this got lost somewhere - needs to be re-implemented
        scrollingBottom: 0, //String or function($table) - offset from the bottom of the table where the header should stop scrolling
        scrollContainer: function($table){
            return $([]); //if the table has horizontal scroll bars then this is the container that has overflow:auto and causes those scroll bars
        },
        getSizingRow: function($table, $cols){
            if($.browser.mozilla){
                return $cols;
            } else {
                return $table.find('tbody tr:first>td');
            }
        },
        floatTableClass: 'floatThead-table'
    }            
};
  
var $window = $(window);
var floatTheadCreated = 0;
/**
 * debounce and fix window resize event for ie7. ie7 is evil and will fire window resize event when ANY dom element is resized.
 * @param debounceMs
 * @param cb
 */
function windowResize(debounceMs, cb){
    var winWidth = $window.width();
    var winHeight = $window.height();
    var debouncedCb = _.debounce(function(){
        if($.browser.msie && parseFloat($.browser.version) <= 8.0) { 
            var winWidthNew = $window.width();
            var winHeightNew = $window.height();
            if(winWidth != winWidthNew || winHeight != winHeightNew){
                winWidth = winWidthNew;
                winHeight = winHeightNew;
                cb();
            }
        } else {
            cb();
        }
    }, debounceMs);
    $window.bind('resize.floatTHead', debouncedCb);
}

/**
 * try to calculate the scrollbar width for your browser/os
 * @return {Number}
 */
function scrollbarWidth() {
    var scrollbarWidth = 0;                    
    var $div = $('<div/>')
    .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
    .prependTo('body').append('<div/>').find('div')
    .css({ width: '100%', height: 200 });
    scrollbarWidth = 100 - $div.width();
    $div.parent().remove();
    return scrollbarWidth;
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
    if($.browser.msie && parseFloat($.browser.version) <= 7.0){
        return this; //no more crappy browser support. 
    }
    if(_.isString(map)){
        var command = map;
        this.filter('table').each(function(){
            var obj = $(this).data('floatThead-attached');
            if(obj && _.isFunction(obj[command])){
                obj[command]();
            }
        });
        return this;
    }
    var opts = $.extend({}, $.floatThead.defaults, map);
    this.filter(':not(.'+opts.floatTableClass+')').each(function(){
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

        var scrollingTop, scrollingBottom;
        var scrollbarOffset = {vertical: 0, horizontal: 0};
        var scWidth = scrollbarWidth();
        var lastColumnCount = 0; //used by columnNum()
        var $scrollContainer = opts.scrollContainer($table);
       
        var locked = $scrollContainer.length > 0; 
        
        var $floatTable = $("<table/>");
        var $floatColGroup = $("<colgroup/>");
        var $tableColGroup = $("<colgroup/>");
        var $floatContainer = $('<div style="overflow: hidden;"></div>');
        var $newHeader = $("<thead/>");
        var $sizerRow = $('<tr class="size-row"/>');
        var $sizerCells = $([]);
        var $tableCells = $([]); //used for sizing - either $sizerCells or $tableColGroup cols. $tableColGroup cols are only created in chrome for borderCollapse:collapse because of a chrome bug.
        var $headerCells = $([]);

        $newHeader.append($sizerRow);
        $header.detach();
        $table.prepend($newHeader); 
        $table.prepend($tableColGroup);
        
        $floatTable.append($floatColGroup);
        $floatContainer.append($floatTable);
        $floatTable.attr('class', $table.attr('class'));
        $floatTable.addClass(opts.floatTableClass).css('margin', 0); //must have no margins or you wont be able to click on things under floating table
        $table.after($floatContainer);
        
        $floatContainer.css({
                position: 'fixed',
                marginTop: 0,
                zIndex: opts.zIndex
        });
        updateScrollingOffsets();
        
        var layoutFixed = {'table-layout': 'fixed'};
        var layoutAuto = {'table-layout': $table.css('tableLayout') || 'auto'};

        function setHeaderHeight(){
            var headerHeight = $header.outerHeight(true);
            $sizerRow.outerHeight(headerHeight);
            $sizerCells.outerHeight(headerHeight);
        }
        
                
        function setFloatWidth(){
            var tableWidth = $table.outerWidth();
            var width = $scrollContainer.width() || tableWidth;
            $floatContainer.width(width - scrollbarOffset.vertical);
            if(locked){
                var percent = 100 * tableWidth / (width - scrollbarOffset.vertical);
                $floatTable.css('width', percent+'%');
            } else {
                $floatTable.outerWidth(tableWidth);
            }
        }
        
        function updateScrollingOffsets(){
            scrollingTop = (_.isFunction(opts.scrollingTop) ? opts.scrollingTop($table) : opts.scrollingTop) || 0;
            scrollingBottom = (_.isFunction(opts.scrollingBottom) ? opts.scrollingBottom($table) : opts.scrollingBottom) || 0;
        }

        /**
         * get the number of columns and also rebuild resizer rows if the count is different then the last count
         */
        function columnNum(){
            var $headerColumns = $header.find('tr:first>'+opts.cellTag);            
            var count =  _.reduce($headerColumns, function(sum, cell){
                return sum + parseInt(($(cell).attr('colspan') || 1), 10);
            }, 0);
            if(count != lastColumnCount){
                lastColumnCount = count;
                var cells = [], cols = [];
                for(var x = 0; x < count; x++){
                    cells.push('<td/>');
                    cols.push('<col/>');
                }
                cols = cols.join('');
                cells = cells.join('');
                $sizerRow.html(cells);
                $tableCells = $sizerRow.find('>td');
                $tableColGroup.html(cols);
                $tableCells = $tableColGroup.find('col');
                
                $floatColGroup.html(cols);
                $headerCells = $floatColGroup.find("col");
                
            }
            return count;
        }

        /**
         * returns a function that updates the floating header's cell widths.
         * @return {Function}
         */
        function reflow(){
            var numCols = columnNum(); //if the tables columns change dynamically since last time (datatables) we need to rebuild the sizer rows and get new count
            var flow = function(){
                var i;
                var $rowCells = opts.getSizingRow($table, $tableCells);

                if($rowCells.length == numCols && numCols > 0){
                    $newHeader.detach();
                    $table.prepend($header);
                    $table.css(layoutAuto);
                    $floatTable.css(layoutAuto);
                    for(i=0; i < numCols; i++){
                        var $rowCell = $rowCells.eq(i);
                        var rowWidth = $rowCell.outerWidth(true);
                        $headerCells.eq(i).outerWidth(rowWidth);
                        $tableCells.eq(i).outerWidth(rowWidth);
                    }
                    $floatTable.append($header); //append because colgroup must go first in chrome
                    $tbody.before($newHeader);
                    $table.css(layoutFixed);
                    $floatTable.css(layoutFixed);
                    setHeaderHeight();
                } else { 
                    $floatTable.append($header);
                    $table.css(layoutAuto);
                    $floatTable.css(layoutAuto);
                    setHeaderHeight();
                }
            };
            flow();
            return flow;
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
            var floatContainerHeight = $floatContainer.height();
            var tableOffset = $table.offset();
            var tableOriginalOffsetTop = null; //used to fix a bouncing bug in ie. only calculated for locked && ie
            if(locked){
                var containerOffset = $scrollContainer.offset();
                tableContainerGap = tableOffset.top - containerOffset.top + scrollingContainerTop;
            } else {
                floatEnd = tableOffset.top - scrollingTop - floatContainerHeight + scrollingBottom + scrollbarOffset.horizontal;
            }
            if($.browser.msie && locked){ //TODO does this still work?
                //fix top +/- 1px bug - it bounces around 
                $scrollContainer.scrollTop(0);
                tableOriginalOffsetTop = $table.offset().top;
                $scrollContainer.scrollTop(scrollingContainerTop);
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
                var top, left;

                if(locked){ //inner scrolling
                    tableOffset = $table.offset(); 
                    if (tableContainerGap > scrollingContainerTop) {
                        if($.browser.msie){ //todo: which versions of ie need this? 9 doesnt seem to
                            top = tableOriginalOffsetTop - windowTop - scrollingContainerTop;
                        } else {
                            top = tableOffset.top - windowTop;
                        }
                    } else {
                        top = tableOffset.top + scrollingContainerTop  - windowTop - tableContainerGap;
                        //headers stop at the top of the viewport
                    }
                    left = tableOffset.left + scrollContainerLeft - windowLeft;
                } else { //window scrolling
                    var tableHeight = $table.outerHeight();
                    if(windowTop > floatEnd + tableHeight){
                        top = tableHeight + scrollingTop - windowTop + floatEnd; 
                    } else if (tableOffset.top > windowTop + scrollingTop) {
                        top = tableOffset.top - windowTop;
                    } else {
                        top = scrollingTop;
                    }
                    left = tableOffset.left - windowLeft;
                }
                return {top: top, left: left};
            }
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
                var scrollLeft = $scrollContainer.scrollLeft();
                if(oldTop != pos.top || oldLeft != pos.left){
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
                if(oldScrollLeft != scrollLeft){
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
                scrollbarOffset.horizontal = $scrollContainer.width() < $table.width() ? scWidth : 0; 
                scrollbarOffset.vertical =  $scrollContainer.height() < $table.height() ? scWidth: 0;
            }
        }
        //finish up. create all calculation functions and bind them to events
        calculateScrollBarSize();
        
        var flow = reflow();
        var calculateFloatContainerPos = calculateFloatContainerPosFn();
        var repositionFloatContainer = repositionFloatContainerFn();
        
        repositionFloatContainer(calculateFloatContainerPos('init'), true); //this must come after reflow because reflow changes scrollLeft back to 0 when it rips out the thead
        
        var windowScrollEvent = function(){ 
            repositionFloatContainer(calculateFloatContainerPos('windowScroll'), false);
        };
        var containerScrollEvent = function(){ 
            repositionFloatContainer(calculateFloatContainerPos('containerScroll'), false);
        };
        
        var windowResizeEvent = function(){
            updateScrollingOffsets();
            calculateScrollBarSize();
            flow = reflow();
            calculateFloatContainerPos = calculateFloatContainerPosFn();
            repositionFloatContainer = repositionFloatContainerFn();
            repositionFloatContainer(calculateFloatContainerPos('resize'), true, true);
        };
        var reflowEvent = _.debounce(function(){
            calculateScrollBarSize();
            updateScrollingOffsets();
            flow = reflow();
            calculateFloatContainerPos = calculateFloatContainerPosFn();
            repositionFloatContainer(calculateFloatContainerPos('reflow'), true);
        }, 1);
        $window.bind('scroll.floatTHead', windowScrollEvent);
        $window.bind('load.floatTHead', reflowEvent); //for tables with images
        $scrollContainer.bind('scroll.floatTHead', containerScrollEvent);
        windowResize(opts.debounceResizeMs, windowResizeEvent);
        $table.bind('reflow', reflowEvent);
        if(isDatatable($table)){
            $table
                  .bind('filter', reflowEvent)
                  .bind('sort',   reflowEvent)
                  .bind('page',   reflowEvent);
        }
        
        //attach some useful functions to the table. 
        $table.data('floatThead-attached', {
            destroy: function(){
                $table.css(layoutAuto);
                $tableColGroup.remove();
                $newHeader.replaceWith($header);
                $table.unbind('reflow');
                reflowEvent = windowResizeEvent = containerScrollEvent = windowScrollEvent = function() {};
                $scrollContainer.unbind('scroll.floatTHead');
                $floatContainer.remove();
                $table.data('floatThead-attached', false);
                floatTheadCreated--;
                if(floatTheadCreated == 0){
                    $window.unbind('scroll.floatTHead');
                    $window.unbind('resize.floatTHead');
                    $window.unbind('load.floatTHead');
                }
            },
            reflow: function(){
                reflowEvent();
            },
            setHeaderHeight: function(){
                setHeaderHeight();
            }
        });
        floatTheadCreated++;
    });
    return this;
};
})(jQuery);
