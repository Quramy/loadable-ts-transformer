import vm from 'vm';
import ts from 'typescript';
import { getImportArg, getLeadingComments, removeMatchingLeadingComments, createObjectMethod } from '../util';
import { CreatePropertyOptions } from './types';

const JS_PATH_REGEXP = /^[./]+|(\.js$)/g;
const MATCH_LEFT_HYPHENS_REPLACE_REGEX = /^-/g;
// https://github.com/webpack/webpack/blob/master/lib/Template.js
const WEBPACK_CHUNK_NAME_REGEXP = /webpackChunkName/;
const WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX = /[^a-zA-Z0-9_!§$()=\-^°]+/g;
const WEBPACK_MATCH_PADDED_HYPHENS_REPLACE_REGEX = /^-|-$/g;

function readWebpackCommentValues(str: string): { webpackChunkName: string } {
  try {
    const values = vm.runInNewContext(`(function(){return {${str}};})()`);
    return values;
  } catch (e) {
    throw Error(`compilation error while processing: /*${str}*/: ${e.message}`);
  }
}

function writeWebpackCommentValues(values: any) {
  try {
    const str = Object.keys(values)
      .map(key => `${key}: ${JSON.stringify(values[key])}`)
      .join(', ');
    return ` ${str} `;
  } catch (e) {
    throw Error(`compilation error while processing: /*${values}*/: ${e.message}`);
  }
}

function getChunkNameComment(importArg: ts.Node) {
  const comments = getLeadingComments(importArg);
  if (!comments.length) return null;
  return comments.find(comment => WEBPACK_CHUNK_NAME_REGEXP.test(comment));
}

function getRawChunkNameFromCommments(importArg: ts.Node) {
  const chunkNameComment = getChunkNameComment(importArg);
  if (!chunkNameComment) return null;
  return readWebpackCommentValues(chunkNameComment);
}

function moduleToChunk(str: string) {
  if (typeof str !== 'string') return '';
  return str
    .replace(JS_PATH_REGEXP, '')
    .replace(WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX, '-')
    .replace(WEBPACK_MATCH_PADDED_HYPHENS_REPLACE_REGEX, '');
}

function generateChunkNameNode(callPath: ts.CallExpression): ts.Expression {
  const importArg = getImportArg(callPath);
  if (ts.isTemplateExpression(importArg)) {
    throw new Error('not implementd');
    // return t.templateLiteral(
    //   importArg.node.quasis.map((quasi, index) =>
    //     transformQuasi(
    //       quasi,
    //       index === 0,
    //       importArg.node.quasis.length === 1,
    //     ),
    //   ),
    //   importArg.node.expressions,
    // )
  } else if (ts.isStringLiteral(importArg) || ts.isNoSubstitutionTemplateLiteral(importArg)) {
    return ts.createStringLiteral(moduleToChunk(importArg.text));
  }
  return importArg;
}

function getExistingChunkNameComment(callNode: ts.CallExpression) {
  const importArg = getImportArg(callNode);
  const values = getRawChunkNameFromCommments(importArg);
  return values;
}

function isAgressiveImport(callNode: ts.CallExpression) {
  const importArg = getImportArg(callNode);
  return ts.isTemplateExpression(importArg) && importArg.templateSpans.length > 0;
}

function addOrReplaceChunkNameComment(callNode: ts.CallExpression, ctx: ts.TransformationContext, values: any) {
  const importArg = getImportArg(callNode);

  removeMatchingLeadingComments(importArg, ctx, WEBPACK_CHUNK_NAME_REGEXP);

  ts.addSyntheticLeadingComment(
    importArg,
    ts.SyntaxKind.MultiLineCommentTrivia,
    writeWebpackCommentValues(values),
    false,
  );
}

function replaceChunkName({ callNode, ctx }: CreatePropertyOptions) {
  const agressiveImport = isAgressiveImport(callNode);
  const values = getExistingChunkNameComment(callNode);

  if (!agressiveImport && values) {
    addOrReplaceChunkNameComment(callNode, ctx, values);
    return ts.createStringLiteral(values.webpackChunkName);
  }

  let chunkNameNode = generateChunkNameNode(callNode);
  let webpackChunkName: string;

  // if (t.isTemplateLiteral(chunkNameNode)) {
  //   webpackChunkName = chunkNameFromTemplateLiteral(chunkNameNode)
  //   chunkNameNode = sanitizeChunkNameTemplateLiteral(chunkNameNode)
  // } else {
  if (ts.isStringLiteral(chunkNameNode) || ts.isNoSubstitutionTemplateLiteral(chunkNameNode)) {
    webpackChunkName = chunkNameNode.text;
  } else {
    webpackChunkName = '';
  }

  addOrReplaceChunkNameComment(callNode, ctx, { webpackChunkName });
  return chunkNameNode;
}

export default function chunkNameProperty(options: CreatePropertyOptions) {
  return createObjectMethod('chunkName', [], ts.createBlock([ts.createReturn(replaceChunkName(options))], true));
}
