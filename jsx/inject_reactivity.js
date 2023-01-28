
import { matchPattern, findPatternShallow } from "./pattern_matching.js"
import { pattern } from "./parse.js"

const input_blacklist = [
    "model",
    "ref",
    "parent",
    "parentBefore",
    "get_computed_style",
    "on",
    /on:.+/,
    "mounted",
    "unmounted",
    "get_computed_style"
]

const state_pattern = {
    "type": "MemberExpression",
    "object": { "type": "Identifier"} 
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
export function replace_reactive(input)
{
    if(input.type == "Literal") return input
    if(matchPattern(input, pattern)) return input
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

function removeDuplicates(arr, ...prop) {
  return arr.filter((obj, pos, arr) => {
    return arr.map(mapObj =>
      prop.map(mapProp => mapObj[mapProp]).join('==')).indexOf(
      prop.map(mapProp => obj[mapProp]).join('==')) === pos;
  });
}

function parseIdentifier(object)
{
  return {obj:object.property.name,prop:object.object.name,data:{
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
          "name": "property"
        },
        "value": {
          "type": "Literal",
          "value": object.property.name,
          // "raw": "\"#p#>R+@cLCz2?V>Ct=df:^u!rK.,QKW*\""
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
          "name": "object"
        },
        "value": object.object,
        "kind": "init"
      },
    ]
  }
  }

}

function buildReactiveObject(input)
{
  const identifiers = removeDuplicates(findPatternShallow(input,state_pattern).map(x=>parseIdentifier(x)), "obj", "prop").map(x=>x.data);
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
              "value": "#p#>R+@cLCz2?V>Ct=df:^u!rK.,QKW*",
              "raw": "\"#p#>R+@cLCz2?V>Ct=df:^u!rK.,QKW*\""
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