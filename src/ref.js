export function ref(ref_object = null)
{
    var __ref_object = ref_object

    const proxy = new Proxy({}, {
        get: (target, name) =>{
            if (__ref_object!=null) {
                return __ref_object[name]
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