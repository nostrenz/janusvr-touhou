var globalTime = 0.0;
room.update = function(delta_time) {
    globalTime += delta_time;
    room.objects["kasen-ibaraki-face"].blend0 = Math.sin(globalTime/500.0)*0.5+0.5;
}
