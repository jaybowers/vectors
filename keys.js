function Keys(listeners) {
	this.listeners = listeners;
	this.keys_pressed = new Set();
	document.addEventListener('keydown', (event) => {
//		console.log(event.type + ' ' + event.key);
		this.keys_pressed.add(event.key);
		callObjects(this.listeners, o => 'keydown' in o, o => o.keydown({ key: event.key }));
	});
	document.addEventListener('keyup', (event) => {
//		console.log(event.type + ' ' + event.key);
		this.keys_pressed.delete(event.key);
		callObjects(this.listeners, o => 'keyup' in o, o => o.keyup({ key: event.key }));
	});
	this.pressed = function(key) {
		return this.keys_pressed.has(key);
	}
}