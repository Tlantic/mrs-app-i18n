# MRS App i18n

MRS App i18n module

## How to compile
Execute this command in the command line:
```
$ npm install
```
You're done! Simple, eh?

## How to develop
Compile is very simple. Just execute in command line:
```
$ grunt
```
Your code will be tested, compiled and minified into *dist* folder

## How to install
1. Include in your code (js or min.js) in index.html (included in *dist* folder)
```JavaScript
<script type="text/javascript" src="mrs-app-ga.min.js"></script>
```

2. Include angular dependency in your module declaration
```JavaScript
angular.module("MyApp", ["MRS.App.i18n"]);
```

3. Configure your configuration file
```JavaScript
angular.module("MRS.App.i18n").constant("$mrsappi18nConfig", {
	"resources": {
    	"path": "i18n/"
	}
});
```

4. Set default language in app init
```JavaScript
app.run(["i18nTranslate",
    function myAppRun($i18n) {
    
        $i18n.basePath = "i18n/"; // if your resources are well configured, you shouldn't need this
        $i18n.setDefaultLanguage('pt-pt', function onSuccess () {
            console.log("### Language loaded");
        });

    }
]);
```

5. Make sure you have created your language file (see next section)

## How to use
This module is available by service and filter.

First of all, we need to configure a language file.

### Language file
Language files must be named according to this rule:
```
resources.LANGUAGE.json
```

Example:
* resources.pt-pt.json
* resources.pt-br.json
* ...

A language file is a json file with key-value content, like this:
```JSON
{
    "hello": "Hello!",
    "hello_name": "Hello {0}!",
    "bye": "Hope to see you again!"
}
```

### Service
Translation service is available to use in your controllers.

```JavaScript
app.controller('myController', ['i18nTranslate, function myController($i18n) {
    
    var helloMessage = $i18n.getTerm('hello'); // Hello!
    var helloMessageName = $i18n.getTerm('hello_name', undefined, 'John'); // Hello John!
    
}]);
```

### Filter
Translation could be made using a *i18n* filter in your HTML code

```HTML
<span>{{ 'hello':i18n }}</span>
```