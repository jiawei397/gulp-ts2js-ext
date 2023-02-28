# gulp-ts2js-ext

The js file compiled with TypeScript has no `.js` suffix. This plugin is mainly
used to help add it.

## Install

`npm install --save-dev gulp-ts2js-ext`

## Usage

```javascript
const gulp = require("gulp");
const ts = require("gulp-typescript");
const typescript = require("typescript");
const sourcemaps = require("gulp-sourcemaps");
const { jsExt, tsExt } = require("gulp-js-ext");

function script() {
  const tsProject = ts.createProject("example/tsconfig.json", {
    typescript,
  });
  return gulp.src("example/ts/**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsExt())
    .pipe(tsProject())
    .js
    .pipe(jsExt({
      minified: true,
    }))
    .pipe(sourcemaps.write(".", { includeContent: true }))
    .pipe(gulp.dest("example/js"));
}

script();
```

It will transform `example/ts` dir files to `example/js`.

Before:

```typescript
import { getUserAge } from "./child2.ts";
import { getUserName } from "./child.ts";

console.log(getUserAge());
console.log(getUserName());
```

After:

```javascript
import { getUserAge } from "./child2.js";
import { getUserName } from "./child.js";
console.log(getUserAge());
console.log(getUserName());
//# sourceMappingURL=index.js.map
```
