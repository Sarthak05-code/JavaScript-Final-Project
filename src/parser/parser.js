const { CompileError } = require("../utils/errors");
const { TOKEN_TYPES } = require("../lexer/lexer");

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  current() {
    return this.tokens[this.pos];
  }

  eat(type, value = null) {
    const token = this.current();
    if (token.type !== type || (value && token.value !== value)) {
      throw new CompileError(
        `Expected ${value || type} but got ${token.value}`,
        token.line,
        token.col,
      );
    }
    this.pos++;
    return token;
  }

  parse() {
    const statements = [];
    while (this.current().type !== TOKEN_TYPES.EOF) {
      statements.push(this.parseStatement());
    }
    return { type: "Program", body: statements };
  }

  parseStatement() {
    const token = this.current();

    if (token.type === TOKEN_TYPES.KEYWORD && token.value === "int") {
      return this.parseDeclaration();
    }
    if (token.type === TOKEN_TYPES.KEYWORD && token.value === "if") {
      return this.parseIf();
    }
    if (token.type === TOKEN_TYPES.KEYWORD && token.value === "while") {
      return this.parseWhile();
    }
    if (token.type === TOKEN_TYPES.KEYWORD && token.value === "print") {
      return this.parsePrint();
    }
    if (token.type === TOKEN_TYPES.IDENTIFIER) {
      return this.parseAssignment();
    }

    throw new CompileError(
      `Unexpected token: ${token.value}`,
      token.line,
      token.col,
    );
  }

  parseDeclaration() {
    this.eat(TOKEN_TYPES.KEYWORD, "int");
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    this.eat(TOKEN_TYPES.OPERATOR, "=");
    const value = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Declaration", name, value };
  }

  parseAssignment() {
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    this.eat(TOKEN_TYPES.OPERATOR, "=");
    const value = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Assignment", name, value };
  }

  parseIf() {
    this.eat(TOKEN_TYPES.KEYWORD, "if");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const condition = this.parseCondition();
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, "{");
    const body = [];
    while (this.current().value !== "}") {
      body.push(this.parseStatement());
    }
    this.eat(TOKEN_TYPES.SYMBOL, "}");
    return { type: "If", condition, body };
  }

  parseWhile() {
    this.eat(TOKEN_TYPES.KEYWORD, "while");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const condition = this.parseCondition();
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, "{");
    const body = [];
    while (this.current().value !== "}") {
      body.push(this.parseStatement());
    }
    this.eat(TOKEN_TYPES.SYMBOL, "}");
    return { type: "While", condition, body };
  }

  parsePrint() {
    this.eat(TOKEN_TYPES.KEYWORD, "print");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const expr = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Print", expression: expr };
  }

  parseCondition() {
    const left = this.parseExpression();
    const op = this.eat(TOKEN_TYPES.OPERATOR).value;
    const right = this.parseExpression();
    return { type: "Condition", left, operator: op, right };
  }

  parseExpression() {
    let left = this.parseTerm();
    while (
      this.current().type === TOKEN_TYPES.OPERATOR &&
      "+-".includes(this.current().value)
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseTerm();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseTerm() {
    let left = this.parseFactor();
    while (
      this.current().type === TOKEN_TYPES.OPERATOR &&
      "*/".includes(this.current().value)
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseFactor();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseFactor() {
    const token = this.current();

    if (token.type === TOKEN_TYPES.NUMBER) {
      this.pos++;
      return { type: "Number", value: token.value };
    }
    if (token.type === TOKEN_TYPES.IDENTIFIER) {
      this.pos++;
      return { type: "Identifier", name: token.value };
    }
    if (token.value === "(") {
      this.eat(TOKEN_TYPES.SYMBOL, "(");
      const expr = this.parseExpression();
      this.eat(TOKEN_TYPES.SYMBOL, ")");
      return expr;
    }

    throw new CompileError(
      `Unexpected token in expression: ${token.value}`,
      token.line,
      token.col,
    );
  }
}

module.exports = { Parser };
