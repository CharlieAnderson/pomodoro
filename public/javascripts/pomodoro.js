var interval = null;
var workMode = true;
var secs = 0,
    mins = 0,
    work = 0,
    rest = 0;

function start() {
    var task = (String)(document.getElementById("input-task").value);
    work = (document.getElementById("input-work").value)/1;
    rest = (document.getElementById("input-rest").value)/1;
    if(interval !== null) {
        clearInterval(interval);
    }
    createClock(task, work, rest);
    console.log(work+rest);
    console.log("starting " + task + " " + work + "/" + rest);
}


function createClock(task, work, rest) {
    // dimensions of the clock
    var width = 500,
        height = 500,
        radius = 250,
        spacing = 0.1;
    // time formate

    var formatSecond = d3.timeFormat("%-S seconds"),
        formatMinute = d3.timeFormat("%-M minutes"),
        formatHour = d3.timeFormat("%-H hours"),
        formatDay = d3.timeFormat("%A"),
        formatDate = function(d) { d = d.getDate(); switch (10 <= d && d <= 19 ? 10 : d % 10) { case 1: d += "st"; break; case 2: d += "nd"; break; case 3: d += "rd"; break; default: d += "th"; break; } return d; },
        formatMonth = d3.timeFormat("%B");
    // setup colors
    var color = d3.scaleLinear()
        .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
        .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });
    // setup svg
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+width/2+","+height/2+")");
    // arc body
    var arcBody = d3.arc()
        .startAngle(0)
        .endAngle(function(d) { return 2*d.value*Math.PI; })
        .innerRadius(function(d) { return d.index*radius; })
        .outerRadius(function(d) { return (d.index + spacing)*radius; });
    // arc center
    var arcCenter = d3.arc()
        .startAngle(0)
        .endAngle(function(d) { return 2*d.value*Math.PI; })
        .innerRadius(function(d) { return (d.index + spacing/2)*radius; })
        .outerRadius(function(d) { return (d.index + spacing/2)*radius; });
    // fields 
    var field = svg.selectAll("g")
        .data(fields())
        .enter()
        .append("g");
    field.append("path")
        .attr("class", "arc-body");
    field.append("path")
        .attr("id", function(d, i) { return "arc-center-"+i; })
        .attr("class", "arc-center");
    // time formatting for d3
    secs = 0;
    mins = 0;
    workMode = true;
    //interval = setInterval(function() {tick(fields);}, 1000);
    tick();
    d3.select(self.frameElement).style("height", height+"px");

    function tick() {
        secs++;
        if(secs == 60) {
            secs = 0;
            mins++;
        }
        if(workMode && mins === work) {
            mins = 0;
            secs = 0;
            workMode = false;
        }
        else if (!workMode && mins === rest) {
            mins = 0;
            secs = 0;
            workMode = true;
        }
        console.log(mins+":"+secs);
        console.log(field);
        field.each(function(d) { this.value = d.value; })
            .data(fields)
            .each(function(d) { d.previousValue = this.value; })
            .each(fieldTransition)
            .transition()
            .duration("500")
        setTimeout(tick, 1000 - Date.now() % 1000);
    }

    function fieldTransition() {
        var field = d3.select(this).transition();
        field.select(".arc-body")
            .attrTween("d", arcTween(arcBody))
            .style("fill", function(d) { return color(d.value); });
        field.select(".arc-center")
            .attrTween("d", arcTween(arcCenter));
    }

    function arcTween(arc) {
        return function(d) {
            var i = d3.interpolateNumber(d.previousValue, d.value);
            return function(t) {
                d.value = i(t);
                return arc(d);
            };
        };
    }

    function fields() {
        var now = new Date;
        return[
            {index: 0.7, value: now.getSeconds/(60)},
            {index: 0.6, value: now.getMinutes/(60)}
        ];
    }
}


function updateClock(seconds, minutes) {

}



