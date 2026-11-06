import Arrow from "./Arrow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 자연 인과 모형과 우인론적 모형이 인과의 힘을 어디에 두는지.
 * 두 모형 모두 젖은 솜이 왜 안 타는지 조건을 조사할 수 있지만 형이상학이 다릅니다.
 */
const SCENES = [
  { label: "자연 인과 모형", summary: "만들어진 사물에도 실제 인과 능력", note: "가까운 원인은 결과를 바로 일으키는 원인, 궁극 원인은 그 질서 전체가 기대는 원인입니다. 이 모형에서 신은 궁극 원인이 될 수 있습니다." },
  { label: "우인론적 모형", summary: "신이 접촉과 함께 연소를 창조", note: "우인론은 사물의 접촉을 계기로 삼아 신이 결과를 만든다고 보는 설명입니다. 불과 솜의 접촉은 연소를 스스로 필연적으로 만들지 않습니다." },
  { label: "젖은 솜 앞에서", summary: "조사는 같이, 형이상학은 따로", note: "두 모형 모두 젖은 솜이 왜 안 타는지 조건을 조사할 수 있습니다. 다른 것은 자연의 힘과 기적 가능성을 설명하는 형이상학입니다." },
] as const;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";

function Box({ x, y, w, h, lines, color = LINE, bold = false, dashed = false }: { x: number; y: number; w: number; h: number; lines: readonly string[]; color?: string; bold?: boolean; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={bold ? 1.25 : 1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, l) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + 4 + (l - (lines.length - 1) / 2) * 16} textAnchor="middle" fontSize={12} fontWeight={bold ? 700 : 500} fill="currentColor">{line}</text>
      ))}
    </g>
  );
}

export default function TwoModelsViz() {
  return (
    <SceneShell
      eyebrow="인과의 힘을 두는 자리"
      title="같은 연소를 두고 화살표를 다른 곳에 긋습니다"
      description="첫 두 장면에서 실선 화살표는 그 모형에서 결과를 일으키는 쪽입니다."
      ariaLabel="자연 인과 모형과 우인론적 모형의 화살표 비교, 젖은 솜 조건 조사"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <>
              <Box x={120} y={4} w={120} h={34} lines={["신"]} dashed />
              <Arrow x1={180} y1={38} x2={180} y2={72} color={MUTED} dashed />
              <text x={190} y={60} fontSize={11} fill={MUTED}>궁극 원인이 될 수 있음</text>
              <rect x={4} y={72} width={352} height={150} rx={10} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="4 3" />
              <text x={14} y={90} fontSize={11} fill={MUTED}>이 질서와 존재</text>
              <Box x={14} y={98} w={124} h={32} lines={["불의 열"]} />
              <Box x={14} y={138} w={124} h={32} lines={["솜의 가연성"]} />
              <Box x={14} y={178} w={124} h={32} lines={["적절한 산소 조건"]} />
              <Box x={258} y={136} w={86} h={36} lines={["연소"]} color={ACCENT} bold />
              <Arrow x1={138} y1={114} x2={258} y2={146} color={ACCENT} />
              <Arrow x1={138} y1={154} x2={258} y2={154} color={ACCENT} />
              <Arrow x1={138} y1={194} x2={258} y2={162} color={MUTED} dashed />
              <text x={206} y={200} textAnchor="middle" fontSize={11} fill={MUTED}>이 조건에서</text>
              <text x={186} y={149} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>가까운 원인</text>
            </>
          )}
          {active === 1 && (
            <>
              <Box x={120} y={4} w={120} h={34} lines={["신"]} color={ACCENT} bold />
              <Box x={14} y={136} w={124} h={36} lines={["불과 솜의 접촉"]} />
              <Box x={258} y={136} w={86} h={36} lines={["연소"]} color={ACCENT} bold />
              <Arrow x1={210} y1={38} x2={290} y2={136} color={ACCENT} />
              <text x={268} y={76} fontSize={11} fontWeight={700} fill={ACCENT}>접촉과 함께</text>
              <text x={268} y={92} fontSize={11} fontWeight={700} fill={ACCENT}>창조</text>
              <line x1={138} x2={258} y1={154} y2={154} stroke={LINE} strokeWidth={1} strokeDasharray="4 3" />
              <path d="M191 147L205 161M205 147L191 161" fill="none" stroke={RED} strokeWidth={1.25} />
              <text x={198} y={186} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>스스로 필연적으로</text>
              <text x={198} y={202} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>만들지 않음</text>
            </>
          )}
          {active === 2 && (
            <>
              <Box x={14} y={10} w={156} h={46} lines={["자연 인과 모형", "조건 조사 가능"]} />
              <Box x={190} y={10} w={156} h={46} lines={["우인론적 모형", "조건 조사 가능"]} />
              <line x1={92} y1={56} x2={140} y2={96} stroke={LINE} strokeWidth={1} />
              <line x1={268} y1={56} x2={220} y2={96} stroke={LINE} strokeWidth={1} />
              <Box x={80} y={96} w={200} h={38} lines={["젖은 솜은 왜 안 타는가"]} color={ACCENT} bold />
              <rect x={14} y={160} width={332} height={56} rx={8} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={180} y={183} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>다른 것</text>
              <text x={180} y={203} textAnchor="middle" fontSize={12} fill="currentColor">자연의 힘과 기적 가능성을 설명하는 형이상학</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
