var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var elixir = require('laravel-elixir');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var changed = require('gulp-changed');
var base64 = require('gulp-base64');
var test = require('gulp-if');
var ignore = require('gulp-ignore');
var getFileSize = require("filesize");

var task = elixir.Task;
var config = elixir.config;


var _ = require('lodash');

elixir.extend('bower', function (options) {

    var options = _.merge({
        debugging: false,
        css: {
            minify : true,
            file: 'vendor.css',
            output: config.css.outputFolder ? config.publicPath + '/' + config.css.outputFolder : config.publicPath + '/css'
        },
        js: {
            uglify : true,
            file: 'vendor.js',
            output: config.js.outputFolder ? config.publicPath + '/' + config.js.outputFolder : config.publicPath + '/js'
        },
        font: {
            output: (config.font && config.font.outputFolder) ? config.publicPath + '/' + config.font.outputFolder : config.publicPath + '/fonts'
        },
        img: {
            output: (config.img && config.img.outputFolder) ? config.publicPath + '/' + config.img.outputFolder : config.publicPath + '/imgs',
            extInline: ['gif', 'png'],
            maxInlineSize: 32 * 1024 //max 32k on ie8
        }
    }, options);

    var files = [];

    if(options.css  !== false) files.push('bower-css');
    if(options.js   !== false) files.push('bower-js');
    if(options.font !== false) files.push('bower-fonts');
    if(options.img  !== false) files.push('bower-imgs');

    new task('bower', function () {
        return gulp.start(files);
    });

    gulp.task('bower-css', function () {
        var onError = function (err) {
            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files CSS Compilation Failed!",
                message: "Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(mainBowerFiles({debugging: options.debugging}))
            .on('error', onError)
            .pipe(filter('**/*.css'))
            .pipe(test(options.img.maxInlineSize > 0, base64({
                extensions: options.img.extInline,
                maxImageSize: options.img.maxInlineSize, // bytes 
                debug: options.debugging,
            })))
            .pipe(concat(options.css.file))
            .pipe(test(options.css.minify,minify()))
            .pipe(gulp.dest(options.css.output))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'CSS Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));

    });

    gulp.task('bower-js', function () {
        var onError = function (err) {

            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files JS Compilation Failed!",
                message: "Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(mainBowerFiles({debugging: options.debugging}))
            .on('error', onError)
            .pipe(filter('**/*.js'))
            .pipe(concat(options.js.file))
            .pipe(test(options.js.uglify,uglify()))
            .pipe(gulp.dest(options.js.output))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'Javascript Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));

    });
    
    gulp.task('bower-fonts', function(){
        
        var onError = function (err) {

            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files Font Copy Failed!",
                message: "Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };
        
        return gulp.src(mainBowerFiles({
                debugging: options.debugging,
                filter: (/\.(eot|svg|ttf|woff|woff2|otf)$/i)
            }))
            .on('error', onError)
            .pipe(changed(options.font.output))
            .pipe(gulp.dest(options.font.output))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'Font Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));
    });

    gulp.task('bower-imgs', function () {

        var onError = function (err) {

            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files Images Copy Failed!",
                message: "Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        var isInline = function (file) {
            
            var filesize = file.stat ? getFileSize(file.stat.size) : getFileSize(Buffer.byteLength(String(file.contents)));
            var fileext = file.path.split('.').pop();
            
            if (options.debugging)
            {
                console.log("Size of file:" + file.path + " (" + 1024*parseFloat(filesize) +" / max="+options.img.maxInlineSize+")");
            }
            
            return options.img.extInline.indexOf(fileext) > -1 && 1024*parseFloat(filesize) < options.img.maxInlineSize;
        }

        return gulp.src(mainBowerFiles({
            debugging: options.debugging,
            filter: (/\.(png|bmp|gif|jpg|jpeg)$/i)
            }))
            .on('error', onError)
            .pipe(ignore.exclude(isInline)) // Exclude inlined images
            .pipe(changed(options.img.output))
            .pipe(gulp.dest(options.img.output))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'Images Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));

    });

});
