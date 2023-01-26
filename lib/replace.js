
import { matchPattern } from "./pattern.js"
import { pattern } from "./parsecode.js"
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
    if(property.key.name != "model" || property.value.type != "Identifier")
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
                        "start": 77,        
                        "end": 83,
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