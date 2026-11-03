export const C = {
  chip1: "#6366f1",
  chip2: "#f59e0b",
  bus: "#10b981",
  capacity: "#8b5cf6",
  muted: "#94a3b8",
  alert: "#ef4444",
};

export const CHIP_XS = Array.from({ length: 12 }, (_, i) => 44 + i * ((436 - 44) / 11));

export const STEPS = [
  { label: "정품 24GB — 2GB 칩 12개", body: "384-bit를 32-bit 채널 12개로 보면 채널마다 2GB 칩 하나다.\n12채널 × 1칩 × 2GB = 24GB." },
  { label: "대표 48GB 개조 — 커스텀 clamshell PCB", body: "같은 2GB 칩을 앞면 12개·뒷면 12개에 싣고 채널마다 두 칩이 경로를 나눠 쓴다.\n12채널 × 2칩 × 2GB = 48GB." },
  { label: "대역폭 공식은 칩 수를 세지 않는다", body: "명목 대역폭 = 핀 속도 × 버스 폭 ÷ 8.\n21 × 384 ÷ 8 = 1,008GB/s." },
  { label: "용량 2배, 명목 대역폭은 같은 조건부 값", body: "정품은 12칩, 개조 보드는 24칩이지만 버스는 384-bit다.\n개조 카드가 21Gb/s를 안정적으로 유지하는지는 실측한다." },
  { label: "한 장으로 합쳐지면 통신을 없앨 수 있다", body: "여러 24GB GPU에 나눠야 하던 모델이 48GB 한 장에 들어오면 GPU 간 경계가 사라진다.\n여전히 여러 장이면 통신 병목은 남는다." },
  { label: "48GB 인식과 장기 안정성은 다른 합격선", body: "커스텀 PCB·펌웨어는 공식 검증 밖이다.\n메모리 오류·Xid·온도·클럭·드라이버 업데이트를 장시간 검증한다." },
] as const;
