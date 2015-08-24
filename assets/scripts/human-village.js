// When true, disable js effects
var toggle = true;

var globalTime = 0.0;
room.update = function(delta_time) {
    globalTime += delta_time;

    if (toggle) {
		applyEffect("mystia");
    }
}

room.onKeyDown = function(event)
{
	// Toggle JS
  if (event.keyCode == 'J') {
  		toggle = !toggle;
      print("Toggle JS: now " + toggle);
  }
}

var applyEffect = function(name) {
	float(name+"-name", 2);
	float(name+"-object", 0);

	lookAtPlayer(name+"-name");
	lookAtPlayerByDistance(name+"-object");
}

/**
 * Make an object float.
 * @param jsId: Object's js_id (ex: "mystia")
 * @param offset: Used to change ce origin position
 */
var float = function(jsId, offset) {
	// Replacing 'sin' by 'tan' in this one is fun ;)
	room.objects[jsId].pos.y = (Math.sin(globalTime/1000)/5 + 0.5) + offset;
}

/**
Same as lookAtPlayer, but with a distance test.
The object will stop looking at player when too far.
It's less creppy :s
*/
var lookAtPlayerByDistance = function(jsId) {
	var dist = distance(player.pos, room.objects[jsId].pos)

	if (dist < 1.5) {
		var x = player.pos.x - room.objects[jsId].pos.x;
		var z = player.pos.z - room.objects[jsId].pos.z;

		room.objects[jsId].fwd = Vector(x,0,z);
	}
}

/**
Make an object looking at the player.
*/
var lookAtPlayer = function(jsId) {
	var x = player.pos.x - room.objects[jsId].pos.x;
	var z = player.pos.z - room.objects[jsId].pos.z;

	room.objects[jsId].fwd = Vector(x,0,z);
}