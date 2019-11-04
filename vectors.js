/*
 A vertex - each angular point of a polygon, polyhedron, or other figure on a 2d plane.
*/
function Vertex(x, y) {
	this.x = x;
	this.y = y;
}
/*
 Having direction as well as magnitude, especially as determining the position of one point in space relative to another
*/
function Vector(magnitude, direction) {
	this.magnitude = magnitude;
	this.direction = direction;
	this.x = this.magnitude * Math.cos( degToRad( this.direction ) );
	this.y = this.magnitude * Math.sin( degToRad( this.direction ) );
	this.add = function (other) {
		var sx = this.x,
		    sy = this.y;

		var rx = sx + other.x,
		    ry = sy + other.y;

		var magnitude = Math.sqrt( (rx * rx) + (ry * ry) ),
		    direction = radToDeg( Math.atan2( ry, rx ) );

		return new Vector(magnitude, direction);
	};
	this.subtract = function (other) {
		var sx = this.x,
		    sy = this.y;

		var rx = sx - other.x,
		    ry = sy - other.y;

		var magnitude = Math.sqrt( (rx * rx) + (ry * ry) ),
		    direction = radToDeg( Math.atan2( ry, rx ) );

		return new Vector(magnitude, direction);
	};
}