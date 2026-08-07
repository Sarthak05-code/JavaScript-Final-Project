class CompileError extends Error {
  constructor(message, line, column) {
    super(message);
    this.line = line;
    this.column = column;
    this.name = "CompileError";
  }
}

module.exports = { CompileError };
