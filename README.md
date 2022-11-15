# jsx-dom-builder

## Description

this is a library that allows to use jsx to create dom elements, and manipulaing them with a builder method

## Instalation

create a vite vanilla app with the command:
``
npm create vite
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

or colne the following repository

https://github.com/Thiago099/jsx-dom-builder-vite-example

## Example

```js
import "./style.css"
import Counter from "./components/counter.jsx"
import Title from "./components/title.jsx"
import RefExample from "./components/ref-example.jsx"

<div parent={document.body} class="container">
    <Title text="vite + jsx-dom-builder"/>
    <Counter />
    <RefExample />
</div>
```
