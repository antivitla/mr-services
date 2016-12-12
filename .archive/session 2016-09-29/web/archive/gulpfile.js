var gulp = require('gulp'),
  concat = require('gulp-concat')

gulp.task('watch', function () {
  gulp.watch('components/*.js', function () {
    //
  })
})

// babel = require('gulp-babel'),
// rollup = require('gulp-rollup'),
// rollupIncludePaths = require('rollup-plugin-includepaths'),
// rollupNodeResolve = require('rollup-plugin-node-resolve'),
// browserify = require('browserify')

// gulp.task('babel', function () {
//   return gulp.src('es2015/*.js')
//     .pipe(rollup({
//       plugins: [
//         rollupIncludePaths({
//           paths: ['es2015']
//         }),
//         rollupNodeResolve({
//           jsnext: true,
//           main: true,
//           browser: true
//         })
//       ]
//     }))
//     .pipe(babel({
//       'presets': ['es2015'],
//     // 'plugins': ['transform-es2015-modules-umd']
//     }))
//     .pipe(concat('bundle.js'))
//     .pipe(gulp.dest('./'))
//     .pipe(browserify('./bundle.js').bundle())
//     .pipe(gulp.dest('./b2.js'))
// })

// gulp.task('watch', function () {
//   gulp.watch(['es2015/*.js'], ['babel'])
// })
