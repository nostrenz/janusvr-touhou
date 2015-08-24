// http://www.dgp.toronto.edu/~mccrae/projects/firebox/js.html

// When true, disable js effects
var toggle = false;

var globalTime = 0.0;
room.update = function(delta_time) {
    globalTime += delta_time;

    if (toggle) {
		applyEffect("2hu");
		applyEffect("seiran");
		applyEffect("sumireko");
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

room.onKeyDown = function(event)
{
  if (event.keyCode == 'J') {
  		//event.preventDefault();
  		toggle = !toggle;
      print("Toggle JS: now " + toggle);
  }
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
Move an object.
@param jsId: Object's js_id (ex: "mystia")
@param vector: Vector object (ex: Vector(3,3,3))
*/
var setPos = function(jsId, vector) {
	room.objects[jsId].pos = vector;
}

/**
Set an object's fwd.
*/
var setFwd = function(jsId, vector) {
	room.objects[jsId].fwd = vector;
}

/**
Make an object looking at the player.
*/
var lookAtPlayer = function(jsId) {
	var x = player.pos.x - room.objects[jsId].pos.x;
	var z = player.pos.z - room.objects[jsId].pos.z;

	room.objects[jsId].fwd = Vector(x,0,z);
}

/**
Display in console the player's user Id
*/
var showUserId = function() {
	print(player.userid);
}