/** ReleaseGateViz — 색상 팔레트 + step 정의
 *
 * 판단 플로우차트: 용량 문제인가? → (YES) 48GB 개조 / (NO) 통신 병목
 * → 병렬화 전략 선택 → 4기법 적용해도 못 메우는 대역폭 격차
 */

export const C = {
  decision: "#64748b", // Q1/Q2 분기 노드 (슬레이트)
  capacity: "#f59e0b", // YES 경로 — 48GB 개조 (앰버)
  comm: "#6366f1", // NO 경로 — GPU간 통신 병목 (인디고)
  pipeline: "#10b981", // 감당됨 — Pipeline Parallel (에메랄드)
  ep: "#8b5cf6", // EP 불가피 — 배치 최적화+quant+batching (바이올렛)
  gap: "#ef4444", // 최종 — 못 메운 대역폭 격차 (레드)
  verdict: "#0ea5e9", // 최종 결론 — 카드 선택 (스카이)
};

export const STEPS = [
  {
    label: "시작 — 용량 문제인가?",
    body: "Weight가 GPU 한 장에 안 들어가서 아예 못 올리는 상황인지부터 확인한다.\n아직 YES/NO 어느 갈래도 선택되지 않은 상태 — 두 화살표 모두 흐리게 표시된다.",
  },
  {
    label: "YES — 48GB 개조로 용량 문제 해결",
    body: "48GB 개조는 이 문제를 정확히 겨냥한 해법.\n대역폭은 그대로지만 애초에 '느리게라도 돌아가는' 상태를 만들 수 있다.",
  },
  {
    label: "NO — 병목은 GPU 간 통신",
    body: "모델이 이미 한 장(또는 개조 없는 24GB 여러 장)에 들어가고 문제가 처리량이라면 48GB 개조는 해당 사항이 없다.\n병목은 GPU 간 통신 — 다음은 병렬화 전략 선택이다.",
  },
  {
    label: "감당됨 — Pipeline Parallel로 all-reduce 회피",
    body: "Expert 수와 activation 크기가 감당된다면 pipeline parallel로 all-reduce 자체를 피하는 구성이 PCIe 2-way에서 더 유리하다.",
  },
  {
    label: "EP 불가피 — 배치 최적화 + quantization + batching",
    body: "Expert parallel이 불가피하다면 배치 최적화와 quantization으로 통신량을 줄이고, batching으로 나머지를 연산 뒤에 숨긴다.",
  },
  {
    label: "최종 판단 — 4기법으로도 못 메우는 9~14배 격차",
    body: "이 네 기법을 다 적용해도 A100·H100의 NVSwitch 대역폭 격차(9~14배)는 메워지지 않는다.\nMulti-tenant SLA·낮은 tail latency가 필수인 워크로드는 이 지점부터 워크스테이션·데이터센터 카드로 넘어가야 한다.",
  },
];
