export type DomainInterventionCandidate = {
  id: "prompt" | "rag" | "continued-pretraining" | "sft" | "rag-sft";
  label: string;
  currentEvidence: boolean;
  targetGain: number;
  generalChange: number;
  cost: number;
};

export const DOMAIN_ADAPTATION_FIXTURE = {
  request: "2026년 환불 규정의 최신 조항을 근거와 함께 알려 주세요.",
  sourceRevision: "refund-policy-2026-10",
  targetGainMinimum: 3,
  regressionBudget: 1,
  costBudget: 3,
  candidates: [
    { id: "prompt", label: "Prompt only", currentEvidence: false, targetGain: 1, generalChange: 0, cost: 1 },
    { id: "rag", label: "RAG", currentEvidence: true, targetGain: 3, generalChange: 0, cost: 2 },
    { id: "continued-pretraining", label: "Continued pretraining", currentEvidence: false, targetGain: 4, generalChange: -2, cost: 4 },
    { id: "sft", label: "SFT", currentEvidence: false, targetGain: 2, generalChange: -0.5, cost: 2 },
    { id: "rag-sft", label: "RAG + SFT", currentEvidence: true, targetGain: 5, generalChange: -0.5, cost: 4 },
  ] satisfies readonly DomainInterventionCandidate[],
} as const;

export function candidatePassesHardRequirements(candidate: DomainInterventionCandidate) {
  return candidate.currentEvidence;
}

export function candidatePassesQuality(candidate: DomainInterventionCandidate) {
  return (
    candidate.targetGain >= DOMAIN_ADAPTATION_FIXTURE.targetGainMinimum &&
    candidate.generalChange >= -DOMAIN_ADAPTATION_FIXTURE.regressionBudget
  );
}

export function candidateFitsBudget(candidate: DomainInterventionCandidate) {
  return candidate.cost <= DOMAIN_ADAPTATION_FIXTURE.costBudget;
}

export function candidateIsEligible(candidate: DomainInterventionCandidate) {
  return (
    candidatePassesHardRequirements(candidate) &&
    candidatePassesQuality(candidate) &&
    candidateFitsBudget(candidate)
  );
}
