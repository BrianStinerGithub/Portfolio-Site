function setCookie(cookieContent) {
	document.cookie = cookieContent;
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie(name, value) {
	return getCookie(name) == value;
}

// Drawing functions for making lines and arcs.
function makeLine(X1, Y1, X2, Y2) {
	context.beginPath();
	context.moveTo(X1, Y1);
	context.lineTo(X2, Y2);
	context.stroke();
}
function makeArc(x, y, radius, length) {
	const angle = Math.random() * Math.PI * 2;
	const sides = Math.round(length / 2) * (Math.PI / 180);
	context.arc(x, y, radius, angle - sides, angle + sides, false);
	context.stroke();
}
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
}


// Pick from a random value from a list.
function pickFrom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

// Splice chunck to either side of angle if still there.
function removeChunkFromAvailangles(availangles, angle, chunk = 10) {
	for (let i = -1 * chunk; i <= chunk; i++) {
		availangles.splice(availangles.indexOf(angle + i), 1);
	}
	return availangles;
}
function range(start, end) {
	return Array(end - start + 1)
		.fill()
		.map((_, idx) => start + idx);
}

// Three geometry functions for finding points, distances, and angles.
function calcX2Y2(x, y, angle, length) {
	return {
		X2: x + Math.cos((angle * Math.PI) / 180) * length,
		Y2: y + Math.sin((angle * Math.PI) / 180) * length,
	};
}
function findDistance(point1, point2) {
	return Math.sqrt(
		Math.pow(Math.abs(point1.X - point2.X), 2) +
			Math.pow(Math.abs(point1.Y - point2.Y), 2)
	);
}
function findAngle(point1, point2) {
	return Math.atan2(
		Math.abs(point1.Y - point2.Y),
		Math.abs(point1.X - point2.X)
	)*(180/Math.PI);
}


export { setCookie, getCookie, checkCookie, makeLine, makeArc, initEdges, pickFrom, range, removeChunkFromAvailangles, calcX2Y2, findDistance, findAngle };
