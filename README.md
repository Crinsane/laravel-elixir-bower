laravel-elixir-bower
====================

Elixir Wrapper Around Bower

### Usage

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-bower');

elixir(function(mix) {
    mix.bower();
});
```

This will :
- scan your bower files
- concat all css files in a `public/css/vendor.css` file
- concat all js files in a `public/js/vendor.js` file
- copy all webfonts in a `fonts/` folder.

### Settings

The default settings are the following :

```javascript
{
    debugging: false,               // Enable/Disable verbose output
    css: {
        file: 'vendor.css',         // Merged CSS file
        output: config.cssOutput    // Elixir default css output folder (public/css)
    },
    js: {
        file: 'vendor.js',          // Merged JS file
        output: config.jsOutput     // Elixir default js output folder (public/js)
    },
    font: {
        output: 'public/fonts'      // Web fonts output folder
    }
}
```

Each setting can be overwritten by passing them as an object to the `bower()` function.

### Examples

```javascript
elixir(function(mix) {
    mix.bower({
        debugging: true,
        css: {
            file: 'plugins.css'
        },
        js: {
            output: 'public/scripts'
        }
    });
});
```

```javascript

var options = {};
options.debugging = true;
options.css = {file: 'plugins.css'};
options.js = {output: 'public/scripts'};

elixir(function(mix) {
    mix.bower(options);
});
```

Those examples doe the same :
- scan your bower files
- concat all css files in a `public/css/plugins.css` file
- concat all js files in a `public/scripts/vendor.js` file
- copy all webfonts in a `fonts/` folder.

