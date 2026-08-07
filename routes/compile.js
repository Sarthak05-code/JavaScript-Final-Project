const express = require("express");
const router = express.Router();
const { Lexer } = require("../src/lexer/lexer");
const { Parser } = require("../src/parser/parser");
const { CodeGenerator } = require("../src/codegen/generator");

router.post("/", (req, res) => {
  try {
    const { source } = req.body;

    // Step 1: Lex
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    // Step 2: Parse
    const parser = new Parser(tokens);
    const ast = parser.parse();

    // Step 3: Generate
    const gen = new CodeGenerator();
    gen.generate(ast);
    const assembly = gen.getOutput();

    res.json({ success: true, assembly, tokens, ast });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
      line: err.line,
      col: err.col,
    });
  }
});

module.exports = router;
