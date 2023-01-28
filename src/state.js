export function state(value){
    const elements = new Set();

    function subscribe(callback){
        elements.add(callback);
    }

    function unsubscribe(callback){
        elements.delete(callback);
    }

    var validator = {
        get(target, key) {
            if (key === '__subscribe') return subscribe;
            if (key === '__unsubscribe') return unsubscribe;
            if (
                    typeof target[key] === 'object' &&
                    target[key] !== null && 
                    !target[key] instanceof HTMLElement
                ) 
                return new Proxy(target[key], validator)
                return target[key];
        },
        set (target, key, value) {
            target[key] = value;
            setTimeout(()=>{
                for(const element of elements){
                    element.$update();
                }
            },0)
          return true
        }
      }

    return new Proxy(value, validator);
}