export function element(type) {
    return build_proxy(new el(type));
}

function build_proxy(element)
{
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

    const proxy = new Proxy(element, {
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
                target.$set_style(value)
            }
            else if (name in target.__element) {
                target.$property(name, value);
            }
            return true;
        }

    });
    return proxy
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
        this.__states = new Set();

        this.__unmounted_events = [];
        this.__mounted_events = [];
        this.__parent = null
    }
    __update()
    {
        for(const event of this.__events)
        {
            event()
        }
    }

    $click()
    {
        this.__element.click()
        return this
    }
    $then(callback)
    {
        setTimeout(() => {
            callback()
        }, 0)
    }


    $find(selector)
    {
        var list = []

        if(this.__element.matches(selector))
        {
            list.push(build_proxy(this))
        }
        
        for(const child of this.__children)
        {
            list = list.concat(child.$find(selector))
        }

        return list

    }

    
    $update()
    {
        for(const event of this.__events)
        {
            event()
        }
        for(const child of this.__children)
        {
            child.$update()
        }
    }

    __parseInput(input)
    {
        if(input && input.key == "e0b8fc2b-fc7e-4786-bc05-b85187a8d065")
        {
            for(const object of input.elements)
            {
                if(object && object.__subscribe)
                {
                    this.__states.add(object);
                    object.__subscribe(this)
                }
            }
            return input.expression
        }
        return input
    }

    __observeParent()
    {
        setTimeout(() => {
            for(const event of this.__mounted_events)
            {
                event()
            }
        }, 0)
        const observer = new MutationObserver((mutations) => {
            for(const mutation of mutations)
            {
                if (mutation.type === 'childList' && mutation.removedNodes.length) {
                    for (const removedNode of mutation.removedNodes) {
                        if (removedNode === this.__element) {
                            this.__unsubscribe()
                            for(const event of this.__unmounted_events)
                            {
                                event()
                            }
                        }
                    }
                }
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    for (const removedNode of mutation.addedNodes) {
                        if (removedNode === this.__element) {
                            this.__subscribe()
                            for(const event of this.__mounted_events)
                            {
                                event()
                            }
                        }
                    }
                }
            }
        });
        observer.observe(this.__element.parentElement, { childList: true });
    }
    __subscribe()
    {
        if(this.__states)
        {
            for(const state of this.__states)
            {
                state.__subscribe(this)
            }
        }
    }
    __unsubscribe()
    {
        for(const child of this.__children) child.__unsubscribe()
        if(this.__states)
        {
            for(const state of this.__states)
            {
                state.__unsubscribe(this)
            }
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

    __handleEffect(isReactive, callback)
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

    $if(condition)
    {
        condition = this.__parseInput(condition)
        this.__handleEffect(this.__isReactive(condition),()=>{
            const conditon_parsed = this.__handleFunction(condition)
            this.$style("display",conditon_parsed?"":"none")
        })
        
        return this
    }

    $class(name, value = true)
    {
        name = this.__parseInput(name)
        value = this.__parseInput(value)
        var previous = null
        this.__handleEffect(this.__isReactive(name,value),()=>{
            const classes = this.__handleFunction(name)
            if(classes)
            {
                if(typeof classes === "object")
                {
                    for(const key in classes)
                    {
                        if(classes[key])
                        {
                            this.__element.classList.add(key);
                        }
                        else
                        {
                            this.__element.classList.remove(key);
                        }
                    }
                }
                else
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
            }
        })
        return this
    }

    get parentElement()
    {
        return this.__parent
    }

    $parent(object)
    {
        this.__parent = object
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

    $parentBefore(object)
    {
        this.__parent = object;
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

    $on(event, callback)
    {
        this.__element.addEventListener(event, callback);
        return this
    }

    $mounted(callback)
    {
        this.__mounted_events.push(callback)
    }

    $unmounted(callback)
    {
        this.__unmounted_events.push(callback)
    }
    
    $property(name, value)
    {
        name = this.__parseInput(name)
        value = this.__parseInput(value)

        this.__handleEffect(this.__isReactive(name,value),()=>{
            this.__element[this.__handleFunction(name)] = this.__handleFunction(value);
        })
        return this
    }

    $style(value, alt = null)
    {
        if(alt)
        {
            this.__style(value, alt)
            return this
        }
        value = this.__parseInput(value)
        this.__handleEffect(this.__isReactive(value),()=>{
            var new_style = this.__handleFunction(value)
            if(typeof new_style === "object")
            {
                for(const key in new_style)
                {
                    this.__element.style[key] = new_style[key];
                }
            }
            else
            {

                const styles = new_style.split(';').filter((style) => style.length > 0);
                this.__element.style = {}
                for(const style of styles) {
                    const [key, value] = style.split(':');
                    this.__element.style[key] = this.__handleFunction(value);
                }
            }
        })
        return this
    }

    __style(key, value)
    {
        key = this.__parseInput(key)
        value = this.__parseInput(value)
        this.__handleEffect(this.__isReactive(key,value),()=>{
            this.__element.style[this.__handleFunction(key)] = this.__handleFunction(value);
        })
        return this
    }

    $get_computed_style(name)
    {
        return window.getComputedStyle(this.__element).getPropertyValue(name)
    }

    $html(value)
    {
        value = this.__parseInput(value)
        this.__handleEffect(this.__isReactive(value),()=>{
            this.__element.innerHTML = this.__handleFunction(value)
        })
        return this
    }

    $child(value)
    {
        value = this.__parseInput(value)
        var container;
        if(this.__isReactive(value))
        {
            container = element("span").$parent(this)
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
                if(item == null) return () => {}
                if(item.__element !== undefined)
                {
                    item.$parent(container)
                    return () => item.$remove()
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

    $remove()
    {
        this.__parent = null
        this.__element.remove()
        return this
    }

    $model([get, set])
    {
        this.$property("value", get)
        this.$on("input", e => set(e.target.value))
        return this
    }

}

