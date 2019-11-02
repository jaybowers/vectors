function Keys(listeners) {
	this.listeners = listeners;
	this.keys_pressed = new Set();
	this.init = function() {
		document.addEventListener('keydown', (event) => {
//			console.log(event.type + ' ' + event.key);
			this.keys_pressed.add(event.key);
		});
		document.addEventListener('keyup', (event) => {
//			console.log(event.type + ' ' + event.key);
			this.keys_pressed.delete(event.key);
		});
	};
	this.pressed = function(key) {
		return this.keys_pressed.has(key);
	}
}