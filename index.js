const { parentPort } = require("worker_threads");

// Fake rows for demo purposes
const dummyRows = [
  { id: 1, name: "Sam", email: "sam@example.com" },
  { id: 2, name: "Müller", email: "mueller@example.com" },
  { id: 3, name: "Daniel", email: "daniel@example.com" }
];

parentPort.on("message", (msg) => {
  // NEW protocol (host -> plugin)
  if (msg && msg.type === "request") {
    // We intentionally do NOT support commands in this legacy plugin
    if (msg.action === "command") {
      parentPort.postMessage({
        type: "response",
        id: msg.id,
        error:
          "mysql-plugin is a legacy plugin (no commands/CSV contract). Please update plugin to host contract."
      });
      return;
    }

    parentPort.postMessage({
      type: "response",
      id: msg.id,
      error: `mysql-plugin legacy: unsupported request action "${msg.action}"`
    });
    return;
  }

  // OLD protocol (legacy)
  if (msg && msg.action === "scan") {
    parentPort.postMessage({ rows: dummyRows });
  } else if (msg && msg.action === "metadata") {
    parentPort.postMessage({
      tables: ["users", "orders"],
      description: "Dummy MySQL plugin (legacy)"
    });
  } else {
    parentPort.postMessage({ error: `Unknown action: ${msg?.action}` });
  }
});
