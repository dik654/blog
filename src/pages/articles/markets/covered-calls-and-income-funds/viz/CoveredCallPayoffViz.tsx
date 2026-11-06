import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #picture — 주식 장부와 판매 약속 장부를 더하면 위가 막힌 선이 된다.
 * 가로 = 만기 주가, 세로 = 100주 기준 손익(달러). 숫자는 본문의 설명용 가정과 같습니다.
 */
const COST = 100;
const STRIKE = 105;
const PREMIUM = 3;
const SHARES = 100;

const stock = (price: number) => (price - COST) * SHARES;
const call = (price: number) => (PREMIUM - Math.max(price - STRIKE, 0)) * SHARES;
const total = (price: number) => stock(price) + call(price);

const W = 380;
const H = 250;
const LEFT = 44;
const RIGHT = 14;
const TOP = 12;
const BOTTOM = 34;
const P_MIN = 85;
const P_MAX = 125;
const V_MIN = -1500;
const V_MAX = 2500;

const px = (price: number) => LEFT + ((price - P_MIN) / (P_MAX - P_MIN)) * (W - LEFT - RIGHT);
const py = (value: number) => TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (H - TOP - BOTTOM);

const line = (fn: (price: number) => number) =>
  [P_MIN, STRIKE, P_MAX].map((price) => `${px(price).toFixed(1)},${py(fn(price)).toFixed(1)}`).join(" ");

const STOCK_COLOR = "#64748b";
const CALL_COLOR = "#d97706";
const TOTAL_COLOR = "#2563eb";

const SCENES = [
  { label: "주식 장부", summary: "120이면 +2,000달러", note: "주식만 있으면 주가와 손익이 한 줄로 함께 움직입니다. 100에서 0이고, 120이면 주당 20달러씩 100주라 2,000달러입니다." },
  { label: "판매 약속 장부", summary: "105까지 +300달러", note: "받은 300달러는 주가가 105에 닿을 때까지 그대로 남습니다. 105를 넘으면 초과분을 넘겨주므로 선이 아래로 꺾입니다." },
  { label: "두 장부 합치기", summary: "최대 800달러에서 평평", note: "두 줄을 더하면 105 아래에서는 주식보다 300달러 높고, 105 위에서는 800달러에 막힙니다. 하락 쪽은 열려 있습니다." },
  { label: "세 가격 읽기", summary: "−700 · 600 · 800달러", note: "90이면 −700달러, 103이면 600달러, 120이면 800달러입니다. 120에서 주식만 가진 사람의 2,000달러보다 1,200달러 적고, 손익이 0이 되는 주가는 97입니다." },
] as const;

const MARKS = [90, 103, 120] as const;
const money = (value: number) => `${value < 0 ? "−" : ""}${Math.abs(value).toLocaleString("en-US")}`;

export default function CoveredCallPayoffViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="만기 손익"
      title="주식 줄과 판매 약속 줄을 더하면 위가 막힌 선이 됩니다"
      description="가로는 한 달 뒤 주가, 세로는 100주 기준 손익입니다. 세금·배당·비용·이자는 뺐고 모든 가격은 설명용 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="주식과 콜 매도의 만기 손익을 더하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[-1000, 0, 1000, 2000].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={W - RIGHT} y1={py(value)} y2={py(value)} stroke="#94a3b8" strokeWidth={value === 0 ? 1 : 0.5} strokeDasharray={value === 0 ? undefined : "2 3"} />
              <text x={LEFT - 6} y={py(value) + 4} textAnchor="end" fontSize={11} fill="#64748b">{money(value)}</text>
            </g>
          ))}
          {[90, 100, 105, 120].map((price) => (
            <text key={price} x={px(price)} y={H - 12} textAnchor="middle" fontSize={11} fill="#64748b">{price}</text>
          ))}
          <polyline points={line(stock)} fill="none" stroke={STOCK_COLOR} strokeWidth={1.25} opacity={active === 1 ? 0.25 : 1} />
          {active >= 1 && <polyline points={line(call)} fill="none" stroke={CALL_COLOR} strokeWidth={1.25} opacity={active === 3 ? 0.35 : 1} />}
          {active >= 2 && <polyline points={line(total)} fill="none" stroke={TOTAL_COLOR} strokeWidth={1.25} />}
          <text x={px(121)} y={py(stock(121)) - 6} textAnchor="end" fontSize={11} fill={STOCK_COLOR} opacity={active === 1 ? 0.35 : 1}>주식만</text>
          {active >= 1 && <text x={px(124)} y={py(call(124)) - 6} textAnchor="end" fontSize={11} fill={CALL_COLOR} opacity={active === 3 ? 0.45 : 1}>판매 약속</text>}
          {active >= 2 && <text x={px(124)} y={py(800) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={TOTAL_COLOR}>합계</text>}
          {active === 3 && MARKS.map((price) => (
            <g key={price}>
              <circle cx={px(price)} cy={py(total(price))} r={3.5} fill={TOTAL_COLOR} />
              <text x={px(price)} y={py(total(price)) + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={TOTAL_COLOR}>{money(total(price))}</text>
            </g>
          ))}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((scene) => scene.label)} />
        <StaticSceneList labels={SCENES.map((scene) => scene.label)} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
