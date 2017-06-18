var browserSync = require('browser-sync'),
    del = require('del'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}))
});


//gulp.task('css-libs', ['sass'], function() {
 // return gulp.src('app/css/libs/**/*.css')
 /* .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
});*/


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('clean', function() {
  return del.sync('docs');
});

gulp.task('clear', function() {
  return cache.clearALL();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('docs/img'));
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('app/css/**/*.css', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('build', ['clean', 'img', 'sass'], function() {
  var buildCss = gulp.src('app/css/**/*.css')
  .pipe(gulp.dest('docs/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('docs/fonts'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('docs'));

  var buildJs = gulp.src('app/js/**/*.js')
  .pipe(gulp.dest('docs/js'));
});
