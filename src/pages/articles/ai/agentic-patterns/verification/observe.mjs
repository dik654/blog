import assert from "node:assert/strict";
import { runExtensionBoundary } from "../extensionBoundaryModel.ts";

const base = {
  resource: " PROD/CUSTOMERS ",
  approval: "APR-42",
  expectedRows: 1200,
  observedRows: 1200,
  rollbackPassed: true,
};

const accepted = runExtensionBoundary(base);
const denied = runExtensionBoundary({ ...base, approval: null });
const rejected = runExtensionBoundary({ ...base, observedRows: 1199 });

assert.equal(accepted.status, "accepted");
assert.equal(accepted.trace.length, 5);
assert.deepEqual(denied, {
  status: "denied",
  effectStarted: false,
  trace: denied.trace,
});
assert.equal(denied.trace.length, 3);
assert.equal(rejected.status, "rejected");
assert.equal(rejected.effectStarted, true);

console.log(JSON.stringify({ accepted, denied, rejected }, null, 2));
