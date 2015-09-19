var toggle = true;
var globalTime = 0.0;
var frontPortalOpen = false;
var frontPortalOpeningRequested = false;
var openDoorsCounter = 0;

var onBoat = false;
var boatGoForward = false;
var boatRotateLeft = false;
var boatRotateRight = false;
var rotateBoatCounter = 3090;
var boatSpeed = 0.0025;
var boatTurnRate = 0.0005;

room.update = function(delta_time) {
	globalTime += delta_time;

	if (toggle) {
		if (frontPortalOpeningRequested) {
			openFrontPortal(delta_time);
		}
		
		boatEffects();
		
		if (onBoat) {
			boatControls(delta_time);
		}
	}
}

var boatEffects = function() {
	float("boat", -1.7, 0.3);
}

var boatControls = function(delta_time) {
	jsId = "boat";
	
	// Make the boat going forwad when holding W
	if (boatGoForward) {
		var vel = (delta_time*boatSpeed);
		
		room.objects[jsId].pos.z += vel * room.objects[jsId].fwd.x;
		room.objects[jsId].pos.x -= vel * room.objects[jsId].fwd.z;
	}

	// Rotate the boat when holding A or D
	if (boatRotateLeft) {
		rotateBoatCounter += delta_time;
		rotateObject(jsId, rotateBoatCounter*boatTurnRate);
	} else if (boatRotateRight) {
		rotateBoatCounter -= delta_time;
		rotateObject(jsId, rotateBoatCounter*boatTurnRate);
	}
	
	// Stay fixed on the boat (also prevent teleporting)
	player.pos.x = room.objects[jsId].pos.x;
	player.pos.y = room.objects[jsId].pos.y;
	player.pos.z = room.objects[jsId].pos.z;
}


///// Utils /////

/**
 * When called, open or close the front portal.
 */
var openFrontPortal = function(delta_time) {
	// Open portal
	if (!frontPortalOpen) {
		openDoorsCounter += delta_time;
		
		// End movement
		if (openDoorsCounter > 3000) {
			frontPortalOpen = true;
			frontPortalOpeningRequested = false;
		}
	// Close portal
	} else if (frontPortalOpen) {
		openDoorsCounter -= delta_time;

		// End movement
		if (openDoorsCounter < 1600) {
			frontPortalOpen = false;
			frontPortalOpeningRequested = false;
		}
	}
	
	// Rotate doors
	rotateObject("front-portal-left", openDoorsCounter/1000);
	rotateObject("front-portal-right", -openDoorsCounter/1000);
}

/**
 * Make an object seems to float.
 */
var float = function(jsId, offset, multiplier) {
	var calc = (Math.sin(globalTime/1000)/5 + 0.5) + offset;
	
	room.objects[jsId].pos.y = calc * multiplier;
}

/**
 * Rotate an object.
 * @param jsId: Object's js_id
 * @param time: An incrementing counter, can be globalTime
 *				A negative value rotate clockwise, a negative one anticlockwise
 */
var rotateObject = function(jsId, time) {
	room.objects[jsId].xdir.x = room.objects[jsId].zdir.z = Math.sin(time);
	room.objects[jsId].zdir.x = (room.objects[jsId].xdir.z = Math.cos(time)) * -1;
}


///// Events /////

room.onKeyDown = function(event)
{
	// Toggle JS
	if (event.keyCode == 'J') {
		toggle = !toggle;
		print("Toggle JS: now " + toggle);
	}
	
	// Use or leave the boat
	if (event.keyCode == 'B') {
		var dist = distance(player.pos, room.objects["boat"].pos);

		if (dist < 2) {
			onBoat = !onBoat;
			
			if (onBoat) {
				print("You're on the boat (W: move forward; A/D: turn left/right; B: leave)");
			}
		}
	}
	
	if (onBoat) {
		// Forward
		if (event.keyCode == 'W') {
			event.preventDefault();
			
			boatGoForward = true;
		}
		
		// Rotate left
		if (event.keyCode == 'A') {
			event.preventDefault();
			
			boatRotateLeft = true;
		}
		
		// Rorate right
		if (event.keyCode == 'D') {
			event.preventDefault();
			
			boatRotateRight = true;
		}
	}
}

room.onKeyUp = function(event)
{
	if (onBoat) {
		// Forward
		if (event.keyCode == 'W') {
			event.preventDefault();
			
			boatGoForward = false;
		}
		
		// Rotate left
		if (event.keyCode == 'A') {
			event.preventDefault();
			
			boatRotateLeft = false;
		}
		
		// Rorate right
		if (event.keyCode == 'D') {
			event.preventDefault();
			
			boatRotateRight = false;
		}
	}
}

/**
 * onClick on "front-portal-left" and "front-portal-right".
 * Trigger front portal's opening/closure.
 */
var portalClicked = function(side) {
	if (!frontPortalOpeningRequested) {
		var dist = distance(player.pos, room.objects["front-portal-" + side].pos);

		if (dist < 4.5) {
			if (!frontPortalOpen) {
				openDoorsCounter = 1600;
			} else {
				openDoorsCounter = 3000;
			}
			
			frontPortalOpeningRequested = true;
		} else {
			print("Get closer to open/close doors");
		}
	}
}