export function effect(value){
    const callbacks = new Set();

    function subscribe(callback){
        callbacks.add(callback);
    }
    value.__subscribe = subscribe;

    function unsubscribe(callback){
        callbacks.delete(callback);
    }
    value.__unsubscribe = unsubscribe;

    var validator = {
        get(target, key) {
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
                for(const callback of callbacks){
                    callback();
                }
            },0)
          return true
        }
      }

    return new Proxy(value, validator);
}