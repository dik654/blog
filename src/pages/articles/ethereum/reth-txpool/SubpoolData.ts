export interface SubpoolInfo {
  name: string;
  condition: string;
  detail: string;
  color: string;
}
export const SUBPOOLS: readonly SubpoolInfo[] = [
  {
    name: "Pending",
    condition: "nonce chain ready · fee eligible",
    detail:
      "현재 account state에서 sender chain의 다음 실행 가능한 transactions. Builder ordering의 후보가 된다.",
    color: "#10b981",
  },
  {
    name: "BaseFee",
    condition: "nonce chain ready · fee blocked",
    detail:
      "nonce dependency는 충족하지만 현재 base fee 때문에 실행할 수 없다. 새 head에서 fee eligibility를 다시 평가한다.",
    color: "#0ea5e9",
  },
  {
    name: "Queued",
    condition: "sender nonce gap or blocked ancestor",
    detail:
      "앞선 nonce가 없거나 같은 sender의 ancestor가 아직 eligible하지 않아 후속 transaction을 실행할 수 없다.",
    color: "#ef4444",
  },
] as const;
export const STATE_CHANGES = [
  {
    event: "New canonical block",
    action:
      "mined transactions를 제거하고 nonce·balance·base fee로 affected sender chains를 재분류한다.",
  },
  {
    event: "Reorg",
    action:
      "reverted transactions를 재검증해 넣고 새 canonical branch에서 이미 소비된 transactions를 제거한다.",
  },
  {
    event: "Replacement",
    action:
      "같은 sender·nonce의 기존 transaction과 type-aware bump policy를 비교한 뒤 descendants를 다시 평가한다.",
  },
  {
    event: "Resource pressure",
    action:
      "configured limits와 local/type policy로 eviction하되 sender dependency가 바뀐 후속 transactions를 재분류한다.",
  },
] as const;
