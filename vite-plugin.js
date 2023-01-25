
var bodyRegex = /JSXDOM\(([\s\S]*?)\)/g
var nonEcapsulatedCommas = /,(?![^{}]*})/g


var parameterRegex = /(.*?):(.*)/g
var isOnlyString = /^\s*?"[^"]*"\s*?$/
var isOnlyNumber = /^\s*?\d*\s*?$/


function replaceBody(input,callback)
{
    return input.replace(bodyRegex, (match, body) => {

        const [name, properies, children] = body.split(nonEcapsulatedCommas)
        return "JSXDOM\(" + name + "," + callback(properies, children) + "\)"
    })
}

function conditionalyReactive(x)
{
    if(isOnlyString.test(x))
    {
        return x
    }
    
    if(isOnlyNumber.test(x))
    {
        return x
    }
    return ` () => ${x}`
}


function replaceParameters(code)
{
    return replaceBody(code, (body,children) => {

        var result = body.replace(parameterRegex, (match, variable_name,variable_value) => {
            if(variable_name.trim() == "model")
            {
                return `${variable_name}: [ () => ${variable_value}, _value => ${variable_value} = _value ],`
            }
            return variable_name + ":" + conditionalyReactive(variable_value) + ","
        })

        if(children)
        {
            result += "," +
            children
                .split(",")
                .map(conditionalyReactive)
                .join(",")
        }

        return result
    })
}

module.exports = () => ({
    name: 'dom-builder',
    config: () => ({
        esbuild: {
            jsxFactory: 'JSXDOM',
            jsxFragment: 'Fragment',
            jsxInject: `import { ref, element, effect, JSXDOM, Fragment } from "jsx-dom-builder"`,
        }
    }),
    transform(code, id,options) {
        if (id.endsWith('.jsx')) {
            code = replaceParameters(code)
            console.log(code)
            // code = replaceModel(code)
        }
        return code;
      }
    

})
  