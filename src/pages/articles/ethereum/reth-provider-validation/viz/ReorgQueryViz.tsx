import SceneShell from "./SceneShell";

/**
 * 본문 대응: #experiment 03 · Reorg — H1000을 비정본으로 만들고 number query와 hash query를 분리한다.
 * #baseline: number selector는 먼저 canonical hash로 해석한 뒤 같은 hash query와 비교한다.
 * 새 정본 블록 이름 H1000′은 설명용 가정.
 */
const SCENES = [
  {
    label: "Reorg 전",
    summary: "number 1,000 = H1000",
    note: "정본 사슬의 1,000번 블록이 H1000입니다. 이때는 번호로 묻든 hash로 묻든 같은 블록을 가리킵니다.",
  },
  {
    label: "Reorg 뒤",
    summary: "H1000 → 비정본",
    note: "Reorg는 정본 사슬의 끝이 다른 갈래로 바뀌는 일입니다. 999 위의 다른 블록(H1000′, 가정)이 정본이 되고 H1000은 비정본 갈래에 남습니다.",
  },
  {
    label: "Number query",
    summary: "1,000 → H1000′ → 비교",
    note: "번호 1,000은 먼저 지금의 canonical hash, 즉 H1000′로 해석합니다. 그 결과를 같은 H1000′ hash query의 결과와 대조해 같은지 봅니다.",
  },
  {
    label: "Hash query H1000",
    summary: "따로 정한 계약",
    note: "H1000을 hash로 직접 묻는 조회는 number query와 분리해 기록합니다. 값을 줄지 오류를 낼지는 지원 범위와 오류 계약에 따르며, 이 글은 그 결과를 정하지 않습니다.",
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#b45309";
const MUTED = "#94a3b8";
const TEXT = "#64748b";
const INK = "#0f172a";

function Block({ x, y, label, tone, dashed = false }: { x: number; y: number; label: string; tone: "plain" | "canon" | "off"; dashed?: boolean }) {
  const stroke = tone === "canon" ? BLUE : tone === "off" ? AMBER : MUTED;
  const fill = tone === "canon" ? "#dbeafe" : "#ffffff";
  return (
    <g>
      <rect x={x} y={y} width={58} height={26} rx={4} fill={fill} stroke={stroke} strokeWidth={tone === "plain" ? 1 : 1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + 29} y={y + 17} textAnchor="middle" fontSize={11.5} fontWeight={tone === "plain" ? 400 : 700} fill={tone === "canon" ? BLUE : tone === "off" ? AMBER : TEXT}>{label}</text>
    </g>
  );
}

export default function ReorgQueryViz() {
  return (
    <SceneShell
      eyebrow="03 · Reorg"
      title="Reorg 뒤 번호와 hash는 다른 블록을 가리킬 수 있습니다"
      description="파란 칸은 지금의 정본 사슬, 주황 점선 칸은 reorg로 비정본이 된 블록입니다. 오른쪽 꼬리표는 각 조회가 어느 블록을 가리키는지 보여 줍니다."
      note="H1000′은 새 정본 블록을 부르려고 붙인 이름입니다(가정). Hash query H1000의 결과는 그리지 않았습니다."
      ariaLabel="reorg 뒤 number 1,000 조회는 새 canonical hash로 해석되고, hash H1000 조회는 별도 계약으로 분리되는 과정"
      scenes={SCENES}
      render={(active) => {
        const after = active >= 1;
        const numberFrom = after ? 109 : 43;
        const numberTop = after ? 98 : 8;
        const hashTop = after ? 32 : 46;
        return (
          <svg viewBox="0 0 360 140" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Block x={6} y={63} label="998" tone="canon" />
            <line x1={64} x2={82} y1={76} y2={76} stroke={BLUE} strokeWidth={1} />
            <Block x={82} y={63} label="999" tone="canon" />
            <path d="M 140 76 L 158 43" fill="none" stroke={after ? AMBER : BLUE} strokeWidth={1} strokeDasharray={after ? "3 3" : undefined} />
            <Block x={158} y={30} label="H1000" tone={after ? "off" : "canon"} dashed={after} />
            {after && (
              <g>
                <path d="M 140 76 L 158 109" fill="none" stroke={BLUE} strokeWidth={1} />
                <Block x={158} y={96} label="H1000′" tone="canon" />
              </g>
            )}
            {active === 0 && <text x={187} y={122} textAnchor="middle" fontSize={10.5} fill={TEXT}>(아직 다른 갈래 없음)</text>}
            {/* number 1,000 꼬리표: 정본 1,000번 블록을 가리킵니다 */}
            <g opacity={active === 3 ? 0.35 : 1}>
              <line x1={216} x2={252} y1={numberFrom} y2={numberTop + 11} stroke={BLUE} strokeWidth={1} />
              <rect x={252} y={numberTop} width={102} height={22} rx={4} fill="#ffffff" stroke={BLUE} strokeWidth={active === 2 ? 1.25 : 1} />
              <text x={303} y={numberTop + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>number 1,000</text>
            </g>
            {/* hash H1000 꼬리표: reorg 뒤에는 결과를 정하지 않은 계약으로 표시 */}
            <g opacity={active === 2 ? 0.35 : 1}>
              <line x1={216} x2={252} y1={43} y2={hashTop + 11} stroke={after ? AMBER : INK} strokeWidth={1} />
              <rect x={252} y={hashTop} width={102} height={22} rx={4} fill="#ffffff" stroke={after ? AMBER : INK} strokeWidth={active === 3 ? 1.25 : 1} />
              <text x={303} y={hashTop + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={after ? AMBER : INK}>{after ? "hash H1000 → ?" : "hash H1000"}</text>
            </g>
            {active === 2 && (
              <text x={303} y={134} textAnchor="middle" fontSize={10.5} fill={BLUE}>= hash H1000′ 결과와 대조</text>
            )}
          </svg>
        );
      }}
    />
  );
}
