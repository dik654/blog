import SceneShell from "./SceneShell";

/**
 * 본문 대응: #activity — 기준 주기 1 MHz 중 열 번에 한 번 완전한 0→1→0.
 * 완전 주기로 세면 α=0.1, 0→1 전환으로 세도 α=0.1 → 0.1×10⁶×108.9 pJ = 10.89 µW.
 * 토글 총수(상승+하강 2번)로 세면 α=0.2 → 같은 식이 21.78 µW, 두 배 오류.
 * 상승·하강이 몇 번째 칸에서 일어나는지는 본문이 정하지 않아 그림의 위치는 가정이다.
 */
const W = 360;
const H = 150;
const LEFT = 14;
const CELLS = 10;
const CELL_W = (W - 2 * LEFT) / CELLS;
const HIGH_Y = 52;
const LOW_Y = 96;
const RISE = 3;
const FALL = 7;
const cx = (index: number) => LEFT + index * CELL_W;

type Mark = "none" | "pair" | "rise" | "both";

const SCENES = [
  { label: "기준 주기 10칸", summary: "1 MHz → 1 µs마다 한 칸", mark: "none", note: "칸 하나가 기준 주기 하나입니다. 이 10칸 동안 출력은 0 V에서 3.3 V로 한 번 올라갔다 다시 0 V로 한 번 내려옵니다. 초당으로는 100만 칸 중 10만 번입니다." },
  { label: "완전 출력 주기로 세기", summary: "1쌍 ÷ 10칸 → α = 0.1 → 10.89 µW", mark: "pair", note: "이 글의 정의입니다. 0→1→0 한 쌍을 하나로 셉니다. 한 쌍의 비용이 108.9 pJ이므로 0.1×100만/s×108.9 pJ = 10.89 µW입니다." },
  { label: "0→1 전환으로 세기", summary: "상승 1번 ÷ 10칸 → α = 0.1 → 10.89 µW", mark: "rise", note: "문헌에 따라 쓰는 정의입니다. 상승만 세도 한 번입니다. 공급원이 에너지를 내는 것은 충전 때뿐이라 두 정의 모두 10만 번의 충전을 셉니다." },
  { label: "토글 총수로 세면", summary: "2번 ÷ 10칸 → α = 0.2 → 21.78 µW", mark: "both", note: "상승과 하강을 모두 세면 α가 0.2가 됩니다. 그런데 CV²는 이미 상승과 하강 한 쌍의 비용이라 같은 식에 넣으면 하강을 한 번 더 세어 두 배가 됩니다." },
] as const satisfies readonly { label: string; summary: string; mark: Mark; note: string }[];

const AMBER = "#d97706";
const RED = "#dc2626";
const BLUE = "#2563eb";

export default function ActivityCountViz() {
  return (
    <SceneShell
      eyebrow="활동률을 무엇으로 세는가"
      title="같은 출력도 세는 법에 따라 α가 두 배로 달라집니다"
      description="활동률 α는 기준 주기 수에 대해 출력 변화를 몇 번 세는지의 비율입니다. 아래는 1 MHz 기준 주기 10칸과 그동안의 출력 전압입니다. 상승과 하강이 몇 번째 칸에서 일어나는지는 정하지 않았으므로 그림의 위치는 가정입니다."
      note="10 pF, 3.3 V, 1 MHz, α=0.1은 이 글의 가상 사례입니다. 대기 전력 3.3 µW는 여기서 더하지 않았습니다."
      ariaLabel="기준 주기 10칸 동안 출력이 한 번 올라갔다 내려오는 파형에서 완전 주기, 상승, 토글 총수로 활동률을 세는 세 방법 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mark: Mark = scene.mark;
        const riseOn = mark === "rise" || mark === "both";
        const fallOn = mark === "both";
        const edgeColor = mark === "both" ? RED : AMBER;
        const wave = `${cx(0)},${LOW_Y} ${cx(RISE)},${LOW_Y} ${cx(RISE)},${HIGH_Y} ${cx(FALL)},${HIGH_Y} ${cx(FALL)},${LOW_Y} ${cx(CELLS)},${LOW_Y}`;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Array.from({ length: CELLS }, (_, index) => (
              <g key={index}>
                <rect x={cx(index) + 1} y={30} width={CELL_W - 2} height={84} fill="#94a3b8" fillOpacity={index % 2 === 0 ? 0.1 : 0.04} />
                <text x={cx(index) + CELL_W / 2} y={128} textAnchor="middle" fontSize={11} fill="#64748b">{index + 1}</text>
              </g>
            ))}
            {mark === "pair" && (
              <>
                <rect x={cx(RISE) - 4} y={22} width={cx(FALL) - cx(RISE) + 8} height={98} fill="none" stroke={BLUE} strokeWidth={1.25} rx={6} />
                <text x={(cx(RISE) + cx(FALL)) / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>0→1→0 한 쌍 = 1</text>
              </>
            )}
            <polyline points={wave} fill="none" stroke="#0f172a" strokeWidth={1.25} className="dark:stroke-slate-200" />
            <text x={cx(0) + 2} y={LOW_Y - 6} fontSize={11} fill="#64748b">0 V</text>
            <text x={cx(RISE) + 6} y={HIGH_Y - 6} fontSize={11} fill="#64748b">3.3 V</text>
            {riseOn && (
              <>
                <circle cx={cx(RISE)} cy={(HIGH_Y + LOW_Y) / 2} r={9} fill="none" stroke={edgeColor} strokeWidth={1.25} />
                <text x={cx(RISE) - 13} y={(HIGH_Y + LOW_Y) / 2 + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={edgeColor}>{mark === "both" ? "1" : "상승 1"}</text>
              </>
            )}
            {fallOn && (
              <>
                <circle cx={cx(FALL)} cy={(HIGH_Y + LOW_Y) / 2} r={9} fill="none" stroke={RED} strokeWidth={1.25} />
                <text x={cx(FALL) + 13} y={(HIGH_Y + LOW_Y) / 2 + 4} fontSize={12} fontWeight={700} fill={RED}>2</text>
              </>
            )}
            <text x={W / 2} y={144} textAnchor="middle" fontSize={11} fill="#64748b">기준 주기 번호 (각 1 µs)</text>
          </svg>
        );
      }}
    />
  );
}
