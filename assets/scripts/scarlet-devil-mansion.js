var toggle = true;
var globalTime = 0.0;

// Doors
var doorsOpen = false;
var doorsOpeningRequested = false;
var leftDoorCounter = 0;
var rightDoorCounter = 0;

// Ladder
var onLadder = false;
var ladderUp = false;
var ladderDown = false;

room.update = function(delta_time) {
	globalTime += delta_time;

	if (toggle) {
		if (doorsOpeningRequested) {
			openDoors(delta_time);
		}
		
		if (onLadder) {
			ladderControls();
		}
	}
}

var ladderControls = function() {
	var jsId = "ladder";
	
	// Prevent going to far
	if (player.pos.y <= room.objects[jsId].pos.y) {
		player.pos.y = room.objects[jsId].pos.y;
	} else if (player.pos.y >= room.objects[jsId].pos.y + 5) {
		player.pos.y = room.objects[jsId].pos.y + 5;
	}
	
	// Go up or down by holding W or S
	if (ladderUp) {
		player.pos.y += 0.025;
	} else if (ladderDown) {
		player.pos.y -= 0.025;
	}
	
	// Lock axis (also prevent teleporting)
	player.pos.x = room.objects[jsId].pos.x;
	player.pos.z = room.objects[jsId].pos.z + 0.4;
}


///// Utils /////

/**
 * When called, open or close the doors.
 */
var openDoors = function(delta_time) {
	// Open doors
	if (!doorsOpen) {
		leftDoorCounter += delta_time;
		rightDoorCounter += delta_time;
		
		// End movement
		if (rightDoorCounter > 3000) {
			doorsOpen = true;
			doorsOpeningRequested = false;
		}
	// Close doors
	} else if (doorsOpen) {
		leftDoorCounter -= delta_time;
		rightDoorCounter -= delta_time;

		// End movement
		if (rightDoorCounter < 1600) {
			doorsOpen = false;
			doorsOpeningRequested = false;
		}
	}
	
	// Rotate doors
	rotateObject("door-left", -leftDoorCounter/1000);
	rotateObject("door-right", rightDoorCounter/1000);
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

/**
 * onClick on "door-left" and "door-right".
 * Trigger doors' opening/closure.
 */
var doorClicked = function(side)
{
	if (!doorsOpeningRequested) {
		var dist = distance(player.pos, room.objects["door-" + side].pos);

		if (dist < 4.5) {
			if (!doorsOpen) {
				leftDoorCounter = -1600;
				rightDoorCounter = 1540;
			}
			
			doorsOpeningRequested = true;
		} else {
			print("Get closer to open/close doors");
		}
	}
}

var nearLadder = function()
{
	var distX = player.pos.x - room.objects["ladder"].pos.x;
	var distZ = player.pos.z - room.objects["ladder"].pos.z;
	
	var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distZ, 2));
	
	return (dist < 1);
}

room.onKeyDown = function(event)
{
	// Toggle JS
	if (event.keyCode == 'J') {
		toggle = !toggle;
		print("Toggle JS: now " + toggle);
	}
	
	// Use or leave the ladder
	if (event.keyCode == 'F') {
		if (nearLadder()) {
			event.preventDefault();

			onLadder = !onLadder;
			
			if (onLadder) {
				print("Ladder: W: Up, S: Down");
				room.gravity = 0;
			} else {
				room.gravity = -9.8;
				player.pos.z -= 0.5;
			}
		}
	}
	
	if (onLadder) {
		// Up
		if (event.keyCode == 'W') {
			event.preventDefault();
			ladderUp = true;
		}
		
		// Down
		if (event.keyCode == 'S') {
			event.preventDefault();
			ladderDown = true;
		}
	}
}

room.onKeyUp = function(event)
{
	if (onLadder) {
		// Up
		if (event.keyCode == 'W') {
			event.preventDefault();
			ladderUp = false;
		}
		
		// Down
		if (event.keyCode == 'S') {
			event.preventDefault();
			ladderDown = false;
		}
	}
}