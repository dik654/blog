import RecoverySceneShell from "./RecoverySceneShell";

/**
 * 본문 대응: #runtime-receipt — Amdahl 경계 S_end ≤ 1 / ((1−f) + f/S_sparse).
 * 막대 전체 폭 = dense baseline 시간 1. f=0.4는 본문 예시, S_sparse=2도 본문 예시.
 * S_sparse=4는 가정, ∞는 식의 극한: 0.6+0.4=1 → 1배, 0.6+0.2=0.8 → 1.25배, 0.6+0.1=0.7 → 약 1.43배, 0.6 → 약 1.67배.
 */
const FIXED = 0.6;
const FRACTION = 0.4;

interface AmdahlScene {
  label: string;
  summary: string;
  note: string;
  kernel: string;
  sparse: number;
  speedup: string;
}

const SCENES: readonly AmdahlScene[] = [
  { label: "Dense baseline", summary: "0.6 + 0.4 = 1", note: "전체 시간 1 가운데 sparse tactic이 실제로 적용되는 구간이 f=0.4, 나머지 0.6은 sparse 경로 밖에서 그대로 남는 시간입니다.", kernel: "1배 (변화 없음)", sparse: 0.4, speedup: "1배" },
  { label: "적용 구간이 2배 빨라지면", summary: "1/(0.6+0.2) = 1.25배", note: "본문 예시입니다. 0.4 구간만 절반인 0.2로 줄어 전체는 0.8이 됩니다. Kernel은 2배여도 전체 상한은 1.25배입니다.", kernel: "2배", sparse: 0.2, speedup: "1.25배" },
  { label: "4배 빨라지면 (가정)", summary: "1/(0.6+0.1) ≈ 1.43배", note: "Kernel speedup을 두 배 더 키워도 줄어드는 것은 0.2에서 0.1로 0.1뿐입니다. 0.6은 손대지 못합니다.", kernel: "4배 (가정)", sparse: 0.1, speedup: "약 1.43배" },
  { label: "적용 구간이 0이 되어도", summary: "1/0.6 ≈ 1.67배", note: "같은 식에 f=0.4를 넣고 적용 구간 시간을 0까지 줄인 극한입니다. 남은 0.6 때문에 이 workload의 상한은 약 1.67배를 넘지 못합니다.", kernel: "한없이 큼 (식의 극한)", sparse: 0, speedup: "약 1.67배" },
];

function Segment({ width, color, text, dashed = false }: { width: number; color: string; text: string; dashed?: boolean }) {
  return (
    <div
      className="flex h-9 min-w-0 items-center justify-center overflow-hidden rounded-sm border text-[11px] font-semibold sm:text-xs"
      style={{ width: `${width * 100}%`, borderColor: color, borderStyle: dashed ? "dashed" : "solid", color }}
    >
      {width >= 0.08 ? text : ""}
    </div>
  );
}

export default function AmdahlBoundViz() {
  return (
    <RecoverySceneShell
      eyebrow="Amdahl 경계"
      title="빨라진 구간이 일부라면 전체 속도는 남은 시간이 정합니다"
      description="막대 전체 폭이 dense baseline의 실행 시간 1입니다. f는 그 시간 중 sparse tactic이 실제로 선택돼 적용되는 비율이고, 본문 예시대로 f=0.4를 씁니다. 적용 구간만 kernel speedup으로 줄어듭니다."
      ariaLabel="f가 0.4일 때 kernel speedup 1, 2, 4, 무한대에서 전체 시간과 전체 speedup 상한"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active] ?? SCENES[0];
        const total = FIXED + s.sparse;
        return (
          <div className="min-w-0 space-y-4 text-xs sm:text-sm">
            <div className="min-w-0">
              <p className="mb-1.5 text-muted-foreground">Dense baseline · 시간 1</p>
              <div className="flex min-w-0 gap-1">
                <Segment width={FIXED} color="#64748b" text="sparse 밖 0.6" />
                <Segment width={FRACTION} color="#2563eb" text="적용 구간 0.4" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="mb-1.5 text-muted-foreground">Kernel speedup {s.kernel} · 시간 {total.toFixed(1)}</p>
              <div className="flex min-w-0 gap-1">
                <Segment width={FIXED} color="#64748b" text="그대로 0.6" />
                {s.sparse > 0 ? <Segment width={s.sparse} color="#2563eb" text={s.sparse.toFixed(1)} /> : <span className="flex h-9 items-center px-1 text-[11px] text-muted-foreground">0</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-3">
              <span className="text-muted-foreground">전체 speedup 상한 = 1 / {total.toFixed(1)}</span>
              <span className="font-mono text-base font-bold text-primary">{s.speedup}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
