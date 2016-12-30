

var secs = 0,
    mins = 0;
var workMode = true;
var work = 0,
    rest = 0;
function start() {
    var task = (String)(document.getElementById("input-task").value);
    work = (document.getElementById("input-work").value)/1;
    rest = (document.getElementById("input-rest").value)/1;
    createClock(task, work, rest);
    console.log(work+rest);
    console.log("starting " + task + " " + work + "/" + rest);
}


function createClock(task, work, rest) {
    // dimensions of the clock
    var width = 1000,
        height = 1000,
        radius = 500,
        spacing = 0.1;
    
    // time formatting for d3
    secs = 0;
    mins = 0;
    workMode = true;
    setInterval(tick, 1000);
}

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
}

function updateClock(seconds, minutes) {

}



