import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 각 증거가 뒷받침하는 주장, 그리고 의식·무이해로 바로 건너뛸 때 생기는 전제.
 */
const PAIRS = [
  ["정답률", "과제 능력"],
  ["내부 활성", "구현"],
  ["학습 자료·상호작용", "의미 형성의 후보 경로"],
  ["자기 보고", "또 하나의 행동 증거"],
] as const;

const SCENES = [
  { label: "증거마다 닿는 주장", summary: "네 줄", mode: 0, note: "정답률은 과제 능력, 내부 활성은 구현, 학습 자료와 상호작용은 의미 형성의 후보 경로, 자기 보고는 또 하나의 행동 증거입니다. 후보 경로라는 말대로 아직 확정된 경로가 아닙니다." },
  { label: "의식으로 바로 긋는 선", summary: "건너뛴 전제", mode: 1, note: "어느 하나를 의식의 직접 측정값으로 부르면 점선을 긋는 셈이고, 그 사이에 건너뛴 전제가 생깁니다." },
  { label: "반대 방향으로 긋는 선", summary: "구현 설명 → 이해 없음?", mode: 2, note: "“통계로 다음 기호를 골랐다”는 구현 설명만으로 이해가 없다고 끝낼 수도 없습니다. 사람의 뇌도 물리 과정으로 작동한다는 사실이 곧 마음을 지우지 않습니다." },
] as const;

const INK = "#64748b";
const ACCENT = "#2563eb";
const WARN = "#dc2626";
const BOX_W = 148;
const BOX_H = 30;
const rowY = (i: number) => 8 + i * 40;

function Box({ x, y, text, color, strong }: { x: number; y: number; text: string; color: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={6} fill={color} fillOpacity={strong ? 0.12 : 0.05} stroke={color} strokeWidth={1} />
      <text x={x + BOX_W / 2} y={y + 20} textAnchor="middle" fontSize={13} fontWeight={strong ? 700 : 400} fill={color}>{text}</text>
    </g>
  );
}

export default function EvidenceClaimMapViz() {
  return (
    <SceneShell
      eyebrow="증거와 주장의 짝"
      title="증거마다 닿는 주장이 다르고, 의식까지 바로 가는 선은 없습니다"
      description="왼쪽은 관찰할 수 있는 증거, 오른쪽은 그 증거가 뒷받침하는 주장입니다. 맨 아래 칸은 위 증거들이 곧장 닿지 못하는 주장입니다. 선은 수량이 아니라 논증의 연결입니다."
      ariaLabel="증거와 주장의 연결과 건너뛴 전제"
      scenes={SCENES}
      render={(active) => {
        const { mode } = SCENES[active];
        const LX = 4;
        const RX = 208;
        const BY = rowY(4) + 12;
        return (
          <svg viewBox="0 0 372 226" className="mx-auto h-auto w-full max-w-[580px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {PAIRS.map(([evidence, claim], i) => {
              const dim = (mode === 2 && i !== 1) || mode === 1;
              return (
                <g key={evidence} opacity={dim ? 0.6 : 1}>
                  <Box x={LX} y={rowY(i)} text={evidence} color={INK} strong={mode === 0 || (mode === 2 && i === 1)} />
                  <line x1={LX + BOX_W} x2={RX} y1={rowY(i) + BOX_H / 2} y2={rowY(i) + BOX_H / 2} stroke={ACCENT} strokeWidth={1} />
                  <Box x={RX} y={rowY(i)} text={claim} color={ACCENT} strong={mode === 0 || (mode === 2 && i === 1)} />
                </g>
              );
            })}
            {mode === 1 && (
              <>
                <rect x={1} y={rowY(0) - 4} width={BOX_W + 6} height={rowY(3) + BOX_H - rowY(0) + 8} rx={8} fill="none" stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
                <path d={`M${LX + BOX_W / 2} ${rowY(3) + BOX_H + 4} V${BY + BOX_H / 2} H${RX}`} fill="none" stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
              </>
            )}
            {mode === 2 && (
              <path d={`M${RX + BOX_W} ${rowY(1) + BOX_H / 2} H368 V${BY + BOX_H / 2} H${RX + BOX_W}`} fill="none" stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
            )}
            <g opacity={mode === 0 ? 0.55 : 1}>
              <Box x={RX} y={BY} text={mode === 2 ? "“이해가 없다”" : "의식(주관적 경험)"} color={mode === 0 ? INK : WARN} strong={mode !== 0} />
            </g>
            {mode !== 0 && (
              <text x={RX - 8} y={mode === 2 ? BY + 20 : BY + 8} textAnchor="end" fontSize={12} fontWeight={700} fill={WARN}>건너뛴 전제</text>
            )}
          </svg>
        );
      }}
    />
  );
}
