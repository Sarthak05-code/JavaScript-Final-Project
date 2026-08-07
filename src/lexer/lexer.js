const { CompileError } = require("../utils/errors");

const TOKEN_TYPES = {
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  OPERATOR: "OPERATOR",
  SYMBOL: "SYMBOL",
  EOF: "EOF",
};

const KEYWORDS = ["int", "if", "else", "while", "print", "return"];

class Lexer {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.tokens = [];
  }

  peek() {
    return this.source[this.pos] || "\0";
  }

  advance() {
    if (this.source[this.pos] === "\n") {
      this.line++;
      this.col = 1;
    } else {
      this.col++;
    }
    return this.source[this.pos++] || "\0";
  }

  skipWhitespace() {
    while (/\s/.test(this.peek())) {
      this.advance();
    }
  }

  readNumber() {
    let num = "";
    const startCol = this.col;
    while (/\d/.test(this.peek())) {
      num += this.advance();
    }
    return {
      type: TOKEN_TYPES.NUMBER,
      value: parseInt(num),
      line: this.line,
      col: startCol,
    };
  }

  readIdentifier() {
    let id = "";
    const startCol = this.col;
    while (/[a-zA-Z_]/.test(this.peek())) {
      id += this.advance();
    }
    const type = KEYWORDS.includes(id)
      ? TOKEN_TYPES.KEYWORD
      : TOKEN_TYPES.IDENTIFIER;
    return { type, value: id, line: this.line, col: startCol };
  }

  tokenize() {
    while (this.pos < this.source.length) {
      this.skipWhitespace();
      if (this.pos >= this.source.length) break;

      const char = this.peek();
      const startCol = this.col;

      if (/\d/.test(char)) {
        this.tokens.push(this.readNumber());
      } else if (/[a-zA-Z_]/.test(char)) {
        this.tokens.push(this.readIdentifier());
      } else if (char === "=" || char === "!" || char === "<" || char === ">") {
        let op = this.advance();
        if (this.peek() === "=") op += this.advance();
        this.tokens.push({
          type: TOKEN_TYPES.OPERATOR,
          value: op,
          line: this.line,
          col: startCol,
        });
      } else if ("+-*/".includes(char)) {
        this.tokens.push({
          type: TOKEN_TYPES.OPERATOR,
          value: this.advance(),
          line: this.line,
          col: startCol,
        });
      } else if ("{}();".includes(char)) {
        this.tokens.push({
          type: TOKEN_TYPES.SYMBOL,
          value: this.advance(),
          line: this.line,
          col: startCol,
        });
      } else {
        throw new CompileError(
          `Unexpected character: ${char}`,
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
