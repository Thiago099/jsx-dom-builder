import ObservableSlim from 'observable-slim';

export function effect(initial_value){
    const callbacks = [];

    function subscribe(callback){
        callbacks.push(callback);
    }
    initial_value.__subscribe = subscribe;
    
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
        this.element = document.createElement(name);
        this.events = [];
    }

    effect(data)
    {
        data.__subscribe(() => {
            for(const event of this.events)
            {
                event()
            }
        })
        return this
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
                            this.element.classList.remove(...((previous).split(" ")))
                        }
                        previous = classes
                    }
                    this.element.classList.add(...((classes).split(" ")));
                }
                else
                {
                    this.element.classList.remove(...((classes).split(" ")));
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
        }
        else
        {
            object.appendChild(this.element);
        }
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
    style(name, value)
    {
        this.#handleEffect(this.#isReactive(name,value),()=>{
            this.element.style[this.#handleFunction(name)] = this.#handleFunction(value);
        })
        return this
    }
    
    html(value)
    {
        this.#handleEffect(this.#isReactive(value),()=>{
            this.element.innerHTML = this.#handleFunction(value)
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



export const dom = (name, props, ...children) => {

    const el = element(name);

    const handlers = {
        "ref": (ref) => {
            ref(el);
        },
        "style":(prop)=>{
            const styles = prop.split(';');
            for(const style of styles) {
                const [key, value] = style.split(':');
                el.style(key,value);
            }},
         "class":(prop)=>{
            // if is object
            if(typeof prop === "object")
            {
                for(const [pkey, value] of Object.entries(prop))
                {
                    el.class(pkey,value);
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
                el.property(key, value);
            }
        };
    }
    if(children)
    {
        for(const child of children)
        {
            if(child.element) {
                child.parent(el);
            }
            else
            {
                el.text(child);
            }
        }
    }
    return el;
};

import path from "path"
export const domBuilderVite = () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'dom',
            jsxFragment: 'Fragment',
            jsxInject: `import { element, effect, dom } from "~/dom-builder";`,
        },
        resolve: {
            alias: {
              '@': path.resolve(__dirname, 'src'),
              '~': path.resolve(__dirname)
            }
          },
    })
  })
  