# jsx-dom-builder

## Description
This is a JSX library, with reactivity, components, input synchronizing and you can fully edit every JSX variable and append it to any element.
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
and build it with
```
npm run build
```
# Example

## From

![image](https://user-images.githubusercontent.com/66787043/215284801-698eb143-87e0-4983-ac0b-34f6f3e85688.png)


[Web page with this interactive example](https://thiago099.github.io/jsx-dom-builder-form-example/)

[Full source code](https://github.com/Thiago099/jsx-dom-builder-form-example)


```js

// import the style
import './style.css'

// The effect object can be used just like a normal object.
// It will update the the dom
var data = state(
{
    name:"pedro",
    age:20
});


// A sample submit method that is called when you click on the button
function submit()
{
    alert("Submit logic here")
}

const app = 
<div class="main-container">
    <div>
        <div class="input-group">
            <div class="input-container half">
                <label>Name:</label>
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
        {/* You can add value to the dom that will update in the same
          * occasions as the model */}
        <div> Name: {data.name} </div>
        <div> Age: {data.age} </div>
    </div>
    <div class="tooltip">You can also add them directly in the element that they will update either using effect or manually using the "element.$update()".</div>
    <div class="footer-button-container">
        { /* You can add events, using the property on: and the name of the event */ }
        <button on:click={submit}> Submit </button>
    </div>
</div>

// The $parent function will append an element to another element, in this case the body
app.$parent(document.body)
```

## Editing the element after its creation and an alternative to state

you can edit every object after its creation, and instead of using state you can manually update the elements

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

app
.$style('background-color', background)
.$style('color', foreground)
.$on('click', () => {
    const [random_color,inverse] = generate_random_colors()
    foreground = random_color
    background = inverse
    // The update function does manually what the effect does automatically, after calling the update function
    // The dynamic part of the element and its children will be updated
    app.$update()
})

app.$parent(document.body)
```


## other examples

### ref

```js

import './style.css'
// If you don't want to set the attributes directly on the html
// you can use ref to acess a element that is not the root of your subtree

const title = ref()
const app =
<div>
    <h1 ref={title}>Hello, world!</h1>
</div>

var color = "red"
// Then you can edit any of its attributes just like you would with the root
title
    .$style("color", color)
    .$on("click",()=>{
        color = "blue"
        title.$update()
    })

app.$parent(document.body)
```

### Components

you can create components with the following syntax
```js
export default function Card({title}, ...children) {
    return (
    <div class="card">
        <div class="card-header">
            {title}
        </div>
        <div class="card-body">
            {children}
        </div>
    </div>
    )
}
```
then you can use it like that
```js
import Card from '@/components/Card.jsx'
const app = <div>
    <Card title="My card title">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
        <p>Quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </Card>
</div>
```

the functions you can call for each element
```js
my_element
    // adds a class to a element
    .$class("my-class")
    // If the value is an expression, the class will be replaced by the current value every time the element updates
    .$class(my_var)
    
    // Appends the element to a parent that can be either a dom element or a jsx-dom-builderjsx-dam-builder element
    .$parent(element2)
    
    // Listens to a event (calls the element. addEventListener)
    .$on("click",e=>{
        console.log("element1 was clicked")
    })
    
    // Add children to an element that can be either a dom element, jsx-dom-builder element, string, object, or an array of either of them combined
    .$child(<div></div>)
    
    // Synchronizes the value to a variable
    .$model(data)
    
    // Replaces the element style for the following style
    // If the value is an expression, it will be replaced every time the element updates
    .$style("background-color:red")
    
    // Sets a single instance of the style of the element
    // Will also update
    .$style("color","blue")
    
    // Removes the element from the dom
    .$remove()
```
