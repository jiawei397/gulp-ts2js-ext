const gulp = require("gulp");
const ts = require("gulp-typescript");
const typescript = require("typescript")
const sourcemaps = require('gulp-sourcemaps');
const { jsExt, tsExt } = require("../lib/index");

/**
 * 编译ts为js，且进行压缩
 */
function script() {
  const tsProject = ts.createProject("example/tsconfig.json", {
    typescript,
  });
  return gulp.src("example/ts/**/*.ts") // or tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsExt())
    .pipe(tsProject())
    .js
    .pipe(jsExt({
      minified: true
    }))
    .pipe(sourcemaps.write('.', { includeContent: true }))
    .pipe(gulp.dest("example/js"));
}

script();