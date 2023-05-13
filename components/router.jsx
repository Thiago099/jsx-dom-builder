

export {Router}

function trimSlashes(str) {
    // Remove slashes from the start of the string
    while (str.charAt(0) === '/') {
      str = str.slice(1);
    }
  
    // Remove slashes from the end of the string
    while (str.charAt(str.length - 1) === '/') {
      str = str.slice(0, -1);
    }
  
    return str;
  }

function Router(routes)
{
    var container = <div></div>
    var currentPath = window.location.pathname;
    navigatePath()
    //on popstate
    window.onpopstate = function(event) {
        navigatePath()
    };
    function navigatePath()
    {
        currentPath = window.location.pathname;
        var path = trimSlashes(currentPath).split('/').filter(x => x !== "")
        container.innerHTML = ""

        for(var route in routes)
        {
            var routePath = route.trim('/').split('/').filter(x => x !== "")
            var parameters = {go}
            if(routePath.length === path.length)
            {
                var match = true
                for(var i = 0; i < routePath.length; i++)
                {
                    if(routePath[i].startsWith('{') && routePath[i].endsWith('}'))
                    {
                        parameters[routePath[i].replace('{','').replace('}','')] = path[i]
                        continue
                    }
                    else if(routePath[i] !== path[i])
                    {
                        match = false
                        break
                    }
                }
                if(match)
                {
                    routes[route]()
                    .then(module => {
                        module.default(parameters).$parent(container)
                    })
                    return
                }
            }
        }
        if(routes["404"] !== undefined) 
        {
            routes["404"]()
            .then(module => {
                module.default().$parent(container)
            })
        }

    }

    function go(path)
    {
        if(path.trim() === "") path = "/"
        window.history.pushState({}, path, path);
        currentPath = path
        navigatePath()
    }
    return container
}