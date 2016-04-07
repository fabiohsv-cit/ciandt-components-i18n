var gulp = require('gulp');
var umd = require('gulp-umd');

gulp.task('default', ['umd']);

gulp.task('umd', function() {
  return gulp.src('src/i18n.js')
    .pipe(umd({
      exports: function() {
        return "'jedi.i18n'";
      },
      namespace: function() {
        return 'ngJediI18n';
      },
      dependencies: function() {
        return [{
          name: 'angular'
        // }, {
        //   name: 'ng-jedi-utilities',
        //   param: 'utilities',
        //   global: 'ngJediUtilities'
        }, {
          name: 'bluebird',
          param: 'Promise',
          global: 'Promise'
        }, {
          name: 'angular-dynamic-locale',
          param: 'dynamicLocale',
          global: 'dynamicLocale'
        }, {
          name: 'lodash',
          param: '_',
          global: '_'
        }];
      },
    }))
    .pipe(gulp.dest('.'))
});