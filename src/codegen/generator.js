class CodeGenerator {
  constructor() {
    this.output = [];
    this.regCounter = 0;
    this.labelCounter = 0;
    this.variables = new Map();
    this.varOffset = 0;
  }

  newReg() {
    return `R${this.regCounter++}`;
  }

  newLabel(prefix) {
    return `${prefix}_${this.labelCounter++}`;
  }

  emit(instruction, ...args) {
    this.output.push(`${instruction} ${args.join(", ")}`);
  }

  generate(node) {
    if (node.type === "Program") {
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("HALT");
    } else if (node.type === "Declaration") {
      const reg = this.visit(node.value);
      this.variables.set(node.name, reg);
      this.emit("MOV", reg, reg); // ensure register holds value
    } else if (node.type === "Assignment") {
      const reg = this.visit(node.value);
      this.variables.set(node.name, reg);
      this.emit("MOV", this.getVarReg(node.name), reg);
    } else if (node.type === "If") {
      const condReg = this.visitCondition(node.condition);
      const endLabel = this.newLabel("endif");
      this.emit("CMP", condReg, "1");
      this.emit("JNE", endLabel);
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("LABEL", endLabel);
    } else if (node.type === "While") {
      const startLabel = this.newLabel("while_start");
      const endLabel = this.newLabel("while_end");
      this.emit("LABEL", startLabel);
      const condReg = this.visitCondition(node.condition);
      this.emit("CMP", condReg, "1");
      this.emit("JNE", endLabel);
      node.body.forEach((stmt) => this.generate(stmt));
      this.emit("JMP", startLabel);
      this.emit("LABEL", endLabel);
    } else if (node.type === "Print") {
      const reg = this.visit(node.expression);
      this.emit("PRINT", reg);
    }
  }

  visit(node) {
    if (node.type === "Number") {
      const reg = this.newReg();
      this.emit("MOV", reg, node.value);
      return reg;
    }
    if (node.type === "Identifier") {
      return this.getVarReg(node.name);
    }
    if (node.type === "BinaryOp") {
      const left = this.visit(node.left);
      const right = this.visit(node.right);
      const result = this.newReg();
      const opMap = { "+": "ADD", "-": "SUB", "*": "MUL", "/": "DIV" };
      this.emit(opMap[node.operator] || "ADD", result, left, right);
      return result;
    }
    throw new Error(`Unknown node type: ${node.type}`);
  }

  visitCondition(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);
    const result = this.newReg();
    this.emit("CMP", left, right);

    const opMap = {
      ">": "SETG",
      "<": "SETL",
      ">=": "SETGE",
      "<=": "SETLE",
      "==": "SETE",
      "!=": "SETNE",
    };
    this.emit(opMap[node.operator] || "SETE", result);
    return result;
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
