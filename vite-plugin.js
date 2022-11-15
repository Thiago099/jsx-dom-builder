const path = require('path');
module.exports = () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'dom',
            // jsxFragment: 'Fragment',
            jsxInject: `import { element, effect, dom } from "jsx-dom-builder";`,
        }
    })
  })
  