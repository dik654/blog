import type { ReactElement } from "react";
import VramSceneShell from "./VramSceneShell";

/**
 * 본문 대응: #multi-gpu-vram-strategies — BF16 weight 51.75 GiB와 48 GiB 카드.
 * 한 장: 51.75 − 48 = 3.75 GiB 초과. TP2: 51.75 ÷ 2 = 25.875 ≈ 25.9 GiB/장.
 * Offload: 본문 조건대로 44 GiB만 쓴다면 51.75 − 44 = 7.75 GiB(≈15%)를 host로. Unified: 본문은 "수백 GiB급"이라고만 하므로 크기를 그리지 않습니다.
 */
const WEIGHT = 51.75;
const CARD = 48;
const SAFE = 44;
const SCALE_MAX = 56;

type Bar = { label: string; parts: { value: number; color: string; text: string }[]; cap: number | null; capText: string };
type Scene = { label: string; summary: string; note: string; bars: Bar[]; unified?: boolean };

const SCENES: readonly Scene[] = [
  {
    label: "한 장에 그대로",
    summary: "51.75 > 48 → 3.75 GiB 초과",
    note: "BF16 weight만으로 48 GiB 카드 한 장을 3.75 GiB 넘습니다. KV cache를 더하기 전부터 상주가 불가능합니다.",
    bars: [
      { label: "GPU 0", parts: [{ value: CARD, color: "#64748b", text: "들어간 48" }, { value: WEIGHT - CARD, color: "#dc2626", text: "초과 3.75" }], cap: CARD, capText: "한도 48 GiB" },
    ],
  },
  {
    label: "2-way · tensor parallel",
    summary: "51.75 ÷ 2 ≈ 25.9 GiB / 장",
    note: "Weight를 두 장에 나누면 장당 약 25.9 GiB라 각 카드에 여유가 생깁니다. 대신 layer마다 attention 뒤와 MLP 뒤에 all-reduce 통신이 두 번 더해집니다.",
    bars: [
      { label: "GPU 0", parts: [{ value: WEIGHT / 2, color: "#2563eb", text: "25.9" }], cap: CARD, capText: "한도 48 GiB" },
      { label: "GPU 1", parts: [{ value: WEIGHT / 2, color: "#2563eb", text: "25.9" }], cap: CARD, capText: "한도 48 GiB" },
    ],
  },
  {
    label: "Offloading · host로 내림",
    summary: "51.75 − 44 = 7.75 GiB (약 15%)",
    note: "본문 조건처럼 48 GiB 중 44 GiB만 안전하게 쓴다면 7.75 GiB를 host RAM에 둬야 나머지가 들어갑니다. Host에 둔 몫은 decode마다 PCIe로 다시 옮겨야 해서 대역폭이 부족하면 step 시간이 늘 수 있습니다.",
    bars: [
      { label: "GPU 0", parts: [{ value: SAFE, color: "#2563eb", text: "44" }], cap: SAFE, capText: "본문 조건의 안전 한도 44 GiB" },
      { label: "Host RAM", parts: [{ value: WEIGHT - SAFE, color: "#d97706", text: "7.75" }], cap: null, capText: "decode마다 PCIe로 GPU에 전송" },
    ],
  },
  {
    label: "Unified / large memory",
    summary: "파티션 없이 51.75 GiB 전체",
    note: "GPU와 host가 처음부터 큰 주소 공간을 공유하면 weight를 나누지 않고 담을 수 있습니다. 본문은 그 용량을 ‘수백 GiB급’이라고만 하므로 칸 크기는 그리지 않았습니다. 대역폭이 discrete GPU보다 낮은 경우가 많아 따로 확인합니다.",
    bars: [{ label: "공유 메모리", parts: [{ value: WEIGHT, color: "#2563eb", text: "51.75" }], cap: null, capText: "담는 공간은 수백 GiB급이라 이 축척으로 그리지 않음" }],
    unified: true,
  },
];

const pctOf = (value: number) => `${(value / SCALE_MAX) * 100}%`;

export default function OverflowSplitViz() {
  return (
    <VramSceneShell
      eyebrow="Known floor 초과"
      title="한 장에 넘치는 51.75 GiB를 나누거나 내리거나 더 큰 공간에 담습니다"
      description="막대는 BF16 weight 51.75 GiB를 같은 축척으로 그렸고, 세로 점선은 각 장치에서 쓸 수 있는 한도입니다. KV cache와 workspace는 넣지 않았습니다."
      ariaLabel="BF16 51.75 GiB weight를 한 장, 두 장, host offload, unified memory에 배치한 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-h-[9.5rem] min-w-0 space-y-4">
            {scene.bars.map((bar) => (
              <div key={bar.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
                <span className="font-semibold">{bar.label}</span>
                <div className="min-w-0">
                  <div className={`relative h-7 min-w-0 rounded-sm ${scene.unified ? "" : "bg-muted/40"}`}>
                    {bar.parts.reduce<{ left: number; nodes: ReactElement[] }>(
                      (acc, part) => ({
                        left: acc.left + part.value,
                        nodes: [
                          ...acc.nodes,
                          <div
                            key={part.text}
                            className="absolute inset-y-0 flex items-center justify-center overflow-hidden text-[11px] font-semibold text-white"
                            style={{ left: pctOf(acc.left), width: pctOf(part.value), backgroundColor: part.color }}
                          >
                            {part.value >= 10 ? part.text : ""}
                          </div>,
                        ],
                      }),
                      { left: 0, nodes: [] },
                    ).nodes}
                    {bar.cap !== null && <div className="absolute -inset-y-1 w-px border-l border-dashed border-[#0f172a] dark:border-[#e2e8f0]" style={{ left: pctOf(bar.cap) }} />}
                  </div>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {bar.parts.map((part) => part.text).join(" + ")} GiB · {bar.capText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
