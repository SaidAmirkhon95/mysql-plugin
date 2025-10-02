const { parentPort } = require("worker_threads");

// Fake rows for demo purposes
const dummyRows = [
  { id: 1, name: "Sam", email: "sam@example.com" },
  { id: 2, name: "Müller", email: "mueller@example.com" },
  { id: 3, name: "Daniel", email: "daniel@example.com" }
];

parentPort.on("message", (msg) => {
  if (msg.action === "scan") {
    parentPort.postMessage({ rows: dummyRows });
  } else if (msg.action === "metadata") {
    parentPort.postMessage({
      tables: ["users", "orders"],
      description: "Dummy MySQL plugin"
    });
  } else {
    parentPort.postMessage({ error: `Unknown action: ${msg.action}` });
  }
});
