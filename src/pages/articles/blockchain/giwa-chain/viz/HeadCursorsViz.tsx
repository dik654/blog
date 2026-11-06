import SceneShell from "./SceneShell";

/**
 * 본문 대응: #head-policy — unsafe 120·safe 118·finalized 115는 한 chain 위의 세 커서다.
 * T는 block 120에 있다. safe가 120 이상이 되고 ancestry가 일치해야 T를 safe라고 부른다.
 * finalized가 120까지 오는 장면은 “L1 origin까지 finalized된 L2 head”라는 정의를 예제에 적용한 것이다.
 */
const W = 340;
const H = 146;
const HEIGHTS = [115, 116, 117, 118, 119, 120] as const;
const X0 = 14;
const BOX = 44;
const GAP = 8;
const xOf = (height: number) => X0 + (height - 115) * (BOX + GAP);
const midOf = (height: number) => xOf(height) + BOX / 2;
const CHAIN_Y = 56;
const INK = "#475569";
const MUTED = "#94a3b8";

const SCENES = [
  { label: "세 커서의 시작 위치", summary: "115 ⪯ 118 ⪯ 120", finalized: 115, safe: 118, bracket: false, note: "Unsafe는 sequencer의 최신 head, safe는 L1 batch에서 재구성된 head, finalized는 L1 origin까지 finalized된 head입니다. ⪯는 왼쪽이 조상이라는 표시로, 세 이름은 점수가 아닙니다." },
  { label: "높이 차이를 시간으로 읽지 않습니다", summary: "차이 5 ≠ 5초", finalized: 115, safe: 118, bracket: true, note: "높이 차이 5가 5초를 뜻하지는 않습니다. Finalized 115가 거래 T까지 확정했다는 뜻도 아니고, T가 든 120은 아직 safe도 아닙니다." },
  { label: "T가 safe에 닿습니다", summary: "safe 120 · ancestry 일치", finalized: 115, safe: 120, bracket: false, note: "block 120이 canonical L1 batch에서 재구성되어 safe head가 120 이상이 되고 ancestry가 일치할 때 비로소 T를 safe라고 부를 수 있습니다." },
  { label: "L1 origin의 finality까지", summary: "finalized 120", finalized: 120, safe: 120, bracket: false, note: "그 L1 origin이 finalized되면 finalized head도 T의 block까지 옵니다. 이 표시가 withdrawal 절차 종료나 앱 수준 finality까지 자동 보장하지는 않습니다." },
] as const;

function Cursor({ height, name, color, row }: { height: number; name: string; color: string; row: number }) {
  const x = midOf(height);
  const y = row === 0 ? CHAIN_Y - 8 : CHAIN_Y + BOX - 8;
  const anchor = height >= 119 ? "end" : "start";
  const labelX = height >= 119 ? x + 20 : x - 20;
  return (
    <g>
      {row === 0 ? (
        <>
          <line x1={x} x2={x} y1={y - 14} y2={y + 6} stroke={color} strokeWidth={1.25} />
          <text x={labelX} y={y - 20} textAnchor={anchor} fontSize={12} fontWeight={700} fill={color}>{name}</text>
        </>
      ) : (
        <>
          <line x1={x} x2={x} y1={y + 2} y2={y + 22} stroke={color} strokeWidth={1.25} />
          <text x={labelX} y={y + 36} textAnchor={anchor} fontSize={12} fontWeight={700} fill={color}>{name}</text>
        </>
      )}
    </g>
  );
}

export default function HeadCursorsViz() {
  return (
    <SceneShell
      eyebrow="block 115~120"
      title="unsafe·safe·finalized는 한 줄 위의 세 커서입니다"
      description="칸 하나가 L2 block이고 왼쪽이 조상입니다. 높이는 예제이며 실제 판단은 hash와 L1 origin으로 합니다. T의 block까지만 다루어 unsafe는 120에 고정했습니다."
      ariaLabel="L2 block 115부터 120 위의 unsafe, safe, finalized 커서와 거래 T의 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {HEIGHTS.map((height, index) => (
              <g key={height}>
                {index > 0 && <line x1={xOf(height) - GAP} x2={xOf(height)} y1={CHAIN_Y + 16} y2={CHAIN_Y + 16} stroke={MUTED} strokeWidth={1} />}
                <rect x={xOf(height)} y={CHAIN_Y} width={BOX} height={32} rx={4} fill={height <= scene.finalized ? "#16a34a" : height <= scene.safe ? "#2563eb" : "none"} fillOpacity={0.14} stroke={MUTED} strokeWidth={1} />
                <text x={midOf(height)} y={CHAIN_Y + 21} textAnchor="middle" fontSize={12} fill={INK}>{height}</text>
              </g>
            ))}
            <text x={midOf(120)} y={CHAIN_Y + 48} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">거래 T</text>
            <Cursor height={scene.finalized} name="finalized" color="#16a34a" row={0} />
            {scene.safe !== scene.finalized && <Cursor height={scene.safe} name="safe" color="#2563eb" row={0} />}
            {scene.safe === scene.finalized && <text x={midOf(scene.safe) + 20} y={CHAIN_Y - 42} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">safe ·</text>}
            <line x1={midOf(120) - 6} x2={midOf(120) - 6} y1={CHAIN_Y + 54} y2={CHAIN_Y + 72} stroke="#64748b" strokeWidth={1.25} />
            <text x={midOf(120) + 20} y={CHAIN_Y + 84} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">unsafe</text>
            {scene.bracket && (
              <>
                <path d={`M${midOf(115)} ${CHAIN_Y + 56} V${CHAIN_Y + 62} H${midOf(120) - 6}`} fill="none" stroke="#dc2626" strokeWidth={1} />
                <text x={midOf(115)} y={CHAIN_Y + 78} fontSize={12} fontWeight={700} fill="#dc2626">차이 5 ≠ 5초</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
