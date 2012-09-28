/**
 * jQuery.floatThead
 * Copyright (c) 2012 Misha Koryak - https://github.com/mkoryak/floatThead
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Date: 9/28/12
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
 * Tested on FF13+, Chrome 21, IE8, IE9 (seems to work on IE7 but not officially supported)
 *
 * @author Mikhail Koryak
 * @version 0.4 
 */
(function( $ ) {
    
var $window = $(window);
var winWidth = $window.width();
var winHeight = $window.height();
function windowResize(debouceMs, cb){
    var debouncedCb = _.debounce(function(){
        if($.browser.msie && $.browser.version <= 8) { //ie is evil and will call this when ANY dom element is resized!!
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
    }, debouceMs);
    $window.bind('resize.floatTHead', debouncedCb);
}

function scrollbarWidth() {
    var scrollbarWidth = 0;                    
    if ($.browser.msie) {
        var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
        .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body'),
        $textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
        .css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');
        scrollbarWidth = $textarea1.width() - $textarea2.width() + 2; // + 2 for border offset
        $textarea1.add($textarea2).remove();
    } else {
        var $div = $('<div />')
        .css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
        .prependTo('body').append('<div />').find('div')
        .css({ width: '100%', height: 200 });
        scrollbarWidth = 100 - $div.width();
        $div.parent().remove();
    }
    return scrollbarWidth;
}

function getHeaderMap ( nThead ) //code borrowed from datatables :)
{
    var aLayout = [];
    var nTrs = $(nThead).children('tr');
    var nTr, nCell;
    var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
    var bUnique;
    var fnShiftCol = function ( a, i, j ) {
        var k = a[i];
                while ( k[j] ) {
            j++;
        }
        return j;
    };

    aLayout.splice( 0, aLayout.length );
    
    /* We know how many rows there are in the layout - so prep it */
    for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
    {
        aLayout.push( [] );
    }
    
    /* Calculate a layout array */
    for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
    {
        nTr = nTrs[i];
        iColumn = 0;
        
        /* For every cell in the row... */
        nCell = nTr.firstChild;
        while ( nCell ) {
            if ( nCell.nodeName.toUpperCase() == "TD" ||
                 nCell.nodeName.toUpperCase() == "TH" )
            {
                /* Get the col and rowspan attributes from the DOM and sanitise them */
                iColspan = nCell.getAttribute('colspan') * 1;
                iRowspan = nCell.getAttribute('rowspan') * 1;
                iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
                iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;

                /* There might be colspan cells already in this row, so shift our target 
                 * accordingly
                 */
                iColShifted = fnShiftCol( aLayout, i, iColumn );
                
                /* Cache calculation for unique columns */
                bUnique = iColspan === 1 ? true : false;
                
                /* If there is col / rowspan, copy the information into the layout grid */
                for ( l=0 ; l<iColspan ; l++ )
                {
                    for ( k=0 ; k<iRowspan ; k++ )
                    {
                        aLayout[i+k][iColShifted+l] = {
                            "cell": $(nCell),
                            "unique": bUnique
                        };
                        aLayout[i+k].nTr = nTr;
                    }
                }
            }
            nCell = nCell.nextSibling;
        }
    }
    return aLayout;
}
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
    if(map === 'destroy'){
        this.filter('table').each(function(){
            var obj = $(this).data('floatThead-attached');
            if(obj){
                obj.destroy();
            }
        });
        return this;
    }
    var opts = $.extend({},{
        cellTag: 'th',
        zIndex: 1001,
        debounceResizeMs: 50,
        scrollingTop: 0, //offset from top of window where the header should not pass above
        scrollingBottom: 0, //offset from the bottom of the table where the header should stop scrolling
        scrollContainer: function($table){
            return $([]); //if the table has horizontal scroll bars then this is the container that has overflow:auto and causes those scroll bars
        }
    }, map);
    var reflow = function($table, $floatContainer, headerMap){
        var $oldHead = $table.find('thead');
        var $rowCells = $table.find('tbody tr:first td');
        
        var rowCells = [];
        var headerCells = [];
        var numCols = headerMap[0].length;
        
        var $floatTable = $floatContainer.find("table.floatThead-table");
        var $header = $floatTable.find("thead");
        var $headerCells = $floatTable.find("col");

        
        for(var j=0; j < numCols; j++){
            rowCells.push({
                cell: $rowCells.eq(j),
                calc: 0
            });
            headerCells.push({
                cell: $headerCells.eq(j)
            });
        }

        var flow = function(){
            $oldHead.detach();
            $table.prepend($header);
        

            $table.css('table-layout', 'auto');
            $floatTable.css('table-layout', 'auto');

            for(var i=0; i < numCols; i++){
                var $rowCell = rowCells[i].cell;
                rowCells[i].calc = $rowCell.outerWidth(true);
            }
            if(numCols > 0){
                var bLeft = parseInt($table.css('border-left-width') || 0, 10);
                var bRight = parseInt($table.css('border-right-width') || 0, 10);
                rowCells[0].calc -= bLeft; //not sure this is right - need to test with more tables to understand whats happening
                rowCells[0].calc -= bRight;
                rowCells[numCols - 1].calc += bRight; 
            }

            $floatTable.append($header);
            $table.prepend($oldHead);
            var $sizerRow = $table.find('thead tr.size-row');
            var $sizerCells = $sizerRow.find('td');
            
            $table.css('table-layout', 'fixed');
            $floatTable.css('table-layout', 'fixed');

           
            for(var x = 0; x < numCols; x++){
                var $headerCell = headerCells[x].cell;
                $headerCell.outerWidth(rowCells[x].calc);
                $sizerCells.eq(x).outerWidth(rowCells[x].calc);
            }
            
            var headerHeight = $header.outerHeight(true);
            $sizerRow.outerHeight(headerHeight);
            $sizerCells.outerHeight(headerHeight);
        };
        flow();

        return flow;
    };

    var calculateFloatContainerPosFn = function($floatContainer, $tableHead, $window, $table, $scrollContainer, scrollbarOffset){
        var locked = $scrollContainer.length > 0; //i want to be able to later make this optional

        var newHeaderTop = 0;
        if(locked){
            var hTop = $table.offset().top;
            var sTop = $scrollContainer.offset().top - $scrollContainer.scrollTop();
            if(hTop != sTop){
                newHeaderTop = $tableHead.position().top;
            }
        }
        return function(){
            locked = scrollbarOffset.vertical > 0; //no scroll bars 
            var theadOffset = $table.offset();
            var floatContainerHeight = $floatContainer.height();
            var windowTop = $window.scrollTop();
            
            var scrollContainerHeight = $scrollContainer.outerHeight();
            var floatEnd;
            if(locked){
                var scrollContainerOffsetTop = $scrollContainer.offset().top;
                floatEnd = scrollContainerOffsetTop + scrollContainerHeight;
                floatEnd = floatEnd - (floatContainerHeight + opts.scrollingBottom + scrollbarOffset.horizontal - newHeaderTop);
            } else {
                if($scrollContainer.length){ //TODO: if i use this, it no longer accounts for newHeaderTop
                    var scrollContainerOffsetTop = $scrollContainer.offset().top;
                    floatEnd = scrollContainerHeight + scrollContainerOffsetTop;
                } else {
                    floatEnd = $table.outerHeight() + theadOffset.top;
                }
                floatEnd = floatEnd - (opts.scrollingTop + floatContainerHeight + opts.scrollingBottom + scrollbarOffset.horizontal);
            }

            var scrollingContainerTop = $scrollContainer.scrollTop();
            var left = theadOffset.left + $scrollContainer.scrollLeft() - $window.scrollLeft();
            var top;
            if(windowTop > floatEnd ){
                top = opts.scrollingTop - (windowTop - floatEnd); 
            } else if (theadOffset.top > windowTop + opts.scrollingTop - scrollingContainerTop) {
                top = theadOffset.top + scrollingContainerTop - windowTop
            } else if (locked){
                top = opts.scrollingTop - (windowTop - floatEnd) - scrollContainerHeight; 
            } else {
                top = opts.scrollingTop;
            }
            if(locked){
                if(scrollingContainerTop < newHeaderTop){
                    top -= scrollingContainerTop;
                } else  { 
                    top -= newHeaderTop;
                }
            }
            return {top: top, left: left};
        }
    };
    
    var repositionFloatContainerFn = function($floatContainer, $table, $scrollContainer, scrollbarOffset){
        return function(coords){ 
            var tableWidth = $table.width();          
            $floatContainer.css({
                top: coords.top,
                left: coords.left,
                width: ($scrollContainer.width() || tableWidth) - scrollbarOffset.vertical
            }); 
            $floatContainer.scrollLeft($scrollContainer.scrollLeft());
        }
    };
    
    this.filter(':not(.floatThead-table)').each(function(){
        var scrollbarOffset = {vertical: 0, horizontal: 0};
        var calculateScrollBarSize = function(){ //this should happen after the floating table has been positioned
            var scWidth = scrollbarWidth();
            if($scrollContainer.length){
                if($scrollContainer.width() < $table.width()){
                    scrollbarOffset.horizontal = scWidth; 
                }
                if($scrollContainer.height() < $table.height()){
                    scrollbarOffset.vertical = scWidth; 
                }
            }
        };
        
        var $table = $(this);
        if($table.data('floatThead-attached')){
            return true;
        }
        
        var $scrollContainer = opts.scrollContainer($table);

        if(!$table.is('table')){
            throw new Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');
        }
        
        
        var $this = $table.find('thead:first');

        var headerMap = getHeaderMap($this);
        var numCols = headerMap[0].length;
        var $floatTable = $("<table></table>");
        var $floatColGroup = $("<colgroup></colgroup>");
        var $window = $(window);
        var $floatContainer = $('<div style="overflow: hidden;"></div>');
        $floatContainer.css({
                position: 'fixed',
                marginTop: 0,
                zIndex: opts.zIndex
        });
        
        var $newHead = $("<thead></thead>");
        var $sizingRow = $('<tr class="size-row"></tr>');
        for(var x = 0; x < numCols; x++){
            $sizingRow.append('<td><div class="size-row-container"></div></td>');
            $floatColGroup.append('<col></col>');
        }
        $newHead.append($sizingRow);
        
        $table.prepend($newHead);
        $floatTable.append($floatColGroup);
        $floatTable.append($this);
        $floatContainer.append($floatTable);
        
        $floatTable.attr('class', $table.attr('class'));
        $floatTable.addClass('floatThead-table').css('margin', 0); //must have no margins or you wont be able to click on things under them
        $table.after($floatContainer);

        calculateScrollBarSize();
        var calculateFloatContainerPos = calculateFloatContainerPosFn($floatContainer, $newHead, $window, $table, $scrollContainer, scrollbarOffset);
        var repositionFloatContainer = repositionFloatContainerFn($floatContainer, $table, $scrollContainer, scrollbarOffset);
        
        repositionFloatContainer(calculateFloatContainerPos());
        var flow = reflow($table, $floatContainer, headerMap);
        
        
        
        
        var scrollEvent = function(){
            var pos = calculateFloatContainerPos();
            $floatContainer.css({
                top: pos.top,
                left: pos.left
            });
            $floatContainer.scrollLeft($scrollContainer.scrollLeft());
        };
        var windowResizeEvent = function(){
            calculateScrollBarSize();
            flow = reflow($table, $floatContainer, headerMap);
            repositionFloatContainer(calculateFloatContainerPos());
        };
        var reflowEvent = function(){
            repositionFloatContainer(calculateFloatContainerPos());
            flow();
        };
        $window.bind('scroll.floatTHead', scrollEvent);
        $scrollContainer.bind('scroll.floatTHead', scrollEvent);
        windowResize(opts.debouceResizeMs, windowResizeEvent);
        $table.bind('reflow', reflowEvent);
        if(isDatatable($table)){
            $table.bind('sort',   reflowEvent)
                  .bind('filter', reflowEvent)
                  .bind('page',   reflowEvent);
        }
        $table.data('floatThead-attached', {
            destroy: function(){
                $table.css('table-layout', 'auto');
                $newHead.replaceWith($this);
                $table.unbind('reflow');
                reflowEvent = windowResizeEvent = scrollEvent = function() {};
                $scrollContainer.unbind('scroll.floatTHead');
                $floatContainer.remove();
                $table.data('floatThead-attached', false);
            }
        });
    });
    return this;
};
})(jQuery);
