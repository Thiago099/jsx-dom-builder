# jsx-dom-builder

## Description

This is a library that allows to use jsx to create dom  elements, and manipulating them with a builder method

## Instalation

Create a vite vanilla app with the command:
``

npm create vite

npm install jsx-dom-builder

``

create the `vite.config.js` with the following code:

```js
import { defineConfig } from "vite"
import  jsxDomBuilderVitePlugin  from "jsx-dom-builder/vite-plugin"
// custom jsx pragma
export default defineConfig({
  plugins:[jsxDomBuilderVitePlugin()],
})

```

## Example

[gh pages](https://thiago099.github.io/jsx-dom-builder-vite-example/) 

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

![image](https://user-images.githubusercontent.com/66787043/202039923-39d4c73f-73ba-4aac-b784-ea49e45aa7b8.png)

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
        <button class="button" id="main" ref={ref}>Main</button>
        <button class="button" id="secondary" ref={ref}>Secondary</button>
    </div>

    ref.main.event("click", () => alert("Main button clicked") )
    ref.secondary.event("click", () => alert("Secondary button clicked") )

    return container
}
```
