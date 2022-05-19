let points = [],
	canvas = document.getElementById("frosted-glass"),
	context = canvas.getContext("2d"),
	newAvailangles = [],
	radiusList = [
		0.3, 0.48, 0.6, 0.7, 0.78, 0.85, 0.9, 0.95, 1.0, 1.58, 2.0, 2.32, 2.58,
		2.81, 3.0, 3.17, 5.0, 8.0, 13.0, 21.0, 34.0, 55.0, 89.0, 144.0, 2.0, 6.0,
		24.0, 120.0,
	];
// Ran these in python to get the values for radiusList
// 8 values from log10, 8 from log2, 8 fibonacci numbers, and 4 factorial numbers.
// total = 28
// resultList = [log10(x) for x in range(2, 10)] + [log2(x) for x in range(2, 10)] +
// [fibonacci(x) for x in range(6, 16)] + [factorial(x) for x in range(2, 6)]
// print('combo list:', ["%.2f" % elem for elem in resultList])

function init() {
    console.log("Initializing...");
    // Fills list with numbers from 0 to 360. Saves me from typing it out.
	for (i = 0; i < 360; i++) {
		newAvailangles.push(i);
    }  
}
init();

function createSmash() {
    console.log("Smashing!");

	drawRadialCracks();     // Draw radial circular cracks that will match up with the long thin cracks
	drawStarCracks();       // Draw a lot long thin lines from center
    generateCrackleWeb();   // Draw bunch of really tiny shards near the center
    eraseBlob();            // A blob shape made of 3 random circles near the center is fully punched out  

}
function findDistance(point1, point2) {
    console.log("Finding distance...");
    return Math.sqrt(
        Math.pow(Math.abs(point1.x - point2.x), 2) +
        Math.pow(Math.abs(point1.y - point2.y), 2)
    );
}
function findAngle(point1, point2) {
    console.log("Finding angle...");
    return Math.atan2(
        Math.abs(point1.y - point2.y),
        Math.abs(point1.x - point2.x)
    );
}
// A blob is made of three semi-random arcs.
// We choose three points around the center,
// get the length of the line between them,
// get the two angles to the center,
// and draw the arcs with a minradius + a random amount.
function eraseBlob() {
    console.log("Erasing blob...");
    const blobPoints = [
        { x: clickX + Math.random() * 100 -50, y: clickY + Math.random() * 100 -50 },
        { x: clickX + Math.random() * 100 +50, y: clickY + Math.random() * 100     },
        { x: clickX + Math.random() * 100    , y: clickY + Math.random() * 100 +50 },
    ];
    const blobAngles = [];
    for (i = 0; i <= 2; i++) {
        blobAngles.push( findAngle( {clickX,clickY}, blobPoints[i]) );
    }
    
    const minRadius = [];
    minRadius.push(distance(points[0], points[1]) / 2);
    minRadius.push(distance(points[1], points[2]) / 2);
    minRadius.push(distance(points[2], points[0]) / 2);


    context.beginPath();
    for (i = 0; i < 3; i++) {
        context.arc(clickX, clickY, minRadius[i] + Math.random() *100, blobAngles[i] - Math.PI /2, blobAngles[i] + Math.PI /2, false);
    }
}

function makeLine(x, y, angle, length) {
    console.log("Making line...");
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
	context.strokeStyle = "#8ab2d8";
	context.stroke();
}
function makeArc(x, y, r) {
    console.log("Making arc...");
	angle = Math.random * Math.PI * 2;
	sides = ((180 - r) * Math.PI) / 180;
	context.beginPath();
	context.arc(x, y, r, angle - sides, angle + sides, false);
	context.strokeStyle = "#8ab2d8";
	context.stroke();
}
// For every radius a random angle draws a circle with 
// a missing piece proportional to the radius.
function drawRadialCracks() {
    console.log("Drawing radial cracks...");
	radiusList.forEach((r) => makeArc(clickX, clickY, r));
}
function drawStarCracks() {
    console.log("Drawing star cracks...");
    centerAvailangles = newAvailangles.cloneDeep();
    while (centerAvailangles.length > 0) {
        let angle = pickAngle(centerAvailangles);
        centerAvailangles.splice(centerAvailangles.indexOf(angle - 5), 10);
        makeLine(clickX, clickY, angle, (length = Math.random() * 180 + 180));
    }
}
function pickPoint() {
    console.log("Picking point...");
	return points[Math.floor(Math.random() * points.length)];
}
function pickAngle(availangles) {
    console.log("Picking angle...");
	return availangles[Math.floor(Math.random() * availangles.length)];
}

// Generate and draw 300 random branches of a spider web.
// Each point is node with 360 degrees of available angles,
// heretofore known as availangles.
//
// A random point is chosen, and a random angle is chosen from
// the availangles list. The angle and 5 to eitherside are removed
// from the availangles list.
//
// The line is drawn from the point1 to the point2 at that angle and length.
// The new point2 is added to the points list and its availangles list is
// is fresh minus the opposite angles to the point1 angle chosen.
function generateCrackleWeb() {
    console.log("Generating crackle web...");
    points.push({ x: clickX, y: clickY, availangles: newAvailangles });
    for (i = 0; i < 300; i++) {
        point = pickPoint();
        if (point.availangles.length > 0) {
            pickedAngle = pickAngle(point.availangles);
        } else {
            i--;
        } // try again, this point has no available angles
        point.availangles.splice(point.availangles.indexOf(angle - 5), 10);
        makeLine(
            point.x,
            point.y,
            pickedAngle,
            (length = Math.random() * 5 + 10)
        );

        // Add new point to points.
        // New points have the opposite angle of the previous point spliced out of their availangles.
        points.push({
            x: point.x + Math.cos((pickedAngle * Math.PI) / 180) * length,
            y: point.y + Math.sin((pickedAngle * Math.PI) / 180) * length,
            availangles: newAvailangles
                .cloneDeep()
                .splice(newAvailangles.indexOf(pickedAngle + 180) - 5, 10)
                .splice(newAvailangles.indexOf(pickedAngle - 180) - 5, 10),
        });
    }
}

canvas.addEventListener("onmousedown", (e) => {
    
    // get click x and y
    const clickX = e.target.clientX;
    const clickY = e.target.clientY;
    console.log(clickX, clickY);
    
    // shake screen randomly 5 times quickly from -20 to 20, then return to normal
    r = () => { return Math.floor(Math.random() * 40) - 20; }
    var tl = new TimelineMax({
        defaults: { duration: 0.04 },
        onComplete: () => {
            screen.style.transform = "translate(0px, 0px)";
        }
    }).to(screen, { x: r(), y: r() }).to(screen, { x: r(), y: r() }).to(screen, { x: r(), y: r() }).to(screen, { x: r(), y: r() }).to(screen, { x: r(), y: r() });
    
    // play sfx
    const sfx = new Audio("{{ url_for('static', filename='mp3/glassHit.mp3') }}");
    sfx.play();

    // generate glass shatter drawing
    createSmash();
});
