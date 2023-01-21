# jsx-dom-builder

## Description

This is a library that allows to use jsx to create a wrapper to the dom elements, more info below.
## Instalation

Create a vite vanilla app with the command:
```
npm create vite
```
open the project folder and run the following commands
```
npm install
npm install jsx-dom-builder
```

create the `vite.config.js` in the root directory of your project, with the following code:

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite"
import  jsxDomBuilderVitePlugin  from "jsx-dom-builder/vite-plugin"
// custom jsx pragma
export default defineConfig({
    plugins:[jsxDomBuilderVitePlugin()],
    // make the @ as a alias to the src folder (opitional but recomended)
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    }
})
```
# Basics

## Creating
you can create a element using either jsx or the element funtion, both have the same result object
```js
const element1 = 
<div class="element1"></div>

const element2 = 
    element("div")
    .class("element2")
```
## Updating

you can automaticaly update using the effect clause wich can be either in the html or in the builder
```js
const data = effect({color:"red"})
const element1 = <input type="text" effect={data} value={()=>data}/>
```

```js
const data = effect({color:"red"})
const element1 = <input type="text"/>

element1
    .effect(data)

element1.value = ()=> data.color
```

alternativily you can update manually using the update function that will do the same but manualy

```js
var color = "red"
const element1 = <div class={()=>color}>{()=>color}</div>

color = "blue"
element1.update()
```
you can also define any propery to the element just like you whuld with the regular dom (note that if you want add events you will have to use the event function listed below)

```js
const element3 = <input type="text"/>
element3.value = "test"

var a = 10
element3.value = () => a
```

here is some other options that you have
```js


element1
    .class("my-class")
    // appends the element to a parent that can be either a dom element or a jsx-dom-builder element
    .parent(element2)
    // listens to a event (calls the element.addEventListener)
    .event("click",e=>{
        console.log("element1 was clicked")
    })
    // add children to a element that can be either a dom element, jsx-dom-builder element, string, object, or a array of either of them combined
    .child(<div></div>)
    // gets and sets the value of a element, mostly used for forms
    .model(data,"bar")
    // replaces the element style for the following style
    .set_style("background-color:red")
    // sets a single instance of style to the element
    .set_single_style("color","blue")
    // removes the element from the dom
    .remove()

```
# Application Examples

## Edit property example

Here is a example of a page with a red square and a button, when you click the button the red square turns blue

![image](https://user-images.githubusercontent.com/66787043/213872010-a6c7d213-26f3-46c7-9096-16eea23f32e4.png)


[page with this example content](https://thiago099.github.io/new-jsx-dom-builder-vite-examples/)

### the main way you whuld aproach this problem
```js
import "./style.css"

const ref = {}

var data = effect({color:"red"})

const app = 
<div class="container" effect={data}>
    <div 
        class="square" 
        ref={[ref,"colored_square"]} 
    />
    <button 
        ref={[ref,"make_it_blue"]}
        class="button"
    >
        make the square blue
    </button>
</div>

ref.colored_square.style.backgroundColor = () => data.color

ref.make_it_blue.event("click", () => {
    data.color = "blue"
})

app.parent(document.body)
```
### Without using effect
```js
import "./style.css"

const ref = {}

var color = "red"

const app = 
<div class="container">
    <div 
        class="square" 
        ref={[ref,"colored_square"]} 
    />
    <button 
        ref={[ref,"make_it_blue"]}
        class="button"
    >
        make the square blue
    </button>
</div>

ref.colored_square.style.backgroundColor = () => color

ref.make_it_blue.event("click", () => {
    color = "blue"
    app.update()
})

app.parent(document.body)
```

### Without reactivity

```js
import "./style.css"

const ref = {}

const app = 
<div class="container">
    <div 
        class="square" 
        ref={[ref,"colored_square"]} 
    />
    <button 
        ref={[ref,"make_it_blue"]}
        class="button"
    >
        make the square blue
    </button>
</div>

ref.colored_square.style.backgroundColor = "red"

ref.make_it_blue.event("click", () => {
    ref.colored_square.style.backgroundColor = "blue"
    app.update()
})

app.parent(document.body)
```

## Model example


![image](https://user-images.githubusercontent.com/66787043/213872553-ddc9521d-f28e-4b1f-9ac4-70fad882ad8b.png)

[page with this example content](https://thiago099.github.io/jsx-dom-builder-model-example/)

```js
import './style.css'
const ref = {}
var data = effect({text:"hello world"})

const app = 
<div class="container" effect={data}>
    <h1>{() => data.text}</h1>
    <input type="text" class="input" model={[data,"text"]} />
</div>

app.parent(document.body)
```
## Dynamic html example

![image](https://user-images.githubusercontent.com/66787043/213873411-1a35a89a-2a11-4774-b333-79e5fdfaf703.png)


[page with this example content](https://thiago099.github.io/jsx-dom-builder-dynamic-content-example/)

```js
import './style.css'
const ref = {}
var data = effect({list:[],text:""})

const app = 
<div class="container" effect={data}>
    <div class="separator">
        <button class="button" ref={[ref,"addButton"]}>Add</button>
        <input class="input" type="text" model={[data,"text"]}/>
    </div>
    <div class="separator">
    <ul>
        {() => data.list.map(item=> <li>{item}</li>)}
    </ul>
    </div>
</div>

ref.addButton.event("click",()=>{
    data.list.push(data.text)
    data.text = ""
})
app.parent(document.body)
```

## Other examples

![image](https://user-images.githubusercontent.com/66787043/202039923-39d4c73f-73ba-4aac-b784-ea49e45aa7b8.png)

[page with this example content](https://thiago099.github.io/jsx-dom-builder-vite-example/) 

[source](https://github.com/Thiago099/jsx-dom-builder-vite-example)

```js
import "./style.css"
import Counter from "./components/counter.jsx"
import Title from "./components/title.jsx"
import RefExample from "./components/ref-example.jsx"

const app = 
<div class="container">
    <Title text="vite + jsx-dom-builder"/>
    <Counter />
    <RefExample />
</div>

app.parent(document.body)
```



Just like to react you can create a component:

```js
export default function Title( { text } )
{
    const title = 
        <h1 
            class="title" 
        >
            {text}
        </h1>
    return title
}

```

Every JSX elements are dom-builder elements and, here is what you can do with them: [here](https://www.npmjs.com/package/@thiago-kaique/dom-builder).

```js
export default function Counter()
{
    const data = effect( { count: 0 } )

    const button = 
        <button 
            class="button" 
            effect={data}
        >
            Count is: { () => data.count }
        </button>

    button.event("click", () => data.count++ )

    return button
}
```
You can also pass an object in the ref property and the element will store a entry with its id as key and, its dom-builder element as the value;
```js
export default function RefExample()
{

    const ref = {}

    const container = 
    <div>
        <button class="button" ref={[ref,"main"]}>Main</button>
        <button class="button" ref={[ref,"secondary"]}>Secondary</button>
    </div>

    ref.main.event("click", () => alert("Main button clicked") )
    ref.secondary.event("click", () => alert("Secondary button clicked") )

    return container
}
```
