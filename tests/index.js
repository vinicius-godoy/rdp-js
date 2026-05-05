import { Parser } from "../src/Parser.js";

const parser = new Parser();

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
