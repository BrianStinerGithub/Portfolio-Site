import { setCookie, checkCookie } from "./cookies.mjs";

// Export all at the bottom of the file.
const canvas = document.getElementById("frosted-glass"),
    context = canvas.getContext("2d"),
	newAvailangles = range(0, 360),
	clickSFX = new Audio("static/mp3/glassHit.mp3"),
	timesSmashed = 0;

function resizeCanvas() {
    console.log("resizing canvas...");
    
	const temp = context.getImageData(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.putImageData(temp, 0, 0);

	console.log("canvas.width:", canvas.width);
	console.log("canvas.height:", canvas.height);
};

// check cookie for glassBroken and resize canvas
function init() {
	console.log("Initializing...");

	if (checkCookie("glassBroken=true")) {
		console.log("Cookie found. Glass has been smashed.");
		// enable scroll, show page, and remove the glass
		document.body.style.overflowY = "visible";
		document.getElementById("page").style.display = "flex";
		canvas.style.display = "none";
	}

	window.onresize = () => resizeCanvas();
	resizeCanvas();
};

// Pick from a random value from a list.
function pickFrom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

// Splice 10 to either side of angle if still there.
function removeChunkFromAvailangles(availangles, angle, chunk) {
	for (let i = -1*chunk; i <= chunk; i++) {
		availangles.splice(availangles.indexOf(angle + i), 1);
	}
};
function range(start, end) {
	return Array(end - start + 1)
		.fill()
		.map((_, idx) => start + idx);
};

// Three geometry functions for finding points, distances, and angles.
function calcX2Y2(x, y, angle, length) {
	return {
		X2: x + Math.cos((angle * Math.PI) / 180) * length,
		Y2: y + Math.sin((angle * Math.PI) / 180) * length,
	};
};
function findDistance(point1, point2) {
	return Math.sqrt(
		Math.pow(Math.abs(point1.X - point2.X), 2) +
			Math.pow(Math.abs(point1.Y - point2.Y), 2)
	);
};
function findAngle(point1, point2) {
	return Math.atan2(
		Math.abs(point1.Y - point2.Y),
		Math.abs(point1.X - point2.X)
	);
};

// Drawing functions for making lines and arcs.
function makeLine(X1, Y1, X2, Y2) {
	context.beginPath();
    context.moveTo(X1, Y1);
    context.lineTo(X2, Y2);
    context.stroke();
};
function makeArc(x, y, radius, length) {
	const angle = (Math.random * Math.PI * 2);
	const sides = ( Math.round(length / 2) * (Math.PI / 180) );
	context.arc(x, y, radius, angle - sides, angle + sides, false);
	context.stroke();
	
	console.log(angle);
	console.log(sides);
};
// availangles for edgePoints are 180 degrees towards the center of the screen.
function initEdges(pointsPerEdge) {
	console.log("Initializing edges...");
	edgePoints = [];
	for (let i = 0; i < pointsPerEdge; i++) {
		// Top edge, X is random, Y is 0.
		edgePoints.push({
			X: Math.random() * canvas.width,
			Y: 0,
			availangles: range(180, 360),
		});
		// Right edge, X is canvas.width, Y is random.
		edgePoints.push({
			X: canvas.width,
			Y: Math.random() * canvas.height,
			availangles: range(90, 270),
		});
		// Bottom edge, X is random, Y is canvas.height.
		edgePoints.push({
			X: Math.random() * canvas.width,
			Y: canvas.height,
			availangles: range(0, 180),
		});
		// Left edge, X is 0, Y is random.
		edgePoints.push({
			X: 0,
			Y: Math.random() * canvas.height,
			availangles: range(0, 90) + range(270, 360),
		});
	}
	return edgePoints;
};



export {
	newAvailangles,
	canvas,
	context,
	timesSmashed,
	clickSFX,
	pickFrom,
	removeChunkFromAvailangles,
	calcX2Y2,
	findDistance,
	findAngle,
	makeLine,
	makeArc,
	init,
	range,
	resizeCanvas,
	initEdges,
	setCookie,
};