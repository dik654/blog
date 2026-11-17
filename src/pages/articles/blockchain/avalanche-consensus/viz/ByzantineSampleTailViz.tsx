import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sampling-poll ExplainedFormula — N=100, F=20, k=5, alpha=4.
 * 뽑힌 5명 안의 Byzantine 수 X의 분포(hypergeometric)를 i=0..5 전부 그리고, alpha=4 이상 꼬리만 더한다.
 * P(X=i) = C(20,i)·C(80,5−i) / C(100,5) → 31.93%, 42.01%, 20.73%, 4.78%, 0.515%, 0.021%. 꼬리 합 ≈ 0.535%.
 */
const N = 100;
const F = 20;
const K = 5;
const ALPHA = 4;

function choose(n: number, r: number): number {
  return Array.from({ length: r }, (_, index) => index).reduce<number>(
    (acc, index) => (acc * (n - index)) / (index + 1),
    1,
  );
}

const PROBS = Array.from({ length: K + 1 }, (_, i) => (choose(F, i) * choose(N - F, K - i)) / choose(N, K));
const TAIL = PROBS.slice(ALPHA).reduce<number>((sum, p) => sum + p, 0);
const MAX_P = Math.max(...PROBS);

const pct = (p: number) => (p >= 0.01 ? `${(p * 100).toFixed(1)}%` : `${(p * 100).toFixed(3)}%`);

const SCENES = [
  {
    label: "전체 100명 중 20명",
    summary: "N=100 · F=20",
    note: "칸 하나가 validator 한 명입니다. 빨간 칸 20개는 adversary가 통제한다고 둔 Byzantine validator입니다. 칸의 위치는 설명용 배치(가정)이며, 한 poll은 이 100명 중 5명을 같은 확률로, 복원 없이 뽑는다고 둡니다.",
  },
  {
    label: "5명 안에 몇 명이 섞이나",
    summary: "0명 31.9% · 1명 42.0% · 2명 20.7%",
    note: "막대 하나가 '뽑힌 5명 중 Byzantine이 i명'인 경우의 확률입니다. 대부분의 표본에는 Byzantine이 0~2명 들어오고, 3명은 약 4.8%입니다. 여섯 막대를 모두 더하면 1입니다.",
  },
  {
    label: "alpha=4 이상만 더하기",
    summary: `4명 + 5명 ≈ ${pct(TAIL)}`,
    note: "식의 합은 점선 오른쪽 두 막대만 더합니다. 4명 약 0.515%, 5명 약 0.021%를 더해 약 0.535%입니다. 이 값은 한 poll의 표본 구성만 말하며, 반복 poll의 독립성이나 network 전체의 상충 결정 확률은 별도입니다.",
  },
] as const;

const W = 360;
const H = 200;

function PopulationGrid() {
  const cell = 13;
  const gap = 3;
  const gridW = 10 * cell + 9 * gap;
  const x0 = (W - gridW) / 2;
  const y0 = 18;
  return (
    <g>
      {Array.from({ length: N }, (_, index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        const faulty = index < F;
        return (
          <rect
            key={index}
            x={x0 + col * (cell + gap)}
            y={y0 + row * (cell + gap)}
            width={cell}
            height={cell}
            rx={2}
            fill={faulty ? "#dc2626" : "#ffffff"}
            stroke={faulty ? "#dc2626" : "#94a3b8"}
            strokeWidth={1}
          />
        );
      })}
      <text x={x0 + gridW + 8} y={y0 + 20} fontSize={10} fontWeight={700} fill="#dc2626">Byzantine 20</text>
      <text x={x0 + gridW + 8} y={y0 + 90} fontSize={10} fill="#64748b">정직 80</text>
    </g>
  );
}

function Distribution({ showTail }: { showTail: boolean }) {
  const left = 24;
  const baseY = 160;
  const topY = 30;
  const slot = (W - 2 * left) / (K + 1);
  const barW = slot * 0.56;
  const cutX = left + slot * ALPHA - (slot - barW) / 4;
  return (
    <g>
      {showTail && (
        <>
          <rect x={cutX} y={topY - 18} width={W - left - cutX} height={baseY - topY + 18} fill="#dc2626" opacity={0.06} />
          <line x1={cutX} x2={cutX} y1={topY - 18} y2={baseY} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
          <text x={cutX + 4} y={topY - 6} fontSize={10} fontWeight={700} fill="#dc2626">alpha=4 이상</text>
        </>
      )}
      {PROBS.map((p, i) => {
        const h = (p / MAX_P) * (baseY - topY);
        const x = left + i * slot + (slot - barW) / 2;
        const inTail = i >= ALPHA;
        const fill = showTail ? (inTail ? "#dc2626" : "#cbd5e1") : "#2563eb";
        return (
          <g key={i}>
            <rect x={x} y={baseY - h} width={barW} height={Math.max(h, 0.5)} rx={2} fill={fill} />
            <text x={x + barW / 2} y={baseY - h - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={showTail && inTail ? "#dc2626" : "#334155"}>
              {pct(p)}
            </text>
            <text x={x + barW / 2} y={baseY + 14} textAnchor="middle" fontSize={10} fill="#64748b">{i}명</text>
          </g>
        );
      })}
      <line x1={left} x2={W - left} y1={baseY} y2={baseY} stroke="#94a3b8" strokeWidth={1} />
      <text x={W / 2} y={baseY + 32} textAnchor="middle" fontSize={10} fill="#64748b">뽑힌 5명 안의 Byzantine 수</text>
    </g>
  );
}

export default function ByzantineSampleTailViz() {
  return (
    <SceneShell
      eyebrow="한 poll의 표본 구성 · 설명용 모델"
      title="5명 표본에 Byzantine이 4명 이상 들어올 확률은 분포의 꼬리입니다"
      description="Byzantine validator는 adversary가 통제한다고 둔 참여자입니다. 본문의 N=100, F=20, k=5, alpha=4를 그대로 쓰고, 막대 높이는 확률에 비례합니다."
      ariaLabel="100명 중 20명이 Byzantine일 때 5명 표본 안의 Byzantine 수 분포와 4명 이상 꼬리 확률"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? <PopulationGrid /> : <Distribution showTail={active === 2} />}
        </svg>
      )}
    />
  );
}
