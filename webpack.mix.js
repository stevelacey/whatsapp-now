let mix = require("laravel-mix")

require("laravel-mix-tailwind")

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.js("resources/js/app.js", "public/js").react()
   .css("resources/css/app.css", "public/css")
   .tailwind()
