// In most cases Marko's built in events work great.
// However, sometimes components need to listen to events 
// emitted from components that are nested arbitrarily deep
// or adjacent to the listening component.

// This class implements a basic global event handler.
class EventHandler {
    constructor() {
        this.events = {};
    }

    /**
     * Emit an event to all listeners
     * @param {String} name Name of the event
     * @param {Object} event The event object
     */
    emit(name, event) {
        if(name in this.events) {
            for(let listener of this.events[name]) {
                listener(event);
            }
        }
    }

    /**
     * Listen to an event
     * @param {String} name Name of the event to listen to
     * @param {Function} cb Callback
     */
    listen(name, cb) {
        if(!(name in this.events)) {
            this.events[name] = [];
        }

        this.events[name].push(cb);
    }
}

const _EventHandler = new EventHandler();
export default _EventHandler;
export const emit = _EventHandler.emit.bind(_EventHandler);
export const listen = _EventHandler.listen.bind(_EventHandler);