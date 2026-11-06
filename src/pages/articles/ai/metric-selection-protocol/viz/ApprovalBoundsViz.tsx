import SceneShell from "./SceneShell";

/**
 * 본문 대응: #receipt — 나쁜 방향의 95% 경계가 허용값을 통과해야 승인한다.
 * 비용 41→42.2≤45, 최저 집단 recall .82→.809≥.80, p95 96→99≤100. 모두 설명용 가정.
 * 세 줄 모두 오른쪽이 불리한 쪽이 되도록 recall 눈금만 뒤집었고, 줄마다 눈금이 다르다.
 */
const TRACKS = [
  { name: "비용 / 1,000건", point: 41, bound: 42.2, limit: 45, boundName: "상한", pointText: "41", boundText: "42.2", limitText: "45", min: 40, max: 45.6 },
  { name: "최저 집단 recall", point: 0.82, bound: 0.809, limit: 0.8, boundName: "하한", pointText: ".82", boundText: ".809", limitText: ".80", min: 0.825, max: 0.797 },
  { name: "p95 지연 ms", point: 96, bound: 99, limit: 100, boundName: "상한", pointText: "96", boundText: "99", limitText: "100", min: 95, max: 100.5 },
] as const;

const SCENES = [
  { label: "비용", summary: "상한 42.2 ≤ 45 → 1", focus: 0, note: "비용은 클수록 나쁘므로 95% 신뢰구간의 상한을 봅니다. 42.2가 사전 허용값 45 안에 있어 통과입니다." },
  { label: "최저 집단 recall", summary: "하한 .809 ≥ .80 → 1", focus: 1, note: "recall은 낮을수록 나쁘므로 하한을 봅니다. 모든 언어 집단의 하한 중 가장 작은 값 .809가 .80 이상이라 통과입니다. 이 줄만 눈금을 뒤집어 오른쪽이 낮은 값입니다." },
  { label: "p95 지연", summary: "상한 99 ≤ 100 → 1", focus: 2, note: "지연은 길수록 나쁘므로 상한을 봅니다. 99ms가 100ms 안에 있어 통과입니다." },
  { label: "세 판정을 곱합니다", summary: "1 · 1 · 1 = 1 → 승인", focus: 3, note: "하나라도 경계를 실패하면 곱이 0이 되어 거절이고, 새 실험과 새 독립 최종 자료가 필요합니다. 최소 표본을 못 채우면 보류합니다. 여기서는 세 경계가 모두 통과해 승인입니다." },
] as const;

const W = 360;
const ROW = 64;
const H = ROW * TRACKS.length + 6;
const LEFT = 14;
const RIGHT = 346;

const OUTCOMES = [
  { name: "최소 표본 미달", result: "보류", on: false },
  { name: "경계 하나라도 실패", result: "거절", on: false },
  { name: "세 경계 모두 통과", result: "승인", on: true },
] as const;

export default function ApprovalBoundsViz() {
  return (
    <SceneShell
      eyebrow="불리한 쪽 경계로 판정"
      title="점추정이 아니라 불리한 쪽 끝이 허용선을 넘지 않는지 봅니다"
      description="신뢰구간은 표본 변동을 감안한 범위이고, 여기서는 그 가운데 불리한 쪽 끝만 씁니다. 점은 점추정(표본에서 구한 값 하나), 선 끝은 95% 경계, 빨간 선은 사전 허용값입니다. 세 줄 모두 오른쪽이 불리한 쪽이고 줄마다 눈금이 달라 여유 길이를 서로 비교하지 않습니다. 수치는 설명용 가정입니다."
      ariaLabel="비용, 최저 집단 recall, p95 지연의 점추정과 95 퍼센트 경계와 허용값"
      scenes={SCENES}
      render={(active) => {
        const { focus, label, summary } = SCENES[active];
        return (
          <div className="mx-auto max-w-[520px] min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label}: ${summary}`}>
              {TRACKS.map((track, index) => {
                const x = (value: number) => LEFT + ((value - track.min) / (track.max - track.min)) * (RIGHT - LEFT);
                const top = index * ROW;
                const axis = top + 34;
                const on = focus === index || focus === 3;
                return (
                  <g key={track.name} opacity={on ? 1 : 0.35}>
                    <text x={LEFT} y={top + 12} fontSize={12} fontWeight={700} fill="#64748b">{track.name}</text>
                    <text x={RIGHT} y={top + 12} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">{`${track.boundName} 통과 → 1`}</text>
                    <line x1={LEFT} x2={RIGHT} y1={axis} y2={axis} stroke="#94a3b8" strokeWidth={1} />
                    <line x1={x(track.point)} x2={x(track.bound)} y1={axis} y2={axis} stroke="#2563eb" strokeWidth={1.25} />
                    <line x1={x(track.bound)} x2={x(track.bound)} y1={axis - 6} y2={axis + 6} stroke="#2563eb" strokeWidth={1.25} />
                    <circle cx={x(track.point)} cy={axis} r={4} fill="#2563eb" />
                    <line x1={x(track.limit)} x2={x(track.limit)} y1={axis - 11} y2={axis + 11} stroke="#dc2626" strokeWidth={1.25} />
                    <text x={x(track.point)} y={axis + 19} textAnchor="middle" fontSize={12} fill="#64748b">{track.pointText}</text>
                    <text x={x(track.bound)} y={axis + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{track.boundText}</text>
                    <text x={x(track.limit)} y={axis + 24} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">{track.limitText}</text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
              {OUTCOMES.map((item) => {
                const lit = focus === 3;
                const chosen = lit && item.on;
                return (
                  <span key={item.result} className="rounded border px-1 py-1.5 leading-4" style={{ borderColor: chosen ? "#2563eb" : "#94a3b8", color: chosen ? "#2563eb" : "#64748b", opacity: lit ? 1 : 0.35, fontWeight: chosen ? 700 : 400 }}>
                    <span className="block break-keep">{item.name}</span>
                    <strong>{item.result}</strong>
                  </span>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
