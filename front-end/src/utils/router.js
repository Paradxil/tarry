class Router {
    constructor() {
        this.listeners = {};
    }

    initialize() {
        window.addEventListener('popstate', (event) => {
            if(this.listeners['popstate']) {
                for(let cb of this.listeners['popstate']) {
                    cb(event);
                }
            }
        })
    }
    
    navigate(path) {
        history.pushState({path: path}, "", path);
    
        if(this.listeners['navigate']) {
            for(let cb of this.listeners['navigate']) {
                cb(path);
            }
        }
    }
    
    listen(event, callback) {
        if(!this.listeners[event]) {
            this.listeners[event] = [];
        }
    
        this.listeners[event].push(callback);
    }

}

const _router = new Router();
export default _router;
export const navigate = _router.navigate.bind(_router);
export const listen = _router.listen.bind(_router);
