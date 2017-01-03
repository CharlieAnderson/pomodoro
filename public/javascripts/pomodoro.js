var interval = null;
var workMode = true;
var tau = 2*Math.PI;
var secs = 0.0,
    mins = 0.0,
    work = 0.0,
    rest = 0.0;

function start() {
    var task = (String)(document.getElementById("input-task").value);
    work = (document.getElementById("input-work").value)/1;
    rest = (document.getElementById("input-rest").value)/1;
    var svg = document.getElementById("polar-svg");
    // reset everything
    while(svg.lastChild) {
        svg.removeChild(svg.lastChild)
    }
    if(interval) {
        interval.stop();
    }
    secs = 0;
    mins = 0;
    workMode = true;
    createClock(task, work, rest);
    console.log(work+rest);
    console.log("starting " + task + " " + work + "/" + rest);
}


function createClock(task, work, rest) {
    
    // setup the arcs for the clock
    var arc = d3.arc();
    var arcSeconds = d3.arc()
        .innerRadius(170)
        .outerRadius(220)
        .startAngle(0);
    var arcMinutes = d3.arc()
        .innerRadius(115)
        .outerRadius(165)
        .startAngle(0);
    // setup svg, g is set so that the origin is the center of the canvas
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        gSeconds = svg.append("g")
                .attr("transform", "translate("+width/2+","+height/2+")");
        gMinutes = svg.append("g")
                .attr("transform", "translate("+width/2+","+height/2+")");
    // setup the background arc, which will be filled by the main arc
    var backgroundSeconds = gSeconds.append("path")
        .datum({endAngle: tau})
        .style("fill", "#ccc")
        .attr("d", arcSeconds);
    // setup the main(foreground) arc, which will move and fill in the background
    var foregroundSeconds = gSeconds.append("path")
        .datum({endAngle: (secs)/(60)*(tau)})
        .style("fill", "#FF0043")
        .attr("d", arcSeconds); 
    // setup the background arc, which will be filled by the main arc
    var backgroundMinutes = gMinutes.append("path")
        .datum({endAngle: tau})
        .style("fill", "#ccc")
        .attr("d", arcMinutes);
    // setup the main(foreground) arc, which will move and fill in the background
    var foregroundMinutes = gMinutes.append("path")
        .datum({endAngle: (mins)/(60)*(tau)})
        .style("fill", "#C00043")
        .attr("d", arcMinutes);

    interval = d3.interval(function() {
        secs++;
        console.log(secs);
        foregroundSeconds.transition()
            .duration(500)
            .attrTween("d", arcTween((secs)/(60)*tau, arcSeconds));
        foregroundMinutes.transition()
            .duration(500)
            .attrTween("d", arcTween((mins)/(60)*tau, arcMinutes));

        if(secs == 60) {
            secs = 0;
            mins++;
        }

        if(workMode) {
            foregroundSeconds.style("fill", "#FF0043")
            foregroundMinutes.style("fill", "#C00043")
        }
        else {
            foregroundSeconds.style("fill", "#34F898")
            foregroundMinutes.style("fill", "#00E174")
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
    }, 1000);

    function arcTween(newAngle, arc) {
        return function(d) {
            var interpolate = d3.interpolate(d.endAngle, newAngle);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        };
    }
}


