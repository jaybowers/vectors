const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function degToRad(deg) {
	return DEG_TO_RAD * deg;
}
function radToDeg(rad) {
	return RAD_TO_DEG * rad;
}

// The maximum is inclusive and the minimum is inclusive 
function randomInt(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomFloat(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.random() * (max - min + 1) + min;
}
