
import { element } from './element'
export const JSXDOM = (name, props, ...children) => {

    var el;
    var is_component = false
    if (typeof name === 'function') {
        el = name(props, ...children);
        if(el === undefined)
        {
            return children
        }
        is_component = true
    }
    else
    {
        el = element(name);
    }

    
    const handlers = {
        "ref": (value) => {
            value.__ref_object = el;
        },
        "style":(prop)=>{
            if(typeof prop === "object")
            {
                for(const [key, value] of Object.entries(prop))
                {
                    el.$style(key,value)
                }
            }
            else
            {
                el.$style(prop)
            }
        },
         "class":(prop)=>{
            // if is object
            if(typeof prop === "object")
            {
                for(const [key, value] of Object.entries(prop))
                {
                    el.$class(key,value);
                }
            }
            else
            {
                el.$class(prop);
            }
        },
        "effect":(prop)=>{
            el.$effect(prop);
        },
        "parent":(prop)=>{
            el.$parent(prop);
        },
        "if":(prop)=>{
            el.$if(prop);
        },
        "model": ([get,set]) =>
        {
            el.$model([get,set])
        },
    }
    const extraHandles = {
        "on": (event,callback) =>
        {
            el.$on(event,callback)
        },

    }

    if(props)
    {
        for(const [key, value] of Object.entries(props))
        {
            const splitKey = key.split(":");
            if(splitKey.length == 2)
            {
                if(extraHandles[splitKey[0]])
                {
                    extraHandles[splitKey[0]](splitKey[1],value)
                }
            }
            else
            if(handlers[key])
            {
                handlers[key](value)
            }
            else
            {
                if(!is_component)
                {
                    el.$property(key, value);
                }
            }
        };
    }
    if(children && !is_component)
    {
        for(const child of children)
        {
            el.$child(child)
        }
    }
    return el;
};


export const Fragment = (props, ...children) => undefined