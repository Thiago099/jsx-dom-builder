export function state(value){
    const elements = new Set();

    function subscribe(callback){
        // console.log('subscribe', callback);
        elements.add(callback);
    }

    function unsubscribe(callback){
        // console.log('unsubscribe', callback);
        elements.delete(callback);
    }

    const validator = {
        get(target, key) {
            if (key === '__subscribe') return subscribe;
            if (key === '__unsubscribe') return unsubscribe;
            if (
                    typeof target[key] === 'object' &&
                    target[key] !== null && 
                    !(target[key] instanceof HTMLElement)
                ) 
                return new Proxy(target[key], validator)
                return target[key];
        },
        set (target, key, _value) {
            target[key] = _value;
            for(const element of elements){
                element.__update();
            }
          return true
        }
      }
    const proxy = new Proxy(value, validator)
    return proxy;
}