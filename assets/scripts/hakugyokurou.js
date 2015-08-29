var toggle = true;
var globalTime = 0.0;
var frontPortalOpen = false;
var frontPortalOpeningRequested = false;
var counter = 0;

room.update = function(delta_time) {
	globalTime += delta_time;

	if (toggle) {
		if (frontPortalOpeningRequested) {
			openFrontPortal(delta_time);
		}
		
		float("boat", -1.7, 0.3);
	}
}

/**
 * When called, open or close the front portal.
 */
var openFrontPortal = function(delta_time) {
	// Open portal
	if (!frontPortalOpen) {
		counter += delta_time;
		
		// End movement
		if (counter > 3000) {
			frontPortalOpen = true;
			frontPortalOpeningRequested = false;
		}
	// Close portal
	} else if (frontPortalOpen) {
		counter -= delta_time;

		// End movement
		if (counter < 1600) {
			frontPortalOpen = false;
			frontPortalOpeningRequested = false;
		}
	}
	
	// Rotate doors
	rotateObject("front-portal-left", counter/1000);
	rotateObject("front-portal-right", -counter/1000);
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
	var sin = Math.sin(time);
	var cos = Math.cos(time);
	
	room.objects[jsId].xdir.x = room.objects[jsId].zdir.z = sin;
	room.objects[jsId].zdir.x = (room.objects[jsId].xdir.z = cos) * -1;
}


///// Events /////

room.onKeyDown = function(event)
{
	// Toggle JS
	if (event.keyCode == 'J') {
		toggle = !toggle;
		print("Toggle JS: now " + toggle);
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
				counter = 1600;
			} else {
				counter = 3000;
			}
			
			frontPortalOpeningRequested = true;
		} else {
			print("Get closer to open/close doors");
		}
	}
}