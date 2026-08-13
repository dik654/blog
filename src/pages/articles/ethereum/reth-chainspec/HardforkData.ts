export interface ForkType {
  id: string;
  condition: string;
  era: string;
  examples: string;
  detail: string;
  color: string;
}

export const FORK_TYPES: readonly ForkType[] = [
  {
    id: "block",
    condition: "Block(number)",
    era: "early execution-layer upgrades",
    examples: "number ≥ activation block",
    detail:
      "현재 block number로 판정한다. 실제 활성 시각을 계산하는 별도 추정은 consensus rule이 아니다.",
    color: "#6366f1",
  },
  {
    id: "ttd",
    condition: "TTD { total_difficulty, .. }",
    era: "Paris / The Merge",
    examples: "parent·total difficulty context",
    detail:
      "PoW chain의 누적 난이도 경계를 표현한다. 사후 canonical block 정보와 함께 transition을 보존할 수 있다.",
    color: "#8b5cf6",
  },
  {
    id: "timestamp",
    condition: "Timestamp(seconds)",
    era: "post-Merge upgrades",
    examples: "header timestamp ≥ activation time",
    detail:
      "wall-clock boundary를 표현한다. 12초마다 반드시 block이 생긴다는 전제나 예측값과는 다르다.",
    color: "#10b981",
  },
  {
    id: "never",
    condition: "Never",
    era: "custom chain policy",
    examples: "해당 rule set을 활성화하지 않음",
    detail:
      "체인이 특정 fork를 사용하지 않는 경우를 sentinel 숫자 없이 명시적으로 나타낸다.",
    color: "#64748b",
  },
] as const;
