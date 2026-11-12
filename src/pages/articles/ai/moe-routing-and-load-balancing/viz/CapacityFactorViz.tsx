import SceneShell from "./SceneShell";

/**
 * 본문 대응: #collapse 의 φ 맞바꿈(ProgressiveDetail 직전).
 * N=8, k=2, T=1,024 → slot 2,048, 이상적 평균 256. e0 수요 614.
 * C = ceil(φ·256): φ=1.0 → 256, 1.25 → 320, 2.0 → 512.
 * e0 drop = 614 − C: 358, 294, 102.
 * 전체 buffer = 8·C: 2,048 / 2,560 / 4,096. 계산되는 slot = 2,048 − drop: 1,690 / 1,754 / 1,946.
 * 빈 자리 = buffer − 계산: 358 / 806 / 2,150. (다른 일곱 expert는 C를 넘지 않는다고 가정)
 */
const N = 8;
const SLOTS = 2048;
const IDEAL = 256;
const DEMAND = 614;
const PHIS = [1.0, 1.25, 2.0] as const;

const ROWS = PHIS.map((phi) => {
  const cap = Math.ceil(phi * IDEAL);
  const drop = Math.max(0, DEMAND - cap);
  const buffer = N * cap;
  const computed = SLOTS - drop;
  return { phi, cap, drop, buffer, computed, empty: buffer - computed };
});

const pct = (part: number, whole: number) => `${Math.round((part / whole) * 100)}%`;

const SCENES = ROWS.map((row) => ({
  label: `φ = ${row.phi.toFixed(2)}`,
  summary: `drop ${row.drop.toLocaleString("en-US")} · 빈 자리 ${row.empty.toLocaleString("en-US")}`,
  note:
    row.phi === 1
      ? `capacity는 평균과 같은 256입니다. e0 수요 614 가운데 358(${pct(358, DEMAND)})이 버려지고, 전체 buffer 2,048칸 중 계산되는 것은 1,690칸입니다.`
      : row.phi === 1.25
        ? `capacity 320에서 e0의 294(${pct(294, DEMAND)})가 버려집니다. 앞 Viz와 본문의 기본 예시가 이 경우입니다. buffer는 2,560칸으로 늘고 빈 자리는 806칸입니다.`
        : `capacity 512면 drop은 102(${pct(102, DEMAND)})로 줄지만 buffer가 4,096칸이 돼 계산하는 1,946칸보다 빈 자리 2,150칸(${pct(2150, 4096)})이 더 많습니다. 빈 자리도 GEMM에 함께 들어갑니다.`,
}));

const W = 360;
const H = 156;
const X0 = 12;
const SPAN = W - 2 * X0;
const MAX_DEMAND = 640;
const MAX_BUFFER = 4096;
const dx = (v: number) => (v / MAX_DEMAND) * SPAN;
const bx = (v: number) => (v / MAX_BUFFER) * SPAN;

export default function CapacityFactorViz() {
  return (
    <SceneShell
      eyebrow="Capacity factor φ · 맞바꿈"
      title="φ를 키우면 버리는 token은 줄지만 비어 있는 buffer 칸이 늘어납니다"
      description="위 막대는 과부하 expert e0이 받은 614 slot과 capacity C = ceil(φ·256)입니다. 아래 막대는 여덟 expert의 buffer를 모두 이은 8·C칸 가운데 실제로 계산되는 slot과 빈 자리입니다."
      note="다른 일곱 expert는 capacity를 넘지 않는다고 가정해 계산했습니다. 빈 자리 수는 이 가정 아래의 산술값입니다."
      ariaLabel="capacity factor 1.0, 1.25, 2.0에서 drop과 빈 buffer 칸 비교"
      scenes={SCENES}
      render={(active) => {
        const row = ROWS[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={14} fontSize={11} fontWeight={700} fill="#475569">e0 수요 614 slot</text>
            <rect x={X0} y={22} width={dx(row.cap)} height={20} fill="#2563eb" />
            <rect x={X0 + dx(row.cap)} y={22} width={dx(row.drop)} height={20} fill="#d97706" />
            <line x1={X0 + dx(row.cap)} x2={X0 + dx(row.cap)} y1={18} y2={46} stroke="#64748b" strokeWidth={1.25} strokeDasharray="3 2" />
            <text x={X0 + dx(row.cap) / 2} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">계산 {row.cap}</text>
            <text x={X0 + dx(row.cap) + 4} y={58} fontSize={10} fontWeight={700} fill="#b45309">drop {row.drop}</text>
            <text x={X0 + dx(row.cap)} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">C = {row.cap}</text>

            <text x={X0} y={88} fontSize={10} fontWeight={700} fill="#475569">전체 buffer 8 × {row.cap} = {row.buffer.toLocaleString("en-US")}칸</text>
            <rect x={X0} y={96} width={bx(row.computed)} height={20} fill="#2563eb" />
            <rect x={X0 + bx(row.computed)} y={96} width={bx(row.empty)} height={20} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 2" />
            <rect x={X0} y={96} width={SPAN} height={20} fill="none" stroke="#cbd5e1" strokeWidth={1} />
            <text x={X0} y={132} fontSize={10} fontWeight={700} fill="#2563eb">계산 {row.computed.toLocaleString("en-US")}</text>
            <text x={X0 + bx(row.buffer)} y={132} textAnchor="end" fontSize={10} fontWeight={700} fill="#64748b">빈 자리 {row.empty.toLocaleString("en-US")}</text>
            <text x={W - X0} y={150} textAnchor="end" fontSize={10} fill="#94a3b8">눈금 끝 = 4,096칸 (φ = 2.0의 buffer)</text>
          </svg>
        );
      }}
    />
  );
}
