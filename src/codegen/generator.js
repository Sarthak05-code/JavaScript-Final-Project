class CodeGenerator {
  constructor() {
    this.output = [];
    this.regCounter = 0;
    this.labelCounter = 0;
    this.variables = new Map();
    this.arrays = new Map();
    this.functions = new Map();
    this.stringPool = [];
    this.currentFunction = null;
  }

  newReg() {
    return `R${this.regCounter++}`;
  }

  newLabel(prefix) {
    return `${prefix}_${this.labelCounter++}`;
  }

  emit(instruction, ...args) {
    this.output.push(`${instruction.padEnd(8)} ${args.join(", ")}`);
  }

  emitComment(text) {
    this.output.push(`; ${text}`);
  }

  generate(node) {
    if (node.type === "Program") {
      this.emitComment("=== DATA SECTION ===");
      node.body.forEach((stmt) => {
        if (stmt.type === "Function") this.emitComment(`func: ${stmt.name}`);
      });
      this.emitComment("=== CODE SECTION ===");
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("HALT");
      this.emitComment("=== STRING POOL ===");
      this.stringPool.forEach((str, i) => {
        this.output.push(`STR_${i}: "${str}"`);
      });
    } else if (node.type === "Function") {
      this.functions.set(node.name, true);
      this.emitComment(`function ${node.name}`);
      this.emit("LABEL", `func_${node.name}`);
      this.currentFunction = node.name;

      // Register parameters as variables
      node.params.forEach((param) => {
        const reg = this.newReg();
        this.variables.set(param.name, reg);
        this.emit("POP", reg); // pop argument from stack into register
      });

      node.body.forEach((stmt) => this.generate(stmt));
      if (node.returnType === "void") {
        this.emit("RET");
      }
      this.currentFunction = null;
    } else if (node.type === "Declaration") {
      const reg = node.value ? this.visit(node.value) : this.newReg();
      this.variables.set(node.name, reg);
    } else if (node.type === "ArrayDeclaration") {
      const baseReg = this.newReg();
      this.arrays.set(node.name, baseReg);
      const size = node.size || (node.values ? node.values.length : 0);
      this.emit("ALLOC", baseReg, size);
      if (node.values) {
        node.values.forEach((val, i) => {
          const valReg = this.visit(val);
          this.emit("STORE", baseReg, i, valReg);
        });
      }
    } else if (node.type === "Assignment") {
      const reg = this.visit(node.value);
      this.variables.set(node.name, reg);
      this.emit("MOV", this.getVarReg(node.name), reg);
    } else if (node.type === "ArrayAssignment") {
      const baseReg = this.arrays.get(node.name);
      const idxReg = this.visit(node.index);
      const valReg = this.visit(node.value);
      this.emit("STORE", baseReg, idxReg, valReg);
    } else if (node.type === "IncDec") {
      const reg = this.getVarReg(node.name);
      const oneReg = this.newReg();
      this.emit("MOV", oneReg, 1);
      const op = node.operator === "++" ? "ADD" : "SUB";
      this.emit(op, reg, reg, oneReg);
    } else if (node.type === "If") {
      const elseLabel = this.newLabel("else");
      const endLabel = this.newLabel("endif");
      const condReg = this.visitCondition(node.condition);
      this.emit("CMP", condReg, 0);
      this.emit("JE", elseLabel);
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("JMP", endLabel);
      this.emit("LABEL", elseLabel);
      if (node.elseBody) {
        node.elseBody.forEach((stmt) => this.generate(stmt));
      }
      this.emit("LABEL", endLabel);
    } else if (node.type === "While") {
      const startLabel = this.newLabel("while_start");
      const endLabel = this.newLabel("while_end");
      this.emit("LABEL", startLabel);
      const condReg = this.visitCondition(node.condition);
      this.emit("CMP", condReg, 0);
      this.emit("JE", endLabel);
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("JMP", startLabel);
      this.emit("LABEL", endLabel);
    } else if (node.type === "For") {
      if (node.init) this.generate(node.init);
      const startLabel = this.newLabel("for_start");
      const endLabel = this.newLabel("for_end");
      const contLabel = this.newLabel("for_cont");
      this.emit("LABEL", startLabel);
      const condReg = this.visitCondition(node.condition);
      this.emit("CMP", condReg, 0);
      this.emit("JE", endLabel);
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("LABEL", contLabel);
      if (node.update) this.generate(node.update);
      this.emit("JMP", startLabel);
      this.emit("LABEL", endLabel);
    } else if (node.type === "Break") {
      this.emit("JMP", `for_end_${this.labelCounter - 1}`); // Simplified
    } else if (node.type === "Continue") {
      this.emit("JMP", `for_cont_${this.labelCounter - 1}`); // Simplified
    } else if (node.type === "Return") {
      if (node.value) {
        const reg = this.visit(node.value);
        this.emit("MOV", "R0", reg);
      }
      this.emit("RET");
    } else if (node.type === "Print") {
      node.arguments.forEach((arg) => {
        const reg = this.visit(arg);
        this.emit("PRINT", reg);
      });
    } else if (node.type === "ExpressionStatement") {
      this.visit(node.expression);
    }
  }

  visit(node) {
    if (node.type === "Number") {
      const reg = this.newReg();
      this.emit("MOV", reg, node.value);
      return reg;
    }
    if (node.type === "String") {
      const idx = this.stringPool.indexOf(node.value);
      const actualIdx = idx === -1 ? this.stringPool.push(node.value) - 1 : idx;
      const reg = this.newReg();
      this.emit("LOADSTR", reg, `STR_${actualIdx}`);
      return reg;
    }
    if (node.type === "Boolean") {
      const reg = this.newReg();
      this.emit("MOV", reg, node.value ? 1 : 0);
      return reg;
    }
    if (node.type === "Identifier") {
      return this.getVarReg(node.name);
    }
    if (node.type === "ArrayAccess") {
      const baseReg = this.arrays.get(node.name);
      const idxReg = this.visit(node.index);
      const resultReg = this.newReg();
      this.emit("LOAD", resultReg, baseReg, idxReg);
      return resultReg;
    }
    if (node.type === "CallExpression") {
      const argRegs = node.arguments.map((arg) => this.visit(arg));
      // Push arguments in reverse order so first param is popped first
      for (let i = argRegs.length - 1; i >= 0; i--) {
        this.emit("PUSH", argRegs[i]);
      }
      this.emit("CALL", `func_${node.name}`);
      return "R0";
    }
    if (node.type === "UnaryOp") {
      const operand = this.visit(node.operand);
      const result = this.newReg();
      if (node.operator === "!") {
        this.emit("NOT", result, operand);
      } else if (node.operator === "-") {
        this.emit("NEG", result, operand);
      }
      return result;
    }
    if (node.type === "BinaryOp") {
      const left = this.visit(node.left);
      const right = this.visit(node.right);
      const result = this.newReg();
      const opMap = {
        "+": "ADD",
        "-": "SUB",
        "*": "MUL",
        "/": "DIV",
        "%": "MOD",
        ">": "GT",
        "<": "LT",
        ">=": "GE",
        "<=": "LE",
        "==": "EQ",
        "!=": "NE",
        "&&": "AND",
        "||": "OR",
      };
      this.emit(opMap[node.operator] || "ADD", result, left, right);
      return result;
    }
    if (node.type === "IncDec") {
      const reg = this.getVarReg(node.name);
      const oneReg = this.newReg();
      this.emit("MOV", oneReg, 1);
      const op = node.operator === "++" ? "ADD" : "SUB";
      this.emit(op, reg, reg, oneReg);
      return reg;
    }
    throw new Error(`Unknown node type: ${node.type}`);
  }

  visitCondition(node) {
    if (
      node.type === "BinaryOp" &&
      [">", "<", ">=", "<=", "==", "!="].includes(node.operator)
    ) {
      const left = this.visit(node.left);
      const right = this.visit(node.right);
      const result = this.newReg();
      const opMap = {
        ">": "GT",
        "<": "LT",
        ">=": "GE",
        "<=": "LE",
        "==": "EQ",
        "!=": "NE",
      };
      this.emit(opMap[node.operator], result, left, right);
      return result;
    }
    return this.visit(node);
  }

  getVarReg(name) {
    if (!this.variables.has(name)) {
      throw new Error(`Undefined variable: ${name}`);
    }
    return this.variables.get(name);
  }

  getOutput() {
    return this.output.join("\n");
  }
}

module.exports = { CodeGenerator };
