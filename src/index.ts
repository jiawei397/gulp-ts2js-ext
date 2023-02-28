import { Transform, TransformCallback } from "node:stream";
import File from "vinyl";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";

export interface PluginOptions {
  minified?: boolean;
}

export type JSExtPlugin = (pluginOptions: PluginOptions) => Transform;
export type TSExtPlugin = () => Transform;

/**
 * ESM js extension add
 */
function replaceImportJSExt(originText: string, minified?: boolean) {
  // 1. 源代码解析成 ast
  const ast = parser.parse(originText, {
    sourceType: "module",
  });

  // 2. 转换
  const visitor = {
    ImportDeclaration(path: any) {
      const str = path.node.source.value;
      if (str.endsWith(".js")) {
        return;
      }
      path.node.source.value = str + ".js";
    },
  };
  traverse(ast, visitor);

  // 3. 生成
  const result = generator(ast, {
    minified,
  }, originText);

  // console.log(result.code);
  return result.code;
}

/**
 * Remove ts ends with ".ts" suffix
 */
function replaceImportTSExt(originText: string) {
  const reg = /import\s.*["']+(.+)["']+/g;
  // 这里不能用AST解析，原因是babel不能直接解析TS
  return originText.replaceAll(reg, (match, str) => {
    if (!str.endsWith(".ts")) {
      return match;
    }
    return match.replace(/\.ts/, "");
  });
}

export const jsExt: JSExtPlugin = (pluginOptions: PluginOptions) => {
  return new Transform({
    objectMode: true,
    transform(
      file: File,
      _encoding: BufferEncoding,
      callback: TransformCallback,
    ) {
      /* istanbul ignore if */
      if (file.isStream()) {
        return callback(new Error("Streaming is not supported."));
      }

      if (file.isNull() || !file.contents) {
        return callback(undefined, file);
      }

      if (!file.path) {
        return callback(
          new Error(
            "Received file with no path. Files must have path to be resolved.",
          ),
        );
      }

      const content = file.contents.toString();
      file.contents = Buffer.from(
        replaceImportJSExt(content, pluginOptions.minified),
      );
      callback(undefined, file);
    },
  });
};

export const tsExt: TSExtPlugin = () => {
  return new Transform({
    objectMode: true,
    transform(
      file: File,
      _encoding: BufferEncoding,
      callback: TransformCallback,
    ) {
      /* istanbul ignore if */
      if (file.isStream()) {
        return callback(new Error("Streaming is not supported."));
      }

      if (file.isNull() || !file.contents) {
        return callback(undefined, file);
      }

      if (!file.path) {
        return callback(
          new Error(
            "Received file with no path. Files must have path to be resolved.",
          ),
        );
      }

      const content = file.contents.toString();
      file.contents = Buffer.from(replaceImportTSExt(content));
      callback(undefined, file);
    },
  });
};
