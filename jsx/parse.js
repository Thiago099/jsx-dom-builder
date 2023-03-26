import * as acorn from "acorn";
import * as escodegen from "escodegen";

export const pattern = {
    "type": "CallExpression",
    "callee": {
        "name": "JSXDOM"
    }
}


export const pattern2 = {
    "type": "CallExpression",
    "callee": {
        "type":"MemberExpression",
        "property":{
            "type":"Identifier",
            "name": /\$.*/
        }
    }
}

export const pattern3 = {
    "type": "AssignmentExpression",
    "left": {
        "type": "MemberExpression",
        "property": {
            "type": "Identifier",
            "name": /\$.*/
        }
    }
}

import { findPattern } from "./pattern_matching.js"
import { replace_reactive,replace_reactive_prop, replace_model,isOnBlacklist } from "./inject_reactivity.js"

export function parse(code)
{
    const parsed = acorn.parse(code, {ecmaVersion: "latest",sourceType: "module"});


    // const ccc = acorn.parse("a.b.c = 10", {ecmaVersion: "latest",sourceType: "module"});
    // console.log(JSON.stringify(ccc,null,2));

    const outside_calls = findPattern(parsed,pattern2);

    for(const outside_call of outside_calls)
    {
        const name = outside_call.callee.property.name;
        if(name == "$model")
        {
            if(outside_call.arguments.length == 1)
            {
                outside_call.arguments[0] = replace_model("model", outside_call.arguments[0])
            }
        }
        else
        if(!isOnBlacklist(name.replace(/\$/,'')))
        {
            for(const index in outside_call.arguments)
            {
                outside_call.arguments[index] = replace_reactive(outside_call.arguments[index]);
            }
        }
    }

    const outside_sets = findPattern(parsed,pattern3);
    
    for(const outside_set of outside_sets)
    {
        const name = outside_set.left.property.name;
        if(!isOnBlacklist(name.replace(/\$/,'')))
        {
            if(!isOnBlacklist(name.replace(/\$/,'')))
            {
                outside_set.right = replace_reactive(outside_set.right);
            }
        }
    }

    const elements = findPattern(parsed,pattern);

    for(const element of elements)
    {
        var properties = element.arguments[1].properties;
        if(properties)
        {
            for(const property of properties)
            {
                if(property.key.type == "Identifier")
                {
                    property.value = replace_model(property.key.name, property.value);
                    property.value = replace_reactive_prop(property.key.name,property.value);
                }
                else if (property.key.type == "Literal")
                {
                    property.value = replace_model(property.key.value, property.value);
                    property.value = replace_reactive_prop(property.key.value,property.value);
                }
            }
        }
        for(var i = 2; i < element.arguments.length; i++)
        {
            element.arguments[i] = replace_reactive(element.arguments[i]);
        }
    }
    return escodegen.generate(parsed)
}