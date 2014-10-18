var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var elixir = require('laravel-elixir');
var plugins = require('gulp-load-plugins')();

elixir.extend('bower', function(src, output) {

    gulp.task('bower', ['bower-css', 'bower-js']);

    gulp.task('bower-css', function () {
        var onError = function (err) {
            plugins.notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files CSS Compilation Failed!",
                message: "Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(mainBowerFiles())
            .pipe(plugins.filter('**/*.css'))
            .pipe(plugins.minifyCss())
            .pipe(gulp.dest(output || config.cssOutput))
            .pipe(plugins.notify({
                title: 'Laravel Elixir',
                subtitle: 'CSS Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));

    });

    gulp.task('bower-js', function () {
        var onError = function (err) {

            plugins.notify.onError({
                title: "Laravel Elixir",
                subtitle: "Bower Files JS Compilation Failed!",
                message: "Error: <%= error.message %>",
                icon: __dirname + '/../icons/fail.png'
            })(err);

            this.emit('end');
        };

        return gulp.src(mainBowerFiles())
            .pipe(plugins.filter('**/*.js'))
            // .pipe(plugins.concat(config.packageManagment.bower.js.fileName))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(output || config.jsOutput))
            .pipe(plugins.notify({
                title: 'Laravel Elixir',
                subtitle: 'Javascript Bower Files Imported!',
                icon: __dirname + '/../icons/laravel.png',
                message: ' '
            }));

    });

    return this.queueTask('bower');

});