import { Tokenizer } from "./Tokenizer.js";

const DefaultFactory = {
  Program(body) {
    return {
      type: "Program",
      body,
    };
  },
  EmptyStatement() {
    return {
      type: "EmptyStatement",
    };
  },
  BlockStatement(body) {
    return {
      type: "BlockStatement",
      body,
    };
  },
  ExpressionStatement(expression) {
    return {
      type: "ExpressionStatement",
      expression,
    };
  },
  StringLiteral(value) {
    return {
      type: "StringLiteral",
      value,
    };
  },
  NumericLiteral(value) {
    return {
      type: "NumericLiteral",
      value,
    };
  },
};

const SExpressionFactory = {
  Program(body) {
    return ["begin", body];
  },
  EmptyStatement() {},
  BlockStatement(body) {
    return ["begin", body];
  },
  ExpressionStatement(expression) {
    return expression;
  },
  StringLiteral(value) {
    return `"${value}"`;
  },
  NumericLiteral(value) {
    return value;
  },
};

const AST_MODE = "default";

const factory = AST_MODE === "default" ? DefaultFactory : SExpressionFactory;

export class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return factory.Program(this.StatementList());
  }

  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()];

    while (this._lookahead !== null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    switch (this._lookahead.type) {
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  EmptyStatement() {
    this._eat(";");

    return factory.EmptyStatement();
  }

  BlockStatement() {
    this._eat("{");

    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];

    this._eat("}");

    return factory.BlockStatement(body);
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return factory.ExpressionStatement(expression);
  }

  Expression() {
    return this.Literal();
  }

  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError("Literal: unexpected literal production");
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return factory.StringLiteral(token.value.slice(1, -1));
  }

  NumericLiteral() {
    const token = this._eat("NUMBER");
    return factory.NumericLiteral(Number(token.value));
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input, expected ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: ${token.value}, expected ${tokenType}`,
      );
    }

    this._lookahead = this._tokenizer.getNextToken();
    return token;
  }
}
