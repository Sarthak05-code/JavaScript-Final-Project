# Assembly Transpiler

A custom programming language transpiler that converts high-level code into pseudo-assembly. Built with Node.js, Express, MySQL, and Tailwind CSS.

![Project Status](https://img.shields.io/badge/status-working-success)
![Node.js](https://img.shields.io/badge/Node.js-24+-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Language Syntax](#language-syntax)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Example Programs](#example-programs)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

This project is a **compiler front-end** that demonstrates how programming languages work under the hood. It takes a custom C-like language and compiles it down to pseudo-assembly instructions.

**What is a transpiler?**

> A transpiler (source-to-source compiler) converts code from one language to another. In this case, from our custom high-level language to low-level assembly-like instructions.

---

## Features

### Language Features

- **Data Types**: `int`, `float`, `string`, `bool`
- **Variables & Arrays**: Declaration, assignment, array indexing
- **Control Flow**: `if`/`else`, `while`, `for` loops
- **Functions**: Declaration, parameters, return values, recursion
- **Operators**: Arithmetic (`+`, `-`, `*`, `/`, `%`), comparison (`==`, `!=`, `<`, `>`, `<=`, `>=`), logical (`&&`, `||`, `!`)
- **Increment/Decrement**: `++`, `--`
- **Built-ins**: `print()`, `input()`
- **Comments**: Single-line `//` and multi-line `/* */`
- **Break/Continue**: Loop control statements

### Application Features

- Real-time compilation with error highlighting
- Syntax-aware code editor with line numbers
- Side-by-side source and assembly view
- Example programs library
- Save/load programs to MySQL database
- Download generated assembly as `.asm` file
- Copy assembly to clipboard
- Compilation statistics (tokens, lines, time)

---

## Tech Stack

| Layer         | Technology             | Purpose                          |
| ------------- | ---------------------- | -------------------------------- |
| **Runtime**   | Node.js 24+            | JavaScript execution environment |
| **Framework** | Express 5.x            | Web server and API               |
| **Database**  | MySQL 8.0              | Program persistence              |
| **Driver**    | mysql2                 | Node.js MySQL connection         |
| **Styling**   | Tailwind CSS v4        | Utility-first CSS framework      |
| **Build**     | PostCSS + Autoprefixer | CSS processing                   |
| **Fonts**     | Fira Code, Inter       | Monospace and UI fonts           |

---

## Architecture

```
Source Code (Custom Language)
    |
    v
[Lexer] → Tokens
    |
    v
[Parser] → Abstract Syntax Tree (AST)
    |
    v
[Code Generator] → Pseudo-Assembly
    |
    v
[MySQL] → Save/Load Programs
```

### Compiler Pipeline

1. **Lexical Analysis (Tokenization)**
   - Breaks source code into tokens (keywords, identifiers, numbers, operators)
   - Handles strings with escape sequences
   - Strips comments

2. **Syntax Analysis (Parsing)**
   - Recursive descent parser builds an AST
   - Validates grammar and structure
   - Reports syntax errors with line/column info

3. **Code Generation**
   - Walks the AST and emits assembly instructions
   - Manages registers (R0, R1, R2, ...)
   - Handles labels for jumps and loops
   - Allocates arrays on the heap

---

## Installation

### Prerequisites

- Node.js 24+ installed
- MySQL Server 8.0+ running
- MySQL Workbench (optional, for visual schema design)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sarthak05-code/JavaScript-Final-Project.git
cd JavaScript-Final-Project
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up MySQL Database

1. Open MySQL Workbench
2. Run the schema script:
   ```sql
   -- File: database/schema.sql
   CREATE DATABASE IF NOT EXISTS transpiler;
   USE transpiler;

   CREATE TABLE IF NOT EXISTS programs (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       source_code TEXT NOT NULL,
       assembly_output TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   CREATE TABLE IF NOT EXISTS compile_history (
       id INT AUTO_INCREMENT PRIMARY KEY,
       program_id INT,
       success BOOLEAN,
       error_message TEXT,
       compile_time_ms INT,
       compiled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
   );
   ```

### Step 4: Configure Database Connection

Edit `config/db.js` with your MySQL credentials:

```js
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "YOUR_PASSWORD_HERE", // <-- Change this
  database: "transpiler",
  waitForConnections: true,
  connectionLimit: 10,
});
```

### Step 5: Build CSS

```bash
npm run build:css
```

### Step 6: Start the Server

```bash
npm start
```

### Step 7: Open in Browser

Navigate to: `http://localhost:3000`

---

## Usage

### Writing Code

1. Type or paste custom language code in the left panel
2. Click **Compile** (or press Ctrl+Enter)
3. View generated assembly in the right panel
4. Fix any errors shown in the error toast

### Saving Programs

1. Write your code
2. Click **Save**
3. Program is stored in MySQL with timestamp

### Loading Examples

1. Click **Examples** button
2. Select from pre-built programs (Fibonacci, Factorial, etc.)
3. Code loads into the editor

### Downloading Assembly

1. Compile your program
2. Click **Download** in the assembly panel
3. File saves as `program.asm`

---

## Language Syntax

### Variables

```c
int x = 10;
float pi = 3.14;
string name = "Hello";
bool flag = true;
```

### Arrays

```c
int arr[5] = {1, 2, 3, 4, 5};
print(arr[0]);      // Output: 1
arr[0] = 100;       // Modify element
```

### If/Else

```c
int x = 15;
if (x > 10) {
    print(100);
} else {
    print(200);
}
```

### While Loop

```c
int i = 0;
while (i < 5) {
    print(i);
    i = i + 1;
}
```

### For Loop

```c
for (int i = 0; i < 5; i = i + 1) {
    print(i);
}
```

### Functions

```c
function int add(int a, int b) {
    return a + b;
}

int result = add(5, 3);
print(result);  // Output: 8
```

### Recursion

```c
function int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

print(factorial(5));  // Output: 120
```

### Strings

```c
string msg = "Hello, World!";
print(msg);

// Direct string printing
print("Hello", "World");
```

### Comments

```c
// Single-line comment

/*
 * Multi-line comment
 * Supports documentation blocks
 */
```

---

## API Endpoints

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| `POST` | `/api/compile`      | Compile source code to assembly |
| `POST` | `/api/programs`     | Save a program to database      |
| `GET`  | `/api/programs`     | List all saved programs         |
| `GET`  | `/api/programs/:id` | Get a specific program          |

### Compile Request

```bash
curl -X POST http://localhost:3000/api/compile   -H "Content-Type: application/json"   -d '{"source": "int x = 5; print(x);"}'
```

### Compile Response

```json
{
  "success": true,
  "assembly": "MOV      R0, 5
PRINT    R0
HALT",
  "tokens": [...],
  "ast": {...},
  "stats": {
    "tokens": 7,
    "lines": 1,
    "compileTimeMs": 2
  }
}
```

---

## Database Schema

### programs Table

| Column            | Type         | Description        |
| ----------------- | ------------ | ------------------ |
| `id`              | INT PK       | Auto-increment ID  |
| `name`            | VARCHAR(255) | Program name       |
| `source_code`     | TEXT         | Source code        |
| `assembly_output` | TEXT         | Generated assembly |
| `created_at`      | TIMESTAMP    | Creation time      |
| `updated_at`      | TIMESTAMP    | Last update time   |

### compile_history Table

| Column            | Type      | Description           |
| ----------------- | --------- | --------------------- |
| `id`              | INT PK    | Auto-increment ID     |
| `program_id`      | INT FK    | Reference to programs |
| `success`         | BOOLEAN   | Compilation success   |
| `error_message`   | TEXT      | Error details         |
| `compile_time_ms` | INT       | Compilation duration  |
| `compiled_at`     | TIMESTAMP | Compilation time      |

---

## Example Programs

### Hello World

```c
string msg = "Hello, World!";
print(msg);
```

### Fibonacci Sequence

```c
int n = 10;
int a = 0;
int b = 1;
int i = 0;

while (i < n) {
    print(a);
    int temp = a + b;
    a = b;
    b = temp;
    i = i + 1;
}
```

### Prime Check

```c
int n = 17;
bool isPrime = true;
int i = 2;

while (i * i <= n) {
    if (n % i == 0) {
        isPrime = false;
    }
    i = i + 1;
}

if (isPrime) {
    print(1);
} else {
    print(0);
}
```

### Bubble Sort (Arrays)

```c
int arr[5] = {64, 34, 25, 12, 22};
int n = 5;
int i = 0;

while (i < n - 1) {
    int j = 0;
    while (j < n - i - 1) {
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
        j = j + 1;
    }
    i = i + 1;
}

// Print sorted array
i = 0;
while (i < n) {
    print(arr[i]);
    i = i + 1;
}
```

---

## Screenshots

_(Add screenshots of your application here)_

- Main editor interface
- Compilation with assembly output
- Error highlighting
- Examples modal

---

## Project Structure

```
JavaScript-Final-Project/
├── config/
│   └── db.js                 # MySQL connection pool
├── database/
│   └── schema.sql            # Database schema
├── public/
│   ├── css/
│   │   ├── input.css         # Tailwind directives
│   │   └── output.css        # Compiled CSS (generated)
│   ├── js/
│   │   └── editor.js         # Frontend logic
│   └── index.html            # Main UI
├── routes/
│   ├── compile.js            # Compilation API
│   └── programs.js           # CRUD for programs
├── src/
│   ├── codegen/
│   │   └── generator.js      # Assembly code generator
│   ├── lexer/
│   │   └── lexer.js          # Tokenizer
│   ├── parser/
│   │   └── parser.js         # AST builder
│   └── utils/
│       └── errors.js         # Custom error class
├── server.js                 # Express server
├── package.json
├── postcss.config.js
└── README.md
```

---

## How It Works

### 1. Lexical Analysis

The lexer scans the source code character by character and produces a stream of tokens:

```javascript
// Input: int x = 5;
// Output:
[
  { type: "KEYWORD", value: "int", line: 1, col: 1 },
  { type: "IDENTIFIER", value: "x", line: 1, col: 5 },
  { type: "OPERATOR", value: "=", line: 1, col: 7 },
  { type: "NUMBER", value: 5, line: 1, col: 9 },
  { type: "SYMBOL", value: ";", line: 1, col: 10 },
];
```

### 2. Parsing

The parser uses recursive descent to build an Abstract Syntax Tree (AST):

```javascript
{
  type: "Program",
  body: [
    {
      type: "Declaration",
      varType: "int",
      name: "x",
      value: { type: "Number", value: 5 }
    }
  ]
}
```

### 3. Code Generation

The generator walks the AST and emits assembly:

```asm
MOV      R0, 5
HALT
```

### Register Management

- Registers are allocated dynamically (R0, R1, R2, ...)
- Variables map to their assigned registers
- Each operation generates new registers for results

### String Handling

- Strings are stored in a string pool
- `LOADSTR` instruction loads string address into register
- `PRINTS` prints string by pool index

---

## Future Improvements

- [ ] **Syntax Highlighting**: Real-time color coding in editor
- [ ] **Step Debugger**: Execute assembly line-by-line with visual state
- [ ] **Optimizer**: Constant folding, dead code elimination
- [ ] **More Types**: `char`, `double`, `long`
- [ ] **Structs**: User-defined data types
- [ ] **Pointers**: Memory addressing
- [ ] **Import System**: Modular code
- [ ] **WebAssembly Target**: Compile to WASM instead of pseudo-assembly

---

## What I Learned

- **Compiler Design**: Lexical analysis, parsing, code generation
- **Recursive Descent Parsing**: Building ASTs from token streams
- **Register Allocation**: Managing limited resources
- **Full-Stack Development**: Node.js, Express, MySQL integration
- **Modern CSS**: Tailwind CSS v4 with PostCSS
- **Error Handling**: Meaningful error messages with line/column info

---

## License

ISC

---

## Author

**Sarthak** — [GitHub](https://github.com/Sarthak05-code)

---

_Built as a final project for JavaScript coursework._
