import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 스미스의 f와 브라운의 위치 자리에 민아의 ‘이 시계가 가고 있다’와 우연한 4시가 놓인다.
 * 네 칸의 배치는 고정하고 안의 글자만 바꾼다. 두 전제는 위의 두 화살표에 붙는다.
 */
const SLOTS = {
  smith: { evidence: ["존스의 포드에 대한", "강한 증거"], false: ["f: 존스가 포드를", "가졌다"], claim: ["h: 존스가 포드를 가졌거나", "브라운이 바르셀로나에 있다"], luck: ["브라운이 우연히", "바르셀로나에 있다"] },
  mina: { evidence: ["눈앞의 시곗바늘", "평소 좋은 근거"], false: ["이 시계가", "가고 있다"], claim: ["지금 4시다"], luck: ["실제 시각이", "우연히 4시"] },
  slot: { evidence: ["좋은 근거"], false: ["거짓인", "중간 믿음"], claim: ["참이 된 결론"], luck: ["믿는 사람이", "몰랐던 우연"] },
} as const;

const SCENES = [
  { label: "스미스의 네 칸", summary: "f는 거짓, h는 참", slots: SLOTS.smith, premises: false, note: "강한 증거에서 f로, f에서 h로 갑니다. f는 거짓이지만 브라운의 위치가 h를 참으로 만듭니다." },
  { label: "민아의 네 칸", summary: "같은 자리에 시계 사례", slots: SLOTS.mina, premises: false, note: "“이 시계가 가고 있다”는 거짓 믿음이 f 자리에, 실제 시각이 우연히 4시였다는 사실이 브라운 자리에 놓입니다." },
  { label: "자리만 남기기", summary: "구조가 같음", slots: SLOTS.slot, premises: false, note: "글자를 지우면 두 사례의 모양이 같습니다. 근거가 거짓인 믿음을 거쳐 결론에 닿고, 그 결론을 참으로 만든 것은 다른 길에서 옵니다. 첫 번째 사례(동전 열 개)도 같은 구조입니다." },
  { label: "두 전제의 자리", summary: "위 화살표 둘에 하나씩", slots: SLOTS.slot, premises: true, note: "거짓인 명제도 정당하게 믿을 수 있어야 첫 화살표가 섭니다. 정당하게 믿는 명제에서 연역하면 결론도 정당화된다고 해야 둘째 화살표가 섭니다." },
] as const;

const W = 340;
const H = 268;
const LEFT = 4;
const COL = 156;
const RIGHT = 180;
const BOX = 50;
const ROW1 = 6;
const ROW2 = 88;
const ROW3 = 206;
const BELIEF = "#2563eb";
const TRUTH = "#d97706";
const PREMISE = "#dc2626";

function Box({ x, y, w, h, color, lines }: { x: number; y: number; w: number; h: number; color: string; lines: readonly string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + 5 + (index - (lines.length - 1) / 2) * 18} textAnchor="middle" fontSize={15} fontWeight={600} fill={color}>{line}</text>
      ))}
    </g>
  );
}

function Down({ x, y1, y2, color }: { x: number; y1: number; y2: number; color: string }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y1} y2={y2 - 5} stroke={color} strokeWidth={1.25} />
      <path d={`M${x} ${y2} l-4 -6 h8 z`} fill={color} />
    </g>
  );
}

export default function SlotSwapViz() {
  return (
    <SceneShell
      eyebrow="같은 자리, 다른 사례"
      title="민아의 시계를 게티어의 네 칸에 옮겨 넣습니다"
      description="왼쪽 줄은 믿음이 지나간 길, 오른쪽 줄은 결론을 참으로 만든 길입니다. 칸의 배치는 고정하고 글자만 바꿉니다."
      ariaLabel="게티어의 두 번째 사례와 민아의 멈춘 시계를 같은 네 칸 구조로 옮기는 과정"
      scenes={SCENES}
      render={(active) => {
        const { slots, premises } = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={LEFT} y={ROW1} w={COL} h={BOX} color={BELIEF} lines={slots.evidence} />
            <Down x={LEFT + COL / 2} y1={ROW1 + BOX} y2={ROW2} color={premises ? PREMISE : BELIEF} />
            <Box x={LEFT} y={ROW2} w={COL} h={BOX} color={BELIEF} lines={slots.false} />
            <Down x={LEFT + COL / 2} y1={ROW2 + BOX} y2={ROW3} color={premises ? PREMISE : BELIEF} />
            <Box x={RIGHT} y={ROW2} w={COL} h={BOX} color={TRUTH} lines={slots.luck} />
            <Down x={RIGHT + COL / 2} y1={ROW2 + BOX} y2={ROW3} color={TRUTH} />
            <Box x={LEFT} y={ROW3} w={RIGHT + COL - LEFT} h={BOX + 6} color="#64748b" lines={slots.claim} />
            {premises && (
              <g>
                <text x={LEFT + COL / 2 + 8} y={ROW1 + BOX + 21} fontSize={15} fontWeight={700} fill={PREMISE}>전제 1: 거짓도 정당</text>
                <text x={LEFT + COL / 2 + 8} y={ROW2 + BOX + 34} fontSize={15} fontWeight={700} fill={PREMISE}>전제 2:</text>
                <text x={LEFT + COL / 2 + 8} y={ROW2 + BOX + 51} fontSize={15} fontWeight={700} fill={PREMISE}>연역이 전달</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
