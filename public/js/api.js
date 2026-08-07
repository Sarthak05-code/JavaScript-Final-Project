const sourceEditor = document.getElementById("sourceEditor");
const assemblyOutput = document.getElementById("assemblyOutput");
const compileBtn = document.getElementById("compileBtn");
const saveBtn = document.getElementById("saveBtn");
const errorToast = document.getElementById("errorToast");
const errorText = document.getElementById("errorText");

function showError(msg) {
  errorText.textContent = msg;
  errorToast.classList.remove("hidden");
  setTimeout(() => errorToast.classList.add("hidden"), 5000);
}

function hideError() {
  errorToast.classList.add("hidden");
}

compileBtn.addEventListener("click", async () => {
  hideError();
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
    } else {
      showError(
        `Line ${data.line || "?"}, Col ${data.col || "?"}: ${data.error}`,
      );
      assemblyOutput.textContent = "; Compilation failed";
    }
  } catch (err) {
    showError("Network error: " + err.message);
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
      compileBtn.textContent = "▶ Saved!";
      setTimeout(() => (compileBtn.innerHTML = "<span>▶</span> Compile"), 1500);
    } else {
      showError(data.error);
    }
  } catch (err) {
    showError("Save failed: " + err.message);
  }
});
