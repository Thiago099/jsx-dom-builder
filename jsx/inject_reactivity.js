
import { matchPattern } from "./pattern_matching.js"
import { pattern } from "./parse.js"

const input_blacklist = ["model","effect","ref","parent"]
export function replace_reactive_prop(input)
{
    if(input_blacklist.includes(input.key.name)) return input.value
    return replace_reactive(input.value)
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
export function replace_model(input)
{
    if(input.key.name != "model")
    {
        return input.value
    }
    return {
        "type": "ArrayExpression",
        "start": 66,
        "end": 102,
        "elements": [
            {
                "type": "ArrowFunctionExpression",
                "expression": true,
                "generator": false,
                "async": false,
                "params": [],
                "body": input.value
            },
            {
                "type": "ArrowFunctionExpression",
                "expression": true,
                "generator": false,
                "async": false,
                "params": [
                    {
                        "type": "Identifier",
                        "start": 77,        
                        "end": 83,
                        "name": "_model_value"    
                    }
                ],
                "body": {
                    "type": "AssignmentExpression",
                    "operator": "=",        
                    "left": input.value,
                    "right": {
                        "type": "Identifier",
                        "name": "_model_value"    
                    }
                }
            }
        ]
    }
}