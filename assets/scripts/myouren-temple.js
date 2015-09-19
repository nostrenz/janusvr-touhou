var toggle = true;
var globalTime = 0.0;

var onBoat = false;
var boatGoForward = false;
var boatRotateLeft = false;
var boatRotateRight = false;
var boatGoUp = false;
var boatGoDown = false;
var rotateBoatCounter = 3090;
var boatSpeed = 0.004;
var boatTurnRate = 0.0005;

room.update = function(delta_time) {
	globalTime += delta_time;

	if (toggle) {
		float("umbrella", 0.003);
		
		if (onBoat) {
			boatControls(delta_time);
		} else {
			float("palanquin", 0.01);
		}
	}
}

var boatControls = function(delta_time) {
	var jsId = "palanquin";
	
	// Prevent going under the ground
	if (room.objects[jsId].pos.y < 7) {
		room.objects[jsId].pos.y = 7;
	}
	
	// Make the boat going forwad when holding W
	if (boatGoForward) {
		var vel = (delta_time*boatSpeed);
		
		room.objects[jsId].pos.z += vel * room.objects[jsId].fwd.z;
		room.objects[jsId].pos.x += vel * room.objects[jsId].fwd.x;
	}

	// Rotate the boat when holding A or D
	if (boatRotateLeft) {
		rotateBoatCounter += delta_time;
		rotateObject(jsId, rotateBoatCounter*boatTurnRate);
	} else if (boatRotateRight) {
		rotateBoatCounter -= delta_time;
		rotateObject(jsId, rotateBoatCounter*boatTurnRate);
	}
	
	// Go up or down by holding I or K
	if (boatGoUp) {
		room.objects[jsId].pos.y += delta_time/250;
	} else if (boatGoDown) {
		room.objects[jsId].pos.y -= delta_time/250;
	} else {
		// Do not float when changing altitude
		float(jsId, 0.01);
	}
	
	// Stay fixed on the boat (also prevent teleporting)
	player.pos.x = room.objects[jsId].pos.x;
	player.pos.y = room.objects[jsId].pos.y + 10;
	player.pos.z = room.objects[jsId].pos.z;
}


///// Utils /////

/**
 * Make an object seems to float.
 */
var float = function(jsId, multiplier) {
	room.objects[jsId].pos.y += Math.sin(globalTime/1000) * multiplier;
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
		jsId = "palanquin";
		
		var dist = distance(player.pos, room.objects[jsId].pos);
		
		var upShip = (
			player.pos.y > room.objects[jsId].pos.y - 2
			&& player.pos.y < room.objects[jsId].pos.y + 12
		);

		if (dist < 20 && upShip) {
			onBoat = !onBoat;
			
			if (onBoat) {
				print("You're on the ship (W: move forward; A/D: turn left/right; I/K: move up/down; B: leave)");
			}
		} else {
			print("You need to get closer to use the ship");
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
		
		// Rotate right
		if (event.keyCode == 'D') {
			event.preventDefault();
			
			boatRotateRight = true;
		}
		
		// Up
		if (event.keyCode == 'I') {
			boatGoUp = true;
		}
		
		// Down
		if (event.keyCode == 'K') {
			boatGoDown = true;
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
		
		// Up
		if (event.keyCode == 'I') {
			boatGoUp = false;
		}
		
		// Down
		if (event.keyCode == 'K') {
			boatGoDown = false;
		}
	}
}