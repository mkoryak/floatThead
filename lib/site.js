
function pageTop(){
  return $("#navs").height();
}

$(function(){

  $("#under-nav").css("top", pageTop());
  if(window.isBS2){
	  $("body").css("paddingTop", pageTop());
  }

	var $tables = $('.load-table');
	if($tables.length){
		$.get('/floatThead/bigtable.htm', function(d){
			var $table = $(d);
			$tables.each(function(){
				var $this = $(this);
				var id = $this.attr('id');
				var clazz = $this.attr('class');
				var $clone = $table.clone();
				$this.replaceWith($clone);
				$clone.attr('id', id);
				$clone.attr('class', clazz);
				$clone.removeClass('load-table');
			})
			$(document).trigger('tables-loaded');
		});
	}
});



var alignmentDebugger = function($table){

  function getOffsetWidth(el) {
    var sty = window.getComputedStyle(el);
    var ret = sty && sty.getPropertyValue('width') || '';
    if (ret && ret.indexOf('.') > -1) {
      ret = parseFloat(ret)
        + parseInt(sty.getPropertyValue('padding-left'))
        + parseInt(sty.getPropertyValue('padding-right'))
        + parseInt(sty.getPropertyValue('border-left-width'))
        + parseInt(sty.getPropertyValue('border-right-width'));
    } else {
      ret = el.offsetWidth;
    }
    return ret;
  }


    var $cont = $("<div></div>", {
        css: {
            position: 'fixed',
            right: '100px',
            top: '200px',
            border: '1px solid red',
            padding: '10px',
            backgroundColor: "#FFF",
            opacity: 0.2
        }
    });
    $('body').append($cont);
    var $button = $('<a href="#" class="btn btn-info">Recalc</a>');
    $cont.append($button); 
    var $tpl = $("<div></div>");
    $cont.append($tpl);
    var $floatContainer = $table.floatThead('getFloatContainer');
    var $floatTable = $floatContainer.find('table');
    $cont.on('mouseover', function(){
      $cont.css('opacity', 1);
    }).on('mouseout', function(){
      $cont.css('opacity', 0.2);
    });

    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g,
        evaluate: /\{\%(.+?)\%\}/g
    };
    var tpl = _.template('table width: {{tableWidth}}<br/>'+
                         'float table width: {{floatTableWidth}}<br/>'+
                         'table cols: {{tableCols}}<br/>'+
                         'float cols: {{floatCols}}</br>'+
                         'float top: {{top}}</br>'+
                         'float left: {{left}}</br>'+
                         'float position: {{pos}}</br>'+
                         'float height: {{height}}</br>'

    );

    
    var recalc = function(){
        var $tableCols = $table.find('col');
        var $floatCols = $floatTable.find('col');
        var tableColsWidths = _.map($tableCols, function(col){
            return getOffsetWidth(col)
        });
        var floatColsWidths = _.map($floatCols, function(col){
            return getOffsetWidth(col)
        });
        var tableWidth = getOffsetWidth($table[0])
        var floatTableWidth = getOffsetWidth($floatTable[0])
        var floatContainerTop = $floatContainer.css("top");
        var floatContainerLeft = $floatContainer.css("left");
        $tpl.html(tpl({
            tableWidth: tableWidth,
            floatTableWidth: floatTableWidth,
            tableCols: tableColsWidths.join(', '),
            floatCols: floatColsWidths.join(', '),
            top: floatContainerTop,
            left: floatContainerLeft,
            pos: $floatContainer.css("position"),
            height: $floatContainer.outerHeight()
        }));
        return false;
    }
    recalc();
    $button.on('click', recalc);
}
var ieVersion = function(){for(var a=3,b=document.createElement("b"),c=b.all||[];b.innerHTML="<!--[if gt IE "+ ++a+"]><i><![endif]-->",c[0];);return 4<a?a:document.documentMode}();

if(ieVersion <= 7.0){
	alert('jQuery.floatThead does not support IE7 or worse. Running this plugin in those browsers will have no effect.');
}