/** CapacityModViz — 색상 팔레트 + step 정의 */

export const C = {
  chip1: "#6366f1", // 정품 1GB(8Gbit) 칩
  chip2: "#f59e0b", // 개조 2GB(16Gbit) 칩
  bus: "#10b981", // 384-bit 버스 / 12채널 / 대역폭 값 / "해결됨"
  capacity: "#8b5cf6", // 용량 축 강조
  muted: "#94a3b8", // 대역폭 식과 무관한 항목(밀도)
  alert: "#ef4444", // 비검증·워런티 소멸 위험 / "해결 안 됨"
};

/**
 * 12채널 각 칩(앞/뒤 공용)의 x좌표.
 * PCB 앞면 12칩·뒷면 12칩이 채널마다 같은 x에 겹쳐 그려진다.
 */
export const CHIP_XS = Array.from(
  { length: 12 },
  (_, i) => 44 + i * ((436 - 44) / 11),
);

export const STEPS = [
  {
    label: "정품 24GB — 이미 clamshell 구조",
    body: "384-bit 버스를 12채널로 나누고, PCB 앞면 12칩·뒷면 12칩(각 1GB)이 채널 하나를 공유한다.\n12채널 × 2GB(앞+뒤) = 24GB.",
  },
  {
    label: "48GB 개조 — 칩 24개를 통째로 교체",
    body: "같은 24개 위치에서 1GB → 2GB(16Gbit) 칩으로만 바꾼다.\n채널 수·클럭·버스 폭은 그대로 — 12채널 × 2GB(칩) × 2(clamshell) = 48GB.",
  },
  {
    label: "대역폭 공식엔 밀도 항이 없다",
    body: "GDDR6X 유효 대역폭 = 핀 speed(Gbps) × 버스 폭(bit) ÷ 8.\n21 × 384 ÷ 8 ≈ 1,008GB/s — 칩이 1GB든 2GB든 이 식에 들어가지 않는다.",
  },
  {
    label: "Before / After — 용량은 2배, 대역폭은 그대로",
    body: "24GB(1GB칩)와 48GB(2GB칩) 모두 이론 대역폭은 약 1,008GB/s로 동일하다.\n밀도는 용량을, 핀 speed·버스 폭은 대역폭을 정하는 서로 다른 두 축이다.",
  },
  {
    label: "풀리는 문제 vs 안 풀리는 문제",
    body: "Weight가 한 장에 들어가느냐(용량 문제)는 개조로 풀린다.\nDecode마다 그 weight를 읽는 속도(대역폭 문제)는 개조 전후가 동일하다.",
  },
  {
    label: "공식 검증 밖의 개조 — 대가",
    body: "커스텀 vBIOS가 메모리 트레이닝(타이밍·전압)을 새로 잡아야 하고 칩 로트마다 최적이 아닐 수 있다.\n워런티는 소멸하고, 드라이버 충돌이 나도 NVIDIA 지원 채널에 문의할 수 없다.",
  },
] as const;
