var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var elixir = require('laravel-elixir');
var filter = require('gulp-filter');
var notify = require('gulp-notify');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

elixir.extend('bower', function(cssFile, cssOutput, jsFile, jsOutput) {

    var config = this;
    var cssFile = cssFile || 'vendor.css';
    var jsFile = jsFile || 'vendor.js';

    gulp.task('bower', ['bower-css', 'bower-js']);

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

        return gulp.src(mainBowerFiles())
            .on('error', onError)
            .pipe(filter('**/*.css'))
            .pipe(concat(cssFile))
            .pipe(minify())
            .pipe(gulp.dest(cssOutput || config.cssOutput))
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

        return gulp.src(mainBowerFiles())
            .on('error', onError)
            .pipe(filter('**/*.js'))
            .pipe(concat(jsFile))
            .pipe(uglify())
            .pipe(gulp.dest(jsOutput || config.jsOutput))
            .pipe(notify({
                title: 'Laravel Elixir',
                subtitle: 'Javascript Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));

    });

    return this.queueTask('bower');

});