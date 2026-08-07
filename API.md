# Assembly Transpiler API

Base URL: `http://localhost:3000`

---

## POST /api/compile

Compile custom language source code to pseudo-assembly.

### Request

```http
POST /api/compile
Content-Type: application/json
```

```json
{
  "source": "int x = 5; print(x);"
}
```

### Success Response (200)

```json
{
    "success": true,
    "assembly": "MOV      R0, 5\nPRINT    R0\nHALT",
    "tokens": [
        { "type": "KEYWORD", "value": "int", "line": 1, "col": 1 },
        { "type": "IDENTIFIER", "value": "x", "line": 1, "col": 5 },
        { "type": "OPERATOR", "value": "=", "line": 1, "col": 7 },
        { "type": "NUMBER", "value": 5, "line": 1, "col": 9 },
        { "type": "SYMBOL", "value": ";", "line": 1, "col": 10 },
        { "type": "KEYWORD", "value": "print", "line": 1, "col": 12 },
        { "type": "SYMBOL", "value": "(", "line": 1, "col": 17 },
        { "type": "IDENTIFIER", "value": "x", "line": 1, "col": 18 },
        { "type": "SYMBOL", "value": ")", "line": 1, "col": 19 },
        { "type": "SYMBOL", "value": ";", "line": 1, "col": 20 },
        { "type": "EOF", "value": "EOF", "line": 1, "col": 21 }
    ],
    "ast": {
        "type": "Program",
        "body": [...]
    },
    "stats": {
        "tokens": 12,
        "lines": 1,
        "compileTimeMs": 2
    }
}
```

### Error Response (400)

```json
{
  "success": false,
  "error": "Unexpected token: $",
  "line": 1,
  "col": 5
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/compile \
  -H "Content-Type: application/json" \
  -d '{"source": "int x = 5; print(x);"}'
```

---

## POST /api/programs

Save a program to the database.

### Request

```http
POST /api/programs
Content-Type: application/json
```

```json
{
  "name": "Hello World",
  "source_code": "string msg = \"Hello\"; print(msg);",
  "assembly_output": "LOADSTR  R0, STR_0\nPRINT    R0\nHALT"
}
```

### Success Response (200)

```json
{
  "success": true,
  "id": 1
}
```

### Error Response (500)

```json
{
  "success": false,
  "error": "ER_ACCESS_DENIED_ERROR: Access denied for user..."
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/programs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Factorial",
    "source_code": "function int factorial(int n) { if (n <= 1) { return 1; } return n * factorial(n - 1); } print(factorial(5));",
    "assembly_output": "; assembly output here"
}'
```

---

## GET /api/programs

List all saved programs.

### Request

```http
GET /api/programs
```

### Success Response (200)

```json
{
  "success": true,
  "programs": [
    {
      "id": 1,
      "name": "Hello World",
      "source_code": "string msg = \"Hello\"; print(msg);",
      "assembly_output": "LOADSTR  R0, STR_0\nPRINT    R0\nHALT",
      "created_at": "2026-08-07T12:00:00.000Z",
      "updated_at": "2026-08-07T12:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Factorial",
      "source_code": "...",
      "assembly_output": "...",
      "created_at": "2026-08-07T12:30:00.000Z",
      "updated_at": "2026-08-07T12:30:00.000Z"
    }
  ]
}
```

### cURL Example

```bash
curl http://localhost:3000/api/programs
```

---

## GET /api/programs/:id

Get a specific program by ID.

### Request

```http
GET /api/programs/1
```

### Success Response (200)

```json
{
  "success": true,
  "program": {
    "id": 1,
    "name": "Hello World",
    "source_code": "string msg = \"Hello\"; print(msg);",
    "assembly_output": "LOADSTR  R0, STR_0\nPRINT    R0\nHALT",
    "created_at": "2026-08-07T12:00:00.000Z",
    "updated_at": "2026-08-07T12:00:00.000Z"
  }
}
```

### Not Found Response (404)

```json
{
  "success": false,
  "error": "Not found"
}
```

### cURL Example

```bash
curl http://localhost:3000/api/programs/1
```

---

## Error Codes

| Status | Meaning                             |
| ------ | ----------------------------------- |
| 200    | Success                             |
| 400    | Compilation error (syntax/semantic) |
| 404    | Program not found                   |
| 500    | Server or database error            |

---

## Supported Language Features

| Feature   | Example                                            |
| --------- | -------------------------------------------------- |
| Variables | `int x = 5;`                                       |
| Strings   | `string s = "hello";`                              |
| Booleans  | `bool flag = true;`                                |
| Arrays    | `int arr[3] = {1, 2, 3};`                          |
| If/Else   | `if (x > 5) { ... } else { ... }`                  |
| While     | `while (i < 10) { ... }`                           |
| For       | `for (int i = 0; i < 10; i = i + 1) { ... }`       |
| Functions | `function int add(int a, int b) { return a + b; }` |
| Recursion | `function int fact(int n) { ... }`                 |
| Print     | `print(x);` or `print("hello");`                   |
| Comments  | `// line` or `/* block */`                         |
| Increment | `i++;` or `++i;`                                   |
