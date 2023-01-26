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



