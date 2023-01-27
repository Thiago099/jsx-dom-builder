# jsx-dom-builder

## Description
This is a JSX library, with reactivity, components, input synchronizing and where you can fully edit every JSX variable and append it to any element.
## Instalation

You can get started by running the following commands
```
git clone https://github.com/Thiago099/basic-jsx-dom-builder-project your-project-name
cd your-project-name
npm install
```
you can start the project with
```
npm run dev
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

// the $parent function will append an element to another element, in this case the body
app.$parent(document.body)
```

## you can edit the elements after they are created

![image](https://user-images.githubusercontent.com/66787043/214976038-8a1d6937-6630-4e7b-bcd3-6f83f4a7af72.png)

[Web page with this interactive example](https://thiago099.github.io/jsx-dom-builder-random-color-example/)

[Full source code](https://github.com/Thiago099/jsx-dom-builder-random-color-example)

```js

import './style.css'

function generate_random_colors()
{
    var random_number = Math.floor(Math.random()*16777215);
    var random_color = '#' + random_number.toString(16)
    var inverse = '#' + (16777215-random_number).toString(16)
    return [random_color, inverse]
}

const [random_color,inverse] = generate_random_colors()
var foreground = random_color
var background = inverse

generate_random_colors()

const app = <div class="main-item" draggable>Click on me to change the color</div>

// you can edit the element after its creation on the jsx, that allows a lot of extra interactions that you cant do without it
app
.$style('background-color', background)
.$style('color', foreground)
.$on('click', () => {
    const [random_color,inverse] = generate_random_colors()
    foreground = random_color
    background = inverse
    // the update function does manually what the effect does automatically, after calling the update function
    // the dynamic part of the element and its children will be updated
    app.$update()
})

app.$parent(document.body)
```


## other examples

```js

import './style.css'
// if you dont want to set the attributes directally on the html
// you can use ref to acess a element that is not the root of your subtree

const title = ref()
const app =
<div>
    <h1 ref={title}>Hello, world!</h1>
</div>

var color = "red"
// then you can edit any of its attributes just like you whuld with the root
title
    .$style("color", color)
    .$on("click",()=>{
        color = "blue"
        title.$update()
    })

app.$parent(document.body)
```
