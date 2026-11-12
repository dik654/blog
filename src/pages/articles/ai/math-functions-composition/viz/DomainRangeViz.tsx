import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shape(7절)과 #need(5절)의 허용 범위 검사.
 * 위 수직선 = 함수가 받는 값(정의역), 아래 수직선 = 결과가 속할 집합. 축은 −4~8만 그린다.
 * 장면 1: f(u)=u², 공역 ℝ 중 치역은 0 이상. f(−2)=f(2)=4, f(0)=0.
 * 장면 2: √x는 x≥0에서만 정의. √4=2, −4는 정의역 밖(−4는 고른 예).
 * 장면 3: g(2)=7이 f의 정의역에 드는지 먼저 확인한 뒤 f(7)=49. 49는 축 밖이라 화살표로만 적는다.
 */
const W = 360;
const H = 176;
const LEFT = 24;
const RIGHT = W - 24;
const MIN = -4;
const MAX = 8;
const TOP_Y = 56;
const BOT_Y = 136;
const TICKS = [-4, -2, 0, 2, 4, 6, 8] as const;
const x = (v: number) => LEFT + ((v - MIN) / (MAX - MIN)) * (RIGHT - LEFT);

const ACCENT = "#2563eb";
const OK = "#16a34a";
const BAD = "#dc2626";
const AXIS = "#94a3b8";
const TEXT = "#475569";

const SCENES = [
  {
    label: "공역과 치역",
    summary: "f(−2) = f(2) = 4",
    note: "f를 실수에서 실수로 가는 제곱 함수라고 선언하면 공역은 아래 수직선 전체입니다. 그러나 제곱 결과는 음수가 될 수 없어서 실제로 도달하는 치역은 0 이상(진한 구간)뿐입니다. −2와 2가 같은 4로 가도 각 입력의 출력은 하나씩입니다.",
  },
  {
    label: "√x의 정의역",
    summary: "√4 = 2 · √(−4)는 실수 없음",
    note: "실수 제곱근은 입력 x ≥ 0에서만 정의됩니다(위 수직선의 진한 구간). −4는 선언된 정의역 밖이라 실수 답이 나오지 않습니다. −4는 경계를 보이려고 고른 값입니다(가정).",
  },
  {
    label: "연결 전 확인",
    summary: "g(2) = 7 ∈ f의 정의역 → f(7) = 49",
    note: "g가 만든 7이 f가 받는 실수에 속하는지 먼저 확인하고 넘깁니다. 5절처럼 다음 규칙이 음이 아닌 수만 받는다고 해도 7은 그 범위에 듭니다. 49는 이 축 밖이라 값만 적었습니다.",
  },
] as const;

function Axis({ y, label, shadeFrom }: { y: number; label: string; shadeFrom: number | null }) {
  return (
    <g>
      <text x={LEFT} y={y - 22} fontSize={11} fontWeight={700} fill={TEXT}>
        {label}
      </text>
      <line x1={LEFT} x2={RIGHT} y1={y} y2={y} stroke={AXIS} strokeWidth={1} />
      {shadeFrom !== null && <rect x={x(shadeFrom)} y={y - 3} width={RIGHT - x(shadeFrom)} height={6} rx={2} fill={ACCENT} fillOpacity={0.45} />}
      {TICKS.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={y - 3} y2={y + 3} stroke={AXIS} strokeWidth={1} />
          <text x={x(t)} y={y + 15} fontSize={10} textAnchor="middle" fill={TEXT}>
            {t}
          </text>
        </g>
      ))}
    </g>
  );
}

function Dot({ v, y, color, label, side = false }: { v: number; y: number; color: string; label?: string; side?: boolean }) {
  return (
    <g>
      <circle cx={x(v)} cy={y} r={4.5} fill={color} />
      {label && (
        <text x={side ? x(v) + 8 : x(v)} y={side ? y - 6 : y - 8} fontSize={11} fontWeight={700} textAnchor={side ? "start" : "middle"} fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

function Arrow({ from, to, color }: { from: number; to: number; color: string }) {
  return <line x1={x(from)} y1={TOP_Y + 6} x2={x(to)} y2={BOT_Y - 6} stroke={color} strokeWidth={1.25} markerEnd="url(#dr-arrow)" />;
}

export default function DomainRangeViz() {
  return (
    <SceneShell
      eyebrow="정의역 · 공역 · 치역"
      title="선언한 집합과 실제로 닿는 값, 넣어도 되는 값을 수직선에 표시합니다"
      description="ℝ은 실수 전체입니다. 위 수직선은 함수가 받는 값, 아래 수직선은 결과가 속할 집합입니다. 진한 구간은 실수 중 일부만 허용되거나 실제로 도달하는 부분이고, 진한 구간이 없는 수직선은 실수 전체가 허용됩니다. 수직선은 −4부터 8까지만 그렸습니다."
      ariaLabel="제곱 함수의 공역과 치역, 제곱근의 정의역, g의 출력이 f의 정의역에 드는지 확인하는 수직선"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <defs>
            <marker id="dr-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L8 4 L0 8 z" fill={TEXT} />
            </marker>
          </defs>
          {active === 0 && (
            <>
              <Axis y={TOP_Y} label="f에 넣는 값 u (정의역 ℝ)" shadeFrom={null} />
              <Axis y={BOT_Y} label="공역 ℝ · 진한 구간 = 치역 0 이상" shadeFrom={0} />
              <Arrow from={-2} to={4} color={TEXT} />
              <Arrow from={2} to={4} color={TEXT} />
              <Arrow from={0} to={0} color={TEXT} />
              <Dot v={-2} y={TOP_Y} color={ACCENT} label="−2" />
              <Dot v={0} y={TOP_Y} color={ACCENT} />
              <Dot v={2} y={TOP_Y} color={ACCENT} label="2" />
              <Dot v={4} y={BOT_Y} color={OK} />
              <Dot v={0} y={BOT_Y} color={OK} />
            </>
          )}
          {active === 1 && (
            <>
              <Axis y={TOP_Y} label="√에 넣는 값 x · 진한 구간 = 정의역 x ≥ 0" shadeFrom={0} />
              <Axis y={BOT_Y} label="실수 결과" shadeFrom={null} />
              <Arrow from={4} to={2} color={TEXT} />
              <Dot v={4} y={TOP_Y} color={ACCENT} label="4" />
              <Dot v={2} y={BOT_Y} color={OK} />
              <Dot v={-4} y={TOP_Y} color={BAD} label="−4 ✕" />
              <text x={x(-4)} y={TOP_Y + 32} fontSize={10} fill={BAD}>
                정의역 밖 · 실수 답 없음
              </text>
            </>
          )}
          {active === 2 && (
            <>
              <Axis y={TOP_Y} label="g에 넣는 값 x" shadeFrom={null} />
              <Axis y={BOT_Y} label="g의 결과 = f에 넣는 값 (f의 정의역 ℝ)" shadeFrom={null} />
              <Arrow from={2} to={7} color={TEXT} />
              <Dot v={2} y={TOP_Y} color={ACCENT} label="2" />
              <Dot v={7} y={BOT_Y} color={OK} label="7 ✓" side />
              <text x={RIGHT} y={BOT_Y + 32} fontSize={11} fontWeight={700} textAnchor="end" fill={OK}>
                f(7) = 49 (축 밖)
              </text>
            </>
          )}
        </svg>
      )}
    />
  );
}
