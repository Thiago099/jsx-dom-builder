import * as acorn from "acorn";
import * as escodegen from "escodegen";

export const pattern = {
    "type": "CallExpression",
    "callee": {
        "name": "JSXDOM"
    }
}

import { findPattern } from "./pattern_matching.js"
import { replace_reactive,replace_reactive_prop, replace_model } from "./inject_reactivity.js"

export function parse(code)
{
    const parsed = acorn.parse(code, {ecmaVersion: "latest",sourceType: "module"});

    const elements = findPattern(parsed,pattern);

    for(const element of elements)
    {
        var properties = element.arguments[1].properties;
        if(properties)
        {
            for(const property of properties)
            {
                property.value = replace_model(property);
                property.value = replace_reactive_prop(property);
            }
        }
        for(var i = 2; i < element.arguments.length; i++)
        {
            element.arguments[i] = replace_reactive(element.arguments[i]);
        }
    }
    return escodegen.generate(parsed)
}