import PlotAxes from "./PlotAxes";
import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #hidden-action — 자기부담 d에 따른 본인의 계산.
 * 주의함 0.1d + 10, 주의 안 함 0.3d. d=100: 20·30, d=0: 10·0, d=60: 16·18, d=50: 15·15.
 * 문턱 = 10 ÷ (0.3 − 0.1) = 50.
 */
const CARE = "#2563eb";
const NOCARE = "#dc2626";
const OWN = "#475569";
const INSURER = "#94a3b8";
const TEXT = "#64748b";

const LEFT = 30;
const RIGHT = 350;
const TOP = 84;
const BOTTOM = 200;
const sx = (value: number) => LEFT + (value / 100) * (RIGHT - LEFT - 12) + 4;
const sy = (value: number) => BOTTOM - (value / 34) * (BOTTOM - TOP);
const careAt = (d: number) => 0.1 * d + 10;
const skipAt = (d: number) => 0.3 * d;

const SCENE_D: readonly number[] = [100, 0, 60, 50];
const SCENES: readonly ShellScene[] = [
  { label: "보험이 없으면", summary: "자기부담 100 · 20 < 30 → 주의", note: "주의하면 기대 손해(사고 확률 × 본인이 지는 금액) 10에 주의 비용 10을 더해 20이고, 안 하면 30입니다." },
  { label: "전액 보험이면", summary: "자기부담 0 · 10 > 0 → 안 함", note: "본인 앞에는 주의 비용 10만 보여 안 하게 됩니다. 사고 확률이 0.3으로 올라 사회적으로 드는 값이 20에서 30이 되고 10이 사라집니다. 보험료도 결국 그만큼이 됩니다." },
  { label: "자기부담이 60이면", summary: "16 < 18 → 다시 주의", note: "주의하면 0.1 × 60 + 10 = 16, 안 하면 0.3 × 60 = 18입니다. 주의가 돌아오지만 보험이 물어 주는 몫은 40으로 줄었습니다." },
  { label: "두 선이 만나는 문턱", summary: "10 ÷ (0.3 − 0.1) = 50", note: "50에서 두 값이 15로 같아집니다. 그 아래로는 보험료를 깎아도 주의가 돌아오지 않습니다. 손해의 절반 이상을 본인에게 남겨야 하니 공짜가 아닙니다." },
];

export default function DeductibleCrossViz() {
  return (
    <SceneShell
      eyebrow="자기부담의 문턱"
      title="손해를 얼마나 본인 장부에 남기면 계산이 뒤집히는가"
      description="자기부담은 사고 때 보험이 물어 주지 않고 본인이 지는 금액입니다. 선은 보험료를 뺀 본인의 계산이며, 주의는 둘 중 하나이고 보험사가 주의 여부를 볼 수 없다고 둔 예입니다."
      ariaLabel="자기부담에 따라 주의할 때와 안 할 때 본인이 치를 값이 뒤집히는 그래프"
      scenes={SCENES}
      render={(active) => {
        const d = SCENE_D[active];
        const care = careAt(d);
        const skip = skipAt(d);
        const tie = care === skip;
        const anchor = d === 100 ? "end" : d === 0 ? "start" : "middle";
        const labelX = sx(d) + (d === 100 ? -8 : d === 0 ? 8 : 0);
        const split = 10 + (d / 100) * 340;
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={11} fontSize={10.5} fontWeight={700} fill={TEXT}>사고 때 손해 100은 누구 장부에</text>
            <rect x={10} y={17} width={340} height={22} rx={4} fill="none" stroke={INSURER} strokeWidth={1} strokeDasharray="4 3" />
            {d > 0 && <rect x={10} y={17} width={split - 10} height={22} rx={4} fill={`${OWN}26`} stroke={OWN} strokeWidth={1} />}
            {d > 0 && <text x={16} y={32} fontSize={11} fontWeight={800} fill={OWN}>본인 {d}</text>}
            {d < 100 && <text x={344} y={32} textAnchor="end" fontSize={11} fontWeight={700} fill={TEXT}>보험 {100 - d}</text>}
            <PlotAxes
              left={LEFT}
              right={RIGHT}
              top={TOP}
              bottom={BOTTOM}
              sx={sx}
              sy={sy}
              xTicks={[0, 25, 50, 75, 100].map((value) => ({ value, label: String(value) }))}
              yTicks={[0, 10, 20, 30].map((value) => ({ value, label: String(value) }))}
              xLabel="자기부담"
              legendY={55}
              legend={[
                { label: "주의할 때: 0.1 × 자기부담 + 10", color: CARE },
                { label: "안 할 때: 0.3 × 자기부담", color: NOCARE, dash: "5 3" },
              ]}
            />
            <line x1={sx(0)} x2={sx(100)} y1={sy(careAt(0))} y2={sy(careAt(100))} stroke={CARE} strokeWidth={1.25} />
            <line x1={sx(0)} x2={sx(100)} y1={sy(skipAt(0))} y2={sy(skipAt(100))} stroke={NOCARE} strokeWidth={1.25} strokeDasharray="5 3" />
            <line x1={sx(d)} x2={sx(d)} y1={TOP} y2={BOTTOM} stroke={TEXT} strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={sx(d)} cy={sy(care)} r={3.5} fill={CARE} />
            <circle cx={sx(d)} cy={sy(skip)} r={3.5} fill="#ffffff" stroke={NOCARE} strokeWidth={1.25} />
            {tie ? (
              <text x={sx(d) - 6} y={sy(care) - 9} textAnchor="end" fontSize={11} fontWeight={800} fill={OWN}>15 = 15</text>
            ) : (
              <>
                <text x={labelX} y={sy(care) + (care > skip ? -8 : 15)} textAnchor={anchor} fontSize={11} fontWeight={800} fill={CARE}>{care}</text>
                <text x={labelX} y={sy(skip) + (skip > care ? -8 : d === 0 ? -6 : 15)} textAnchor={anchor} fontSize={11} fontWeight={800} fill={NOCARE}>{skip}</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
