import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #serving-break-even — 평균 2.7731개를 만드는 시간을 한 축에 놓는다.
 * 기준 2.7731×10 = 27.731ms. 회차 2+12+1 = 15 → 비 1.848733. 2+30+1 = 33 → 비 .840333.
 * 손익분기 검증 = 27.731−2−1 = 24.731ms(글의 숫자에서 나온 산수).
 */
interface Scene extends ShellScene {
  verify: number | null;
  ratio: string;
}

const SCENES: readonly Scene[] = [
  { label: "비교할 기준", summary: "2.7731 × 10ms = 27.731ms", verify: null, ratio: "", note: "기준 모델만으로 토큰 하나에 10ms가 걸린다면, 추측 디코딩이 평균으로 확정하는 2.7731개를 만드는 데 27.731ms가 걸립니다. 빨간 선이 이 기준입니다." },
  { label: "검증 12ms", summary: "2 + 12 + 1 = 15ms", verify: 12, ratio: "27.731 ÷ 15 ≈ 1.848733", note: "같은 평균 출력을 15ms에 만들므로 이 가정에서는 약 1.85배 빠릅니다." },
  { label: "검증 30ms", summary: "2 + 30 + 1 = 33ms", verify: 30, ratio: "27.731 ÷ 33 ≈ .840333", note: "수락 확률과 평균 확정 수는 그대로인데 회차가 빨간 선을 넘어 비가 1 아래로 떨어집니다. 여러 토큰을 확정해도 이 가정에서는 더 느립니다." },
  { label: "두 막대가 같아지는 곳", summary: "검증 = 27.731 − 3 = 24.731ms", verify: 24.731, ratio: "27.731 ÷ 27.731 = 1", note: "후보 2ms와 나머지 1ms를 두면 검증 24.731ms에서 비가 1입니다. 가정 숫자의 산수이며 실측 경계가 아닙니다. 대기열·긴 꼬리 지연은 이 비율로 알 수 없습니다." },
];

const AXIS = 35;
const BASELINE = 27.731;
const COLORS = { draft: "#d97706", verify: "#2563eb", rest: "#64748b", base: "#94a3b8" };
const TICKS = [0, 10, 20, 30];

const pct = (value: number) => `${(value / AXIS) * 100}%`;

export default function BreakEvenViz() {
  return (
    <SceneShell
      eyebrow="모든 시간은 가정"
      title="같은 평균 출력을 만드는 시간을 한 축에 놓습니다"
      description="가로축은 밀리초(ms)입니다. 위는 기준 모델만 쓸 때, 아래는 추측 디코딩 한 회차의 시간입니다. 2.7731은 앞 절의 α=.7, K=4 모형값입니다."
      ariaLabel="기준 모델 단독 시간과 추측 디코딩 한 회차 시간 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const parts = scene.verify === null
          ? []
          : [
              { key: "후보 준비", value: 2, color: COLORS.draft },
              { key: "검증", value: scene.verify, color: COLORS.verify },
              { key: "나머지 처리", value: 1, color: COLORS.rest },
            ];
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-[3.4rem_minmax(0,1fr)] gap-x-2 gap-y-3 text-xs">
              <span className="self-center font-bold leading-4">기준 단독</span>
              <div className="relative h-8 rounded-sm bg-muted/40">
                <div className="flex h-full items-center justify-end rounded-sm pr-2 font-mono font-bold text-[#0f172a]" style={{ width: pct(BASELINE), backgroundColor: COLORS.base }}>27.731</div>
              </div>
              <span className="self-center font-bold leading-4">한 회차</span>
              <div className="relative h-8 rounded-sm bg-muted/40">
                <div className="flex h-full overflow-hidden rounded-sm">
                  {parts.map((part) => (
                    <span key={part.key} className="h-full shrink-0" style={{ width: pct(part.value), backgroundColor: part.color }} />
                  ))}
                </div>
                <span className="absolute w-px" style={{ left: pct(BASELINE), top: -44, bottom: 0, backgroundColor: "#dc2626" }} aria-hidden />
              </div>
              <span />
              <div className="relative h-4 font-mono text-[11px] text-muted-foreground">
                {TICKS.map((tick) => (
                  <span key={tick} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: pct(tick) }}>{tick}</span>
                ))}
              </div>
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1"><span className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: COLORS.draft }} />후보 준비 2</li>
              <li className="flex items-center gap-1"><span className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: COLORS.verify }} />검증 {scene.verify ?? "−"}</li>
              <li className="flex items-center gap-1"><span className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: COLORS.rest }} />나머지 처리 1</li>
            </ul>
            <p className="mt-2 min-h-7 border-t border-border pt-2 text-sm font-bold tabular-nums">{scene.ratio ? `시간 비 ${scene.ratio}` : " "}</p>
          </div>
        );
      }}
    />
  );
}
