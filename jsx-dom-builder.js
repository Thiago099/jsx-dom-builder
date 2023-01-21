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



class el{
    // constructor
    constructor(name) {
        if(typeof name === "string")
        {
            this.__element = document.createElement(name);
        }
        else if(name instanceof HTMLElement)
        {
            this.__element = name;
        }
        else
        {
            throw new Error("Invalid element name");
        }
        this.__events = [];
        this.__children = [];
        this.__data = null;
    }
    update()
    {
        for(const event of this.__events)
        {
            event()
        }
        for(const child of this.__children)
        {
            child.update()
        }
    }
    effect(data)
    {
        this.__data = data;
        setTimeout(()=>{this.__subscribe()},0)
        return this
    }

    __observeParent()
    {
        const observer = new MutationObserver((mutations) => {
            for(const mutation of mutations)
            {
                if (mutation.type === 'childList' && mutation.removedNodes.length) {
                    for (const removedNode of mutation.removedNodes) {
                        if (removedNode === this.__element) {
                            this.__unsubscribe()
                        }
                    }
                }
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    for (const removedNode of mutation.addedNodes) {
                        if (removedNode === this.__element) {
                            this.__subscribe()
                        }
                    }
                }
            }
        });
        observer.observe(this.__element.parentElement, { childList: true });
    }
    __subscribe()
    {
        if(this.__data)
        {
            this.__data.__subscribe(()=>this.update())
        }
    }
    __unsubscribe()
    {
        for(const child of this.__children) child.__unsubscribe()
        if(this.__data)
        {
            this.__data.__unsubscribe(()=>this.update())
        }
    }

    __handleFunction(data)
    {
        if(typeof data === "function")
        {
            return data()
        }
        return data
    }

    __handleEffect(isReactive,callback)
    {
        if(isReactive)
        {
            callback()
            this.__events.push(callback)
        }
        else
        {
            callback()
        }
    }

    __isReactive(...fields)
    {
        for(const field of fields)
        {
            if(typeof field === "function")
            {
                return true
            }
        }
        return false
    }

    class(name, value = true)
    {
        if(this.__isReactive(name))
        {
            var previous = this.__handleFunction(name)
        }
        this.__handleEffect(this.__isReactive(name,value),()=>{
            const classes = this.__handleFunction(name)
            if(classes)
            {
                if(this.__handleFunction(value))
                {
                    if(this.__isReactive(name))
                    {
                        if(previous)
                        {
                            this.__element.classList.remove(...((previous).split(" ").filter((c) => c.length > 0)))
                        }
                        previous = classes
                    }
                    this.__element.classList.add(...((classes).split(" ").filter((c) => c.length > 0)));
                }
                else
                {
                    this.__element.classList.remove(...((classes).split(" ").filter((c) => c.length > 0)));
                    previous = null
                }
            }
        })
        return this
    }

    parent(object)
    {
        if(object.__element !== undefined)
        {
            object.__element.appendChild(this.__element);
            object.__children.push(this)
        }
        else
        {
            object.appendChild(this.__element);
        }
        this.__observeParent();
        return this
    }

    parentBefore(object)
    {
        if(object.__element !== undefined)
        {
            if(object.__element.firstChild)
            {
                object.__element.insertBefore(this.__element, object.__element.firstChild);
            }
            else
            {
                object.__element.appendChild(this.__element);
            }
        }
        else
        {
            if(object.firstChild)
            {
                object.insertBefore(this.__element, object.firstChild);
            }
            else
            {
                object.appendChild(this.__element);
            }
        }

        this.__observeParent();
        return this
    }

    event(event, callback)
    {
        this.__element.addEventListener(event, callback);
        return this
    }
    
    property(name, value)
    {
        this.__handleEffect(this.__isReactive(name,value),()=>{
            this.__element[this.__handleFunction(name)] = this.__handleFunction(value);
        })
        return this
    }

    set_style(value)
    {
        this.__handleEffect(this.__isReactive(value),()=>{
            const styles = this.__handleFunction(value).split(';').filter((style) => style.length > 0);
            this.__element.style = {}
            for(const style of styles) {
                const [key, value] = style.split(':');
                this.__element.style[key] = this.__handleFunction(value);
            }
        })
        return this
    }

    set_single_style(key, value)
    {
        this.__handleEffect(this.__isReactive(key,value),()=>{
            this.__element.style[this.__handleFunction(key)] = this.__handleFunction(value);
        })
        return this
    }

    get_computed_style(name)
    {
        return window.getComputedStyle(this.__element).getPropertyValue(name)
    }

    html(value)
    {
        this.__handleEffect(this.__isReactive(value),()=>{
            this.__element.innerHTML = this.__handleFunction(value)
        })
        return this
    }

    child(value, keep_order = true)
    {

        var container;
        if(keep_order)
        {
            container = element("span").parent(this)
        }
        else
        {
            container = this
        }
        var clean_last_item = null

        this.__handleEffect(this.__isReactive(value),()=>{

            var item = this.__handleFunction(value)

            if(clean_last_item) clean_last_item()
            
            const addAnyElmentAsChild = (item) => 
            {
                if(item.__element !== undefined)
                {
                    item.parent(container)
                }
                else if(item instanceof HTMLElement)
                {
                    container.__element.appendChild(item)
                }
                else
                {
                    item = document.createTextNode(item);
                    container.__element.appendChild(item);
                }
                return () => item.remove()
            }

            if(Array.isArray(item))
            {
                var itens_to_remove = []
                for(const i of item)
                {
                    itens_to_remove.push(addAnyElmentAsChild(i))
                }
                clean_last_item = () => {
                    for(const remove_function of itens_to_remove) remove_function()
                }
            }
            else
            {
                clean_last_item = addAnyElmentAsChild(item)
            }
        })
        return this
    }

    remove()
    {
        this.__element.remove()
        return this
    }

    model(object, property)
    {
        this.property("value", () => object[property])
        this.event("input", (e) => {
            object[property] = e.target.value
        })
    }

}

export function element(type) {

    function intercept(target, name)
    {
        if(typeof target[name] !== "object")
        {
            return target[name]
        }
        const result = new Proxy(target[name], {
            set: (target, name, value) => {
                proxy.__handleEffect(proxy.__isReactive(value),()=>{
                    target[name] = proxy.__handleFunction(value);
                })
                return true;
            },
            get: (target, name) => {
                return intercept(target, name);
            }
        });
        return result
    }

    const proxy = new Proxy(new el(type), {
        get: (target, name) =>{
            if (name in target) {
                return target[name]
            }
            else if (name in target.__element) {
                return intercept(target.__element, name);
            }
        },
        set: (target, name, value) => {
            if (name in target) {
                target[name] = value;
            }
            else if(name == "style")
            {
                target.set_style(value)
            }
            else if (name in target.__element) {
                target.property(name, value);
            }
            return true;
        }

    });
    return proxy;
}

export function query(selector) {
    return new el(document.querySelector(selector));
}

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
        "ref": ([obj,key]) => {
            
            obj[key] = el;

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
        "model": ([obj,key]) =>
        {
            el.model(obj,key)
        }

    }

    if(props)
    {
        for(const [key, value] of Object.entries(props))
        {
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
            el.child(child)
        }
    }
    return el;
};


export const Fragment = (props, ...children) => undefined