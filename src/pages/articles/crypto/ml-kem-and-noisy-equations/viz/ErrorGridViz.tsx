import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 오류가 없으면 공개된 표와 결과로 비밀을 푸는 정확한 연립방정식이 된다.
 * 17×17칸이 s=[s₁,s₂]의 모든 후보입니다. 2s₁+3s₂=t₁과 4s₁+s₂=t₂를 만족하는 칸을 칠합니다(모두 17로 나눈 나머지).
 * t=[8,6]이면 만나는 칸은 (1,2). 오류 1을 더한 t=[9,6]이면 (6,16). 검산: 2×6+3×16=60→9, 4×6+16=40→6.
 */
const Q = 17;
const CELL = 17;
const LEFT = 36;
const TOP = 8;
const W = LEFT + CELL * Q + 10;
const H = TOP + CELL * Q + 40;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const SCENES = [
  { label: "첫 식", summary: "2s₁ + 3s₂ = 8", note: "칸 하나가 비밀 후보 하나입니다. 오류를 뺀 공개값 8을 만족하는 칸만 칠하면 17칸입니다. 이 식만으로는 답이 하나로 정해지지 않습니다." },
  { label: "둘째 식", summary: "4s₁ + s₂ = 6 → (1,2)", note: "둘째 식의 칸까지 칠하면 두 무리가 한 칸에서만 만납니다. 그 칸 (1,2)가 비밀 s입니다. 오류가 없으면 연립방정식을 푸는 일로 끝납니다." },
  { label: "오류 하나", summary: "t₁ = 9 → (6,16)", note: "실제 t₁=9를 쓰면 (6,16)에서 만납니다. 2×6+3×16=60, 4×6+16=40은 17로 나누면 9와 6이라 식은 맞지만 비밀이 아닙니다. 2차원 예라 안전하지는 않습니다." },
  { label: "오류의 크기", summary: "양쪽 끝이 다 실패", note: "너무 작거나 차원이 낮으면 공격이 쉬워질 수 있고, 너무 크면 복원이 깨집니다. 복원이 깨지는 작은 예는 10절에서 계산합니다. 경계는 개념도입니다." },
] as const;

const hit1 = (a: number, b: number, t: number) => (2 * a + 3 * b) % Q === t;
const hit2 = (a: number, b: number) => (4 * a + b) % Q === 6;
const cx = (a: number) => LEFT + a * CELL;
const cy = (b: number) => TOP + (Q - 1 - b) * CELL;

function Grid({ active }: { active: number }) {
  const t1 = active === 2 ? 9 : 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[268px] sm:max-w-[320px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {Array.from({ length: Q * Q }, (_, index) => {
        const a = index % Q;
        const b = Math.floor(index / Q);
        const first = hit1(a, b, t1);
        const second = active >= 1 && hit2(a, b);
        const fill = first && second ? RED : first ? `${AMBER}66` : second ? `${BLUE}55` : "none";
        return <rect key={index} x={cx(a) + 0.5} y={cy(b) + 0.5} width={CELL - 1} height={CELL - 1} fill={fill} stroke={FAINT} strokeWidth={0.5} opacity={first || second ? 1 : 0.55} />;
      })}
      {[0, 4, 8, 12, 16].map((v) => (
        <g key={v}>
          <text x={cx(v) + CELL / 2} y={TOP + Q * CELL + 15} textAnchor="middle" fontSize={12} fill={GRAY}>{v}</text>
          <text x={LEFT - 5} y={cy(v) + CELL / 2 + 4} textAnchor="end" fontSize={12} fill={GRAY}>{v}</text>
        </g>
      ))}
      <text x={LEFT + (Q * CELL) / 2} y={H - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>s₁ 후보</text>
      <text x={11} y={TOP + (Q * CELL) / 2} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY} transform={`rotate(-90 11 ${TOP + (Q * CELL) / 2})`}>s₂ 후보</text>
      {active === 2 && (
        <rect x={cx(1) - 1} y={cy(2) - 1} width={CELL + 2} height={CELL + 2} fill="none" stroke={GRAY} strokeWidth={1.25} strokeDasharray="3 2" />
      )}
      {active === 1 && <text x={cx(1) + CELL + 5} y={cy(2) + 13} fontSize={13} fontWeight={700} fill={RED}>(1,2)</text>}
      {active === 2 && (
        <g>
          <text x={cx(1) + CELL + 5} y={cy(2) + 13} fontSize={13} fontWeight={700} fill={GRAY}>진짜 비밀</text>
          <text x={cx(6) + CELL + 5} y={cy(16) + 13} fontSize={13} fontWeight={700} fill={RED}>(6,16)</text>
        </g>
      )}
    </svg>
  );
}

function Band({ active }: { active: number }) {
  const y = 118;
  const x0 = 14;
  const a = 112;
  const b = 248;
  const x1 = W - 14;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[268px] sm:max-w-[320px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <text x={W / 2} y={y + 76} textAnchor="middle" fontSize={13} fontWeight={700} fill={GRAY}>오류의 크기 →</text>
      <rect x={x0} y={y - 26} width={a - x0} height={52} fill={`${RED}1f`} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
      <rect x={a} y={y - 26} width={b - a} height={52} fill={`${BLUE}26`} stroke={BLUE} strokeWidth={1} />
      <rect x={b} y={y - 26} width={x1 - b} height={52} fill={`${RED}1f`} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
      <text x={(x0 + a) / 2} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>너무 작음</text>
      <text x={(a + b) / 2} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>쓸 수 있는 폭</text>
      <text x={(b + x1) / 2} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>너무 큼</text>
      <text x={(x0 + a) / 2} y={y + 48} textAnchor="middle" fontSize={12} fill={RED}>공격이 쉬워질 수</text>
      <text x={(b + x1) / 2} y={y + 48} textAnchor="middle" fontSize={12} fill={RED}>복원이 깨짐</text>
    </svg>
  );
}

export default function ErrorGridViz() {
  return (
    <SceneShell
      eyebrow="격자 칸으로 푸는 연립방정식"
      title="오류 하나가 두 식의 교차점을 멀리 옮깁니다"
      description="칠한 칸은 식을 만족하는 비밀 후보, 빨간 칸은 두 식이 만나는 곳입니다."
      ariaLabel="17 곱하기 17 후보 칸에서 두 식의 교차점이 오류 때문에 옮겨 가는 모습과 오류 크기의 양쪽 한계"
      scenes={SCENES}
      render={(active) => (active === 3 ? <Band active={active} /> : <Grid active={active} />)}
    />
  );
}
