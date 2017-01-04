var interval = null;
var workMode = true;
var tau = 2*Math.PI;
var secs = 0.0,
    mins = 0.0,
    minsElapsed = -1.0,
    work = 0.0,
    rest = 0.0;

function start() {
    var task = (String)(document.getElementById("input-task").value);
    var toggleChecked = document.getElementById("toggle-off").checked;
    workMode = toggleChecked;
    work = (document.getElementById("input-work").value)/1;
    rest = (document.getElementById("input-rest").value)/1;
    stop();
    if(workMode)
        mins = work;
    else
        mins = rest;
    createClock(task, work, rest);
}

function stop() {
    var svg = document.getElementById("polar-svg");
    var toggleChecked = document.getElementById("toggle-off").checked;
    // reset everything
    while(svg.lastChild) {
        svg.removeChild(svg.lastChild)
    }
    if(interval) {
        interval.stop();
    }
    secs = 0;
    mins = 0;
    minsElapsed = 0;
    workMode = toggleChecked;
}

function createClock(task, work, rest) {
    // setup the arcs for the clock
    var arc = d3.arc();
    var timeText = "00:00";
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
        .style("fill", "#eee")
        .attr("d", arcSeconds);
    // setup the main(foreground) arc, which will move and fill in the background
    var foregroundSeconds = gSeconds.append("path")
        .datum({endAngle: (60-secs)/(60)*(tau)})
        .style("fill", "#FF0043")
        .attr("d", arcSeconds); 
    // setup the background arc, which will be filled by the main arc
    var backgroundMinutes = gMinutes.append("path")
        .datum({endAngle: tau})
        .style("fill", "#eee")
        .attr("d", arcMinutes);
    // setup the main(foreground) arc, which will move and fill in the background
    var foregroundMinutes = gMinutes.append("path")
        .datum({endAngle: (minsElapsed)/(60)*(tau)})
        .style("fill", "#C00043")
        .attr("d", arcMinutes);
    // the current time as a text element
    var clockText = gMinutes.append("text")
        .text(timeText)
        .style("font-weight", "bold")
        .style("fill", "#eee")
        .attr("text-anchor", "middle")
        .attr("font-size", "48px")
        .attr("font-family", "helvetica");

    interval = d3.interval(function() {
        secs--;
        console.log(secs);
        if(secs < 0) {
            secs = 59;
            mins--;
            minsElapsed++;
        }
        timeText = getTimeText();
        clockText.text(timeText);
        foregroundSeconds.transition()
            .duration(500)
            .attrTween("d", arcTween((60-secs)/(60)*tau, arcSeconds));
        foregroundMinutes.transition()
            .duration(500)
            .attrTween("d", arcTween((minsElapsed)/(60)*tau, arcMinutes));
        if(workMode) {
            foregroundSeconds.style("fill", "#FF0043")
            foregroundMinutes.style("fill", "#C00043")
        }
        else {
            foregroundSeconds.style("fill", "#34F898")
            foregroundMinutes.style("fill", "#00E174")
        }
        if(workMode && mins === 0 && secs === 0) {
            mins = rest;
            secs = 0;
            minsElapsed = -1;
            workMode = false;
        }
        else if (!workMode && mins === 0 && secs === 0) {
            mins = work;
            secs = 0;
            minsElapsed = -1;
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

    function getTimeText() {
        var secsText = ""+secs;
        var minsText = ""+mins;
        if(secs < 10) {
            secsText = "0"+secsText;
        }
        if(mins < 10) {
            minsText = "0"+minsText;
        }
        return minsText+":"+secsText;
    }
}


