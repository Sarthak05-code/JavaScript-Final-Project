const sourceEditor = document.getElementById("sourceEditor");
const assemblyOutput = document.getElementById("assemblyOutput");
const lineNumbers = document.getElementById("lineNumbers");
const lineColDisplay = document.getElementById("lineColDisplay");
const compileBtn = document.getElementById("compileBtn");
const saveBtn = document.getElementById("saveBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const loadBtn = document.getElementById("loadBtn");
const errorToast = document.getElementById("errorToast");
const errorText = document.getElementById("errorText");
const statusText = document.getElementById("statusText");
const tokenCount = document.getElementById("tokenCount");
const examplesModal = document.getElementById("examplesModal");
const examplesList = document.getElementById("examplesList");
const closeModal = document.getElementById("closeModal");

const examples = {
  "Hello World": `string msg = "Hello, World!";
print(msg);`,

  Fibonacci: `int n = 10;
int a = 0;
int b = 1;
int i = 0;

while (i < n) {
    print(a);
    int temp = a + b;
    a = b;
    b = temp;
    i = i + 1;
}`,

  "If/Else": `int x = 15;

if (x > 10) {
    print(100);
} else {
    print(200);
}

if (x == 15) {
    print(999);
}`,

  "For Loop": `int sum = 0;

for (int i = 0; i < 5; i = i + 1) {
    sum = sum + i;
}

print(sum);`,

  Arrays: `int arr[5] = {10, 20, 30, 40, 50};
int idx = 2;
print(arr[idx]);

arr[0] = 99;
print(arr[0]);`,

  Functions: `function int add(int a, int b) {
    return a + b;
}

int result = add(5, 3);
print(result);`,

  Factorial: `function int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int f = factorial(5);
print(f);`,

  Booleans: `bool flag = true;
int x = 10;

if (flag && x > 5) {
    print(1);
}

if (!flag || x == 10) {
    print(2);
}`,

  "String Concat (simulated)": `string hello = "Hello";
string world = "World";
print(hello);
print(world);`,

  "Prime Check": `int n = 17;
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
}`,
};

function updateLineNumbers() {
  const lines = sourceEditor.value.split("\n").length;
  lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join(
    "<br>",
  );
}

function updateCursorPos() {
  const pos = sourceEditor.selectionStart;
  const text = sourceEditor.value.substring(0, pos);
  const line = text.split("\n").length;
  const col = text.split("\n").pop().length + 1;
  lineColDisplay.textContent = `Ln ${line}, Col ${col}`;
}

function showError(msg, line) {
  errorText.textContent = msg;
  errorToast.classList.remove("hidden");
  statusText.textContent = "Error";
  statusText.className = "text-[#f38ba8]";

  if (line) {
    highlightErrorLine(line);
  }

  setTimeout(() => {
    errorToast.classList.add("hidden");
    clearErrorHighlight();
  }, 6000);
}

function hideError() {
  errorToast.classList.add("hidden");
  clearErrorHighlight();
  statusText.textContent = "Ready";
  statusText.className = "";
}

function highlightErrorLine(lineNum) {
  const lines = sourceEditor.value.split("\n");
  // Visual feedback via scroll
  const lineHeight = 24; // approx
  sourceEditor.scrollTop = (lineNum - 1) * lineHeight;
}

function clearErrorHighlight() {
  // Reset any visual markers
}

sourceEditor.addEventListener("input", () => {
  updateLineNumbers();
  hideError();
});

sourceEditor.addEventListener("keyup", updateCursorPos);
sourceEditor.addEventListener("click", updateCursorPos);
sourceEditor.addEventListener("scroll", () => {
  lineNumbers.scrollTop = sourceEditor.scrollTop;
});

// Tab support
sourceEditor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = sourceEditor.selectionStart;
    const end = sourceEditor.selectionEnd;
    sourceEditor.value =
      sourceEditor.value.substring(0, start) +
      "    " +
      sourceEditor.value.substring(end);
    sourceEditor.selectionStart = sourceEditor.selectionEnd = start + 4;
  }
});

compileBtn.addEventListener("click", async () => {
  hideError();
  compileBtn.innerHTML = `<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Compiling...`;

  const source = sourceEditor.value;

  try {
    const res = await fetch("/api/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source }),
    });

    const data = await res.json();

    if (data.success) {
      assemblyOutput.textContent = data.assembly;
      tokenCount.textContent = `${data.tokens?.length || 0} tokens`;
      statusText.textContent = "Compiled successfully";
      statusText.className = "text-[#a6e3a1]";

      // Add fade-in effect
      assemblyOutput.style.opacity = "0";
      setTimeout(() => (assemblyOutput.style.opacity = "1"), 50);
    } else {
      showError(
        `Line ${data.line || "?"}, Col ${data.col || "?"}: ${data.error}`,
        data.line,
      );
      assemblyOutput.textContent = "; Compilation failed\n; Check error below";
      tokenCount.textContent = "0 tokens";
    }
  } catch (err) {
    showError("Network error: " + err.message);
  } finally {
    compileBtn.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Compile`;
  }
});

saveBtn.addEventListener("click", async () => {
  const source = sourceEditor.value;
  const assembly = assemblyOutput.textContent;

  if (!source.trim()) {
    showError("Nothing to save");
    return;
  }

  try {
    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Program " + new Date().toLocaleTimeString(),
        source_code: source,
        assembly_output: assembly,
      }),
    });

    const data = await res.json();
    if (data.success) {
      saveBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Saved!`;
      setTimeout(
        () =>
          (saveBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg> Save`),
        1500,
      );
    } else {
      showError(data.error);
    }
  } catch (err) {
    showError("Save failed: " + err.message);
  }
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(assemblyOutput.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([assemblyOutput.textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "program.asm";
  a.click();
  URL.revokeObjectURL(url);
});

// Examples modal
loadBtn.addEventListener("click", () => {
  examplesList.innerHTML = Object.entries(examples)
    .map(
      ([name, code]) => `
        <button class="w-full text-left p-3 rounded-lg bg-[#1e1e2e] hover:bg-[#313244] transition-colors group" onclick="loadExample('${name}')">
            <div class="font-medium text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors">${name}</div>
            <div class="text-xs text-[#6c7086] mt-1 truncate">${code.split("\n")[0]}...</div>
        </button>
    `,
    )
    .join("");
  examplesModal.classList.remove("hidden");
  examplesModal.classList.add("flex");
});

closeModal.addEventListener("click", () => {
  examplesModal.classList.add("hidden");
  examplesModal.classList.remove("flex");
});

function loadExample(name) {
  sourceEditor.value = examples[name];
  updateLineNumbers();
  examplesModal.classList.add("hidden");
  examplesModal.classList.remove("flex");
  hideError();
}

// Init
updateLineNumbers();
