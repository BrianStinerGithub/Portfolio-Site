import {
    makeArc, makeLine,
    calcX2Y2, findAngle, findDistance,
    removeChunkFromAvailangles, pickFrom, range,
    canvas, context, newAvailangles, timesSmashed,
    init, initEdges, clickSFX, setCookie,
} from "./glassSmashHelper.mjs";

context.lineWidth = 1;
context.strokeStyle = "black";

init();

function edgeCracks() {
    const pointsPerEdge = 20;
    if (edgePoints.length == 0) {
        var edgePoints = initEdges(pointsPerEdge);
        return;
    }

    for(let i = 0; i < pointsPerEdge*4; i++) {
        const { X, Y, availangles } = pickFrom(edgePoints);
        const angle = pickFrom(availangles);
        const { X2, Y2 } = calcX2Y2(X, Y, angle, pickFrom(range(30, 40)));
        makeLine(X, Y, X2, Y2);
        const newEdgePoint = { X, Y, availangles: structuredClone(availangles) };
        removeChunkFromAvailangles(availangles, angle);
        edgePoints.push(newEdgePoint);
    }
}

function shatterGlass() {
    console.log("Shattering glass...");

    // enable scroll, show page, and remove the glass
    document.body.style.overflowY = "visible";
    document.getElementById("page").style.display = "flex";
    canvas.style.display = "none";

    // display the 50 glass shards
    document.getElementsByClassName("glass-shard").
        forEach(shard => {
            shard.style.display = "block";
        });

    // set cookie to prevent annoying repeated glass smashing
    setCookie("glassBroken=true");
}

// ? This is the star of the show.
// ? The next four functions are labeled in order of complexity and the order in which they are called.
function createSmash(X, Y) {
    console.log("Smashing!", X, Y);

    drawRadialCracks(X, Y);         // Draw radial circular cracks that will match up with the long thin cracks
    drawStarCracks(X, Y);           // Draw a lot long thin lines from center
    generateCrackleWeb(X, Y);       // Draw bunch of really tiny shards near the center
    // eraseBlob(X, Y);               // A blob shape made of 3 random circles near the center is fully punched out  

    timesSmashed++;
    console.log("timesSmashed:", timesSmashed);

    if (timesSmashed >= 5) { setTimeout(() => edgeCracks(), 500); }
    if (timesSmashed >= 10) { shatterGlass(); }

}



// *    1    *
// For every radius a random angle draws a circle with 
// a missing piece proportional to the radius.
function drawRadialCracks(clickX, clickY) {
    console.log("Drawing radial cracks...");
    const radiusList = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 35, 50, 90, 110];
    radiusList.forEach(
        (r) => makeArc( clickX, clickY, r, (360 - r * 3) )
    );
}

// *    2    *
// Lines from center out to the edge of the circle.
// Completely exhausts the availangles list for the center point.
function drawStarCracks(clickX, clickY) {
    console.log("Drawing star cracks...");

    const centerAvailangles = range(0, 360);
    let angle, X2, Y2;
    while (centerAvailangles.length > 1) {
    
        angle = pickFrom(centerAvailangles);
        centerAvailangles = removeChunkFromAvailangles(centerAvailangles, angle, 10);

        ( X2, Y2 ) = calcX2Y2(clickX, clickY, angle, Math.floor(Math.random() * 60) + 100);
        makeLine(clickX, clickY, X2, Y2);

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

    const points = []

    firstPoint = { X: clickX, Y: clickY, availangles: structuredClone(newAvailangles) };
    while (firstPoint.availangles.length > 1) {
        const angle = pickFrom(firstPoint.availangles);
        const { X2, Y2 } = calcX2Y2(firstPoint.X, firstPoint.Y, angle, 25);
        makeLine(firstPoint.X, firstPoint.Y, X2, Y2);

        const newPoint = { X: X2, Y: Y2, availangles: structuredClone(newAvailangles) };
        removeChunkFromAvailangles(firstPoint.availangles, angle);
        removeChunkFromAvailangles(newPoint.availangles, (angle + 180) % 360);
        points.push(newPoint);
    }

    console.log("points:", points);

    for (let i = 0; i < 200; i++) {
        point = pickFrom(points);                                                   // Pick a random point from points
    
        if (point.availangles.length < 5) { i--; continue; }                        // If no availangles at that point, skip it.
        if (findDistance(clickX, clickY, point.X, point.Y) > 40) { i--; continue; } // If point is too far from center, skip it.
    
        pickedAngle = pickFrom(point.availangles);                                  // Pick a random angle from the availangles list.
        const { X2, Y2 } = calcX2Y2(point.X, point.Y, pickedAngle, 15);             // Calculate the new point2.
        makeLine(point.X, point.Y, X2, Y2);                                         // Draw the line from point1 to point2.
    
        newPoint = { X: X2, Y: Y2, availangles: structuredClone(newAvailangles) };  // Create a new point2.
        removeChunkFromAvailangles(point.availangles, pickedAngle);                 // Remove the angle from the availangles list.
        removeChunkFromAvailangles(newPoint.availangles, (pickedAngle + 180) % 360);// Remove the opposite angle from the availangles list.
        points.push(newPoint);                                                      // Add the new point2 to the points list.
    }
    console.log("points:", points);
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
        { x: clickX + Math.random() * 100 - 50, y: clickY + Math.random() * 100 - 50 },
        { x: clickX + Math.random() * 100 + 50, y: clickY + Math.random() * 100 },
        { x: clickX + Math.random() * 100, y: clickY + Math.random() * 100 + 50 },
    ];
    const blobAngles = [];
    for (i = 0; i <= 2; i++) {
        blobAngles.push(findAngle({ clickX, clickY }, blobPoints[i]));
    }

    const minRadius = [];
    minRadius.push(findDistance(blobPoints[0], blobPoints[1]) / 2);
    minRadius.push(findDistance(blobPoints[1], blobPoints[2]) / 2);
    minRadius.push(findDistance(blobPoints[2], blobPoints[0]) / 2);

    const PIover2 = Math.PI / 2;
    context.beginPath();
    for (i = 0; i < 3; i++) {
        context.arc(clickX, clickY, minRadius[i] + Math.random() * 100, blobAngles[i] - PIover2, blobAngles[i] + PIover2, false);
    }
}


// Mouse click event triggers a sfx, screen shake, and createSmash()
canvas.onmousedown = (e) => {
    console.log("Mouse down...");

    // play sfx
    setTimeout(clickSFX.cloneNode(true).play(), 20);

    // generate glass shatter drawing
    createSmash(e.clientX, e.clientY);

    // shake screen randomly 5 times quickly from -20 to 20, then return to normal
    r = () => {
        return Math.floor(Math.random() * 40) - 20;
    };
    for (let i = 0; i < 5; i++) {
        gsap.to(canvas, { x: r(), y: r(), duration: 0.04 });
    }
    canvas.style.transform = "translate(0px, 0px)";
}
