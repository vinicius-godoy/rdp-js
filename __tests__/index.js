import { Parser } from "../src/Parser.js";
import literalsTest from "./literals-test.js";
import statementListTest from "./statement-list-test.js";
import assert from "assert";

const tests = [literalsTest, statementListTest];

const parser = new Parser();

function exec() {
  const program = `
  
    /**
     * Docs comment:
     */
    "hello";
  
    // Number:
    42;
  
  `;

  const ast = parser.parse(program);

  console.log(JSON.stringify(ast, null, 2));
}

function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

tests.forEach((testRun) => testRun(test));

console.log("All assertions passed!");
