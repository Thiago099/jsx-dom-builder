
export function findPattern(object, pattern)
{
    const found = [];
    _findPattern(object);
    return found;
    function _findPattern(input)
    {
        if(Array.isArray(input))
        {
            for(const item of input)
            {
                _findPattern(item);
            }
        }
        else if(input && typeof input === "object")
        {
            if(matchPattern(input, pattern)) found.push(input)
            for(const [key,item] of Object.entries(input))
            {
                _findPattern(item);
            }
        }
    }

}
export function matchPattern(input, pattern)
{
    if(typeof pattern === "object")
    {
        if(!input || typeof input !== "object") return false
        for(const [key,item] of Object.entries(pattern))
        {
            if(!input.hasOwnProperty(key)) return false
            if(!matchPattern(input[key], item)) return false
        }
    }
    else
    {
        if(input !== pattern) return false
    }
    return true;
}