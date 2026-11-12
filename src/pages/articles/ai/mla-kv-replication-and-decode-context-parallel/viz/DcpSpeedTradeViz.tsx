import SceneShell from "./SceneShell";

/**
 * 본문 대응: #costs — 단일 요청 생성 속도(tok/s), 모두 본문이 인용한 커뮤니티 기록(현장 경험).
 * 흔한 비교 90(BF16 KV, FlashInfer FA2) → 65(FP8 KV, TRITON_MLA, DCP8).
 * 같은 TRITON_MLA·FP8: DCP1 79 → DCP8 65 = 14. 다른 사용자 표: FP8 79 → 68, BF16 78 → 67 = 11.
 * 150K 문맥: DCP 없이 6~7, DCP 8에서 28~35.
 */
interface Bar {
  label: string;
  low: number;
  high: number;
  color: string;
}

const AXIS = 100;
const SLOTS = 4;
const GREY = "#94a3b8";
const NO_DCP = "#64748b";
const DCP = "#2563eb";

const SCENES: readonly { label: string; summary: string; note: string; bars: readonly Bar[] }[] = [
  {
    label: "흔히 인용하는 비교",
    summary: "90 → 65",
    note: "흔히 DCP의 비용으로 인용하는 90과 65는 KV 숫자 크기와 attention backend부터 다릅니다. 90은 BF16 KV를 FlashInfer FA2로 돌린 값인데 FA2는 FP8 KV를 받지 못합니다. 이 차이에는 DCP가 아닌 원인이 섞여 있습니다.",
    bars: [
      { label: "BF16 KV · FlashInfer FA2", low: 90, high: 90, color: GREY },
      { label: "FP8 KV · TRITON_MLA · DCP8", low: 65, high: 65, color: DCP },
    ],
  },
  {
    label: "같은 backend끼리",
    summary: "DCP만의 몫 14",
    note: "같은 위키의 FP8 KV, TRITON_MLA끼리 비교하면 DCP1 79에서 DCP8 65로 14 tok/s가 줄어듭니다. 5절의 통신 때문입니다. MLA 층마다 query all-gather, lse all-gather, 출력 reduce-scatter 세 번이 더해져 61층이면 decode step마다 183번입니다(계산).",
    bars: [
      { label: "FP8 KV · TRITON_MLA · DCP1", low: 79, high: 79, color: NO_DCP },
      { label: "FP8 KV · TRITON_MLA · DCP8", low: 65, high: 65, color: DCP },
    ],
  },
  {
    label: "다른 사용자의 표",
    summary: "11씩 줄어듦",
    note: "다른 사용자의 backend 비교표도 DCP를 끈 값과 켠 값이 FP8 79 대 68, BF16 78 대 67입니다. 이 표의 DCP 크기는 본문에 적혀 있지 않습니다. 두 기록을 합치면 단일 요청에서 DCP가 약 11~14 tok/s를 깎습니다.",
    bars: [
      { label: "FP8 KV · DCP 없음", low: 79, high: 79, color: NO_DCP },
      { label: "FP8 KV · DCP 켬", low: 68, high: 68, color: DCP },
      { label: "BF16 KV · DCP 없음", low: 78, high: 78, color: NO_DCP },
      { label: "BF16 KV · DCP 켬", low: 67, high: 67, color: DCP },
    ],
  },
  {
    label: "150K 문맥에서는",
    summary: "6~7 대 28~35",
    note: "150K 문맥에서는 반대가 됩니다. 위키는 DCP 없이 약 6~7 tok/s, DCP 8에서 28~35 tok/s를 적습니다. 장마다 읽는 KV가 1/8이 되는 것으로 방향은 설명되지만, 이만큼의 차이는 대역폭 산수로 다 설명되지 않아 원인은 확인하지 못했습니다.",
    bars: [
      { label: "150K 문맥 · DCP 없음", low: 6, high: 7, color: NO_DCP },
      { label: "150K 문맥 · DCP 8", low: 28, high: 35, color: DCP },
    ],
  },
];

const shown = (bar: Bar) => (bar.low === bar.high ? `${bar.low}` : `${bar.low}~${bar.high}`);

function SpeedRow({ bar }: { bar: Bar | undefined }) {
  if (!bar) return <div className="invisible h-[2.75rem]" aria-hidden />;
  return (
    <div className="h-[2.75rem] min-w-0">
      <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm">
        <span className="min-w-0 truncate">{bar.label}</span>
        <span className="shrink-0 font-mono font-bold">{shown(bar)} tok/s</span>
      </div>
      <div className="relative mt-1 h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-0 rounded-sm" style={{ width: `${(bar.low / AXIS) * 100}%`, backgroundColor: bar.color }} />
        {bar.high > bar.low ? (
          <div
            className="absolute inset-y-0 rounded-sm border border-dashed"
            style={{ left: `${(bar.low / AXIS) * 100}%`, width: `${((bar.high - bar.low) / AXIS) * 100}%`, borderColor: bar.color }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function DcpSpeedTradeViz() {
  return (
    <SceneShell
      eyebrow="DCP의 속도 비용"
      title="DCP는 단일 요청 속도를 깎지만 150K 문맥에서는 반대로 나타납니다"
      description="막대는 요청 하나의 생성 속도(tok/s, 0~100 눈금)입니다. 짙은 회색은 DCP 없음, 파랑은 DCP를 켠 값(크기는 막대 이름에 적었고 다른 사용자 표는 크기 미기재), 옅은 회색은 DCP 설정이 본문에 적히지 않은 값이며 점선 구간은 기록된 범위입니다. 모두 Kimi K2.5를 돌린 커뮤니티 기록입니다(현장 경험)."
      note="DCP(decode context parallel)는 대화의 token을 여러 GPU에 나눠 담는 설정입니다(6절). 측정 반복 횟수와 오차는 기록에 없습니다."
      ariaLabel="DCP 유무에 따른 단일 요청 생성 속도 비교"
      scenes={SCENES}
      render={(active) => {
        const bars = SCENES[active].bars;
        return (
          <div className="space-y-3">
            {Array.from({ length: SLOTS }, (_, slot) => (
              <SpeedRow key={slot} bar={bars[slot]} />
            ))}
          </div>
        );
      }}
    />
  );
}
