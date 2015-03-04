var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var elixir = require('laravel-elixir');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var _ = require('lodash');

elixir.extend('bower', function(options) {

    var config = this;
    
    var options = _.merge({
        debugging: false,
        css: {
            file: 'vendor.css',
            output: config.cssOutput
        },
        js: {
            file: 'vendor.js',
            output: config.jsOutput
        },
        font: {
            output: 'public/fonts'
        }
    }, options);

    gulp.task('bower', ['bower-css', 'bower-js', 'bower-fonts']);

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
            .pipe(concat(options.css.file))
            .pipe(minify())
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
            .pipe(uglify())
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
                filter: (/\.(eot|svg|ttf|woff|otf)$/i)
            }))
            .on('error', onError)
            .pipe(gulp.dest(options.font.output))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'Font Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));
    });
    

    return this.queueTask('bower');

});