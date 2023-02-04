
import { matchPattern, findPatternShallow, findPattern } from "./pattern_matching.js"
import { pattern } from "./parse.js"

const input_blacklist = [
    "model",
    "ref",
    "parent",
    "parentBefore",
    "get_computed_style",
    "find",
    //"then",
    "on",
    /on:.+/,
    "mounted",
    "unmounted",
    "get_computed_style"
]

const state_pattern = {
    "type": "MemberExpression",
    "property": { "type": "Identifier"} 
}

export function isOnBlacklist(key)
{
    for(const item of input_blacklist)
    {
        if(typeof item == "string")
        {
            if(item == key) return true
        }
        else if(item instanceof RegExp)
        {
            if(item.test(key)) return true
        }
    }
    return false
}
export function replace_reactive_prop(key,input)
{
    if(isOnBlacklist(key)) return input
    return replace_reactive(input)
}
function isStatic(input)
{
  if(input.type == "ArrayExpression") return input.elements.every(x => isStatic(x))
  if(input.type == "ObjectExpression") return input.properties.every(x => isStatic(x.value))
  if(input.type == "Literal") return true
  if(matchPattern(input, pattern)) return true
  return false
}
export function replace_reactive(input)
{

  if(isStatic(input)) return input
    return handleReactivity(input)
}
function handleReactivity(input)
{
  if(input.type == "ArrowFunctionExpression") return buildReactiveObject(input)
  return buildReactiveObject({
      "type": "ArrowFunctionExpression",      
      "expression": true,
      "generator": false,
      "async": false,
      "params": [],
      "body": input
  })
}



function buildReactiveObject(input)
{
  const identifiers = findPatternShallow(input,state_pattern).map(x=>
    {
      return  {
          "type": "ConditionalExpression",
          "start": 0,
          "end": 52,
          "test": {
            "type": "BinaryExpression",
            "start": 0,
            "end": 30,
            "left": {
              "type": "UnaryExpression",
              "start": 0,
              "end": 14,
              "operator": "typeof",
              "prefix": true,
              "argument": x.object
            },
            "operator": "!==",
            "right": {
              "type": "Literal",
              "start": 19,
              "end": 30,
              "value": "undefined",
              "raw": "'undefined'"
            }
          },
          "consequent":x.object,
          "alternate": {
            "type": "Identifier",
            "start": 43,
            "end": 52,
            "name": "undefined"
          }
        }
      }
    );
  console.log(identifiers)
    return  {
      "type": "ObjectExpression",
      "start": 81,
      "end": 167,
      "properties": [
        {
          "type": "Property",
          "method": false,
          "shorthand": false,
          "computed": false,
          "key": {
            "type": "Identifier",
            "name": "key"
          },
          "value": {
            "type": "Literal",
            "value": "e0b8fc2b-fc7e-4786-bc05-b85187a8d065",
            "raw": "\"e0b8fc2b-fc7e-4786-bc05-b85187a8d065\""
          },
          "kind": "init"
        },
        {
          "type": "Property",
          "method": false,
          "shorthand": false,
          "computed": false,
          "key": {
            "type": "Identifier",
            "start": 115,
            "end": 125,
            "name": "expression"
          },
          "value": input,
        "kind": "init"
      },
        {
          "type": "Property",
          "method": false,
          "shorthand": false,
          "computed": false,
          "key": {
            "type": "Identifier",
            "name": "elements"
          },
          "value": {
            "type": "ArrayExpression",
            "elements": identifiers
          },
          "kind": "init"
        }
      ]
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
        buildReactiveObject({
          "type": "ArrowFunctionExpression",      
          "expression": true,
          "generator": false,
          "async": false,
          "params": [],
          "body": input
      }),
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