
import { parse } from "./lib/parsecode.js"
export default () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'JSXDOM',
            jsxFragment: 'Fragment',
            jsxInject: `import { ref, element, effect, JSXDOM, Fragment } from "jsx-dom-builder"`,
        }
    }),
    transform(code, id, options) {
        if (id.endsWith('.jsx')) {
            console.log(code);
            code = parse(code);
        }
        return code;
      }
    

})
  