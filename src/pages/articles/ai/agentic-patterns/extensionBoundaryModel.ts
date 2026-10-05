export type ExtensionRequest = {
  resource: string;
  approval: string | null;
  expectedRows: number;
  observedRows: number;
  rollbackPassed: boolean;
};

export type BoundaryTrace = {
  stage: "hook" | "skill" | "guardrail" | "executor" | "verifier";
  decision: string;
};

export type BoundaryResult = {
  status: "denied" | "rejected" | "accepted";
  effectStarted: boolean;
  trace: BoundaryTrace[];
};

export function runExtensionBoundary(request: ExtensionRequest): BoundaryResult {
  const trace: BoundaryTrace[] = [];

  const normalizedResource = request.resource.trim().toLowerCase();
  trace.push({ stage: "hook", decision: `normalize:${normalizedResource}` });

  trace.push({
    stage: "skill",
    decision: "load:backup → migrate → count → rollback-test",
  });

  const authorized =
    normalizedResource === "prod/customers" && request.approval === "APR-42";
  trace.push({
    stage: "guardrail",
    decision: authorized ? "allow:APR-42" : "deny:approval-or-resource",
  });
  if (!authorized) return { status: "denied", effectStarted: false, trace };

  trace.push({ stage: "executor", decision: "migration-receipt:fx-9001" });

  const artifactPassed =
    request.observedRows === request.expectedRows && request.rollbackPassed;
  trace.push({
    stage: "verifier",
    decision: artifactPassed ? "accept:count-and-rollback" : "reject:invariant",
  });

  return {
    status: artifactPassed ? "accepted" : "rejected",
    effectStarted: true,
    trace,
  };
}
