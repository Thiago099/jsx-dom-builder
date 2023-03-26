
import { parse } from "./jsx/parse.js"
export default () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'JSXDOM',
            jsxFragment: 'Fragment',
            jsxInject: `import { ref, element, state, JSXDOM, Fragment } from "jsx-dom-builder"`,
        }
    }),
    transform(code, id, options) {
        if (id.endsWith('.jsx')) {
            code = parse(code);
            // console.log(code);
        }
        return code;
      }
    

})
  