import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — SRP31.90의 감독 충격 여섯 모양과 SRP31.82의 이상치 시험
 * (여섯 충격 중 가장 큰 EVE 감소를 Tier 1 자본의 15%와 비교; Tier 1 100이면 기준 15 — 본문의 가정).
 * 실제 충격 크기는 통화별 표를 따르므로 곡선의 이동 폭은 모양만 보이는 설명용 값입니다.
 */
const W = 120;
const H = 86;
const X_SHORT = 12;
const X_LONG = 108;
const POINTS = 9;
const SHIFT = 12;

/** 설명용 기준 곡선: 단기에서 장기로 갈수록 금리가 높아지는 모양(y가 작을수록 금리가 높음). */
const baseY = (t: number) => 50 - 22 * Math.sqrt(t);

/** 금리 상승 = y 감소. t는 0(단기)~1(장기). */
const SHAPES = [
  { name: "평행 상승", rise: () => SHIFT },
  { name: "평행 하락", rise: () => -SHIFT },
  { name: "가팔라짐", rise: (t: number) => -SHIFT + 2 * SHIFT * t },
  { name: "평평해짐", rise: (t: number) => SHIFT - 2 * SHIFT * t },
  { name: "단기 상승", rise: (t: number) => SHIFT * (1 - t) },
  { name: "단기 하락", rise: (t: number) => -SHIFT * (1 - t) },
] as const;

const path = (rise: (t: number) => number) =>
  Array.from({ length: POINTS }, (_, i) => {
    const t = i / (POINTS - 1);
    return `${X_SHORT + (X_LONG - X_SHORT) * t},${baseY(t) - rise(t)}`;
  }).join(" ");

const SCENES = [
  { label: "평행 상승·하락", summary: "모든 만기가 함께 움직임", focus: [0, 1], note: "모든 만기 금리가 같은 방향으로 함께 오르거나 내립니다." },
  { label: "가팔라짐·평평해짐", summary: "단기와 장기가 반대로", focus: [2, 3], note: "가팔라짐은 단기는 내리고 장기는 오르는 충격, 평평해짐은 단기는 오르고 장기는 내리는 충격입니다. 그림에서는 파란 선이 중간 만기에서 회색 선과 교차합니다." },
  { label: "단기 상승·하락", summary: "단기금리만 움직임", focus: [4, 5], note: "단기금리만 오르거나 내리는 충격입니다. 그림에서는 장기로 갈수록 이동을 줄여 그렸습니다(모양은 가정). 여기까지가 SRP31.90의 여섯 모양입니다." },
  { label: "이상치 시험", summary: "가장 큰 EVE 감소 > 15 ?", focus: [0, 1, 2, 3, 4, 5], note: "여섯 충격마다 EVE 감소를 계산하고 그중 가장 큰 값을 Tier 1 자본(은행 자본 가운데 손실을 먼저 흡수하는 핵심 자본)의 15%와 비교합니다(SRP31.82). Tier 1 자본이 100이면 기준은 15이고, 이를 넘으면 이상치 은행으로 검토 대상이 됩니다(가정)." },
] as const;

function Panel({ index, on }: { index: number; on: boolean }) {
  const shape = SHAPES[index];
  return (
    <div className={`rounded-lg border p-1.5 ${on ? "border-[#2563eb]" : "border-border opacity-40"}`}>
      <p className="text-center text-xs font-semibold">{shape.name}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${shape.name} 충격 모양`}>
        <polyline points={path(() => 0)} fill="none" stroke="#94a3b8" strokeWidth={1} />
        <polyline points={path(shape.rise)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
        <text x={X_SHORT} y={H - 2} fontSize={10} fill="#64748b">단기</text>
        <text x={X_LONG} y={H - 2} fontSize={10} fill="#64748b" textAnchor="end">장기</text>
      </svg>
    </div>
  );
}

export default function SupervisoryShockViz() {
  return (
    <SceneShell
      eyebrow="감독 충격"
      title="여섯 가지 금리 충격 모양과 15% 이상치 시험"
      description="회색 선은 충격 전, 파란 선은 충격 뒤 만기별 금리이며 위로 갈수록 금리가 높습니다. 실제 크기는 2024년에 재조정되어 2026년 1월부터 적용되는 통화별 표를 따르므로, 그림의 이동 폭은 모양만 보이는 설명용입니다(가정)."
      ariaLabel="바젤 IRRBB 감독 충격 여섯 가지와 EVE 이상치 시험"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const focus: readonly number[] = scene.focus;
        return (
          <div className="min-w-0 space-y-3">
            <div className="mx-auto grid max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
              {SHAPES.map((shape, panel) => <Panel key={shape.name} index={panel} on={focus.includes(panel)} />)}
            </div>
            {index === 3 ? (
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-center text-xs sm:gap-2">
                <p className="rounded-lg border border-border p-2">충격 6개의 EVE 감소</p>
                <span aria-hidden className="text-muted-foreground">→</span>
                <p className="rounded-lg border border-[#2563eb] p-2 font-semibold">가장 큰 값</p>
                <span aria-hidden className="text-muted-foreground">vs</span>
                <p className="rounded-lg border border-[#dc2626] p-2"><span className="font-mono font-bold">100×15% = 15</span><span className="block text-muted-foreground">Tier 1 자본 100(가정)</span></p>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border p-2 text-center text-xs text-muted-foreground">파란 테두리 = 이 장면의 두 충격</p>
            )}
          </div>
        );
      }}
    />
  );
}
