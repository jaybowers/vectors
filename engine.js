function run() {
	for (let object of objects) {
		callObject(object, o => 'onKeys' in o, o => o.onKeys(keys));
		if (object.coords) {
			var oldCoords = object.coords.clone();
			callObject(object, o => 'move' in o, o => o.move());
			var collidedWith = collision(object);
			if (collidedWith != null) {
				object.coords = oldCoords;
				callObject(object, o => 'onCollision' in o, o => o.onCollision(collidedWith));
			}
		}
	}
}
function collisions(objects) {
	for (let object of objects) {
		collision(object);
	}
}
function collision(object) {
	if ('bounds' in object) {
		var bounds = object.bounds();

		var colliding = null;
		for (let other of objects) {
			if (other === object) {
				continue;
			}
			if ('bounds' in other) {
				var otherbounds = other.bounds();
				if (bounds.type == 'box' && otherbounds.type == 'box') {
					if (boxBoxCollide(bounds, otherbounds)) {
						return  other;
					}
				}
				if (bounds.type == 'circle' && otherbounds.type == 'circle') {
					if (circleCircleCollide(bounds, otherbounds)) {
						return  other;
					}
				}

			}
		}
	}
	return null;
}
function boxBoxCollide(box1, box2) {
	return box1.bottomRight.x >= box2.bottomLeft.x
		&& box1.bottomLeft.x <= box2.bottomRight.x
		&& box1.topLeft.y >= box2.bottomLeft.y
		&& box1.bottomLeft.y <= box2.topLeft.y;
}
function circleCircleCollide(circle1, circle2) {
	var length = Math.abs(circle1.x - circle2.x);
	var height = Math.abs(circle1.y - circle2.y);
	var distance = Math.sqrt( length * length + height * height );
	return distance <= circle1.radius + circle2.radius;
}
function draw() {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	callObjects(objects, o => 'draw' in o, o => o.draw(ctx));
}
function callObjects(objects, pred, callback) {
	for (let object of objects) {
		callObject(object, pred, callback);
	}
}
function callObject(object, pred, callback) {
	if (pred(object)) {
		return callback(object);
	}
	return null;
}