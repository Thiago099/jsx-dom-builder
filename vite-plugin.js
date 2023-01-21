module.exports = () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'JSXDOM',
            jsxFragment: 'Fragment',
            jsxInject: `import { element, effect, JSXDOM, Fragment } from "jsx-dom-builder"\n`,
        }
    })
  })
  