/**
 * jQuery.floatThead
 * Copyright (c) 2012 Mikhail Koryak - http://notetodogself.blogspot.com
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * Date: 9/21/12
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
 * @version 0.2 
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
    $window.resize(debouncedCb);
}
function uniformArrayReduction(arr, amount){
  var total = _.reduce(arr, function(x, y) { return x + y; }, 0);
  if(amount > total){
    return arr;
  }
  if(amount == total) {
	return _.map(arr, function(){ return 0; });
  }

  var removed = 0;
  var output = [];
  for(var index = 0; index < arr.length; index++){
    var i = arr[index];
    if(removed < amount){
      var toRemove = ~~(i / total * amount);
      output.push(i - toRemove);
      removed += toRemove;
    } else {
      output.push(i);
	}
  }
  while(removed < amount){
    for(var i = 0; i < output.length; i++){
      if(output[i] > 0){
        output[i] -= 1;
        removed += 1;
        if(removed == amount){
          break;
		}
      }
    }
  }	
  return output;
}

$.fn.floatThead = function(map){
    var opts = $.extend({},{
        cellTag: 'th',
        zIndex: 1001,
        debouceResizeMs: 50,
		scrollingTop: 0, //offset from top of window where the header should not pass above
        scrollingBottom: 0, //offset from the bottom of the table where the header should stop scrolling
        scrollContainer: function($table){
            return $([]); //if the table has horizontal scroll bars then this is the container that has overflow:auto and causes those scroll bars
        }
    }, map);
    var reflow = function($table, $floatContainer){
        var $rowCells = $table.find('thead tr.size-row td');
        var $sizerRow = $table.find('thead tr.size-row');
        var $sizer = $sizerRow.find('td').add($sizerRow);
        var $floatTable = $floatContainer.find("table.floatThead-table");
        var $header = $floatTable.find("thead");
        var $headerCells = $header.find(">tr>"+opts.cellTag);
        var tableWidth = $table.outerWidth(true);
        var floatTableWidth = $floatTable.outerWidth(true);
        var max = (tableWidth > floatTableWidth ? tableWidth : floatTableWidth); 
        $table.outerWidth(max);
        $floatTable.outerWidth(max);
        
        $table.css('table-layout', 'auto');
        $floatTable.css('table-layout', 'auto');
        var widths = [];
        for(var x = 0; x < $rowCells.length; x++){
            var $rowCell = $($rowCells.get(x));
            var $headerCell = $($headerCells.get(x));
            widths.push({
                header: {
                    pref: $headerCell.outerWidth(true)
                },
                row: {
                    pref: $rowCell.outerWidth(true)
                }
            })
        }
        $table.outerWidth(1);
        $floatTable.outerWidth(1);
        for(x = 0; x < $rowCells.length; x++){
            $rowCell = $($rowCells.get(x));
            $headerCell = $($headerCells.get(x));
            widths[x].header.min = $headerCell.outerWidth(true);
            widths[x].row.min = $rowCell.outerWidth(true);
        }
        $table.outerWidth(max);
        $floatTable.outerWidth(max);
        $table.css('table-layout', 'fixed');
        $floatTable.css('table-layout', 'fixed');
        var firstTime = true;
        var flow = function(){    
            for(x = 0; x < $rowCells.length; x++){
                $rowCell = $($rowCells.get(x));
                $headerCell = $($headerCells.get(x));
                var setBoth = function(val){
                    $headerCell.outerWidth(val);
                    $rowCell.outerWidth(val);
                };
                var width = widths[x];
                if(width.row.pref < width.header.pref){
                    width.calc = (width.row.pref < width.header.min) ? width.header.min : width.row.pref;
                } else {
                    width.calc = (width.header.pref < width.row.min) ? width.row.min : width.header.pref;
                }
                if(!firstTime){
                    var headerWidth = $headerCell.outerWidth(true);
                    var rowWidth = $rowCell.outerWidth(true);
                    if(headerWidth > rowWidth){
                        width.calc = headerWidth;
                    }
                }
            }
			var calcArray = _.pluck(widths, 'calc');
			var expectedWidth = _.reduce(calcArray, function(sum, val){
				return sum + val;
			}, 0);
			
			if(expectedWidth > max){ //TODO: we should only do this if its going to work
				calcArray = uniformArrayReduction(calcArray, expectedWidth - max);
			};
			for(x = 0; x < $rowCells.length; x++){
                $rowCell = $($rowCells.get(x));
                $headerCell = $($headerCells.get(x));
				$headerCell.outerWidth(calcArray[x]);
				$rowCell.outerWidth(calcArray[x]);
			}
            var newContainerWidth = $floatContainer.outerWidth(true);
            var newTableWidth = $table.outerWidth(true);
			var widthChange = newTableWidth - tableWidth;
            if(newTableWidth < newContainerWidth){
                $table.outerWidth(newContainerWidth);
                $floatTable.outerWidth(newContainerWidth);
            } 
            $sizer.outerHeight($header.outerHeight(true));
        };
        flow();
        firstTime = false;
        
        return flow;
    };

    var calculateFloatContainerPosFn = function($floatContainer, $tableHead, $window, $table, $scrollContainer, scrollbarOffset){
		var locked = $scrollContainer.length > 0; //i want to be able to later make this optional
        return function(){
            var theadOffset = $tableHead.offset();
            var floatContainerHeight = $floatContainer.height();
            var windowTop = $window.scrollTop();
			var floatEnd;
			if(locked){
				floatEnd = $scrollContainer.offset().top;
				floatEnd = floatEnd - (floatContainerHeight + opts.scrollingBottom + scrollbarOffset.horizontal);
			} else {
				if($scrollContainer.length){ //TODO: move out of this fn?
					floatEnd = $scrollContainer.outerHeight() + $scrollContainer.offset().top;
				} else {
					floatEnd = $table.outerHeight() + $table.offset().top;
				}
				floatEnd = floatEnd - (opts.scrollingTop + floatContainerHeight + opts.scrollingBottom + scrollbarOffset.horizontal);
			}
			
            

            var scrollingContainerTop = $scrollContainer.scrollTop();
          //  console.log('floatEnd', floatEnd);
         //   console.log('window top', windowTop);
		//	console.log('opts.scrollingTop', opts.scrollingTop);
          //  console.log('scrollingContainerTop top', scrollingContainerTop, $scrollContainer);
		//	console.log('> ', windowTop + opts.scrollingTop - scrollingContainerTop);
            var left = theadOffset.left + $scrollContainer.scrollLeft() - $window.scrollLeft();
            var top;
			if(windowTop > floatEnd ){
				top = opts.scrollingTop - (windowTop - floatEnd); 
			} else if (theadOffset.top > windowTop + opts.scrollingTop - scrollingContainerTop) {
                top = theadOffset.top + scrollingContainerTop - windowTop
            } else  {
                top = opts.scrollingTop;
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
                width: ($scrollContainer.width() || tableWidth) - scrollbarOffset.vertical,
            }); 
        }
    };
    
    return this.filter(':not(.floatThead-table)').each(function(){
		var scrollbarOffset = {vertical: 0, horizontal: 0};
        var calculateScrollBarSize = function(){ //this should happen after the floating table has been positioned
            var floatContainerScrollLeft = $floatContainer.scrollLeft();
            var scrollContainerScrollLeft = $scrollContainer.scrollLeft();
            $floatContainer.scrollLeft(100000);
            $scrollContainer.scrollLeft(100000);
            var newFloatContainerScrollLeft = $floatContainer.scrollLeft();
            var newScrollContainerScrollLeft = $scrollContainer.scrollLeft();
            if(newScrollContainerScrollLeft > newFloatContainerScrollLeft){ //we got a vertical scroll bar!
                scrollbarOffset.vertical = newScrollContainerScrollLeft - newFloatContainerScrollLeft;
                $floatContainer.css({
                    width: $floatContainer.width() - scrollbarOffset.vertical
                });
            }
            $floatContainer.scrollLeft(floatContainerScrollLeft);
            $scrollContainer.scrollLeft(scrollContainerScrollLeft);
            if($scrollContainer.width() < $table.width()){
                scrollbarOffset.horizontal = scrollbarOffset.vertical || 15; //hardcoded for now!
            }
        };
        
        var $table = $(this);
		if($table.data('floatThead-attached')){
			return true;
		}
		$table.data('floatThead-attached', true);
        var $scrollContainer = opts.scrollContainer($table);

        if(!$table.is('table')){
            throw new Error('jQuery.floatThead must be run on a table element. ex: $("table").floatThead();');
        }
		
		
		var $this = $table.find('thead');
        var numCols = $this.find(">tr>"+opts.cellTag).length;
        var $floatTable = $("<table></table>");
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
        }
        $newHead.append($sizingRow);
        
        $table.prepend($newHead);
        $floatTable.append($this);
        $floatContainer.append($floatTable);
        
        $floatTable.attr('class', $table.attr('class'));
        $floatTable.addClass('floatThead-table').css('margin', 0); //must have no margins or you wont be able to click on things under them
        $table.after($floatContainer);
        var calculateFloatContainerPos = calculateFloatContainerPosFn($floatContainer, $newHead, $window, $table, $scrollContainer, scrollbarOffset);
        var repositionFloatContainer = repositionFloatContainerFn($floatContainer, $table, $scrollContainer, scrollbarOffset);
        
		
		var flow = reflow($table, $floatContainer);
        
		
		repositionFloatContainer(calculateFloatContainerPos(false));
		calculateScrollBarSize();
        
        
        $window.bind('scroll.floatTHead', function() {
            var pos = calculateFloatContainerPos();
            $floatContainer.css({
				top: pos.top,
                left: pos.left
            });
			$floatContainer.scrollLeft($scrollContainer.scrollLeft());
        });

        $scrollContainer.scroll(function(){
            $floatContainer.scrollLeft($scrollContainer.scrollLeft());
        });
        
        
        windowResize(opts.debouceResizeMs, function(){
            repositionFloatContainer(calculateFloatContainerPos());
			calculateScrollBarSize();
            flow = reflow($table, $floatContainer);
        });
        if($.browser.chrome){
            $window.trigger('resize'); //fix weird bug!!
        }


        $table.bind('reflow', function(){
            repositionFloatContainer(calculateFloatContainerPos());
            flow();
        });
        
    });
};
})(jQuery);