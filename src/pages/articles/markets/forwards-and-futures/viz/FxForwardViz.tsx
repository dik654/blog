import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 달러당 1000원, 원화 연 4%, 달러 연 2%.
 * 1000 × 1.04 = 1040원, 1달러 × 1.02 = 1.02달러, 1040 ÷ 1.02 ≈ 1019.61원.
 */
const SCENES = [
  { label: "같은 출발", summary: "1000원 = 1달러", note: "외환 선도는 나중에 달러를 얼마에 바꿀지 오늘 정하는 약속입니다. 같은 돈을 원화로 둘 수도, 달러로 바꿔 둘 수도 있으니 두 갈래를 나란히 놓습니다." },
  { label: "원화로 1년", summary: "1000 × 1.04 = 1040원", note: "원화에 연 4%가 붙어 1년 뒤 1040원입니다." },
  { label: "달러로 1년", summary: "1 × 1.02 = 1.02달러", note: "달러에 연 2%가 붙어 1년 뒤 1.02달러입니다. 두 결과는 통화가 달라 아직 바로 비교할 수 없습니다." },
  { label: "비용이 맞는 가격", summary: "1040 ÷ 1.02 ≈ 1019.61원", note: "1.02달러를 1040원으로 바꾸는 가격이 달러당 약 1019.61원입니다. 자유로운 차입·예치와 거래비용 없음을 가정한 단순 가격이며 실제 환율 예측값이 아닙니다." },
] as const;

const GRAY = "#64748b";
const BLUE = "#2563eb";
const GREEN = "#16a34a";

function Node({ x, y, w, h, color, on, lines }: { x: number; y: number; w: number; h: number; color: string; on: boolean; lines: readonly string[] }) {
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + 5 + (index - (lines.length - 1) / 2) * 16} textAnchor="middle" fontSize={13} fontWeight={index === 0 ? 700 : 400} fill={color}>{line}</text>
      ))}
    </g>
  );
}

export default function FxForwardViz() {
  return (
    <SceneShell
      eyebrow="외환 선도"
      title="원화로 둔 1년과 달러로 둔 1년을 맞추는 가격을 찾습니다"
      description="달러당 1000원, 원화 연 4%, 달러 연 2%는 글의 가정입니다."
      ariaLabel="원화와 달러 두 경로의 1년 뒤 금액과 이를 맞추는 선도 가격"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={48} y={14} textAnchor="middle" fontSize={11} fill={GRAY}>오늘</text>
          <text x={302} y={14} textAnchor="middle" fontSize={11} fill={GRAY}>1년 뒤</text>

          <g opacity={active >= 1 ? 1 : 0.35}>
            <line x1={92} y1={72} x2={250} y2={44} stroke={BLUE} strokeWidth={1} />
            <text x={170} y={46} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>원화 연 4%</text>
          </g>
          <g opacity={active >= 2 ? 1 : 0.35}>
            <line x1={92} y1={92} x2={250} y2={120} stroke={GREEN} strokeWidth={1} />
            <text x={170} y={124} textAnchor="middle" fontSize={12} fontWeight={700} fill={GREEN}>달러 연 2%</text>
          </g>

          <Node x={4} y={58} w={88} h={48} color={GRAY} on lines={["1000원", "= 1달러"]} />
          <Node x={250} y={26} w={104} h={36} color={BLUE} on={active >= 1} lines={[active >= 1 ? "1040원" : "?원"]} />
          <Node x={250} y={102} w={104} h={36} color={GREEN} on={active >= 2} lines={[active >= 2 ? "1.02달러" : "?달러"]} />
          {active === 3 && <text x={302} y={87} textAnchor="middle" fontSize={15} fontWeight={700} fill={GRAY}>=</text>}

          <Node x={4} y={152} w={350} h={36} color={BLUE} on={active === 3} lines={[active === 3 ? "1.02달러 × 약 1019.61원 ≈ 1040원" : "달러당 가격은 아직 없습니다"]} />
        </svg>
      )}
    />
  );
}
