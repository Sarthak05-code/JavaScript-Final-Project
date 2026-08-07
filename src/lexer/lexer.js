const { CompileError } = require("../utils/errors");

const TOKEN_TYPES = {
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  STRING: "STRING",
  BOOLEAN: "BOOLEAN",
  OPERATOR: "OPERATOR",
  SYMBOL: "SYMBOL",
  COMMENT: "COMMENT",
  EOF: "EOF",
};

const KEYWORDS = [
  "int",
  "float",
  "string",
  "bool",
  "void",
  "if",
  "else",
  "while",
  "for",
  "break",
  "continue",
  "function",
  "return",
  "print",
  "input",
];

const OPERATORS = [
  "=",
  "==",
  "!=",
  "<",
  ">",
  "<=",
  ">=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "++",
  "--",
  "&&",
  "||",
  "!",
];

class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.tokens = [];
  }

  peek(offset = 0) {
    return this.source[this.pos + offset] || "\0";
  }

  advance() {
    const char = this.source[this.pos] || "\0";
    if (char === "\n") {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    this.pos++;
    return char;
  }

  skipWhitespace() {
    while (/\s/.test(this.peek())) {
      this.advance();
    }
  }

  readComment() {
    while (this.peek() !== "\n" && this.peek() !== "\0") {
      this.advance();
    }
  }

  readMultiLineComment() {
    while (
      !(this.peek() === "*" && this.peek(1) === "/") &&
      this.peek() !== "\0"
    ) {
      this.advance();
    }
    if (this.peek() === "*" && this.peek(1) === "/") {
      this.advance();
      this.advance();
    }
  }

  readString() {
    const quote = this.advance();
    let str = "";
    const startCol = this.col - 1;
    while (this.peek() !== quote && this.peek() !== "\0") {
      if (this.peek() === "\\") {
        this.advance();
        const esc = this.advance();
        const escapes = {
          n: "\n",
          t: "\t",
          r: "\r",
          "\\": "\\",
          '"': '"',
          "'": "'",
        };
        str += escapes[esc] || esc;
      } else {
        str += this.advance();
      }
    }
    if (this.peek() === "\0") {
      throw new CompileError("Unterminated string", this.line, startCol);
    }
    this.advance();
    return {
      type: TOKEN_TYPES.STRING,
      value: str,
      line: this.line,
      col: startCol,
    };
  }

  readNumber() {
    let num = "";
    const startCol = this.col;
    let isFloat = false;
    while (
      /\d/.test(this.peek()) ||
      (this.peek() === "." && !isFloat && /\d/.test(this.peek(1)))
    ) {
      if (this.peek() === ".") isFloat = true;
      num += this.advance();
    }
    return {
      type: TOKEN_TYPES.NUMBER,
      value: isFloat ? parseFloat(num) : parseInt(num),
      line: this.line,
      col: startCol,
    };
  }

  readIdentifier() {
    let id = "";
    const startCol = this.col;
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      id += this.advance();
    }
    if (id === "true" || id === "false") {
      return {
        type: TOKEN_TYPES.BOOLEAN,
        value: id === "true",
        line: this.line,
        col: startCol,
      };
    }
    const type = KEYWORDS.includes(id)
      ? TOKEN_TYPES.KEYWORD
      : TOKEN_TYPES.IDENTIFIER;
    return { type, value: id, line: this.line, col: startCol };
  }

  readOperator() {
    const startCol = this.col;
    let op = this.advance();
    const twoChar = op + this.peek();
    if (OPERATORS.includes(twoChar)) {
      op += this.advance();
    } else if (
      OPERATORS.includes(op + this.peek()) &&
      ["=", "!", "<", ">", "+", "-", "&", "|"].includes(op)
    ) {
      op += this.advance();
    }
    return {
      type: TOKEN_TYPES.OPERATOR,
      value: op,
      line: this.line,
      col: startCol,
    };
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();
      if (this.pos >= this.source.length) break;

      const char = this.peek();
      const startCol = this.col;

      if (char === "/" && this.peek(1) === "/") {
        this.readComment();
        continue;
      }
      if (char === "/" && this.peek(1) === "*") {
        this.advance();
        this.advance();
        this.readMultiLineComment();
        continue;
      }
      if (char === '"' || char === "'") {
        this.tokens.push(this.readString());
      } else if (/\d/.test(char)) {
        this.tokens.push(this.readNumber());
      } else if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
      } else if (OPERATORS.some((op) => op.startsWith(char))) {
        this.tokens.push(this.readOperator());
      } else if ("{}();,[]".includes(char)) {
        this.tokens.push({
          type: TOKEN_TYPES.SYMBOL,
          value: this.advance(),
          line: this.line,
          col: startCol,
        });
      } else {
        throw new CompileError(
          `Unexpected character: '${char}'`,
          this.line,
          startCol,
        );
      }
    }

    this.tokens.push({
      type: TOKEN_TYPES.EOF,
      value: "EOF",
      line: this.line,
      col: this.col,
    });
    return this.tokens;
  }
}

module.exports = { Lexer, TOKEN_TYPES };
