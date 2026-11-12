import SceneShell from "./SceneShell";

/**
 * 본문 대응: small-case·comparison-boundary 절(모두 가정).
 * 목표 100만토큰, 허용 ±3만. A 관측 90만(0.43)·102만(0.42), B 관측 98만(0.39)·110만(0.38).
 * 거리 A 10만·2만, B 2만·10만 → 102만과 98만 선택, 차이 0.42 − 0.39 = 0.03.
 * 마지막 장면: 목표에서 10만 떨어진 점밖에 없으면 가장 가까워도 허용폭 밖이라 보류.
 */
const TARGET = 100;
const TOL = 3;
const LO = 85;
const HI = 115;

type Obs = { n: number; loss: number };
const RUN_A: readonly Obs[] = [
  { n: 90, loss: 0.43 },
  { n: 102, loss: 0.42 },
];
const RUN_B: readonly Obs[] = [
  { n: 98, loss: 0.39 },
  { n: 110, loss: 0.38 },
];
const ONLY_FAR: readonly Obs[] = [{ n: 90, loss: 0.43 }];

const nearest = (obs: readonly Obs[]) =>
  obs.reduce<Obs>((best, o) => (Math.abs(o.n - TARGET) < Math.abs(best.n - TARGET) ? o : best), obs[0]);

const PICK_A = nearest(RUN_A);
const PICK_B = nearest(RUN_B);
const DIFF = (PICK_A.loss - PICK_B.loss).toFixed(2);

const SCENES = [
  {
    label: "후보 관측 네 개",
    summary: `목표 ${TARGET}만 · 허용 ±${TOL}만`,
    note: "가로축은 처리한 토큰입니다. 두 실행이 정확히 100만에서 남긴 기록은 없고, 회색 띠(97만~103만)가 미리 정한 허용폭입니다.",
  },
  {
    label: "실행마다 가장 가까운 점",
    summary: `A ${PICK_A.n}만 · B ${PICK_B.n}만`,
    note: "100만과의 거리는 A에서 10만·2만, B에서 2만·10만입니다. 각 실행 안에서 따로 가장 가까운 점을 고르면 A는 102만, B는 98만입니다.",
  },
  {
    label: "허용폭 검사 뒤의 차이",
    summary: `${PICK_A.loss} − ${PICK_B.loss} = ${DIFF}`,
    note: "두 점 모두 허용 3만 안이라 비교 후보가 됩니다. 관측 손실 차이는 0.03이지만 A는 목표를 2만 넘긴 곳, B는 2만 못 미친 곳에서 잰 값이라 정확히 100만에서의 차이라고 단정하지 않습니다.",
  },
  {
    label: "가장 가까워도 밖이면 보류",
    summary: "10만 밖 → 비교 보류",
    note: "한 실행에 목표에서 10만 떨어진 점밖에 없다면 그 점이 가장 가깝더라도 허용폭을 넘습니다. 이때는 비교를 보류합니다. 점 사이를 선으로 이어 100만의 값을 읽는 것은 실제 평가 결과가 아니라 추가 가정입니다.",
  },
] as const;

const W = 360;
const H = 192;
const L = 40;
const R = 16;
const x = (n: number) => L + ((n - LO) / (HI - LO)) * (W - L - R);
const ROW_A = 62;
const ROW_B = 112;
const COLOR_A = "#2563eb";
const COLOR_B = "#d97706";
const MUTED = "#94a3b8";
const INK = "#334155";
const OUT = "#dc2626";

function Dots({ obs, y, color, pick, active }: { obs: readonly Obs[]; y: number; color: string; pick: Obs | null; active: number }) {
  return (
    <g>
      {obs.map((o) => {
        const chosen = active >= 1 && pick !== null && o.n === pick.n;
        const faded = active >= 1 && !chosen;
        return (
          <g key={o.n} opacity={faded ? 0.35 : 1}>
            {active === 1 && (
              <line x1={x(o.n)} x2={x(TARGET)} y1={y + 14} y2={y + 14} stroke={color} strokeWidth={1} />
            )}
            {active === 1 && (
              <text x={(x(o.n) + x(TARGET)) / 2} y={y + 26} textAnchor="middle" fontSize={11} fill={color}>
                {Math.abs(o.n - TARGET)}만
              </text>
            )}
            <circle cx={x(o.n)} cy={y} r={chosen ? 6 : 4.5} fill={chosen ? color : "#ffffff"} stroke={color} strokeWidth={1.25} />
            <text x={x(o.n)} y={y - 11} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
              {o.n}만 · {o.loss}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function ToleranceWindowViz() {
  return (
    <SceneShell
      eyebrow="가까운 점 고르기"
      title="가장 가까운 점을 골라도 허용폭 검사는 남습니다"
      description="점 하나가 평가 기록 하나이고, 점 위의 수는 처리한 토큰과 그때의 손실입니다. 목표 100만토큰, 허용 ±3만은 미리 정한 규칙입니다(가정)."
      ariaLabel="목표 100만토큰 근처에서 두 실행의 가장 가까운 관측을 고르고 허용폭을 검사하는 과정"
      scenes={SCENES}
      render={(active) => {
        const far = active === 3;
        const a = far ? ONLY_FAR : RUN_A;
        const pickA = far ? nearest(ONLY_FAR) : PICK_A;
        const pickAOut = Math.abs(pickA.n - TARGET) > TOL;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={x(TARGET - TOL)} y={26} width={x(TARGET + TOL) - x(TARGET - TOL)} height={112} fill="#e2e8f0" />
            <line x1={x(TARGET)} x2={x(TARGET)} y1={22} y2={140} stroke={INK} strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(TARGET)} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>
              목표 100만
            </text>
            <text x={L - 8} y={ROW_A + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={COLOR_A}>
              A
            </text>
            <text x={L - 8} y={ROW_B + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={COLOR_B}>
              B
            </text>
            <Dots obs={a} y={ROW_A} color={COLOR_A} pick={active >= 1 ? pickA : null} active={active} />
            <Dots obs={RUN_B} y={ROW_B} color={COLOR_B} pick={active >= 1 ? PICK_B : null} active={active} />
            <line x1={L} x2={W - R} y1={146} y2={146} stroke={MUTED} strokeWidth={1} />
            {[85, 90, 95, 100, 105, 110, 115].map((t) => (
              <text key={t} x={x(t)} y={160} textAnchor="middle" fontSize={10} fill="#64748b">
                {t}만
              </text>
            ))}
            {far && (
              <g>
                <line x1={x(pickA.n)} x2={x(TARGET)} y1={ROW_A + 14} y2={ROW_A + 14} stroke={OUT} strokeWidth={1} />
                <text x={(x(pickA.n) + x(TARGET)) / 2} y={ROW_A + 27} textAnchor="middle" fontSize={11} fill={OUT}>
                  {Math.abs(pickA.n - TARGET)}만
                </text>
              </g>
            )}
            {active === 2 && (
              <text x={W / 2} y={184} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>
                둘 다 회색 띠 안 · 차이 {DIFF}
              </text>
            )}
            {far && pickAOut && (
              <text x={W / 2} y={184} textAnchor="middle" fontSize={12} fontWeight={700} fill={OUT}>
                (가정) A의 기록이 90만뿐 → 띠 밖이라 비교 보류
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
