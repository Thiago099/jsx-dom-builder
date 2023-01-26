
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
        // "id": (value) =>{
        //     // id is used by ref and should not be set
        //     // remove this block to allow id to be set
        // },
        "ref": (value) => {
            
            value.__ref_object = el;

            return

            // const find = (name) => Object.entries(props).find(([key, value]) => key === name)

            // const id = find("id");
            // if(id)
            // {
            //     ref[id[1]] = el;
            //     return
            // }



            // const _class = find("class");
            // if(_class)
            // {
            //     const classes = _class[1].split(" ").filter((c) => c.length > 0);
            //     if(classes.length > 0)
            //     {
            //         ref[classes[0]] = el;
            //     }
            //     return
            // }
        },
        "style":(prop)=>{
            if(typeof prop === "object")
            {
                for(const [key, value] of Object.entries(prop))
                {
                    el.style[key] = value
                }
            }
            else
            {
                el.style = prop
            }
        },
         "class":(prop)=>{
            // if is object
            if(typeof prop === "object")
            {
                for(const [key, value] of Object.entries(prop))
                {
                    el.class(key,value);
                }
            }
            else
            {
                el.class(prop);
            }
        },
        "effect":(prop)=>{
            el.effect(prop);
        },
        "parent":(prop)=>{
            el.parent(prop);
        },
        "if":(prop)=>{
            el.if(prop);
        },
        "model": (getset) =>
        {
            el.model(getset)
        },
    }
    const extraHandles = {
        "on": (event,callback) =>
        {
            el.on(event,callback)
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
                    el[key]=value;
                }
            }
        };
    }
    if(children && !is_component)
    {
        for(const child of children)
        {
            el.child(child,false)
        }
    }
    return el;
};


export const Fragment = (props, ...children) => undefined