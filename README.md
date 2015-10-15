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
- copy all images in a `imgs/` folder.

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
    },
    img: {
        output: 'public/imgs',   
        extInline: ['gif','png'],   // Extensions to inline
        maxInlineSize: 32 * 1024    // [kB] Inline as data uri images below specified size
                                    // (use 0 to disable, max 32k on ie8)
    }
}
```

Each setting can be overwritten by passing them as an object to the `bower()` function.

Any setting can also be set to `false` to prevent generation and output of those files.

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

Those examples do the same :
- scan your bower files
- concat all css files in a `public/css/plugins.css` file
- concat all js files in a `public/scripts/vendor.js` file
- copy all webfonts in a `fonts/` folder.

```javascript
elixir(function(mix) {
    mix.bower({
        debugging: true,
        css: false,
        js: false,
        font: {
            output: 'public/fonts'
        },
        img: {
            output: 'public/css',
            extInline: ['gif', 'png'],   // Extensions to inline
            maxInlineSize: 32 * 1024    // [kB] Inline as data uri images below specified size
                                        // (use 0 to disable, max 32k on ie8)
        }
    });
});
```
This example does the following:
- scan your bower files
- skips css and js files
- copy all webfonts in a `public/fonts/` folder.
- copy all gif or png images into `public/css` folder.
- inline any of those images which are smaller than 32k.
