import SceneShell from "./SceneShell";

/**
 * 본문 대응: #inner-product 끝 문단 — n-bit range proof는 2log₂(n)+9개 원소,
 * proof generation·verification time은 n에 선형.
 * n=8,16,32,64는 설명용 선택: 원소 수 15, 17, 19, 21 / 시간은 8-bit 대비 1, 2, 4, 8배.
 */
const NS: readonly number[] = [8, 16, 32, 64];
const SIZE = NS.map((n) => 2 * Math.log2(n) + 9);
const WORK = NS.map((n) => n / NS[0]);
const SIZE_MAX = 24;
const WORK_MAX = 8;

const SCENES = [
  { label: "8-bit", summary: "2·3 + 9 = 15개 · 시간 기준 1배", note: "n=8이면 log₂8=3이므로 proof는 2·3+9=15개의 group·field 원소입니다. 오른쪽 시간 막대는 8-bit의 prove·verify 시간을 기준 1로 둔 상대값입니다." },
  { label: "16-bit", summary: "2·4 + 9 = 17개 · 시간 2배", note: "bit 수를 두 배로 늘리면 proof에는 원소 2개만 더해집니다. 반면 prove·verify 시간은 n에 선형이어서, 정비례로 단순화하면 두 배가 됩니다." },
  { label: "32-bit", summary: "2·5 + 9 = 19개 · 시간 4배", note: "다시 두 배가 되어도 proof는 2개 더 늘 뿐이지만 시간은 같은 단순화에서 8-bit의 4배입니다." },
  { label: "64-bit", summary: "2·6 + 9 = 21개 · 시간 8배", note: "bit 수가 8배여도 proof는 15개에서 21개로 늘 뿐이지만, 시간은 같은 단순화에서 8배입니다. 짧은 proof와 logarithmic verifier time은 같은 말이 아닙니다." },
] as const;

const W = 360;
const H = 150;
const BASE = 118;
const TOP = 22;
const BAR = 26;

function Panel({ x, title, values, max, active, color, fmt }: { x: number; title: string; values: readonly number[]; max: number; active: number; color: string; fmt: (value: number) => string }) {
  const span = 150;
  const gap = (span - values.length * BAR) / (values.length - 1);
  return (
    <g>
      <text x={x} y={12} fontSize={11} fontWeight={700} fill="#475569">{title}</text>
      <line x1={x} x2={x + span} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      {values.map((value, index) => {
        const height = (value / max) * (BASE - TOP);
        const bx = x + index * (BAR + gap);
        const shown = index <= active;
        return (
          <g key={NS[index]} opacity={shown ? 1 : 0.15}>
            <rect x={bx} y={BASE - height} width={BAR} height={height} rx={2} fill={color} opacity={index === active ? 0.95 : 0.45} />
            <text x={bx + BAR / 2} y={BASE - height - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#334155">{shown ? fmt(value) : ""}</text>
            <text x={bx + BAR / 2} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">{NS[index]}</text>
          </g>
        );
      })}
      <text x={x + span / 2} y={BASE + 28} textAnchor="middle" fontSize={10} fill="#64748b">range bit 수 n</text>
    </g>
  );
}

export default function ProofSizeVsWorkViz() {
  return (
    <SceneShell
      eyebrow="proof 크기 vs 시간 · 논문 abstract"
      title="bit 수가 두 배가 되면 proof는 원소 2개만 늘지만 시간은 n에 선형으로 늘어납니다"
      description="왼쪽은 n-bit range proof의 원소 수 2log₂(n)+9, 오른쪽은 n에 선형인 prove·verify 시간을 8-bit 대비 배수로 그렸습니다. 선형 증가를 정비례로 단순화했고 n=16·32·64는 설명용 선택입니다(가정). 절대 시간은 그리지 않습니다."
      ariaLabel="range bit 수에 따른 proof 원소 수와 상대 시간 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Panel x={10} title="proof 원소 수" values={SIZE} max={SIZE_MAX} active={active} color="#2563eb" fmt={(value) => String(value)} />
          <Panel x={200} title="시간 (8-bit = 1×)" values={WORK} max={WORK_MAX} active={active} color="#d97706" fmt={(value) => `${value}×`} />
        </svg>
      )}
    />
  );
}
