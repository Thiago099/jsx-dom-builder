module.exports = () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'JSXDOM',
            jsxFragment: 'Fragment',
            jsxInject: `import { ref, element, effect, JSXDOM, Fragment } from "jsx-dom-builder"\n`,
        }
    })
  })
  