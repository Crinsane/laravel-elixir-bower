laravel-elixir-bower
====================

Elixir Wrapper Around Bower

```
var elixir = require('laravel-elixir');

require('laravel-elixir-bower');

elixir(function(mix) {
    mix.bower()
       .routes()
       .events();
});
```

This will scan your bower files and concat all css files, by default, in a `css/vendor.css` file. And all js files in a `js/vendor.js` file.

These settings can be overwriten by passing them to the `bower()` function.

```
elixir(function(mix) {
    mix.bower('styles.css', 'public/assets/css', 'scripts.js', 'public/assets/js');
});
```