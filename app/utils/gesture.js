class Gesture {
  constructor(event = null){
    this.events = [];
    this.defaultPrevented = false;
    this.propagationStopped = false;
    if (event) {
      this.push(event);
    }
  }

  // Methods
  push(event) {
    this.events.push(event);
    this.last = event;
    if (this.defaultPrevented) {
      event.preventDefault();
    }
    if (this.propagationStopped) {
      event.stopPropagation();
    }
  }

  preventDefault(thisArg, condFn) {
    var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
    var result = func ? func(this) : true;
    this.defaultPrevented = result;
    return result;
  }

  stopPropagation(thisArg, condFn) {
    var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
    var result = func ? func(this) : true;
    this.propagationStopped = result;
    return result;
  }

  adquire(thisArg, condFn) {
    var func = arguments.length === 2 ? condFn.bind(thisArg) : thisArg;
    var result = func ? func(this) : true;
    this.defaultPrevented = result;
    this.propagationStopped = result;
    return result;
  }

  isHorizontal(margin = 15) {
    var mod = this.direction % 90;
    return mod < margin || mod > (90 - margin);
  }

  // Getters
  get eventsCount() {
    return this.events.length;
  }

  get duration() {
    return this.last.timeStamp - this.first.timeStamp;
  }

  get first(){
    return this.events[0];
  }

  get pageX(){
    return this.last.touches[0].pageX;
  }

  get pageY(){
    return this.last.touches[0].pageY;
  }

  get initPageX() {
    return this.first.touches[0].pageX;
  }

  get initPageY() {
    return this.first.touches[0].pageY;
  }

  get lastEvents() {
    return this.events.slice(Math.max(this.eventsCount - 5, 0), this.eventsCount);
  }

  get deltaX() {
    return this.pageX - this.initPageX;
  }

  get deltaY() {
    return this.pageY - this.initPageY;
  }

  get speedX() {
    var lastEvents = this.lastEvents;
    var initX    = lastEvents[0].touches[0].pageX;
    var initTime = lastEvents[0].timeStamp;
    var lastX    = lastEvents[lastEvents.length - 1].touches[0].pageX;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastX - initX) / (lastTime - initTime) * 1000 || 0;
  }

  get speedY() {
    var lastEvents = this.lastEvents;
    var initY    = lastEvents[0].touches[0].pageY;
    var initTime = lastEvents[0].timeStamp;
    var lastY    = lastEvents[lastEvents.length - 1].touches[0].pageY;
    var lastTime = lastEvents[lastEvents.length - 1].timeStamp;

    return (lastY - initY) / (lastTime - initTime) * 1000 || 0;
  }

  get direction() {
    var x = this.deltaX;
    var y = -this.deltaY;
    var radians = Math.acos(Math.abs(y) / Math.sqrt(x*x + y*y));
    var degrees = radians * 180 / Math.PI;
    if (x >= 0 && y >= 0) {
      return degrees;         // 1st cuadrant
    } else if (x >= 0 && y < 0) {
      return 180 - degrees;   // 2nd cuadrant
    } else if (x < 0 && y < 0) {
      return 180 + degrees;   // 3rd cuadrant
    } else {
      return 360 - degrees;   // 4th cuadrant
    }
  }
}

export default Gesture;
