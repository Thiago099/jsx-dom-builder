import ObservableSlim from 'observable-slim';

export function effect(initial_value){
    const callbacks = new Set();

    function subscribe(callback){
        // console.log('subscribe');
        callbacks.add(callback);
    }
    initial_value.__subscribe = subscribe;

    function unsubscribe(callback){
        // console.log('unsubscribe');
        callbacks.delete(callback);
    }
    initial_value.__unsubscribe = unsubscribe;

    const data = ObservableSlim.create(initial_value, true, (changes)=> {

        for(const callback of callbacks){
            callback(data);
        }
    });
    return data
}

class el{
    // constructor
    constructor(name) {
        if(typeof name === "string")
        {
            this.element = document.createElement(name);
        }
        else if(name instanceof HTMLElement)
        {
            this.element = name;
        }
        else
        {
            throw new Error("Invalid element name");
        }
        this.events = [];
        this.children = [];
        this.on = false
    }
    #handleCallbacks = () =>
    {
        for(const event of this.events)
        {
            event()
        }
        for(const child of this.children)
        {
            child.#handleCallbacks()
        }
    }
    effect(data)
    {
        this.data = data;
        this.#subscribe();
        return this
    }

    #observeParent()
    {
        const observer = new MutationObserver((mutations) => {
            for(const mutation of mutations)
            {
                if (mutation.type === 'childList' && mutation.removedNodes.length) {
                    for (const removedNode of mutation.removedNodes) {
                        if (removedNode === this.element) {
                            this.#unsubscribe()
                        }
                    }
                }
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    for (const removedNode of mutation.addedNodes) {
                        if (removedNode === this.element) {
                            this.#subscribe()
                        }
                    }
                }
            }
        });
        observer.observe(this.element.parentElement, { childList: true });
    }
    #subscribe()
    {
        if(this.data)
        {
            this.data.__subscribe(this.#handleCallbacks)
        }
    }
    #unsubscribe()
    {
        for(const child of this.children) child.#unsubscribe()
        if(this.data)
        {
            this.data.__unsubscribe(this.#handleCallbacks)
        }
    }

    #handleFunction(data)
    {
        if(typeof data === "function")
        {
            return data()
        }
        return data
    }

    #handleEffect(isReactive,callback)
    {
        if(isReactive)
        {
            callback()
            this.events.push(callback)
        }
        else
        {
            callback()
        }
    }

    #isReactive(...fields)
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
        if(this.#isReactive(name))
        {
            var previous = this.#handleFunction(name)
        }
        this.#handleEffect(this.#isReactive(name,value),()=>{
            const classes = this.#handleFunction(name)
            if(classes)
            {
                if(this.#handleFunction(value))
                {
                    if(this.#isReactive(name))
                    {
                        if(previous)
                        {
                            this.element.classList.remove(...((previous).split(" ").filter((c) => c.length > 0)))
                        }
                        previous = classes
                    }
                    this.element.classList.add(...((classes).split(" ").filter((c) => c.length > 0)));
                }
                else
                {
                    this.element.classList.remove(...((classes).split(" ").filter((c) => c.length > 0)));
                    previous = null
                }
            }
        })
        return this
    }
    parent(object)
    {
        if(object.element !== undefined)
        {
            object.element.appendChild(this.element);
            object.children.push(this)
        }
        else
        {
            object.appendChild(this.element);
        }
        this.#observeParent();
        return this
    }
    parentBefore(object)
    {
        if(object.element !== undefined)
        {
            if(object.element.firstChild)
            {
                object.element.insertBefore(this.element, object.element.firstChild);
            }
            else
            {
                object.element.appendChild(this.element);
            }
        }
        else
        {
            if(object.firstChild)
            {
                object.insertBefore(this.element, object.firstChild);
            }
            else
            {
                object.appendChild(this.element);
            }
        }
        this.#observeParent();
        return this
    }
    event(event, callback)
    {
        this.element.addEventListener(event, callback);
        return this
    }
    property(name, value)
    {
        this.#handleEffect(this.#isReactive(name,value),()=>{
            this.element[this.#handleFunction(name)] = this.#handleFunction(value);
        })
        return this
    }
    style(name, value = null)
    {
        this.#handleEffect(this.#isReactive(name,value),()=>{
            if(this.#handleFunction(value))
            {
                this.element.style[this.#handleFunction(name)] = this.#handleFunction(value);
            }
            else
            {
                const styles = this.#handleFunction(name).split(';').filter((style) => style.length > 0);
                for(const style of styles) {
                    const [key, value] = style.split(':');
                    this.element.style[key] = value;
                }
            }
        })
        return this
    }

    get_computed_style(name)
    {
        return window.getComputedStyle(this.element).getPropertyValue(name)
    }

    get_property(name)
    {
        return this.element[name]
    }
    
    html(value)
    {
        this.#handleEffect(this.#isReactive(value),()=>{
            this.element.innerHTML = this.#handleFunction(value)
        })
        return this
    }
    child(value)
    {
        var old = null
        this.#handleEffect(this.#isReactive(value),()=>{

            var item = this.#handleFunction(value)

            if(typeof item !== "object")
            {
                item = document.createTextNode(item)
            }

            if(old != item)
            {
                if(old !== null)
                {
                    if(old.element !== undefined)
                    {
                        old.remove()
                    }
                    else
                    {
                        this.element.removeChild(old)
                    }
                }
                
                if(item.element !== undefined)
                {
                    item.parent(this)
                }
                else
                {
                    this.element.appendChild(item)
                }
                old = item
            }
        })
        return this
    }

    text(value)
    {
        const text = document.createTextNode(this.#handleFunction(value));
        this.element.appendChild(text);
        this.#handleEffect(this.#isReactive(value),()=>{
            text.textContent = this.#handleFunction(value)
        })
    }
    remove()
    {
        this.element.remove();
    }

    model(get,set)
    {
        this.property("value", get)
        this.event("input", (e) => {
            set(e.target.value)
        })
    }
}

export function element(type) {
    return new el(type);
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
            el = element("div")
            .style("display:inline-block")
        }
        else
        {
            is_component = true
        }
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
        "ref": (ref) => {

            const find = (name) => Object.entries(props).find(([key, value]) => key === name)

            const id = find("id");
            if(id)
            {
                ref[id[1]] = el;
                return
            }
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
                    el.style(key, value)
                }
            }
            else
            {
                el.style(prop)
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
                    el.property(key, value);
                }
            }
        };
    }
    if(children && !is_component)
    {
        for(const child of children)
        {
            parseChild(child);
            function parseChild(child)
            {
                if(child)
                {
                    if(Array.isArray(child))
                    {
                        for(const c of child)
                        {
                            parseChild(c)
                        }
                    }
                    else 
                    if (typeof child === 'function')
                    {
                        const container = new element("span").parent(el)
                        container.child(child)
                    }
                    else
                    {
                        if(child.element) 
                        {
                            child.parent(el);
                        }
                        else
                        {
                            if(typeof child === "object")
                            {
                                el.text(JSON.stringify(child));
                            }
                            else
                            el.text(child);
                        }
                    }
                }
            }
        }
    }
    return el;
};


export const Fragment = (props, ...children) => undefined