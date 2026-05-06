import { Parser } from "../src/Parser.js";
import literalsTest from "./literals-test.js";
import statementListTest from "./statement-list-test.js";
import blockTest from "./block-test.js";
import emptyStatementTest from "./empty-statement-test.js";
import assert from "assert";

const tests = [literalsTest, statementListTest, blockTest, emptyStatementTest];

const parser = new Parser();

function exec() {
  const program = `42;"hello";`;

  const ast = parser.parse(program);

  console.log(JSON.stringify(ast, null, 2));
}

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

exec();
// tests.forEach((testRun) => testRun(test));
// console.log("All assertions passed!");
