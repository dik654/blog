import SceneShell from "./SceneShell";

/**
 * 본문 대응: #procedure — 70B FP16 140 GB + KV 200 GB, rank당 예산 72 GB.
 * (140+200)/g′: 4장 85 GB(초과), 5장 68 GB(통과) → g_min=5 → 2의 거듭제곱으로 올려 TP 8, PP 1, DP = floor(16/8) = 2.
 * KV head 수가 5 이상이라 KV가 g′로 나뉜다고 보는 글의 계산을 그대로 씁니다.
 */
const WEIGHT = 140;
const KV = 200;
const BUDGET = 72;
const CANDIDATES = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const perRank = (g: number) => (WEIGHT + KV) / g;

const SCENES = [
  { label: "1 · 최소 몇 장인가", summary: "4장 85 GB, 5장 68 GB", note: "KV는 처리한 token의 attention 값을 담는 memory입니다. KV도 장수만큼 나뉜다고 보면(뒤쪽 그림 참고) 최소 장수 g_min은 5입니다.", step: 0 },
  { label: "2 · 갈림길", summary: "5 ≤ 8, NVLink → TP 8", note: "5장은 node 8장 안에 들어가고 node 안이 NVLink이므로 첫 갈래입니다. 2의 거듭제곱으로 올려 TP 8, PP 1입니다.", step: 1 },
  { label: "3 · 남는 GPU는 DP", summary: "floor(16 / 8) = 2", note: "그 전에 통신 비율 검산 R = 1.1 / 5.2 = 0.21 < 1을 통과합니다. 남는 GPU는 모두 replica로 만듭니다. TP 8 × DP 2, 앞서 답으로 고른 후보 C입니다.", step: 2 },
  { label: "다른 갈래", summary: "PCIe면 실측, 초과면 PP", note: "PCIe node면 둘째 갈래에서 같은 부하로 재서 고르고, g_min이 node를 넘으면 셋째 갈래로 PP를 씁니다. MLA·DCP는 이 절 뒤쪽 그림에서 봅니다.", step: 3 },
] as const;

const W = 360;
const H = 146;
const BASE = 112;
const TOP = 18;
const SLOT = (W - 20) / CANDIDATES.length;
const scaleMax = perRank(1);

function SearchChart() {
  const lineY = BASE - (BUDGET / scaleMax) * (BASE - TOP);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="GPU 수에 따른 rank당 memory와 예산 72 GB">
      {CANDIDATES.map((g, position) => {
        const value = perRank(g);
        const height = (value / scaleMax) * (BASE - TOP);
        const x = 10 + position * SLOT + 6;
        const width = SLOT - 12;
        const pass = value <= BUDGET;
        const isMin = g === 5;
        return (
          <g key={g}>
            <rect x={x} y={BASE - height} width={width} height={height} rx={2} fill={pass ? "#2563eb" : "#94a3b8"} opacity={isMin ? 0.95 : pass ? 0.45 : 0.6} />
            <text x={x + width / 2} y={BASE + 14} textAnchor="middle" fontSize={10} fontWeight={isMin ? 700 : 400} fill="#64748b">{g}장</text>
            <text x={x + width / 2} y={BASE + 28} textAnchor="middle" fontSize={10} fontWeight={isMin ? 700 : 400} fill={isMin ? "#2563eb" : "#64748b"}>{Math.round(value)}</text>
          </g>
        );
      })}
      <line x1={10} x2={W - 10} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <line x1={10} x2={W - 10} y1={lineY} y2={lineY} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
      <text x={W - 10} y={lineY - 5} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">예산 72 GB</text>
      <text x={W - 10} y={TOP} textAnchor="end" fontSize={10} fill="#64748b">아래 숫자 = 장당 GB</text>
    </svg>
  );
}

const BRANCHES = [
  { cond: "g_min ≤ 8, NVLink", result: "TP 8 · PP 1" },
  { cond: "g_min ≤ 8, PCIe", result: "TP 8 (MLA면 DCP 8), TP 4 × PP 2와 실측 비교" },
  { cond: "g_min > 8", result: "TP 8 · PP = ceil(g_min / 8)" },
] as const;

function Branches({ step }: { step: number }) {
  return (
    <div className="space-y-1.5">
      {BRANCHES.map((branch, position) => {
        const on = step === 3 ? position > 0 : position === 0;
        return (
          <div key={branch.cond} className={`grid gap-x-2 rounded-lg border px-3 py-1 text-xs leading-4 sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:py-1.5 sm:leading-5 ${on ? "border-primary bg-primary/10" : "border-border text-muted-foreground"}`}>
            <span className="font-mono font-semibold">{branch.cond}</span>
            <span>→ {branch.result}</span>
          </div>
        );
      })}
    </div>
  );
}

function Replicas() {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2" aria-hidden="true">
      {["replica 0", "replica 1"].map((name) => (
        <div key={name} className="rounded-lg border border-border px-2 py-1.5">
          <p className="text-xs font-semibold">{name}</p>
          <div className="grid grid-cols-4 gap-0.5">
            {Array.from({ length: 8 }, (_, cell) => <span key={cell} className="h-3 rounded-[2px] bg-[#2563eb]/50" />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DegreeSearchViz() {
  return (
    <SceneShell
      eyebrow="Degree 고르기"
      title="70B를 16 GPU에 놓는 절차를 끝까지 따라가면 후보 C가 나옵니다"
      description="70B FP16 140 GB + KV 200 GB, 8장 node 2대, 장당 예산 72 GB인 글의 예시입니다."
      ariaLabel="최소 GPU 수 찾기, 갈림길, 남는 GPU를 DP로 주는 과정"
      scenes={SCENES}
      render={(index) => {
        const { step } = SCENES[index];
        if (step === 0) return <SearchChart />;
        return (
          <div className="min-w-0">
            <Branches step={step} />
            {step === 2 && <Replicas />}
          </div>
        );
      }}
    />
  );
}
