import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #commit-open — 평가점 등식 f(τ)−y = q(τ)(τ−z), 17로 나눈 나머지, τ=7은 교육용 가정.
 * f(7)=66≡15. 정상: 15−10=5, 13×3=39≡5. 거짓 11: 15−11=4.
 * τ를 알면 4/3 ≡ 4×6 = 24 ≡ 7 (3×6=18≡1) → 7×3=21≡4로 등식을 맞춘다.
 */
const W = 300;
const H = 128;
const MOD = 17;
const LEFT = 6;
const CELL = (W - 2 * LEFT) / MOD;
const STRIP_Y = 30;
const STRIP_H = 24;
const cx = (value: number) => LEFT + value * CELL + CELL / 2;

const DATA: readonly { lhs: string; rhs: string; left: number; right: number }[] = [
  { lhs: "f(7) − 10 = 15 − 10 = 5", rhs: "q(7) × (7 − 4) = 13 × 3 = 39 ≡ 5", left: 5, right: 5 },
  { lhs: "f(7) − 11 = 15 − 11 = 4", rhs: "13 × 3 = 39 ≡ 5 (정상 몫 값을 그대로 씀)", left: 4, right: 5 },
  { lhs: "f(7) − 11 = 15 − 11 = 4", rhs: "7 × 3 = 21 ≡ 4 (몫 대신 숫자 7을 고름)", left: 4, right: 4 },
];

const SCENES = [
  {
    label: "정상 답 10",
    summary: "양쪽 모두 5 → 통과",
    note: "τ=7에서 f(7)=49+14+3=66이고 17로 나눈 나머지는 15입니다. 정상 몫 X+6은 7에서 13입니다. 왼쪽 15−10=5와 오른쪽 13×3=39≡5가 같은 칸에 놓입니다.",
  },
  {
    label: "거짓 답 11, 몫 다항식 없음",
    summary: "왼쪽 4 · 오른쪽 5 → 거절",
    note: "f(X)−11은 X−4로 나누면 나머지 16이 남아 다항식 몫이 없습니다. 정상 몫의 값 13을 그대로 쓰면(가정) 오른쪽은 여전히 5라서 왼쪽 4와 다른 칸입니다.",
  },
  {
    label: "τ=7을 아는 경우",
    summary: "4 ÷ 3 ≡ 7 → 양쪽 모두 4",
    note: "τ를 알면 다항식을 찾지 않고 필요한 숫자를 바로 계산합니다. 3×6=18≡1이므로 3으로 나누기는 6을 곱하기이고, 4×6=24≡7입니다. 7×3=21≡4가 되어 거짓 답 11이 평가점 등식을 맞춥니다. 이것은 비밀 준비값이 드러났을 때의 문제이며 안전한 SRS에서는 τ를 알려 주지 않습니다.",
  },
] as const;

const C = { ink: "#334155", muted: "#94a3b8", left: "#2563eb", right: "#d97706", ok: "#15803d", bad: "#b91c1c" } as const;

function Strip({ active }: { active: number }) {
  const d = DATA[active];
  const match = d.left === d.right;
  const cells = Array.from({ length: MOD }, (_, value) => value);
  return (
    <div className="min-w-0">
      <div className="space-y-1 rounded-md border border-border px-3 py-2 font-mono text-xs leading-6">
        <p className="break-words font-bold text-blue-700 dark:text-blue-400">왼쪽 {d.lhs}</p>
        <p className="break-words font-bold text-amber-700 dark:text-amber-400">오른쪽 {d.rhs}</p>
      </div>
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[460px]" role="img" aria-label={`왼쪽 ${d.left}, 오른쪽 ${d.right}, ${match ? "같은 칸" : "다른 칸"}`}>
      {cells.map((value) => {
        const hit = value === d.left || value === d.right;
        return (
          <g key={value}>
            <rect x={LEFT + value * CELL} y={STRIP_Y} width={CELL} height={STRIP_H} fill={hit ? (match ? "#dcfce7" : "#f1f5f9") : "none"} stroke={C.muted} strokeWidth={1} />
            <text x={cx(value)} y={STRIP_Y + 15} textAnchor="middle" fontSize={10} fill={hit ? C.ink : C.muted} fontWeight={hit ? 700 : 400}>
              {value}
            </text>
          </g>
        );
      })}
      <path d={`M${cx(d.left) - 5} ${STRIP_Y - 10} L${cx(d.left) + 5} ${STRIP_Y - 10} L${cx(d.left)} ${STRIP_Y - 3} Z`} fill={C.left} />
      <text x={cx(d.left)} y={STRIP_Y - 14} textAnchor="middle" fontSize={10.5} fill={C.left}>
        왼쪽
      </text>
      <path d={`M${cx(d.right) - 5} ${STRIP_Y + STRIP_H + 10} L${cx(d.right) + 5} ${STRIP_Y + STRIP_H + 10} L${cx(d.right)} ${STRIP_Y + STRIP_H + 3} Z`} fill={C.right} />
      <text x={cx(d.right)} y={STRIP_Y + STRIP_H + 24} textAnchor="middle" fontSize={10.5} fill={C.right}>
        오른쪽
      </text>
      <text x={W / 2} y={STRIP_Y + STRIP_H + 44} textAnchor="middle" fontSize={10} fill={C.muted}>
        0부터 16까지: 17로 나눈 나머지가 놓이는 칸
      </text>
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={match ? C.ok : C.bad}>
        {match ? "같은 칸 → 평가점 등식 통과" : "다른 칸 → 평가점 등식 실패"}
      </text>
    </svg>
    </div>
  );
}

export default function TauForgeryViz() {
  return (
    <StepSceneShell
      eyebrow="τ가 드러나면"
      title="평가점 등식의 양쪽이 같은 칸에 놓이는가"
      description="KZG가 검사하는 f(τ)−y = q(τ)(τ−4)를 17로 나눈 나머지 칸 위에 놓습니다. τ는 원래 아무도 몰라야 하는 비밀 준비값이며, 여기서는 교육용으로 7이라고 둡니다(가정). 실제 검증자는 이 숫자를 직접 보지 않고 군 원소로 검사합니다."
      ariaLabel="τ=7일 때 정상 답, 거짓 답, τ를 아는 위조의 평가점 등식 비교"
      scenes={SCENES}
      render={(active) => <Strip active={active} />}
    />
  );
}
