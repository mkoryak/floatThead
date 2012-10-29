/**
 * jQuery.floatThead
 * Copyright (c) 2012 Misha Koryak - https://github.com/mkoryak/floatThead
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Date: 10/23/12
 *
 * @projectDescription lock a table header in place while scrolling - without breaking styles or events bound to the header
 *
 * Dependancies:
 * jquery 1.7.0 + [required]
 * underscore.js 1.3.0 + [required]
 *
 * http://notetodogself.blogspot.com
 * http://programmingdrunk.com/floatThead/
 *
 * Tested on FF13+, Chrome 21, IE9, IE8, IE7 (but tables with colspans are not supported in ie7)
 *
 * @author Misha Koryak
 * @version 0.7.2
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
        mixedModeScrolling: false, //calculate on the go if page scrolling or container scrolling should be used. if container has no vertical scroll bars, use page scrolling
        zIndex: 1001, //zindex of the floating thead (actually a container div)
        debounceResizeMs: 1,
        scrollingTop: 0, //String or function($table) - offset from top of window where the header should not pass above
        scrollingBottom: 0, //String or function($table) - offset from the bottom of the table where the header should stop scrolling
        scrollContainer: function($table){
            return $([]); //if the table has horizontal scroll bars then this is the container that has overflow:auto and causes those scroll bars
        }
    }            
};
  
var $window = $(window);
var winWidth = $window.width();
var winHeight = $window.height();
var floatTheadCreated = 0;
/**
 * debounce and fix window resize event for ie7. ie7 is evil and will fire window resize event when ANY dom element is resized.
 * @param debounceMs
 * @param cb
 */
function windowResize(debounceMs, cb){
    var debouncedCb = _.debounce(function(){
        if($.browser.msie && parseFloat($.browser.version) <= 8.0) { 
            var winWidthNew = $window.width();
            var winHeightNew = $window.height();
            if(winWidth != winWidthNew || winHeight != winHeightNew){
                winWidth = $window.width();
                winHeight = $window.height();
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
    if ($.browser.msie && parseFloat($.browser.version) == 7.0 ) {
        scrollbarWidth = 15; //hack until i can find a workaround
    } else {
        var $div = $('<div/>')
        .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
        .prependTo('body').append('<div/>').find('div')
        .css({ width: '100%', height: 200 });
        scrollbarWidth = 100 - $div.width();
        $div.parent().remove();
    }
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
    this.filter(':not(.floatThead-table)').each(function(){
        var $table = $(this);
        if($table.data('floatThead-attached')){
            return true; //continue the each loop 
        }
        if(!$table.is('table')){
            throw new Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');
        }
        var scrollingTop, scrollingBottom;
        var scrollbarOffset = {vertical: 0, horizontal: 0};
        var scWidth = scrollbarWidth();
        
        var lastColumnCount = 0; //used by columnNum()
        var $scrollContainer = opts.scrollContainer($table);
        var $header = $table.find('thead:first');

        var locked = $scrollContainer.length > 0; 
        
        var $floatTable = $("<table/>");
        var $floatColGroup = $("<colgroup/>");
        var $floatContainer = $('<div style="overflow: hidden;"></div>');
        var $newHead = $("<thead/>");
        var $sizerRow = $('<tr class="size-row"></tr>');
        var $sizerCells = $([]);
        var $headerCells = $([]);

        $newHead.append($sizerRow);
        $table.prepend($newHead);
        $floatTable.append($floatColGroup);
        $floatContainer.append($floatTable);
        $floatTable.attr('class', $table.attr('class'));
        $floatTable.addClass('floatThead-table').css('margin', 0); //must have no margins or you wont be able to click on things under floating table
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
                $sizerRow.html(cells.join(''));
                $floatColGroup.html(cols.join(''));
                $sizerCells = $sizerRow.find('>td');
                if($.browser.msie && parseFloat($.browser.version) == 7.0){
                    $headerCells = $headerColumns; //on ie7 we will not support colspans as a result of this
                } else {
                    $headerCells = $floatColGroup.find("col");
                }
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
                var $rowCells = $table.find('tbody tr:first>td');

                if($rowCells.length == numCols && numCols > 0){
                    $table.prepend($header);
                    $table.css(layoutAuto);
                    $floatTable.css(layoutAuto);
                    for(i=0; i < numCols; i++){
                        var $rowCell = $rowCells.eq(i);
                        var rowWidth = $rowCell.outerWidth(true);
                        //TODO: check this logic more
                        if(i == 0 && $.browser.mozilla && ($rowCell.css('border-left-width') || $rowCell.css('border-right-width'))){
                            rowWidth--;
                        }
                        $headerCells.eq(i).outerWidth(rowWidth);
                        $sizerCells.eq(i).outerWidth(rowWidth);
                    }
                    setHeaderHeight();
                    $floatTable.append($header); //append because colgroup must go first in chrome
                    $table.css(layoutFixed);
                    $floatTable.css(layoutFixed);
                } else {
                    setHeaderHeight();
                    $floatTable.append($header);
                    $table.css(layoutAuto);
                    $floatTable.css(layoutAuto);
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
            var locked = $scrollContainer.length > 0; //i want to be able to later make this optional
            var scrollingContainerTop = $scrollContainer.scrollTop();
            
            //this floatEnd calc was moved out of the returned function because we assume the table height doesnt change (otherwise we must reinit by calling calculateFloatContainerPosFn)
            var floatEnd;
            var tableContainerGap = 0;
            var floatContainerHeight = $floatContainer.height();
            var tableOffset = $table.offset();
            var tableOriginalOffsetTop = null; //used to fix a bouncing bug in ie. only calculated for locked && ie
            if(locked){
                var containerOffset = $scrollContainer.offset();
                tableContainerGap = (tableOffset.top - containerOffset.top) + scrollingContainerTop;
            } else {
                floatEnd = tableOffset.top - (scrollingTop + floatContainerHeight + scrollingBottom + scrollbarOffset.horizontal);
            }
            if($.browser.msie && locked){
                //fix top +/- 1px bug - it bounces around 
                $scrollContainer.scrollTop(0);
                tableOriginalOffsetTop = $table.offset().top;
                $scrollContainer.scrollTop(scrollingContainerTop);
            }
            return function(){
                var top, left;
                var windowTop = $window.scrollTop();
                scrollingContainerTop = $scrollContainer.scrollTop();
                if(opts.mixedModeScrolling){
                    locked = scrollbarOffset.vertical > 0; //no scroll bars 
                }
                if(locked){ //inner scrolling
                    tableOffset = $table.offset(); 
                    if (tableContainerGap > scrollingContainerTop) {
                        if($.browser.msie){ 
                            top = tableOriginalOffsetTop - windowTop - scrollingContainerTop;
                        } else {
                            top = tableOffset.top - windowTop;
                        }
                    } else {
                        top = tableOffset.top + scrollingContainerTop  - windowTop - tableContainerGap;
                        //headers stop at the top of the viewport
                    }
                    left = tableOffset.left + $scrollContainer.scrollLeft() - $window.scrollLeft();
                } else { //window scrolling
                    var tableHeight = $table.outerHeight();
                    if(windowTop > floatEnd + tableHeight){
                        top = tableHeight + scrollingTop - (windowTop - floatEnd); 
                    } else if (tableOffset.top > windowTop + scrollingTop - scrollingContainerTop) {
                        top = tableOffset.top + scrollingContainerTop - windowTop
                    } else {
                        top = scrollingTop;
                    }
                    left = tableOffset.left - $window.scrollLeft();
                }
                
            //  console.log(tableOffset.left , $scrollContainer.scrollLeft() , $window.scrollLeft());
                return {top: top, left: left};
            }
        }
        
        function setFloatWidth(){
            var width;
            if(false && $scrollContainer.length){ //TODO: this doesnt work on datatables exaample 2
                var tableWidth = $table.outerWidth();
                var containerWidth = $scrollContainer.width();
                width = tableWidth < containerWidth ? tableWidth : containerWidth;
            } else {
                width = $scrollContainer.width() || $table.outerWidth();
            }
            $floatContainer.width(width - scrollbarOffset.vertical);
            $floatTable.outerWidth($table.outerWidth());
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
        var calculateFloatContainerPos = calculateFloatContainerPosFn();
        var repositionFloatContainer = repositionFloatContainerFn();
        
        var flow = reflow();
        repositionFloatContainer(calculateFloatContainerPos(), true); //this must come after reflow because reflow changes scrollLeft back to 0 when it rips out the thead
        
        var scrollEvent = function(){ 
            repositionFloatContainer(calculateFloatContainerPos(), false);
        };
        var windowResizeEvent = function(){
            updateScrollingOffsets();
            calculateScrollBarSize();
            flow = reflow();
            calculateFloatContainerPos = calculateFloatContainerPosFn();
            repositionFloatContainer = repositionFloatContainerFn();
            repositionFloatContainer(calculateFloatContainerPos(), true, true);
        };
        var reflowEvent = _.debounce(function(){
            calculateScrollBarSize();
            updateScrollingOffsets();
            calculateFloatContainerPos = calculateFloatContainerPosFn();
            repositionFloatContainer(calculateFloatContainerPos(), true);
            flow = reflow();
        }, 1);
        $window.bind('scroll.floatTHead', scrollEvent);
        $scrollContainer.bind('scroll.floatTHead', scrollEvent);
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
                $table.css('table-layout', 'auto');
                $newHead.replaceWith($header);
                $table.unbind('reflow');
                reflowEvent = windowResizeEvent = scrollEvent = function() {};
                $scrollContainer.unbind('scroll.floatTHead');
                $floatContainer.remove();
                $table.data('floatThead-attached', false);
                floatTheadCreated--;
                if(floatTheadCreated == 0){
                    $window.unbind('scroll.floatTHead');
                    $window.unbind('resize.floatTHead');
                }
            },
            reflow: function(){
                $table.trigger('reflow');
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
