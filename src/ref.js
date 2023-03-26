export function ref(ref_object = null)
{
    var __ref_object = ref_object

    const proxy = new Proxy({}, {
        get: (target, name) =>{
            if (__ref_object!=null) {
                if (typeof __ref_object[name] === 'function') {
                    // check if the nameerty is a function
                    return function(...args) {
                      const result = __ref_object[name].apply(__ref_object, args); // call the method on the real element
                      return result; // otherwise, return the original result
                    }.bind(this);
                  } else {
                    return __ref_object[name]; // pass through any other property access
                  }
                }
        },
        set: (target, name, value) => {
            if(name === "__ref_object") __ref_object = value
            if (value != null) {
                __ref_object[name] = value
                return true
            }
            return true;
        }
    })
    return proxy
    
}