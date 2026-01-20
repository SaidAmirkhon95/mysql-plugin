const { parentPort } = require("worker_threads");

// Fake rows for demo purposes
const dummyRows = [
  { id: 1, name: "Sam", email: "sam@example.com" },
  { id: 2, name: "Müller", email: "mueller@example.com" },
  { id: 3, name: "Daniel", email: "daniel@example.com" }
];

parentPort.on("message", (msg) => {
  if (!msg || msg.type !== "request") return;

  // Host calls commands like: { type:"request", action:"command", payload:{commandId:"mysql.scan"} }
  if (msg.action === "command") {
    const { commandId } = msg.payload || {};

    if (commandId === "mysql.scan") {
      // ❌ INTENTIONALLY wrong: return JSON instead of CSV
      parentPort.postMessage({
        type: "response",
        id: msg.id,
        payload: {
          format: "json",
          data: dummyRows
        }
      });
      return;
    }

    parentPort.postMessage({
      type: "response",
      id: msg.id,
      error: "Unknown commandId: " + commandId
    });
    return;
  }

  parentPort.postMessage({
    type: "response",
    id: msg.id,
    error: `Unsupported action: ${msg.action}`
  });
});
