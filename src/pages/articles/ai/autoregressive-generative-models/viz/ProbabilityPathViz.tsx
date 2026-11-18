import SceneShell from "./SceneShell";

/**
 * 본문 대응: #factorization 해석 — p(x₁=1)=.6, p(x₂=0|x₁=1)=.5 → (1,0)의 joint .3.
 * vocabulary를 {0,1}로 둔 것은 가정이며, 그래서 형제 가지는 1−.6=.4, 1−.5=.5로 계산된다.
 * x₁=0 아래의 조건부 확률은 본문에 없어 숫자를 적지 않는다.
 * ln .6 ≈ −0.51, ln .5 ≈ −0.69, 합 ≈ −1.20 = ln .3.
 */
const SCENES = [
  {
    label: "첫 token을 고릅니다",
    summary: "p(x₁=1) = .6",
    note: "Token 값이 0과 1 두 개뿐이라고 두면(가정) 첫 갈림길의 두 가지는 합이 1이어야 하므로 p(x₁=0)=1−.6=.4입니다. 아직 prefix가 없어 조건 없이 고릅니다.",
  },
  {
    label: "Prefix가 다음 갈림길을 정합니다",
    summary: "p(x₂=0 | x₁=1) = .5",
    note: "x₁=1이라는 prefix 위에서만 둘째 갈림길이 열립니다. 이 갈림길도 합이 1이라 p(x₂=1|x₁=1)=.5입니다. x₁=0 아래의 확률은 본문이 정하지 않아 비워 둡니다.",
  },
  {
    label: "한 경로를 끝까지 곱합니다",
    summary: ".6 × .5 = .3",
    note: "Sequence (1,0)은 첫 갈림길의 1과 둘째 갈림길의 0이 모두 일어나야 하는 한 경로라 곱합니다. 더하면 .6+.5=1.1로 1을 넘어 확률이 될 수 없습니다. x₁=1 아래 두 끝 .3, .3과 x₁=0 아래 두 끝의 합 .4를 더하면 1입니다.",
  },
  {
    label: "Log를 씌우면 곱이 합이 됩니다",
    summary: "ln .6 + ln .5 ≈ −1.20 = ln .3",
    note: "자연로그로 −0.51과 −0.69를 더하면 −1.20이고 이는 ln .3과 같습니다. T개의 작은 확률을 곱하는 대신 token별 log 값을 더해 loss를 누적합니다.",
  },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const LINE = "#cbd5e1";
const TEXT = "#64748b";

function Edge({ x1, y1, x2, y2, on, label, lx, ly }: { x1: number; y1: number; x2: number; y2: number; on: boolean; label: string; lx: number; ly: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? ACCENT : LINE} strokeWidth={on ? 1.25 : 1} />
      <text x={lx} y={ly} textAnchor="middle" fontSize="15" fontWeight={on ? 700 : 400} fill={on ? ACCENT : TEXT}>
        {label}
      </text>
    </g>
  );
}

function Node({ x, y, label, on }: { x: number; y: number; label: string; on: boolean }) {
  return (
    <g>
      <rect x={x - 32} y={y - 15} width="64" height="30" rx="8" fill="none" stroke={on ? ACCENT : MUTED} strokeWidth={on ? 1.25 : 1} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight={on ? 700 : 400} fill={on ? ACCENT : TEXT}>
        {label}
      </text>
    </g>
  );
}

export default function ProbabilityPathViz() {
  return (
    <SceneShell
      eyebrow="확률 경로"
      title="갈림길 두 번을 지나는 한 경로의 확률"
      description="본문의 p(x₁=1)=.6, p(x₂=0|x₁=1)=.5를 갈림길로 그렸습니다. 선 위 숫자는 그 갈림길에서 해당 token이 나올 확률이고, 오른쪽 끝 숫자는 그 경로 전체(joint)의 확률입니다. Token 값은 0과 1 두 개라고 둡니다(가정)."
      ariaLabel="첫 token 확률과 조건부 확률을 곱해 sequence (1,0)의 joint probability .3을 얻는 확률 나무"
      scenes={SCENES}
      render={(active) => {
        const level2 = active >= 1;
        const path = active >= 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 400 214" role="img" aria-label={SCENES[active].label} className="mx-auto block h-auto w-full max-w-[30rem]">
              <Node x={40} y={105} label="시작" on />
              <Edge x1={72} y1={98} x2={128} y2={56} on label=".6" lx={92} ly={68} />
              <Edge x1={72} y1={112} x2={128} y2={160} on={false} label=".4" lx={92} ly={154} />
              <Node x={160} y={50} label="x₁=1" on />
              <Node x={160} y={165} label="x₁=0" on={false} />

              <g opacity={level2 ? 1 : 0.2}>
                <Edge x1={192} y1={44} x2={253} y2={24} on={level2} label=".5" lx={220} ly={24} />
                <Edge x1={192} y1={56} x2={253} y2={86} on={false} label=".5" lx={214} ly={90} />
                <Node x={285} y={22} label="x₂=0" on={level2} />
                <Node x={285} y={92} label="x₂=1" on={false} />
                <line x1={192} y1={165} x2={240} y2={165} stroke={LINE} strokeWidth="1" strokeDasharray="4 4" />
                <text x={292} y={160} textAnchor="middle" fontSize="13" fill={MUTED}>x₂ 가지</text>
                <text x={292} y={177} textAnchor="middle" fontSize="13" fill={MUTED}>(본문 미지정)</text>
              </g>

              <g opacity={path ? 1 : 0}>
                <text x={374} y={27} textAnchor="middle" fontSize="16" fontWeight={700} fill={ACCENT}>.3</text>
                <text x={374} y={97} textAnchor="middle" fontSize="15" fill={TEXT}>.3</text>
                <text x={374} y={170} textAnchor="middle" fontSize="15" fill={TEXT}>합 .4</text>
                <text x={200} y={208} textAnchor="middle" fontSize="13" fill={TEXT}>네 끝의 합 .3 + .3 + .4 = 1</text>
              </g>
            </svg>
            <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 border-t border-border pt-3 font-mono text-xs sm:text-sm">
              <span className="text-muted-foreground">곱</span>
              <span className={`text-right ${active >= 2 ? "font-bold text-foreground" : "text-muted-foreground"}`}>{active >= 2 ? ".6 × .5 = .3" : "…"}</span>
              <span className="text-muted-foreground">log 합</span>
              <span className={`text-right ${active >= 3 ? "font-bold text-foreground" : "text-muted-foreground"}`}>{active >= 3 ? "−0.51 + (−0.69) ≈ −1.20" : "…"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
