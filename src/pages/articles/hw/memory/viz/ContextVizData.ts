export const C = {
  ddr4: "#71717a",
  ddr5: "#6366f1",
  ecc: "#10b981",
  err: "#ef4444",
  info: "#06b6d4",
  warn: "#f59e0b",
};

export const STEPS = [
  {
    label: "메모리는 용량·대역폭·지연·오류 정책을 함께 고른다",
    body: "작업 집합만 들어가면 끝이 아니라 코어에 데이터를 공급하고 오류를 관찰·복구하는 경로까지 설계합니다.",
  },
  {
    label: "이론 대역폭은 전송률과 채널 폭의 곱이다",
    body: "세대 이름보다 실제 동작 MT/s, 채운 채널 수와 workload가 사용하는 비율을 확인합니다.",
  },
  {
    label: "DIMM 개수보다 채널을 먼저 고르게 채운다",
    body: "빈 채널을 남긴 채 한 채널에 두 개를 꽂으면 용량은 늘어도 총 대역폭과 동작 속도가 불리할 수 있습니다.",
  },
  {
    label: "DDR5 온다이 ECC와 시스템 ECC는 보호 범위가 다르다",
    body: "온다이 ECC는 DRAM cell 내부, 시스템 ECC는 module·bus·controller를 포함한 전송 경로의 오류를 다룹니다.",
  },
  {
    label: "최종 구성은 CPU·보드·펌웨어 지원표와 대조해 확정한다",
    body: "UDIMM·RDIMM·3DS·MRDIMM은 서로 대체품이 아니며 용량·rank·DPC 조합별 허용 속도도 플랫폼마다 다릅니다.",
  },
];
