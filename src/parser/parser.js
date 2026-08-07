const { CompileError } = require("../utils/errors");
const lexerModule = require("../lexer/lexer");
const TOKEN_TYPES = lexerModule.TOKEN_TYPES;

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
    this.inLoop = false;
    this.inFunction = false;
  }

  current() {
    return this.tokens[this.pos];
  }

  peek(offset = 1) {
    return (
      this.tokens[this.pos + offset] || this.tokens[this.tokens.length - 1]
    );
  }

  eat(type, value = null) {
    const token = this.current();
    if (token.type !== type || (value && token.value !== value)) {
      throw new CompileError(
        `Expected ${value || type} but got ${token.value || token.type}`,
        token.line,
        token.col,
      );
    }
    this.pos++;
    return token;
  }

  match(type, value = null) {
    const token = this.current();
    return token.type === type && (!value || token.value === value);
  }

  parse() {
    const statements = [];
    while (!this.match(TOKEN_TYPES.EOF)) {
      statements.push(this.parseTopLevel());
    }
    return { type: "Program", body: statements };
  }

  parseTopLevel() {
    if (this.match(TOKEN_TYPES.KEYWORD, "function")) {
      return this.parseFunction();
    }
    return this.parseStatement();
  }

  parseStatement() {
    const token = this.current();

    if (
      this.match(TOKEN_TYPES.KEYWORD, "int") ||
      this.match(TOKEN_TYPES.KEYWORD, "float") ||
      this.match(TOKEN_TYPES.KEYWORD, "string") ||
      this.match(TOKEN_TYPES.KEYWORD, "bool")
    ) {
      return this.parseDeclaration();
    }
    if (this.match(TOKEN_TYPES.KEYWORD, "if")) return this.parseIf();
    if (this.match(TOKEN_TYPES.KEYWORD, "while")) return this.parseWhile();
    if (this.match(TOKEN_TYPES.KEYWORD, "for")) return this.parseFor();
    if (this.match(TOKEN_TYPES.KEYWORD, "break")) return this.parseBreak();
    if (this.match(TOKEN_TYPES.KEYWORD, "continue"))
      return this.parseContinue();
    if (this.match(TOKEN_TYPES.KEYWORD, "return")) return this.parseReturn();
    if (this.match(TOKEN_TYPES.KEYWORD, "print")) return this.parsePrint();
    if (this.match(TOKEN_TYPES.IDENTIFIER)) {
      if (this.peek().value === "(") return this.parseCallStatement();
      if (this.peek().value === "++" || this.peek().value === "--")
        return this.parseIncDec();
      return this.parseAssignment();
    }

    throw new CompileError(
      `Unexpected token: ${token.value}`,
      token.line,
      token.col,
    );
  }

  parseFunction() {
    this.eat(TOKEN_TYPES.KEYWORD, "function");
    const returnType = this.eat(TOKEN_TYPES.KEYWORD).value;
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const params = [];
    while (!this.match(TOKEN_TYPES.SYMBOL, ")")) {
      const pType = this.eat(TOKEN_TYPES.KEYWORD).value; // was IDENTIFIER
      const pName = this.eat(TOKEN_TYPES.IDENTIFIER).value;
      params.push({ type: pType, name: pName });
      if (this.match(TOKEN_TYPES.SYMBOL, ","))
        this.eat(TOKEN_TYPES.SYMBOL, ",");
    }
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, "{");
    const body = [];
    const prevInFunction = this.inFunction;
    this.inFunction = true;
    while (!this.match(TOKEN_TYPES.SYMBOL, "}")) {
      body.push(this.parseStatement());
    }
    this.inFunction = prevInFunction;
    this.eat(TOKEN_TYPES.SYMBOL, "}");
    return { type: "Function", name, returnType, params, body };
  }

  parseDeclaration() {
    const varType = this.eat(TOKEN_TYPES.KEYWORD).value;
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;

    if (this.match(TOKEN_TYPES.SYMBOL, "[")) {
      return this.parseArrayDeclaration(varType, name);
    }

    let value = null;
    if (this.match(TOKEN_TYPES.OPERATOR, "=")) {
      this.eat(TOKEN_TYPES.OPERATOR, "=");
      value = this.parseExpression();
    }
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Declaration", varType, name, value };
  }

  parseArrayDeclaration(varType, name) {
    this.eat(TOKEN_TYPES.SYMBOL, "[");
    const size = this.match(TOKEN_TYPES.NUMBER)
      ? this.eat(TOKEN_TYPES.NUMBER).value
      : null;
    this.eat(TOKEN_TYPES.SYMBOL, "]");
    let values = null;
    if (this.match(TOKEN_TYPES.OPERATOR, "=")) {
      this.eat(TOKEN_TYPES.OPERATOR, "=");
      this.eat(TOKEN_TYPES.SYMBOL, "{");
      values = [];
      while (!this.match(TOKEN_TYPES.SYMBOL, "}")) {
        values.push(this.parseExpression());
        if (this.match(TOKEN_TYPES.SYMBOL, ","))
          this.eat(TOKEN_TYPES.SYMBOL, ",");
      }
      this.eat(TOKEN_TYPES.SYMBOL, "}");
    }
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "ArrayDeclaration", varType, name, size, values };
  }

  parseAssignment() {
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;

    if (this.match(TOKEN_TYPES.SYMBOL, "[")) {
      this.eat(TOKEN_TYPES.SYMBOL, "[");
      const index = this.parseExpression();
      this.eat(TOKEN_TYPES.SYMBOL, "]");
      this.eat(TOKEN_TYPES.OPERATOR, "=");
      const value = this.parseExpression();
      this.eat(TOKEN_TYPES.SYMBOL, ";");
      return { type: "ArrayAssignment", name, index, value };
    }

    this.eat(TOKEN_TYPES.OPERATOR, "=");
    const value = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Assignment", name, value };
  }

  parseIncDec() {
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    const op = this.eat(TOKEN_TYPES.OPERATOR).value;
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "IncDec", name, operator: op };
  }

  parseIf() {
    this.eat(TOKEN_TYPES.KEYWORD, "if");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const condition = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, "{");
    const body = this.parseBlock();
    let elseBody = null;
    if (this.match(TOKEN_TYPES.KEYWORD, "else")) {
      this.eat(TOKEN_TYPES.KEYWORD, "else");
      if (this.match(TOKEN_TYPES.KEYWORD, "if")) {
        elseBody = [this.parseIf()];
      } else {
        this.eat(TOKEN_TYPES.SYMBOL, "{");
        elseBody = this.parseBlock();
      }
    }
    return { type: "If", condition, body, elseBody };
  }

  parseWhile() {
    this.eat(TOKEN_TYPES.KEYWORD, "while");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const condition = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, "{");
    const prevInLoop = this.inLoop;
    this.inLoop = true;
    const body = this.parseBlock();
    this.inLoop = prevInLoop;
    return { type: "While", condition, body };
  }

  parseFor() {
    this.eat(TOKEN_TYPES.KEYWORD, "for");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const init = this.parseForInit();
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    const condition = this.parseExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    const update = this.parseForUpdate();
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, "{");
    const prevInLoop = this.inLoop;
    this.inLoop = true;
    const body = this.parseBlock();
    this.inLoop = prevInLoop;
    return { type: "For", init, condition, update, body };
  }

  parseForInit() {
    if (
      this.match(TOKEN_TYPES.KEYWORD, "int") ||
      this.match(TOKEN_TYPES.KEYWORD, "float")
    ) {
      const varType = this.eat(TOKEN_TYPES.KEYWORD).value;
      const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
      this.eat(TOKEN_TYPES.OPERATOR, "=");
      const value = this.parseExpression();
      return { type: "Declaration", varType, name, value };
    }
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    this.eat(TOKEN_TYPES.OPERATOR, "=");
    const value = this.parseExpression();
    return { type: "Assignment", name, value };
  }

  parseForUpdate() {
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    if (
      this.match(TOKEN_TYPES.OPERATOR, "++") ||
      this.match(TOKEN_TYPES.OPERATOR, "--")
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      return { type: "IncDec", name, operator: op };
    }
    this.eat(TOKEN_TYPES.OPERATOR, "=");
    const value = this.parseExpression();
    return { type: "Assignment", name, value };
  }

  parseBlock() {
    const statements = [];
    while (!this.match(TOKEN_TYPES.SYMBOL, "}")) {
      statements.push(this.parseStatement());
    }
    this.eat(TOKEN_TYPES.SYMBOL, "}");
    return statements;
  }

  parseBreak() {
    if (!this.inLoop) {
      throw new CompileError(
        "break outside of loop",
        this.current().line,
        this.current().col,
      );
    }
    this.eat(TOKEN_TYPES.KEYWORD, "break");
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Break" };
  }

  parseContinue() {
    if (!this.inLoop) {
      throw new CompileError(
        "continue outside of loop",
        this.current().line,
        this.current().col,
      );
    }
    this.eat(TOKEN_TYPES.KEYWORD, "continue");
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Continue" };
  }

  parseReturn() {
    if (!this.inFunction) {
      throw new CompileError(
        "return outside of function",
        this.current().line,
        this.current().col,
      );
    }
    this.eat(TOKEN_TYPES.KEYWORD, "return");
    let value = null;
    if (!this.match(TOKEN_TYPES.SYMBOL, ";")) {
      value = this.parseExpression();
    }
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Return", value };
  }

  parsePrint() {
    this.eat(TOKEN_TYPES.KEYWORD, "print");
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const args = [];
    while (!this.match(TOKEN_TYPES.SYMBOL, ")")) {
      args.push(this.parseExpression());
      if (this.match(TOKEN_TYPES.SYMBOL, ","))
        this.eat(TOKEN_TYPES.SYMBOL, ",");
    }
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "Print", arguments: args };
  }

  parseCallStatement() {
    const expr = this.parseCallExpression();
    this.eat(TOKEN_TYPES.SYMBOL, ";");
    return { type: "ExpressionStatement", expression: expr };
  }

  parseCallExpression() {
    const name = this.eat(TOKEN_TYPES.IDENTIFIER).value;
    this.eat(TOKEN_TYPES.SYMBOL, "(");
    const args = [];
    while (!this.match(TOKEN_TYPES.SYMBOL, ")")) {
      args.push(this.parseExpression());
      if (this.match(TOKEN_TYPES.SYMBOL, ","))
        this.eat(TOKEN_TYPES.SYMBOL, ",");
    }
    this.eat(TOKEN_TYPES.SYMBOL, ")");
    return { type: "CallExpression", name, arguments: args };
  }

  parseExpression() {
    return this.parseOr();
  }

  parseOr() {
    let left = this.parseAnd();
    while (this.match(TOKEN_TYPES.OPERATOR, "||")) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseAnd();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseAnd() {
    let left = this.parseEquality();
    while (this.match(TOKEN_TYPES.OPERATOR, "&&")) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseEquality();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseEquality() {
    let left = this.parseComparison();
    while (
      this.match(TOKEN_TYPES.OPERATOR, "==") ||
      this.match(TOKEN_TYPES.OPERATOR, "!=")
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseComparison();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseComparison() {
    let left = this.parseAdditive();
    while (
      this.match(TOKEN_TYPES.OPERATOR, "<") ||
      this.match(TOKEN_TYPES.OPERATOR, ">") ||
      this.match(TOKEN_TYPES.OPERATOR, "<=") ||
      this.match(TOKEN_TYPES.OPERATOR, ">=")
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseAdditive();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    while (
      this.match(TOKEN_TYPES.OPERATOR, "+") ||
      this.match(TOKEN_TYPES.OPERATOR, "-")
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseMultiplicative();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseMultiplicative() {
    let left = this.parseUnary();
    while (
      this.match(TOKEN_TYPES.OPERATOR, "*") ||
      this.match(TOKEN_TYPES.OPERATOR, "/") ||
      this.match(TOKEN_TYPES.OPERATOR, "%")
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const right = this.parseUnary();
      left = { type: "BinaryOp", operator: op, left, right };
    }
    return left;
  }

  parseUnary() {
    if (
      this.match(TOKEN_TYPES.OPERATOR, "!") ||
      this.match(TOKEN_TYPES.OPERATOR, "-")
    ) {
      const op = this.eat(TOKEN_TYPES.OPERATOR).value;
      const operand = this.parseUnary();
      return { type: "UnaryOp", operator: op, operand };
    }
    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.current();

    if (this.match(TOKEN_TYPES.NUMBER)) {
      this.pos++;
      return { type: "Number", value: token.value };
    }
    if (this.match(TOKEN_TYPES.STRING)) {
      this.pos++;
      return { type: "String", value: token.value };
    }
    if (this.match(TOKEN_TYPES.BOOLEAN)) {
      this.pos++;
      return { type: "Boolean", value: token.value };
    }
    if (this.match(TOKEN_TYPES.IDENTIFIER)) {
      if (this.peek().value === "(") {
        return this.parseCallExpression();
      }
      if (this.peek().value === "[") {
        const name = token.value;
        this.pos++;
        this.eat(TOKEN_TYPES.SYMBOL, "[");
        const index = this.parseExpression();
        this.eat(TOKEN_TYPES.SYMBOL, "]");
        return { type: "ArrayAccess", name, index };
      }
      if (this.peek().value === "++" || this.peek().value === "--") {
        const name = token.value;
        this.pos++;
        const op = this.eat(TOKEN_TYPES.OPERATOR).value;
        return { type: "IncDec", name, operator: op, postfix: true };
      }
      this.pos++;
      return { type: "Identifier", name: token.value };
    }
    if (this.match(TOKEN_TYPES.SYMBOL, "(")) {
      this.eat(TOKEN_TYPES.SYMBOL, "(");
      const expr = this.parseExpression();
      this.eat(TOKEN_TYPES.SYMBOL, ")");
      return expr;
    }

    throw new CompileError(
      `Unexpected token: ${token.value}`,
      token.line,
      token.col,
    );
  }
}

module.exports = { Parser };
