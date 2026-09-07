/** NvlinkGapQuantified Viz — 색상 상수 + step 정의 */

export const C = {
  formula: "#f59e0b", // PCIe raw bandwidth 공식 유도 (앰버)
  pcie: "#3b82f6", // PCIe 링크 (블루)
  nvlink3090: "#8b5cf6", // 3090 NVLink bridge (보라)
  nvswitch: "#10b981", // A100/H100 NVSwitch (에메랄드)
  h100: "#06b6d4", // H100 강조 (시안)
  alert: "#ef4444", // 핀 부재 · 경고 (레드)
};

export const STEPS = [
  {
    label: "PCIe raw bandwidth 공식 — 16GT/s × 16lane × 128/130 ÷ 8",
    body: "PCI-SIG 규격값을 그대로 대입하면 ≈31.5GB/s 편도가 나온다.\n두 방향을 동시에 쓰는 duplex 합은 그 두 배인 ≈63GB/s — 이게 4090이 GPU 간 통신에 쓸 수 있는 전부다.",
  },
  {
    label: "RTX 4090 — NVLink 핀 자체가 PCB에서 빠짐",
    body: "Ada Lovelace 세대부터 golden finger 커넥터가 없다. 물리적 제약이라 개조로도 복구 불가.\nGPU 두 장을 잇는 경로는 PCIe Gen4 x16 하나뿐, 편도 ≈31.5GB/s.",
  },
  {
    label: "RTX 3090 — PCIe + NVLink bridge 1개 추가",
    body: "같은 소비자 카드인데 전 세대는 NVLink bridge로 두 번째 경로를 얹는다. 112.5GB/s 집계.\n다만 bridge가 정한 2-way 고정 pair만 연결되고 8-way 이상으로는 확장되지 않는다.",
  },
  {
    label: "A100 — NVSwitch로 8장 전체 full mesh",
    body: "3rd-gen NVLink 12 link + NVSwitch. 600GB/s 집계 대역폭을 8장 전체가 균일하게 나눠 쓴다.\n어떤 GPU 쌍을 골라도 같은 대역폭 — bridge처럼 정해진 pair가 없다.",
  },
  {
    label: "H100 — 같은 NVSwitch 구조, 900GB/s로 확장",
    body: "4th-gen NVLink 18 link + NVSwitch. link 수가 늘어난 만큼 집계 대역폭도 A100의 1.5배로 올라간다.\ntopology 성격은 A100과 동일한 8-way full mesh.",
  },
  {
    label: "요약 — 4090 대비 3090 1.8배, A100 9.5배, H100 14.3배",
    body: "4090의 63GB/s를 기준선(1x)으로 두면 3090 NVLink는 1.8배, A100은 9.5배, H100은 14.3배다.\n연산 성능이 오른 세대에서 GPU 간 통신 상한은 오히려 한 자릿수 이상 뒤처졌다.",
  },
  {
    label: "topology 의존성 — PCIe는 경로에 따라 갈리고 NVSwitch는 균일",
    body: "PCIe만 있는 구성은 GPU가 같은 root complex 아래인지, switch를 몇 단 거치는지에 따라 achievable bandwidth가 달라진다.\nNVSwitch는 어떤 pair를 골라도 항상 같은 대역폭 — topology 걱정이 아예 없다.",
  },
];
