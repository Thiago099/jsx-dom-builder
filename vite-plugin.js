const path = require('path');
module.exports.jsxDomBuilderVitePlugin = () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'dom',
            jsxFragment: 'Fragment',
            jsxInject: `import { element, effect, dom } from "jsx-dom-builder";`,
        },
        resolve: {
            alias: {
              '@': path.resolve(__dirname, 'src'),
              '~': path.resolve(__dirname)
            }
          },
    })
  })
  