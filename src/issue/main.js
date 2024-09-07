const { join } = require("path");
const { Worker } = require("worker_threads");
require("ssh2");

async function runWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker(join(__dirname, "worker.js"));
    worker.on("error", reject);
    worker.on("exit", resolve);
  });
}

(async () => {
  await runWorker();
  await runWorker();
})();
