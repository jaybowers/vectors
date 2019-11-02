/*
 Coords

 Describes where the object is on the 2D plane
*/
function Coords(x, y, rotation, direction, speed) {
	// the x position on the canvas
	this.x = x;
	// the y position on the canvas
	this.y = y;
	// the rotated angle of the object
	this.rotation = rotation;
	// the direction that the object is traveling in
	this.direction = direction;
	// the speed of the movement
	this.speed = speed;
	// rotate the object
	this.rotate = function(deltaDegrees) {
		this.rotation = this._boundedDegrees(this.rotation + deltaDegrees);
	}
	// set the direction that the object is moving in
	this.direct = function(newDegrees) {
		this.direction = this._boundedDegrees(newDegrees);
	}
	this._boundedDegrees = function(degrees) {
		if (degrees > 360) {
			degrees -= 360;
		}
		if (degrees < 0) {
			degrees += 360;
		}
		return degrees;
	}
	this.applyForce = function(direction, amount) {
		var forceVector = new Vector(amount, direction);
		var currentVector = new Vector(this.speed, this.direction);

		var newVector = currentVector.add(forceVector);

		this.speed = newVector.magnitude;
		this.direct(newVector.direction);
	}
	this.clone = function() {
		return new Coords(this.x, this.y, this.rotation, this.direction, this.speed);
	}
}
/*
 VectorObject

 Base class for objects in the world.
*/
function VectorObject(coords, vertices, mass) {
	this.coords = coords;
	this.vertices = vertices;
	this.mass = mass;
	this.colliding = null;
	this.bounds = function() {
		return this.boundingBox();
	}
}
VectorObject.prototype.debug = function( ctx ) {
	this.bounds().draw(ctx);

	var coords = this.coords;
	ctx.save();
	ctx.translate( coords.x, coords.y );
	ctx.fillText(
			   'x = ' + coords.x.toFixed(1)
			+ ' y = ' + coords.y.toFixed(1)
			+ ' rotation = ' + coords.rotation.toFixed(2)
			+ ' speed = ' + coords.speed.toFixed(2)
			+ ' direction = ' + coords.direction.toFixed(2), -50, 50);
	ctx.restore();
}
VectorObject.prototype.drawObject = function( ctx, vertices, strokeStyle = 'black' ) {
		ctx.beginPath();
		ctx.moveTo(vertices[0].x, vertices[0].y);
		for (let i = 1; i < vertices.length; i++) {
			ctx.lineTo(vertices[i].x, vertices[i].y);
		}
		ctx.closePath();
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
}
VectorObject.prototype.draw = function( ctx ) {
	var coords = this.coords;
	var x = coords.x,
	    y = coords.y,
	    rotation = coords.rotation;
	ctx.save();
	ctx.translate( x, y );
	ctx.rotate( degToRad(rotation) );
	this.drawObject( ctx, this.vertices );
	ctx.restore();
}
VectorObject.prototype.moveObject = function() {
	var coords = this.coords;
	if (coords.x > canvas.width) {
		coords.x = 0;
	}
	if (coords.x < 0) {
		coords.x = canvas.width;
	}
	if (coords.y > canvas.height) {
		coords.y = 0;
	}
	if (coords.y < 0) {
		coords.y = canvas.height;
	}
}
VectorObject.prototype.move = function() {
	var coords = this.coords;
	var x = coords.x,
	    y = coords.y,
	    direction = coords.direction,
	    speed = coords.speed;
	coords.x = x + ( speed * Math.cos( degToRad( direction ) ) );
	coords.y = y + ( speed * Math.sin( degToRad( direction ) ) );
	this.moveObject();
}
VectorObject.prototype.translatedVertecies = function() {
	var x = this.coords.x,
    	y = this.coords.y,
    	rotation = this.coords.rotation;

    var translated = [];
    for (let vertex of this.vertices) {
		var rx = (vertex.x * Math.cos(degToRad( rotation)))
				- (vertex.y * Math.sin(degToRad( rotation )));

		var ry = (vertex.x * Math.sin(degToRad( rotation )))
				+ (vertex.y * Math.cos(degToRad( rotation )));

		var tx = rx + x;
		var ty = ry + y;

		translated.push(new Vertex(tx, ty));
    }
    return translated;
}
VectorObject.prototype.boundingBox = function() {
	var vertices = this.translatedVertecies();
	var minx = vertices[0].x, maxx = vertices[0].x, miny = vertices[0].y, maxy = vertices[0].y;
	for (let i = 0; i < vertices.length; i++) {
		let vertex = vertices[i];
		minx = Math.min(minx, vertex.x);
		maxx = Math.max(maxx, vertex.x);
		miny = Math.min(miny, vertex.y);
		maxy = Math.max(maxy, vertex.y);
	}
	var object = this;
	return {
		type: 'box',
		bottomLeft: new Vertex(minx, miny),
		topRight: new Vertex(minx, maxy),
		topLeft: new Vertex(maxx, maxy),
		bottomRight: new Vertex(maxx, miny),
		asVerticies: function() {
			return [
				this.bottomLeft,
				this.topRight,
				this.topLeft,
				this.bottomRight
			];
		},
		draw: function(ctx) {
			ctx.save();
			object.drawObject( ctx, this.asVerticies(), (object.colliding ? 'red' : 'blue') );
			ctx.restore();
		}
	};
}
VectorObject.prototype.boundingCircle = function() {
	var vertices = this.vertices;
	var minx = vertices[0].x, maxx = vertices[0].x, miny = vertices[0].y, maxy = vertices[0].y;
	for (let i = 0; i < vertices.length; i++) {
		let vertex = vertices[i];
		maxx = Math.max(maxx, Math.abs(vertex.x));
		maxy = Math.max(maxy, Math.abs(vertex.y));
	}
	var object = this;
	return {
		type: 'circle',
		radius: Math.max(maxx, maxy),
		x: object.coords.x,
		y: object.coords.y,
		draw: function(ctx) {
			ctx.save();
			ctx.translate(object.coords.x, object.coords.y);
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
			ctx.strokeStyle = (object.colliding ? 'red' : 'blue');
			ctx.stroke();
			ctx.restore();
		}
	};
}
function Asteroid(
	x = randomInt( 0, canvas.width ),
	y = randomInt( 0, canvas.height ),
	rotation = randomInt( 0, 360 ),
	direction = randomInt( 0, 360 ),
	speed = Math.random()
	) {
	var radius = 50;
	var vertices = [];
	for (let angle = 0; angle < 360; angle += randomInt(30, 90)) {
		let x = (radius + randomInt(-10, +10)) * Math.cos( degToRad( angle ) );
		let y = (radius + randomInt(-10, +10)) * Math.sin( degToRad( angle ) );
		vertices.push( new Vertex(x, y) );
	}
	VectorObject.call(this, new Coords(
		x,
		y,
		rotation,
		direction,
		speed
	), vertices, 500);
	this.rotation_speed = randomFloat( -1, 1 );
	this.moveObject = function() {
		Object.getPrototypeOf(Asteroid.prototype).moveObject.call(this);
		this.coords.rotate(this.rotation_speed);
	}
	this.onCollision = function(other) {
		this.coords.applyForce(other.coords.direction, other.coords.speed);
		other.coords.applyForce(this.coords.direction, this.coords.speed);
	}
	this.bounds = function() {
		return this.boundingCircle();
	}
	this.elasticCollision = function(m1, m2) {
		var first = 0;
		if (m1.mass != m2.mass ) {
			first = ( ( m1.mass - m2.mass) / ( m1.mass + m2.mass ) * m1.coords.speed );
		}
		return first
			+ ( ( 2 * m2.mass) / ( m1.mass + m2.mass ) * m2.coords.speed )
	}
	this.billardBallCollision = function(o1, o2) {
		// work out center of mass connecting line
		var length = o1.coords.x - o2.coords.x;
		var height = o1.coords.y - o2.coords.y;
	}
}
Asteroid.prototype = Object.create(VectorObject.prototype);
Asteroid.prototype.constructor = Asteroid;

function Ship() {
	VectorObject.call(this, new Coords(
		Math.abs( canvas.width / 2),
		Math.abs( canvas.height / 2),
		270,
		270,
		0
	), [
		new Vertex(25, 0),
		new Vertex(-25, -20),
		new Vertex(-5, 0),
		new Vertex(-25, 20)
	], 100);
	this.onKeys = function(keys) {
		var coords = this.coords;
		if (keys.pressed('ArrowRight')) {
			coords.rotate(3);
		}
		if (keys.pressed('ArrowLeft')) {
			coords.rotate(-3);
		}
		if (keys.pressed('ArrowUp')) {
			this.thrust();
		}
		if (keys.pressed(' ')) {
			this.fire();
        }
	}
	this.bounds = function() {
		return this.boundingCircle();
	}
	this.thrust = function() {
    	var coords = this.coords;
		coords.applyForce(coords.rotation, 0.1);
	}
    this.fire = function() {
    	var coords = this.coords;
        objects.add(new Projectile(coords.x, coords.y, coords.rotation, coords.speed + 5));
    }
}
Ship.prototype = Object.create(VectorObject.prototype);
Ship.prototype.constructor = Ship;
function Projectile(x, y, direction, speed) {
	VectorObject.call(this, new Coords(
		x,
		y,
		direction,
		direction,
		speed
	), [
		new Vertex(25, 0),
		new Vertex(30, 0)
	], 1);
	this.moveObject = function() {
		if (this.coords.x <= 0 || this.coords.x >= canvas.width
		 || this.coords.y <= 0 || this.coords.y >= canvas.width) {
			objects.delete(this);
		}
	}
}
Projectile.prototype = Object.create(VectorObject.prototype);
Projectile.prototype.constructor = Projectile;