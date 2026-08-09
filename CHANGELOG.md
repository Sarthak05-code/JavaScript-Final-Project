# Changelog

All notable changes to the Assembly Transpiler project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-08-09

### Added

- **CI/CD Pipeline** — GitHub Actions workflow with multi-stage validation
  - Security audit (`npm audit`)
  - Cross-platform testing (Ubuntu, Windows, macOS)
  - Multi-Node version testing (Node 22, 24)
  - Full integration smoke test with real MySQL service
  - Bundle size monitoring
  - 8 automated API endpoint tests
- **Environment Configuration** — `process.env` support via `.env` file
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT` variables
  - `.env.example` template for new developers
- **Docker Support** — Containerization files added
  - `Dockerfile` for Node.js app image
  - `docker-compose.yml` for orchestrating app + MySQL
  - `.dockerignore` for optimized builds
- **Helper Scripts**
  - `start.bat` / `start.sh` — One-click application startup
  - `setup.bat` / `setup.sh` — First-time environment setup
  - `scripts/seed.js` — Database seeding with 12 example programs
  - `scripts/test.js` — Automated compiler test suite (22 tests)
- **Documentation**
  - `API.md` — Full API endpoint documentation with cURL examples
  - `README.md` — Comprehensive project documentation
  - `CHANGELOG.md` — This file
- **VS Code Configuration** — `.vscode/settings.json` and `.vscode/extensions.json`
- **Makefile** — Cross-platform command shortcuts (`make build`, `make test`, etc.)
- **GitHub Issue Templates** — Bug report and feature request templates

### Changed

- **MySQL Configuration** — Moved from hardcoded credentials to environment variables
  - `config/db.js` now reads from `process.env` with fallbacks
  - Enables CI/CD and Docker compatibility
- **CI Workflow** — Removed deprecated Node 20 from test matrix
- **GitHub Pages** — Deployment job prepared (requires manual enablement in repo settings)

### Fixed

- **Function Parameter Bug** — Parameters now correctly register as variables in code generator
  - Added `POP` instructions to load arguments into registers
- **String Token Bug** — String values no longer render as `[object Object]` in assembly
  - `visit()` now returns proper registers with `LOADSTR` instruction
- **Parser Token Type Bug** — `parseFunction()`, `parseDeclaration()`, `parseForInit()` now correctly expect `KEYWORD` tokens for type declarations instead of `IDENTIFIER`
- **Circular Dependency Warning** — Fixed `TOKEN_TYPES` export/import between lexer and parser
- **PostCSS Build** — Added `postcss-cli` dependency and `build:css:once` script for CI compatibility

---

## [1.1.0] - 2026-08-08

### Added

- **Advanced Language Features**
  - `else` and `else if` blocks
  - `for` loops with init, condition, update
  - `break` and `continue` statements (with scope validation)
  - `return` statement (with function scope validation)
  - Functions with parameters and return values
  - Recursion support (e.g., factorial)
  - String data type with string pool allocation
  - Boolean data type (`true`, `false`)
  - Arrays with declaration, initialization, and indexed access
  - Increment (`++`) and decrement (`--`) operators
  - Logical operators (`&&`, `||`, `!`)
  - Modulo operator (`%`)
  - Single-line (`//`) and multi-line (`/* */`) comments
- **Enhanced Frontend**
  - Dark theme with Catppuccin-inspired color palette
  - Line numbers in source editor
  - Cursor position display (Ln, Col)
  - Tab support in textarea
  - Error toast with line highlighting
  - Example programs modal (12 pre-built examples)
  - Copy and download assembly buttons
  - Compilation statistics (token count, lines, compile time)
  - Status bar with real-time feedback
- **MySQL Integration**
  - `compile_history` table for tracking compilation attempts
  - Save/load programs via API
  - Program listing endpoint
- **Assembly Output Improvements**
  - Labeled sections (`DATA SECTION`, `CODE SECTION`, `STRING POOL`)
  - Comments in generated assembly
  - Proper register allocation tracking

### Changed

- **Lexer** — Complete rewrite with support for strings, booleans, comments, and multi-character operators
- **Parser** — Expanded to handle full expression precedence, functions, loops, and error scope checking
- **Code Generator** — Added string pool, array allocation, function labels, and parameter handling
- **UI** — Replaced basic layout with responsive split-pane design using Tailwind CSS

### Fixed

- **String Rendering** — Direct `print("Hello")` now works correctly
- **Function Calls** — Arguments properly pushed/popped from stack
- **Error Messages** — Line and column numbers now display correctly in error toast

---

## [1.0.0] - 2026-08-07

### Added

- **Initial Release** — Core compiler pipeline
  - Lexer: Tokenizes `int`, identifiers, numbers, basic operators, symbols
  - Parser: Recursive descent parser builds AST
  - Code Generator: Emits pseudo-assembly with register allocation
- **Basic Language Features**
  - Integer variables (`int x = 5;`)
  - Variable assignment
  - `if` statements
  - `while` loops
  - `print()` built-in function
  - Arithmetic operators (`+`, `-`, `*`, `/`)
  - Comparison operators (`>`, `<`, `>=`, `<=`, `==`, `!=`)
- **Web Application**
  - Express server with static file serving
  - POST `/api/compile` endpoint
  - Basic HTML/CSS frontend
  - Tailwind CSS v4 integration with PostCSS
- **Database**
  - MySQL connection via `mysql2`
  - `programs` table for storing source code
  - MySQL Workbench-compatible schema
- **Project Structure**
  - Modular architecture: `src/lexer/`, `src/parser/`, `src/codegen/`
  - Separate routes for compile and program APIs
  - Public assets folder for frontend

### Notes

- This was the initial MVP built for a JavaScript final project
- Supported simple programs up to ~20 lines
- No functions, strings, or arrays in this version

---

## Roadmap / Future Ideas

- [ ] **Syntax Highlighting** — Real-time color coding in the editor
- [ ] **Step Debugger** — Execute assembly line-by-line with register/stack visualization
- [ ] **Code Optimizer** — Constant folding, dead code elimination, register reuse
- [ ] **Additional Types** — `char`, `double`, `long`
- [ ] **Structs** — User-defined composite data types
- [ ] **Pointers** — Memory addressing and dereferencing
- [ ] **Import System** — Modular code with `import`/`export`
- [ ] **WebAssembly Target** — Compile to WASM instead of pseudo-assembly
- [ ] **Live Collaboration** — Multiple users editing via WebSockets
- [ ] **Assembly Interpreter** — Actually execute the generated pseudo-assembly

---

## Legend

- **Added** — New features
- **Changed** — Modifications to existing functionality
- **Deprecated** — Soon-to-be-removed features
- **Removed** — Deleted features
- **Fixed** — Bug fixes
- **Security** — Security-related changes
