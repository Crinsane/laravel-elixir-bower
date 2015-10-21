var gulp = require('gulp');
var bowerfiles = require('main-bower-files');
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
var filesize = require('filesize');

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
                message: "Bower Files CSS Compilation Failed! Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(bowerfiles({debugging: options.debugging}))
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
            .pipe(new elixir.Notification('CSS Bower Files Imported!'));

    });

    gulp.task('bower-js', function () {
        var onError = function (err) {

            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files JS Compilation Failed!",
                message: "Bower Files JS Compilation Failed! Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(bowerfiles({debugging: options.debugging}))
            .on('error', onError)
            .pipe(filter('**/*.js'))
            .pipe(concat(options.js.file))
            .pipe(test(options.js.uglify,uglify()))
            .pipe(gulp.dest(options.js.output))
            .pipe(new elixir.Notification('Javascript Bower Files Imported!'));

    });
    
    gulp.task('bower-fonts', function(){
        
        var onError = function (err) {

            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files Font Copy Failed!",
                message: "Bower Files Font Copy Failed! Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };
 
        return gulp.src(bowerfiles({
                debugging: options.debugging,
                filter: (/\.(eot|svg|ttf|woff|woff2|otf)$/i)
            }))
            .on('error', onError)
            .pipe(changed(options.font.output))
            .pipe(gulp.dest(options.font.output))
            .pipe(new elixir.Notification('Font Bower Files Imported!'));
    });

    gulp.task('bower-imgs', function () {

        var onError = function (err) {

            notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files Images Copy Failed!",
                message: "Bower Files Images Copy Failed! Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        var isInline = function (file) {
            
            var fsize = file.stat ? filesize(file.stat.size) : filesize(Buffer.byteLength(String(file.contents)));
            var fext = file.path.split('.').pop();
            
            if (options.debugging)
            {
                console.log("Size of file:" + file.path + " (" + 1024*parseFloat(fsize) +" / max="+options.img.maxInlineSize+")");
            }
            
            return options.img.extInline.indexOf(fext) > -1 && 1024*parseFloat(fsize) < options.img.maxInlineSize;
        }

        return gulp.src(bowerfiles({
            debugging: options.debugging,
            filter: (/\.(png|bmp|gif|jpg|jpeg)$/i)
            }))
            .on('error', onError)
            .pipe(ignore.exclude(isInline)) // Exclude inlined images
            .pipe(changed(options.img.output))
            .pipe(gulp.dest(options.img.output))
            .pipe(new elixir.Notification('Images Bower Files Imported!'));

    });

});
