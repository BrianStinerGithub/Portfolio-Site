const canvas = document.getElementById("frosted-glass"),
	context = canvas.getContext("2d"),
    newAvailangles = [],
	radiusList = [
		// radiusList = [log10(x) for x in range(2, 10)] +
		//              [log2(x) for x in range(2, 10)] +
		//              [fibonacci(x) for x in range(6, 16)] +
		//              [factorial(x) for x in range(2, 6)]
        //
        // Subpixel radiuses might be contributing to slowdowns.
		0.3, 0.48, 0.6, 0.7, 0.78, 0.85, 0.9, 0.95, 1.0, 1.58, 2.0, 2.32, 2.58,
		2.81, 3.0, 3.17, 5.0, 8.0, 13.0, 21.0, 34.0, 55.0, 89.0, 144.0, 2.0, 6.0,
		24.0, 120.0,
	],
    sfx = new Audio("../../static/mp3/glassHit.mp3");
    timesSmashed = 0;
    context.lineWidth = 1;
	context.strokeStyle = "black";
console.log("Initializing...");
// Fills list with numbers from 0 to 360. Saves me from typing it out.
for (i = 0; i < 360; i++) {
    newAvailangles.push(i);
}
shatterGlass = () => {
    console.log("Shattering glass...");
    canvas.style.display = "none";
}


// ? This is the star of the show.
//   The next four functions are labeled in order of complexity.
function createSmash(X, Y) {
    console.log("Smashing!", X, Y);

	//drawRadialCracks(X, Y);         // Draw radial circular cracks that will match up with the long thin cracks
	drawStarCracks(X, Y);           // Draw a lot long thin lines from center
    //generateCrackleWeb(X, Y);       // Draw bunch of really tiny shards near the center
    // eraseBlob(X, Y);               // A blob shape made of 3 random circles near the center is fully punched out  
    timesSmashed++;
    console.log("timesSmashed:", timesSmashed);
    if(timesSmashed >= 10) {
        shatterGlass();
    }
}



// *    1    *
// For every radius a random angle draws a circle with 
// a missing piece proportional to the radius.
function drawRadialCracks(clickX, clickY) {
    radiusList.forEach(
        (r) => makeArc( clickX, clickY, r, (360 -r*2) )
    );
}

// *    2    *
// Lines from center out to the edge of the circle.
// Completely exhausts the availangles list for the center point.
function drawStarCracks(clickX, clickY) {
    
    console.log("Drawing star cracks...");
    
    const centerAvailangles = structuredClone(newAvailangles);
    while (centerAvailangles.length > 0) {

        console.log("availangles:", centerAvailangles);
        
        let angle = pickFrom(centerAvailangles);
        
        console.log("angle:", angle);

        removeChunkFromAvailangles(centerAvailangles, angle);

        makeLine(clickX, clickY, angle, (Math.random() * 180 + 180));

    }
}

// *    3    *
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
function generateCrackleWeb(clickX, clickY) {
    console.log("Generating crackle web...");
    
    const points = [];
    points.push( { x: clickX, y: clickY, availangles: structuredClone(newAvailangles) } );
    
    for (i = 0; i < 300; i++) {
        point = pickFrom(points);
        
        if (point.availangles.length == 0) { i--; continue; } // If no availangles at point, reset and try again.
        pickedAngle = pickFrom(point.availangles);
        removeChunkFromAvailangles(point.availangles, pickedAngle);
        

        makeLine(point.x, point.y, pickedAngle, 5); // (Math.random() * 5 + 10) ? random length
        const { newX, newY } = calcX2Y2(x, y, angle, length);
        // Add new point to points.
        // New points have the opposite angle of the previous point spliced out of their availangles.
        newPoint = { x: newX, y: newY, availangles: structuredClone(point.availangles) };
        removeChunkFromAvailangles(newPoint.availangles, (pickedAngle + 180) % 360);
        points.push(newPoint);
    }
}


// *    4    *
// A blob is made of three semi-random arcs.
// We choose three points around the center,
// get the length of the line between them,
// get the two angles to the center,
// and draw the arcs with a minradius + a random amount.
//
// Use .arc to create a circular stroke and then use .clip() to make that the current clipping region.
// Then you can use .clearRect() to erase the whole canvas, but only the clipped area will change.
// context.clearRect(0, 0, canvas.width, canvas.height);
function eraseBlob(clickX, clickY) {
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
    minRadius.push( findDistance( blobPoints[0], blobPoints[1]) /2 );
    minRadius.push( findDistance( blobPoints[1], blobPoints[2]) /2 );
    minRadius.push( findDistance( blobPoints[2], blobPoints[0]) /2 );


    context.beginPath();
    for (i = 0; i < 3; i++) {
        context.arc(clickX, clickY, minRadius[i] + Math.random() *100, blobAngles[i] - Math.PI /2, blobAngles[i] + Math.PI /2, false);
    }
}

// Pick from a list.
function pickFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// Splice 10 to either side of angle if still there.
removeChunkFromAvailangles = (availangles, angle) => {
	for (i = -10; i <= 10; i++) {
		availangles.splice(availangles.indexOf(angle + i), 1);
	}
};

// Geometry functions for finding angles, points, and distances.
calcX2Y2 = (x, y, angle, length) => {
    return {
        x2: x + Math.cos(angle * Math.PI / 180) * length,
        y2: y + Math.sin(angle * Math.PI / 180) * length
    };
}
function findDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(Math.abs(point1.x - point2.x), 2) +
        Math.pow(Math.abs(point1.y - point2.y), 2)
    );
}
function findAngle(point1, point2) {
    return Math.atan2(
        Math.abs(point1.y - point2.y),
        Math.abs(point1.x - point2.x)
    );
}

// Drawing functions for making lines and arcs.
makeLine = (x, y, angle, length) => {
	const { x2, y2 } = calcX2Y2(x, y, angle, length);
    
    console.log("Drawing line from", x, y, "to", x2, y2);
    
    context.moveTo(x, y);
    context.beginPath();
	context.lineTo( x2, y2 );
    context.stroke();
    
}
function makeArc(x, y, radius, length) {
	
    angle = Math.random * Math.PI * 2;
    console.log(angle);
    sides = Math.round(length / 2) * Math.PI / 180;
    console.log(sides);
	context.arc(x, y, radius, angle - sides, angle + sides, false);
    context.stroke();
    
}

// Mouse click event triggers a sfx, screen shake, and createSmash()
canvas.onmousedown = (e) => {
	console.log("Mouse down...");
	
    // play sfx
    sfx.volume = 0.1;
    sfx.play();
    
	// shake screen randomly 5 times quickly from -20 to 20, then return to normal
	r = () => {
		return Math.floor(Math.random() * 40) - 20;
	};
	const tl = new TimelineMax({
		defaults: { duration: 0.04 },
		onComplete: () => {
			canvas.style.transform = "translate(0px, 0px)";
		},
	})  .to(canvas, { x: r(), y: r() })
        .to(canvas, { x: r(), y: r() })
        .to(canvas, { x: r(), y: r() })
        .to(canvas, { x: r(), y: r() })
        .to(canvas, { x: r(), y: r() });
    tl.play();

	// get click x and y
	const clickX = e.clientX;
	const clickY = e.clientY;
	console.log(clickX, clickY);

	// generate glass shatter drawing
	createSmash(clickX, clickY);
}

