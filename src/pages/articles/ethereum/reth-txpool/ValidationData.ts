export interface ValidationStep {
  order: number;
  check: string;
  failReason: string;
  detail: string;
  color: string;
}
export const VALIDATION_STEPS: readonly ValidationStep[] = [
  {
    order: 1,
    check: "Envelope·fork",
    failReason: "unsupported / malformed",
    detail:
      "transaction type, chain id와 fork activation에 맞는 fields·encoding인지 확인한다.",
    color: "#6366f1",
  },
  {
    order: 2,
    check: "Fee·gas shape",
    failReason: "invalid fee fields",
    detail:
      "fee cap 관계, gas limit, intrinsic gas와 type-specific resource declarations의 구조적 유효성을 확인한다.",
    color: "#0ea5e9",
  },
  {
    order: 3,
    check: "Signature·sender",
    failReason: "invalid signature",
    detail:
      "type별 signing payload에서 sender를 복구하고 signature canonicality와 chain replay protection을 적용한다.",
    color: "#f59e0b",
  },
  {
    order: 4,
    check: "Account state",
    failReason: "nonce / funds",
    detail:
      "같은 canonical provider view의 nonce와 balance로 stale nonce, affordability와 sender limits를 평가한다.",
    color: "#10b981",
  },
  {
    order: 5,
    check: "Blob conditions",
    failReason: "invalid / unavailable sidecar",
    detail:
      "blob transaction이면 versioned hashes, sidecar·proof 관계와 configured blob pool policy를 추가로 검사한다.",
    color: "#8b5cf6",
  },
  {
    order: 6,
    check: "Classification result",
    failReason: "reject / defer",
    detail:
      "영구 invalid, replacement conflict, nonce gap, fee-blocked와 eligible 결과를 구분해 다음 pool action을 결정한다.",
    color: "#ef4444",
  },
] as const;
