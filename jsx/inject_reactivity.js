
import { matchPattern } from "./pattern_matching.js"
import { pattern } from "./parse.js"

export const input_blacklist = ["model","effect","ref","parent","on","mounted","unmounted","get_computed_style"]
export function replace_reactive_prop(key,input)
{
    if(input_blacklist.includes(key)) return input
    return replace_reactive(input)
}
export function replace_reactive(input)
{
    if(input.type == "Literal") return input
    if(input.type == "ArrowFunctionExpression") return input
    if(matchPattern(input, pattern)) return input

    return {
        "type": "ArrowFunctionExpression",      
        "expression": true,
        "generator": false,
        "async": false,
        "params": [],
        "body": input
    }
}
export function replace_model(key,input)
{
    if(key != "model")
    {
        return input
    }
    return {
        "type": "ArrayExpression",
        "elements": [
            {
                "type": "ArrowFunctionExpression",
                "expression": true,
                "generator": false,
                "async": false,
                "params": [],
                "body": input
            },
            {
                "type": "ArrowFunctionExpression",
                "expression": true,
                "generator": false,
                "async": false,
                "params": [
                    {
                        "type": "Identifier",
                        "name": "_model_value"    
                    }
                ],
                "body": {
                    "type": "AssignmentExpression",
                    "operator": "=",        
                    "left": input,
                    "right": {
                        "type": "Identifier",
                        "name": "_model_value"    
                    }
                }
            }
        ]
    }
}