function　overColor(classname,func,color){
    var color=color||"#ccc";
    var func=func||{
        over:function(){},
        out:function(){}
    };
    var rcolor=$(classname).css("background");
    $(classname).mouseover(function(event) {
    	$(this).css({
    		background: color,
    	});
        func.over($(this));
    }).mouseout(function(event) {
    	$(this).css({
    		background: rcolor,
    	});
        func.out($(this));
    });;
}
function Click(classname,clickevent){
	$(classname).click(function(event){
		clickevent(event)
	});
}
function basic_pie(container) {
  var
    d1 = [[0, 4]],
    d2 = [[0, 3]],
    d3 = [[0, 1.03]],
    d4 = [[0, 3.5]],
    graph;
  
  graph = Flotr.draw(container, [
    { data : d1, label : 'Comedy' },
    { data : d2, label : 'Action' },
    { data : d3, label : 'Romance',
      pie : {
        explode : 50
      }
    },
    { data : d4, label : 'Drama' }
  ], {
    HtmlText : false,
    grid : {
      verticalLines : false,
      horizontalLines : false
    },
    xaxis : { showLabels : false },
    yaxis : { showLabels : false },
    pie : {
      show : true, 
      explode : 6
    },
    mouse : { track : true },
    legend : {
      position : 'se',
      backgroundColor : '#D2E8FF'
    }
  });
}