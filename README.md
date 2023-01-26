# jsx-dom-builder

## Description

This is a library that allows to use jsx to create a wrapper to the dom elements.
## Instalation

You can get started by running the following commands
```
git clone https://github.com/Thiago099/jsx-dom-builder-vite-example
cd jsx-dom-builder-vite-example
npm install
```
you can start the project with
```
npm run dev
```

### Alternatively, you can install it manually

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
export default defineConfig({
    // this adds the plugin necessáry for this library to work
    plugins:[jsxDomBuilderVitePlugin()],
    // make the @ as a alias to the src folder (opitional but recomended)
    resolve: {
        alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    }
})
```
# Example

## From

![image](https://user-images.githubusercontent.com/66787043/214968406-b38bcd10-20a6-4139-9797-83aac3bd56b1.png)


[Web page with this interactive example](https://thiago099.github.io/jsx-dom-builder-form-example/)

[Full source code](https://github.com/Thiago099/jsx-dom-builder-form-example)

first you create a reactive object that wi
```js

// import the style
import './style.css'

// the effect object can be used just like a normal object.
// it will update the elements and its children if they have the effect property, or $effect function
var data = effect(
{
    name:"pedro",
    age:20
});


// sample submit method that is called when you click on the button
function submit()
{
    alert("Submit logic here")
}

const app = 
<div effect={data} class="main-container">
    <div>
        <div class="input-group">
            <div class="input-container half">
                <label>Name:</label>
                {/* the model propery and the $model function will sync any variable with a input
                  * note that to update the html you need either the effect or the $update function*/}
                <input type="text" model={data.name}></input>
            </div>
            <div class="input-container half">
                <label>Age:</label>
                <input type="text" model={data.age}></input>
            </div>
        </div>
        <div class="tooltip">The model parameter makes the input in sync with any variable.</div>
    </div>
    <div class="card">
        {/* you can add values to the dom that will update in the same
          * ocasions as the model */}
        <div> Name: {data.name} </div>
        <div> Age: {data.age} </div>
    </div>
    <div class="tooltip">You can also add them directly in the element that they will update either using effect or manually using the "element.$update()".</div>
    <div class="footer-button-container">
        { /* you can add events, using the property on: and the name of the event*/ }
        <button on:click={submit}> Submit </button>
    </div>
</div>

// the $parent function will append an element to either another element or a dom element
app.$parent(document.body)
```
