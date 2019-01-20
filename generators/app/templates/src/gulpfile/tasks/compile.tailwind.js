import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import config from '../../package';
import error_handler from '../lib/error_handler';

const $ = gulpLoadPlugins();

const paths = {
  src: [
    `${config.srcPaths.css}tailwind.scss`,
  ],
  dest: process.cwd() + '/tmp/',
};

const compileTailwind = () => {
  gulp
    .src(paths.src)
    .pipe($.sass())
    .on('error', function(e) { console.log(e)})
    .pipe($.postcss())
    .pipe(gulp.dest(paths.dest + 'tailwind.css'))
}

gulp.task('compile:tailwind', compileTailwind);
