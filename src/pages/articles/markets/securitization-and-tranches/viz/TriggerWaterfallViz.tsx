import ArrowPath from "./ArrowPath";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 모인 돈의 처리 순서, 그리고 "일정 조건을 넘으면 뒤 순서 지급을 멈추고
 * 앞 순서 원금부터 갚도록 할 수 있다"는 계약 분기. 세 칸은 크기가 같아 금액을 뜻하지 않고, 위에서 아래로의 위치가 지급 순서다.
 */
const SCENES = [
  { label: "조건을 넘기 전", summary: "70 다음 20 다음 10", note: "모인 돈에서 수금 비용과 이자를 처리하는 순서도 계약에 적혀 있습니다. 조건을 넘기 전에는 세 몫이 70 다음 20 다음 10의 순서로 계약이 정한 대로 받습니다." },
  { label: "조건을 넘은 뒤", summary: "뒤 순서 멈춤 · 앞 순서 원금부터", note: "실제 계약은 이렇게 할 수 있습니다. 어떤 조건인지와 중간 몫이 어떻게 되는지는 이 글이 정하지 않았으니 계약을 봐야 합니다. 원금 손실 모형만으로는 매달 누가 현금을 받는지 설명할 수 없는 이유입니다." },
] as const;

const SLOT_X = 236;
const SLOT_W = 118;
const SLOT_H = 38;
const SLOT_Y = [6, 61, 116];
const NAMES = ["앞 순서 70", "중간 20", "뒤 순서 10"];
const ACCENT = "#2563eb";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const TEXT = "#64748b";

const AFTER = [
  { status: "원금부터 갚음", color: ACCENT, dashed: false, width: 1.25 },
  { status: "계약에 따름", color: MUTED, dashed: true, width: 1 },
  { status: "지급 멈춤", color: RED, dashed: true, width: 1 },
];

export default function TriggerWaterfallViz() {
  return (
    <SceneShell
      eyebrow="계약 안의 분기"
      title="일정 조건을 넘으면 돈이 가는 곳이 바뀔 수 있습니다"
      description="3절의 70·20·10 사례(가정)에 분기를 얹었습니다. 세 칸의 크기는 같아 금액을 뜻하지 않고, 위에서 아래로 지급 순서입니다. 조건의 값은 정해 두지 않았습니다."
      ariaLabel="조건을 넘기 전과 넘은 뒤의 현금 지급 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={6} y={58} width={72} height={44} rx={8} fill="#64748b" fillOpacity={0.1} stroke={TEXT} strokeWidth={1} />
          <text x={42} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>모인 돈</text>
          <ArrowPath points={[[78, 80], [103, 80]]} color={MUTED} />
          <rect x={104} y={58} width={84} height={44} rx={8} fill="#64748b" fillOpacity={0.1} stroke={TEXT} strokeWidth={1} />
          <text x={146} y={77} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>수금 비용·이자</text>
          <text x={146} y={92} textAnchor="middle" fontSize={11} fill={TEXT}>처리</text>
          <text x={146} y={44} textAnchor="middle" fontSize={11} fontWeight={700} fill={active === 1 ? RED : TEXT}>{active === 1 ? "일정 조건 넘음" : "일정 조건 전"}</text>
          {[2, 1, 0].map((i) => {
            const y = SLOT_Y[i];
            const after = AFTER[i];
            const stopped = active === 1 && i === 2;
            const midY = y + SLOT_H / 2;
            const color = active === 1 ? after.color : ACCENT;
            return (
              <g key={y}>
                {stopped ? (
                  <>
                    <polyline points={`188,80 212,80 212,${midY} 224,${midY}`} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3 3" />
                    <line x1={224} x2={224} y1={midY - 7} y2={midY + 7} stroke={color} strokeWidth={1.25} />
                  </>
                ) : (
                  <ArrowPath points={[[188, 80], [212, 80], [212, midY], [SLOT_X - 1, midY]]} color={color} dashed={active === 1 && after.dashed} width={active === 1 ? after.width : 1} />
                )}
                <rect x={SLOT_X} y={y} width={SLOT_W} height={SLOT_H} rx={8} fill="#64748b" fillOpacity={0.1} stroke={color} strokeWidth={1} strokeDasharray={active === 1 && after.dashed ? "3 3" : undefined} />
                <text x={SLOT_X + SLOT_W / 2} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>{NAMES[i]}</text>
                <text x={SLOT_X + SLOT_W / 2} y={y + 30} textAnchor="middle" fontSize={11} fontWeight={active === 1 ? 700 : 400} fill={active === 1 && !after.dashed ? ACCENT : active === 1 && i === 2 ? RED : TEXT}>{active === 1 ? after.status : "계약대로 지급"}</text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
