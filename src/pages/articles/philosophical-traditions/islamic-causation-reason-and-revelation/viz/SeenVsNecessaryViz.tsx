import Arrow from "./Arrow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 직접 본 것은 두 사건의 결합이고, 그 결합의 필연은 관찰로 보지 못했다는 알가잘리의 주장.
 * 평소의 질서로 예측이 가능하다고 보면서 신에게 다른 결과를 만들 능력이 없다고 제한하지 않습니다.
 * 10번과 11번째는 1·3절의 사례입니다.
 */
const TOP_Y = 44;
const BOTTOM_Y = 112;
const COLS = Array.from({ length: 10 }, (_, i) => 72 + i * 19);
const NEXT_X = 296;
const OTHER_X = 340;

const SCENES = [
  { label: "본 것", summary: "두 사건이 함께 일어남", note: "위 점은 불과 솜의 접촉, 아래 점은 연소입니다. 눈으로 확인한 것은 둘이 짝을 이루어 일어났다는 사실입니다. 알가잘리는 이것을 부정하지 않습니다." },
  { label: "못 본 것", summary: "반드시 그렇다는 연결", note: "점선이 비어 있는 자리입니다. 그 결합이 불 자체의 본성 때문에 반드시 일어난다는 필연은 관찰로 보지 못했다는 것이 그의 주장입니다." },
  { label: "두 가지를 함께", summary: "평소의 규칙 + 열린 가능성", note: "신이 평소의 질서를 유지하므로 다음도 예측할 수 있고, 그러면서 신에게 다른 결과를 만들 능력이 없다고 제한하지도 않습니다. 일상의 규칙성과 기적의 가능성을 한 설명 안에 두려는 시도입니다." },
] as const;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";

export default function SeenVsNecessaryViz() {
  return (
    <SceneShell
      eyebrow="알가잘리의 구분"
      title="짝지어 일어난 것은 보았지만 반드시 그렇다는 연결은 보지 못했습니다"
      description="세로 한 칸이 관찰 한 번입니다. 10번과 11번째는 앞 절의 불과 솜 사례입니다."
      ariaLabel="접촉과 연소의 짝 10번, 비어 있는 필연의 연결, 11번째의 평소 경로와 열려 있는 다른 결과"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={8} y={TOP_Y - 3} fontSize={11} fontWeight={600} fill="currentColor">불·솜</text>
          <text x={8} y={TOP_Y + 11} fontSize={11} fontWeight={600} fill="currentColor">접촉</text>
          <text x={8} y={BOTTOM_Y + 4} fontSize={11} fontWeight={600} fill="currentColor">연소</text>
          <text x={COLS[0]} y={20} textAnchor="middle" fontSize={10} fill={MUTED}>1</text>
          <text x={COLS[9]} y={20} textAnchor="middle" fontSize={10} fill={MUTED}>10</text>
          {COLS.map((x) => (
            <g key={x}>
              <line x1={x} x2={x} y1={TOP_Y + 6} y2={BOTTOM_Y - 6} stroke={RED} strokeWidth={1} strokeDasharray="3 3" opacity={active === 1 ? 0.9 : 0} />
              <circle cx={x} cy={TOP_Y} r={4.5} fill={LINE} />
              <circle cx={x} cy={BOTTOM_Y} r={4.5} fill={ACCENT} />
            </g>
          ))}
          <g opacity={active === 1 ? 1 : 0}>
            <text x={(COLS[0] + COLS[9]) / 2} y={146} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>점선 연결은 관찰에 없음</text>
          </g>
          <g opacity={active === 2 ? 1 : 0}>
            <text x={NEXT_X} y={20} textAnchor="middle" fontSize={10} fill={MUTED}>11번째</text>
            <circle cx={NEXT_X} cy={TOP_Y} r={4.5} fill={LINE} />
            <Arrow x1={NEXT_X} y1={TOP_Y + 6} x2={NEXT_X} y2={BOTTOM_Y - 7} color={ACCENT} />
            <circle cx={NEXT_X} cy={BOTTOM_Y} r={4.5} fill={ACCENT} />
            <Arrow x1={NEXT_X + 4} y1={TOP_Y + 5} x2={OTHER_X - 3} y2={BOTTOM_Y - 7} color={MUTED} dashed />
            <circle cx={OTHER_X} cy={BOTTOM_Y} r={4.5} fill="none" stroke={MUTED} strokeWidth={1.25} />
            <text x={NEXT_X - 8} y={BOTTOM_Y + 22} textAnchor="end" fontSize={11} fontWeight={700} fill={ACCENT}>평소의 질서: 연소</text>
            <text x={352} y={BOTTOM_Y + 40} textAnchor="end" fontSize={11} fontWeight={700} fill={MUTED}>다른 결과: 신의 능력을 제한하지 않음</text>
          </g>
        </svg>
      )}
    />
  );
}
