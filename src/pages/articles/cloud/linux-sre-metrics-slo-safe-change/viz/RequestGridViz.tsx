import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 초당 1,000 요청, 서버 100대 중 1대 장애(요청의 1%, 그중 절반 실패).
 * 장애 노드 10건 중 5건 실패 + 나머지 990건 × 평소 오류 1%(가정) = 9.9건 → 약 15건 = 1.5%.
 * 허용은 0.1% = 1건, 15 ÷ 1 = 소진율 15. 칸 하나가 요청 1건이다.
 */
const COLS = 40;
const ROWS = 25;
const PITCH = 9;
const CELL = 8;
const CELLS = COLS * ROWS;
const NODE_CELLS = 10;
const NODE_FAILS = 5;
const BASELINE = new Set(Array.from({ length: 10 }, (_, i) => NODE_CELLS + ((i * 97 + 53) % 990)));

const SCENES = [
  { label: "1초에 1,000건", summary: "장애 노드로 10건", note: "칸 하나가 요청 1건입니다. 100대 중 1대라 요청의 1%, 곧 맨 위 파란 10칸이 그 노드로 갑니다." },
  { label: "장애 노드에서 실패", summary: "10건 중 5건 = 0.5%", note: "그 요청이 절반쯤 실패하면 빨간 5칸입니다. 전체 1,000건으로 보면 0.5%뿐입니다." },
  { label: "평소 오류까지 합치면", summary: "약 15건 = 1.5%", note: "나머지 990건에 평소 오류율 1%(가정)가 깔려 있어 9.9건, 약 10칸이 더 있습니다. 합치면 약 15칸, 전체 성공률 98.5%입니다." },
  { label: "허용치와 비교", summary: "15 ÷ 1 → 소진율 15", note: "허용 오류율 0.1%는 1,000건에 1건입니다. 지금 오류율이 허용치의 몇 배인지가 소진율이고, 여기서는 15배입니다." },
] as const;

export default function RequestGridViz() {
  return (
    <SceneShell
      eyebrow="1초 동안의 요청"
      title="한 노드의 장애와 평소 오류를 더해야 오류율 1.5%가 나옵니다"
      description="(가정) 서버 100대, 초당 1,000 요청. 파랑은 장애 노드로 간 요청, 빨강은 거기서 실패한 요청, 주황은 다른 노드의 평소 오류입니다."
      note="실패 칸의 자리는 가정이고 개수만 뜻이 있습니다. 평소 오류율 1%는 설명을 위해 높게 잡은 값입니다."
      ariaLabel="1,000개 요청 칸에서 장애 노드의 실패와 평소 오류를 세어 오류율을 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 258" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {Array.from({ length: CELLS }, (_, i) => {
            const nodeCell = i < NODE_CELLS;
            const fail = nodeCell && i < NODE_FAILS && active >= 1;
            const base = BASELINE.has(i) && active >= 2;
            const fill = fail ? "#dc2626" : nodeCell ? "#2563eb" : base ? "#d97706" : "#94a3b8";
            return <rect key={i} x={(i % COLS) * PITCH} y={Math.floor(i / COLS) * PITCH} width={CELL} height={CELL} rx={1} fill={fill} opacity={fail || nodeCell || base ? 1 : 0.35} />;
          })}
          {active === 3 && (
            <g>
              <text x={0} y={ROWS * PITCH + 14} fontSize={11} fontWeight={700} fill="#15803d">허용 1건</text>
              <rect x={62} y={ROWS * PITCH + 6} width={CELL} height={CELL} rx={1} fill="#15803d" />
              <text x={0} y={ROWS * PITCH + 32} fontSize={11} fontWeight={700} fill="#dc2626">실제 약 15건</text>
              {Array.from({ length: 15 }, (_, i) => (
                <rect key={i} x={84 + i * PITCH} y={ROWS * PITCH + 24} width={CELL} height={CELL} rx={1} fill={i < NODE_FAILS ? "#dc2626" : "#d97706"} />
              ))}
            </g>
          )}
        </svg>
      )}
    />
  );
}
