import PlotAxes from "./PlotAxes";
import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #signaling — 요구 단위에 따른 순이익 선.
 * 이 글: 잘하는 쪽 12−s, 못하는 쪽이 따라 하면 12−4s, 안 갖추면 6, 섞이면 9. 12−4s=6 → s=1.5, 12−s=9 → s=3.
 * 논문: 능력 1·2, 비용 y·y/2. 2−y=1 → y=1, 2−y/2=1 → y=2. 그 범위에서 2−y/2는 섞인 값 1.5 이하.
 */
const HIGH = "#2563eb";
const LOW = "#dc2626";
const FLAT = "#475569";
const POOL = "#d97706";
const OK = "#059669";
const TEXT = "#64748b";

const LEFT = 30;
const RIGHT = 350;
const TOP = 62;
const BOTTOM = 210;

const SCENES: readonly ShellScene[] = [
  { label: "못하는 쪽이 돌아서는 자리", summary: "6 ÷ 4 = 1.5단위", note: "못하는 쪽이 따라 하면 12에서 단위마다 4씩 빠져 1.5단위에서 안 갖추고 받는 6과 같아집니다. 그보다 큰 요구여야 따라오지 않습니다." },
  { label: "두 단위를 요구하면", summary: "잘하는 쪽 10 · 못하는 쪽 4", note: "잘하는 쪽은 12 − 2 = 10으로 6보다 낫고, 못하는 쪽은 12 − 8 = 4로 6보다 못합니다. 그래서 갈라집니다. 둘을 합치면 16으로 섞였을 때의 18보다 2 적습니다." },
  { label: "요구가 너무 높아지면", summary: "3단위부터 잘하는 쪽도 9 이하", note: "잘하는 쪽의 12 − 요구 단위가 섞였을 때의 9와 같아지는 자리가 3입니다(본문 숫자로 계산). 3을 넘으면 갈라져도 아무도 낫지 않습니다." },
  { label: "논문 자신의 수치에서는", summary: "1 < y* < 2 · 순이익 < 1.5", note: "y*는 논문의 요구 수준입니다. 능력 1·2, 비용 y·y/2이면 이 범위의 순이익 2 − y*/2가 섞인 값 1.5 아래입니다. 앞 장면에서 잘하는 쪽이 본 이득은 비용 비가 1대 4로 가팔라서이고 일반적 결론이 아닙니다." },
];

export default function SignalThresholdViz() {
  return (
    <SceneShell
      eyebrow="요구 수준의 문턱"
      title="표시를 얼마나 요구해야 갈라지고, 언제 아무도 낫지 않게 되는가"
      description="가로축은 요구하는 표시의 단위, 세로축은 비용을 뺀 뒤 손에 남는 값입니다. 표시는 일을 해내는 양을 바꾸지 않고 두 유형이 절반씩이라고 둔 계산입니다."
      ariaLabel="요구 단위에 따라 잘하는 쪽과 못하는 쪽의 순이익이 달라지는 그래프"
      scenes={SCENES}
      render={(active) => {
        const paper = active === 3;
        const xMax = paper ? 3 : 4;
        const yMax = paper ? 2.5 : 14;
        const sx = (value: number) => LEFT + (value / xMax) * (RIGHT - LEFT - 8);
        const sy = (value: number) => BOTTOM - (value / yMax) * (BOTTOM - TOP);
        const flat = paper ? 1 : 6;
        const pool = paper ? 1.5 : 9;
        const high = paper ? { from: 2, end: 2 - xMax / 2 } : { from: 12, end: 12 - xMax };
        const lowCut = paper ? 2 : 3;
        const windowFrom = paper ? 1 : 1.5;
        const windowTo = paper ? 2 : 3;
        const showHigh = active >= 1;
        const showPool = active >= 2;
        const markX = active === 0 ? 1.5 : active === 1 ? 2 : null;
        return (
          <svg viewBox="0 0 360 242" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active >= 2 && (
              <g>
                <rect x={sx(windowFrom)} y={TOP} width={sx(windowTo) - sx(windowFrom)} height={BOTTOM - TOP} fill={paper ? `${LOW}10` : `${OK}14`} />
                <text x={(sx(windowFrom) + sx(windowTo)) / 2} y={TOP + 13} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={paper ? LOW : OK}>
                  {paper ? "갈라지지만 손해" : "잘하는 쪽만 이득"}
                </text>
              </g>
            )}
            <PlotAxes
              left={LEFT}
              right={RIGHT}
              top={TOP}
              bottom={BOTTOM}
              sx={sx}
              sy={sy}
              xTicks={(paper ? [0, 1, 2, 3] : [0, 1.5, 2, 3, 4]).map((value) => ({ value, label: String(value) }))}
              yTicks={(paper ? [0, 1, 1.5, 2] : [0, 6, 9, 12]).map((value) => ({ value, label: String(value) }))}
              xLabel={paper ? "요구 수준 y*" : "요구 단위"}
              legendY={12}
              legend={[
                { label: paper ? "잘하는 쪽: 2 − y*/2" : "잘하는 쪽: 12 − 요구 단위", color: HIGH },
                { label: paper ? "못하는 쪽이 따라 하면: 2 − y*" : "못하는 쪽이 따라 하면: 12 − 4 × 요구 단위", color: LOW, dash: "6 3" },
              ]}
            />
            <line x1={LEFT} x2={RIGHT - 8} y1={sy(flat)} y2={sy(flat)} stroke={FLAT} strokeWidth={1} strokeDasharray="5 3" />
            {showPool && <line x1={LEFT} x2={RIGHT - 8} y1={sy(pool)} y2={sy(pool)} stroke={POOL} strokeWidth={1} strokeDasharray="2 3" />}
            <line x1={sx(0)} x2={sx(lowCut)} y1={sy(paper ? 2 : 12)} y2={sy(0)} stroke={LOW} strokeWidth={1.25} strokeDasharray="6 3" />
            <line x1={sx(0)} x2={sx(xMax)} y1={sy(high.from)} y2={sy(high.end)} stroke={HIGH} strokeWidth={1.25} opacity={showHigh ? 1 : 0.25} />
            <text x={RIGHT - 8} y={sy(flat) - 4} textAnchor="end" fontSize={10.5} fontWeight={700} fill={FLAT}>안 갖추면 {flat}</text>
            {showPool && <text x={RIGHT - 8} y={sy(pool) - 4} textAnchor="end" fontSize={10.5} fontWeight={700} fill={POOL}>섞이면 {pool}</text>}
            {markX !== null && (
              <>
                <line x1={sx(markX)} x2={sx(markX)} y1={TOP} y2={BOTTOM} stroke={TEXT} strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={sx(markX)} cy={sy(12 - 4 * markX)} r={3.5} fill={LOW} />
                {showHigh && <circle cx={sx(markX)} cy={sy(12 - markX)} r={3.5} fill={HIGH} />}
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
