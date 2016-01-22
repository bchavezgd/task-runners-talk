var gulp = require('gulp'),

	/* loading tasks */
	sass = require('gulp-sass'),
	postcss = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	watch = require('gulp-watch'),

	/* path variables */
	src = './_src',
	dist = './_site';

// defining tasks
gulp.task('default', ['sass']);

gulp.task('sass', function () {
	gulp.src( src + '/sass/style.sass')
    .pipe(
    	sass({
	      /* options */
	      outputStyle: 'expanded'
	    })
    )
    .pipe(postcss([
      /* postcss plugins */
      autoprefixer({
        /* options */
        browsers: ['last 3 version']
      })
//      , cssnano
    ]))
    .pipe( gulp.dest( dist ) )
});



gulp.task('watch', function () {
    gulp.watch(src + 'sass/**/*', ['sass']);
});
