export interface ExExUseCase {
  id: string;
  label: string;
  category: string;
  desc: string;
  events: string;
  caveat: string;
  color: string;
}

export const USE_CASES: ExExUseCase[] = [
  {
    id: "indexer",
    label: "TX/로그 인덱서",
    category: "데이터 파이프라인",
    desc: "canonical block·receipt·log에서 query-oriented rows를 만들고 별도 DB에 기록한다.",
    events: "Committed → 인덱싱, Reverted → 롤백, Reorged → 롤백 + 재인덱싱",
    caveat:
      "block hash 기반 rollback, transaction 경계와 idempotent replay를 함께 시험해야 한다.",
    color: "#6366f1",
  },
  {
    id: "bridge",
    label: "L1→L2 브릿지 릴레이",
    category: "크로스체인",
    desc: "L1 contract event를 감지해 downstream bridge·rollup pipeline의 입력으로 변환한다.",
    events: "Committed → deposit 로그 감지 → L2 제출",
    caveat:
      "finality policy와 reorg compensation은 ExEx 바깥 downstream protocol까지 함께 설계해야 한다.",
    color: "#0ea5e9",
  },
  {
    id: "analytics",
    label: "실시간 분석",
    category: "모니터링",
    desc: "block·execution outcome에서 운영 지표나 도메인 통계를 파생한다.",
    events: "Committed → 통계 업데이트",
    caveat:
      "무거운 계산을 분리하더라도 완료 전 checkpoint를 앞당기지 않도록 durability contract가 필요하다.",
    color: "#10b981",
  },
];
