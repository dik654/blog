import Arrow from "./Arrow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 셋째 문단 — 열일곱 번째 논의를 우인론 한 모형으로만 읽으면 안 됩니다.
 * Stanford 철학백과 알가잘리 항목(§7, 2026-10-09 확인) 정리: 직접 창조와 2차 원인의 길을 모두 열어 두고
 * 적어도 두 가지 일관된 응답을 내놓습니다. 거부한 것은 연결이 자기 안에서 필연적이라는 주장입니다.
 */
const SCENES = [
  { label: "한 모형으로 읽으면", summary: "이렇게만 읽으면 부족합니다", note: "열일곱 번째 논의를 신이 결과를 직접 창조한다는 우인론 한 모형으로만 읽은 경우입니다." },
  { label: "두 길을 열어 둠", summary: "적어도 두 가지 일관된 응답", note: "2차 원인은 신이 만든 자연 사물을 거쳐 결과가 나오는 길입니다. 7절의 두 모형은 바깥의 두 진영이 아니라 그의 안에서도 함께 검토된 선택지입니다." },
  { label: "끝까지 거부한 것", summary: "자기 안에서 필연적인 연결", note: "닫힌 것은 세 번째 줄입니다. 그가 끝까지 거부한 것은 그 연결이 자기 안에서 필연적이라는 주장입니다." },
] as const;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";

const LANES = { direct: 34, secondary: 110, rejected: 186 } as const;
const H = 36;

function Box({ x, y, w, label, color = LINE, bold = false }: { x: number; y: number; w: number; label: string; color?: string; bold?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - H / 2} width={w} height={H} rx={8} fill="none" stroke={color} strokeWidth={bold ? 1.25 : 1} />
      <text x={x + w / 2} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={bold ? 700 : 500} fill="currentColor">{label}</text>
    </g>
  );
}

export default function GhazaliRoutesViz() {
  return (
    <SceneShell
      eyebrow="열일곱 번째 논의를 읽는 법"
      title="열어 둔 두 길과 닫아 둔 한 길"
      description="Stanford 철학백과 알가잘리 항목(§7, 2026-10-09 확인)의 정리를 줄로 나눠 그렸습니다."
      ariaLabel="알가잘리가 열어 둔 직접 창조와 2차 원인의 길, 거부한 필연적 연결"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <g>
            <text x={12} y={LANES.direct - 24} fontSize={11} fontWeight={600} fill={MUTED}>직접 창조의 길</text>
            <Box x={12} y={LANES.direct} w={52} label="신" color={ACCENT} bold />
            <Arrow x1={64} y1={LANES.direct} x2={278} y2={LANES.direct} color={ACCENT} />
            <Box x={278} y={LANES.direct} w={70} label="결과" />
          </g>
          <g opacity={active === 0 ? 0.15 : 1}>
            <text x={12} y={LANES.secondary - 24} fontSize={11} fontWeight={600} fill={MUTED}>2차 원인의 길</text>
            <Box x={12} y={LANES.secondary} w={52} label="신" color={ACCENT} bold />
            <Arrow x1={64} y1={LANES.secondary} x2={132} y2={LANES.secondary} color={ACCENT} />
            <Box x={132} y={LANES.secondary} w={84} label="자연 사물" />
            <Arrow x1={216} y1={LANES.secondary} x2={278} y2={LANES.secondary} color={ACCENT} />
            <Box x={278} y={LANES.secondary} w={70} label="결과" />
          </g>
          <g opacity={active === 2 ? 1 : 0.15}>
            <text x={12} y={LANES.rejected - 24} fontSize={11} fontWeight={600} fill={RED}>거부: 자기 안에서 필연적인 연결</text>
            <Box x={132} y={LANES.rejected} w={84} label="자연 사물" color={RED} />
            <line x1={216} x2={278} y1={LANES.rejected} y2={LANES.rejected} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
            <path d="M240 179L254 193M254 179L240 193" fill="none" stroke={RED} strokeWidth={1.25} />
            <Box x={278} y={LANES.rejected} w={70} label="결과" color={RED} />
          </g>
        </svg>
      )}
    />
  );
}
