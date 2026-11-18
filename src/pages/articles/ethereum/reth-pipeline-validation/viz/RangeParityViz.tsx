import PipelineSceneShell from "../../reth-pipeline/viz/PipelineSceneShell";

/**
 * 본문 대응: #recovery·#decision — 재시작이나 unwind 뒤 checkpoint와 output이 같은 범위를 가리키는지로 통과·기각을 가릅니다.
 * 축 = fixture block 99..250. 막대 = 실제로 남은 output, 삼각형 = 그 stage의 checkpoint.
 * 99·163·140·250은 본문 실험 목록의 숫자입니다. 100..130 output, block 200의 누락 body,
 * 다음 batch 164..227(threshold 64)은 실패 모양을 보이려는 가정입니다.
 */

interface Lane {
  stage: string;
  outputEnd: number | null;
  checkpoint: number;
  /** 남아 있으면 안 되는 구간 (점선 경고) */
  forbidden?: readonly [number, number];
  /** checkpoint는 지났는데 output이 비어 있는 구간 (주황 빗금) */
  missing?: readonly [number, number];
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  lanes: readonly Lane[];
  pass: boolean;
  verdict: string;
  marker?: number;
}

const SCENES: readonly Scene[] = [
  {
    label: "Commit 전 종료",
    summary: "checkpoint 99 · output 없음",
    note: "Output과 checkpoint가 transaction 안에 있을 때 끝났다면 둘 다 공개되지 않아야 합니다. 둘 다 99에 있으므로 재시작은 100부터이고 통과입니다.",
    lanes: [{ stage: "Stage", outputEnd: null, checkpoint: 99 }],
    pass: true,
    verdict: "같은 범위 · 통과",
  },
  {
    label: "Commit 직후 종료",
    summary: "checkpoint 163 · output 100..163",
    note: "Checkpoint 163과 output 100..163이 함께 남았습니다. 막대 끝과 삼각형이 같은 자리이므로 재시작은 164부터이고 통과입니다.",
    lanes: [{ stage: "Stage", outputEnd: 163, checkpoint: 163 }],
    pass: true,
    verdict: "같은 범위 · 통과",
  },
  {
    label: "Output만 남음",
    summary: "output 163 ≠ checkpoint 99",
    note: "Output은 163까지 보이는데 checkpoint는 99입니다. 재시작 뒤 output과 checkpoint가 서로 다른 range를 가리키므로 실패입니다. 결정 절이 말하는 mixed range의 한 모양입니다.",
    lanes: [{ stage: "Stage", outputEnd: 163, checkpoint: 99 }],
    pass: false,
    verdict: "서로 다른 range · 기각",
  },
  {
    label: "Checkpoint가 앞섬",
    summary: "checkpoint 163 > output 130",
    note: "Checkpoint는 163인데 output은 130까지만 있다고 해 봅시다(가정). 재시작한 stage는 164부터 이어 가므로 131..163은 비어 있는 채로 남습니다. 기각 조건의 첫 항목입니다.",
    lanes: [{ stage: "Stage", outputEnd: 130, checkpoint: 163, missing: [131, 163] }],
    pass: false,
    verdict: "checkpoint가 output보다 앞섬 · 기각",
  },
  {
    label: "Invalid input에서 멈춤",
    summary: "Bodies 163 · Senders ≤ 163",
    note: "다음 batch 164..227 안의 block 200 body가 없다고 해 봅시다(가정). Bodies는 오류를 반환하고 163에 머물러야 하며, 뒤 stage인 Senders의 target도 163을 넘지 않아야 합니다. 점선 구간에 Senders output이 생기면 invalid suffix가 downstream에 남은 것이므로 기각입니다.",
    lanes: [
      { stage: "Bodies", outputEnd: 163, checkpoint: 163 },
      { stage: "Senders", outputEnd: 163, checkpoint: 163, forbidden: [164, 250] },
    ],
    pass: true,
    verdict: "첫 오류에서 정지 · 통과 조건",
    marker: 200,
  },
  {
    label: "Reorg unwind 뒤",
    summary: "250 → 140 · stale 0",
    note: "250에서 140으로 역순 unwind한 뒤에는 checkpoint 140과 output 끝이 같아야 합니다. 141..250에 이전 branch의 output이나 checkpoint가 하나라도 남으면 실패입니다.",
    lanes: [{ stage: "Stage", outputEnd: 140, checkpoint: 140, forbidden: [141, 250] }],
    pass: true,
    verdict: "141..250 stale 0 · 통과 조건",
  },
];

const W = 360;
const LEFT = 62;
const RIGHT = 344;
const LANE_H = 50;
const AXIS_Y = 132;
const H = 152;
const x = (block: number) => LEFT + ((block - 99) / (250 - 99)) * (RIGHT - LEFT);
const TICKS = [99, 140, 163, 250] as const;

export default function RangeParityViz() {
  return (
    <PipelineSceneShell
      eyebrow="재시작·unwind 뒤 판정"
      title="막대 끝과 checkpoint 삼각형이 어긋나면 그 run은 기각합니다"
      description="파란 막대는 재시작이나 unwind 뒤 실제로 남은 output, 삼각형은 그 stage의 checkpoint입니다. 빨간 점선 칸은 아무것도 남아 있으면 안 되는 구간이고, 주황 빗금 칸은 checkpoint가 지나갔는데 output이 비어 있는 구간입니다. 99·140·163·250은 본문 실험 목록의 block 번호입니다."
      note="Checkpoint는 stage가 그 block까지 output과 진행 상태를 영속화했다는 기록입니다. 130과 block 200의 누락 body, 다음 batch 164..227은 실패 모양을 보이려는 가정입니다."
      ariaLabel="재시작과 unwind 뒤 checkpoint와 output 범위가 같은지에 따른 통과와 기각"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.verdict}`}>
              <defs>
                <pattern id="range-parity-missing" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1={0} y1={0} x2={0} y2={6} stroke="#d97706" strokeWidth={1} strokeOpacity={0.6} />
                </pattern>
              </defs>
              {scene.lanes.map((lane, laneIndex) => {
                const y = 14 + laneIndex * LANE_H + (scene.lanes.length === 1 ? LANE_H / 2 : 0);
                const cpX = x(lane.checkpoint);
                // output이 하나도 없으면 첫 batch 시작 전(99)까지 저장된 것과 같습니다.
                const mismatch = (lane.outputEnd ?? 99) !== lane.checkpoint;
                return (
                  <g key={lane.stage}>
                    <text x={LEFT - 8} y={y + 13} textAnchor="end" fontSize={11} fontWeight={700} fill="#475569">{lane.stage}</text>
                    <rect x={x(99)} y={y} width={RIGHT - x(99)} height={18} rx={2} fill="none" stroke="#cbd5e1" strokeWidth={1} />
                    {lane.forbidden && (
                      <rect x={x(lane.forbidden[0] - 0.5)} y={y} width={x(lane.forbidden[1]) - x(lane.forbidden[0] - 0.5)} height={18} rx={2} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                    )}
                    {lane.missing && (
                      <g>
                        <rect x={x(lane.missing[0] - 0.5)} y={y} width={x(lane.missing[1]) - x(lane.missing[0] - 0.5)} height={18} rx={2} fill="url(#range-parity-missing)" stroke="#d97706" strokeWidth={1} />
                        <text x={x(lane.missing[1]) + 6} y={y + 13} fontSize={10} fontWeight={700} fill="#b45309">{lane.missing[0]}..{lane.missing[1]} 빈 칸</text>
                      </g>
                    )}
                    {lane.outputEnd !== null ? (
                      <rect x={x(99.5)} y={y} width={x(lane.outputEnd) - x(99.5)} height={18} rx={2} fill="#2563eb" fillOpacity={0.85} />
                    ) : (
                      <text x={x(99) + 6} y={y + 13} fontSize={10} fill="#64748b">output 없음</text>
                    )}
                    <path d={`M ${cpX} ${y + 22} l -6 9 h 12 z`} fill={mismatch ? "#dc2626" : "#0f766e"} />
                    <text x={cpX > W / 2 ? cpX - 9 : cpX + 9} y={y + 32} textAnchor={cpX > W / 2 ? "end" : "start"} fontSize={10} fontWeight={700} fill={mismatch ? "#b91c1c" : "#0f766e"}>
                      checkpoint {lane.checkpoint}
                    </text>
                  </g>
                );
              })}
              {scene.marker !== undefined && (
                <g>
                  <line x1={x(scene.marker)} x2={x(scene.marker)} y1={8} y2={AXIS_Y} stroke="#d97706" strokeWidth={1} />
                  <text x={x(scene.marker) - 4} y={10} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">✕ block {scene.marker} body 없음</text>
                </g>
              )}
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((block) => (
                <g key={block}>
                  <line x1={x(block)} x2={x(block)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(block)} y={AXIS_Y + 15} textAnchor={block === 99 ? "start" : block === 250 ? "end" : "middle"} fontSize={10} fill="#64748b">{block}</text>
                </g>
              ))}
            </svg>
            <p className={`mt-2 border-y py-2 text-center text-xs font-bold ${scene.pass ? "border-primary/40 text-primary" : "border-red-600/50 text-red-700 dark:text-red-400"}`}>
              {scene.pass ? "✓ " : "✕ "}
              {scene.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
