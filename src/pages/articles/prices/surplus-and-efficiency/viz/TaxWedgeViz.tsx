import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: price-cap 절 ProgressiveDetail — 한 개당 세금 4를 파는 쪽에 물리면
 * 드는 값이 전부 4씩 오르고, 새 균형은 사는 값 9·받는 값 5에 두 쌍이며,
 * 총량 12가 산 쪽 1 + 판 쪽 1 + 세금 8 + 사라진 2로 갈라진다.
 */
const WTP: readonly number[] = [10, 9, 8, 7, 6, 5];
const MC: readonly number[] = [4, 5, 6, 7, 8, 9];
const PRICE = 7;
const TAX = 4;

const Q0 = WTP.filter((w, i) => w >= MC[i]).length;
const Q1 = WTP.filter((w, i) => w >= MC[i] + TAX).length;
/** 세금 뒤 사는 쪽이 내는 값: 거래되는 마지막 쌍이 낼 수 있던 금액 */
const BUY = WTP[Q1 - 1];
const SELL = BUY - TAX;

const CS0 = WTP.slice(0, Q0).reduce<number>((a, w) => a + (w - PRICE), 0);
const PS0 = MC.slice(0, Q0).reduce<number>((a, m) => a + (PRICE - m), 0);
const TOTAL0 = CS0 + PS0;
const CS1 = WTP.slice(0, Q1).reduce<number>((a, w) => a + (w - BUY), 0);
const PS1 = MC.slice(0, Q1).reduce<number>((a, m) => a + (SELL - m), 0);
const TAX_REV = TAX * Q1;
const LOST = TOTAL0 - CS1 - PS1 - TAX_REV;

const BUYER = "#10b981";
const SELLER = "#6366f1";
const TAXC = "#d97706";
const LOSTC = "#ef4444";
const MUTED = "#94a3b8";

const X = (v: number) => 88 + (v - 3) * 19;
const ROW0 = 44;
const ROW_GAP = 20;

const SCENES = [
  {
    label: "세금 전 · 값 7에 네 쌍",
    summary: `총량 ${TOTAL0}`,
    note: `앞 절과 같은 시장입니다. 쌍마다 낼 수 있던 금액(원)이 드는 값(네모)보다 크거나 같은 넷째 쌍까지 거래되고, 산 쪽이 ${CS0}, 판 쪽이 ${PS0}을 남겨 합이 ${TOTAL0}입니다.`,
  },
  {
    label: "드는 값이 전부 4씩 오릅니다",
    summary: `거래되는 쌍 ${Q0} → ${Q1}`,
    note: `한 개당 ${TAX}의 세금을 파는 쪽이 내면, 파는 쪽에게는 드는 값이 ${TAX}씩 올라간 것과 같습니다(속 빈 네모). 낼 수 있던 금액이 올라간 값 이상인 쌍은 첫째(${WTP[0]} ≥ ${MC[0] + TAX})와 둘째(${WTP[1]} ≥ ${MC[1] + TAX})뿐입니다. 셋째는 ${WTP[2]} < ${MC[2] + TAX}라 빠집니다.`,
  },
  {
    label: "사는 값과 받는 값이 갈라집니다",
    summary: `${BUY} − ${SELL} = ${TAX}`,
    note: `새 균형에서 사는 쪽이 내는 값은 ${PRICE}에서 ${BUY}로 ${BUY - PRICE} 오르고, 파는 쪽이 실제로 받는 값은 ${PRICE}에서 ${SELL}로 ${PRICE - SELL} 내립니다. 두 값 사이의 틈이 세금 ${TAX}이고, 여기서는 두 줄의 기울기가 같게 잡혀 있어 반반으로 나뉩니다. 누가 내도록 정하느냐는 이 비율을 바꾸지 않습니다. 사는 쪽에 물리도록 바꿔도 같은 비율로 나뉩니다.`,
  },
  {
    label: `${TOTAL0}가 어디로 갔는가`,
    summary: `${CS1} + ${PS1} + ${TAX_REV} + ${LOST}`,
    note: `두 쌍만 거래되므로 산 쪽은 ${WTP[0]}−${BUY}와 ${WTP[1]}−${BUY}로 ${CS1}, 판 쪽은 ${SELL}−${MC[0]}와 ${SELL}−${MC[1]}로 ${PS1}을 남기고, 세금은 ${TAX}씩 두 개라 ${TAX_REV}이 거두어집니다. 셋을 더하면 ${CS1 + PS1 + TAX_REV}이라 ${TOTAL0}에서 ${LOST}가 줄었습니다. 줄어든 ${LOST}는 셋째 쌍(${WTP[2]}과 ${MC[2]})이 만들 수 있었던 값이고, 값을 묶을 때와 달리 ${TAX_REV}은 세금으로 남습니다.`,
  },
] as const;

const SPLIT: readonly (readonly { label: string; value: number; color: string }[])[] = [
  [
    { label: "산 쪽", value: CS0, color: BUYER },
    { label: "판 쪽", value: PS0, color: SELLER },
  ],
  [],
  [],
  [
    { label: "산 쪽", value: CS1, color: BUYER },
    { label: "판 쪽", value: PS1, color: SELLER },
    { label: "세금", value: TAX_REV, color: TAXC },
    { label: "사라짐", value: LOST, color: LOSTC },
  ],
];

const BAR_X = 8;
const BAR_UNIT = 304 / TOTAL0;

function Figure({ s }: { s: number }) {
  const taxed = s >= 1;
  const split = SPLIT[s];
  const offsets = split.map((_, i) => split.slice(0, i).reduce<number>((a, x) => a + x.value, 0));
  return (
    <svg viewBox="0 0 320 222" role="img" aria-label={SCENES[s].label} className="h-auto w-full max-w-md">
      {/* 가격선 */}
      {s === 0 && (
        <g>
          <line x1={X(PRICE)} y1={30} x2={X(PRICE)} y2={ROW0 + 5 * ROW_GAP + 8} stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
          <text x={X(PRICE)} y={24} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={MUTED}>
            값 {PRICE}
          </text>
        </g>
      )}
      {s >= 2 && (
        <g>
          <rect x={X(SELL)} y={30} width={X(BUY) - X(SELL)} height={5 * ROW_GAP + 22} fill={TAXC} fillOpacity={0.08} />
          <line x1={X(BUY)} y1={30} x2={X(BUY)} y2={ROW0 + 5 * ROW_GAP + 8} stroke={BUYER} strokeWidth={1} strokeDasharray="3 2" />
          <line x1={X(SELL)} y1={30} x2={X(SELL)} y2={ROW0 + 5 * ROW_GAP + 8} stroke={SELLER} strokeWidth={1} strokeDasharray="3 2" />
          <text x={X(BUY) + 3} y={24} fontSize={10} fontWeight={700} fill={BUYER}>
            사는 값 {BUY}
          </text>
          <text x={X(SELL) - 3} y={24} textAnchor="end" fontSize={10} fontWeight={700} fill={SELLER}>
            받는 값 {SELL}
          </text>
          <text x={(X(SELL) + X(BUY)) / 2} y={24} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={TAXC}>
            틈 {TAX}
          </text>
        </g>
      )}

      {WTP.map((w, i) => {
        const y = ROW0 + i * ROW_GAP;
        const cost = MC[i] + (taxed ? TAX : 0);
        const traded = w >= cost;
        const lo = Math.min(cost, w);
        const hi = Math.max(cost, w);
        return (
          <g key={i}>
            <text x={6} y={y + 4} fontSize={11} fontWeight={700} fill={traded ? "#64748b" : MUTED}>
              {i + 1}쌍
            </text>
            <text x={30} y={y + 4} fontSize={10} fill={MUTED}>
              {w} · {MC[i]}
              {taxed ? `+${TAX}` : ""}
            </text>
            <line x1={X(lo)} y1={y} x2={X(hi)} y2={y} stroke={traded ? BUYER : MUTED} strokeWidth={traded ? 3 : 1} strokeOpacity={traded ? 0.6 : 0.5} />
            {taxed && (
              <g>
                <line x1={X(MC[i])} y1={y} x2={X(cost)} y2={y} stroke={TAXC} strokeWidth={1} strokeDasharray="2 2" />
                <rect x={X(cost) - 4} y={y - 4} width={8} height={8} fill="none" stroke={TAXC} strokeWidth={1.25} />
              </g>
            )}
            <rect x={X(MC[i]) - 4} y={y - 4} width={8} height={8} fill={SELLER} fillOpacity={taxed ? 0.45 : 0.9} />
            <circle cx={X(w)} cy={y} r={4.5} fill={BUYER} />
            <text x={316} y={y + 4} textAnchor="end" fontSize={10.5} fontWeight={700} fill={traded ? BUYER : MUTED}>
              {traded ? "거래" : "안 함"}
            </text>
          </g>
        );
      })}

      {/* 금액 눈금 */}
      {[4, 6, 8, 10, 12].map((t) => (
        <text key={t} x={X(t)} y={ROW0 + 5 * ROW_GAP + 20} textAnchor="middle" fontSize={9.5} fill={MUTED}>
          {t}
        </text>
      ))}

      {/* 아래 칸: 총량이 어떻게 갈라졌는가 */}
      {split.length > 0 ? (
        <g>
          {split.map((seg, i) => (
            <g key={seg.label}>
              <rect
                x={BAR_X + offsets[i] * BAR_UNIT}
                y={178}
                width={seg.value * BAR_UNIT}
                height={14}
                fill={seg.color}
                fillOpacity={0.35}
                stroke={seg.color}
                strokeWidth={1}
                strokeDasharray={seg.label === "사라짐" ? "3 2" : undefined}
              />
              <text x={BAR_X + (offsets[i] + seg.value / 2) * BAR_UNIT} y={190} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={seg.color}>
                {seg.value}
              </text>
            </g>
          ))}
          <text x={BAR_X} y={212} fontSize={10.5} fontWeight={700} fill={MUTED}>
            {split.map((seg) => `${seg.label} ${seg.value}`).join(" · ")} = {TOTAL0}
          </text>
        </g>
      ) : (
        <g>
          <text x={BAR_X} y={190} fontSize={10.5} fontWeight={700} fill={s === 1 ? TAXC : MUTED}>
            {s === 1
              ? `낼 수 있던 금액 ≥ 드는 값 + ${TAX} 인 쌍: ${Q1}개`
              : `사는 쪽 +${BUY - PRICE} · 받는 쪽 −${PRICE - SELL} · 합쳐서 ${TAX}`}
          </text>
          <text x={BAR_X} y={210} fontSize={10} fill={MUTED}>
            {s === 1 ? "셋째 쌍부터는 세금을 얹은 값이 낼 수 있던 금액보다 큽니다" : `사는 쪽이 낸 ${BUY} 가운데 ${TAX}는 세금, ${SELL}가 파는 쪽에 갑니다`}
          </text>
        </g>
      )}
    </svg>
  );
}

export default function TaxWedgeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((x) => x.label);
  return (
    <VizFrame
      eyebrow="세금이 만드는 틈"
      title="세금 4가 사는 값과 받는 값을 벌려 놓습니다"
      description="줄마다 한 쌍입니다. 원은 사는 쪽이 낼 수 있던 금액, 네모는 파는 쪽에 드는 값, 속 빈 네모는 거기에 세금을 더한 값입니다."
      note="앞 글과 같은 여섯 쌍의 시장이며 사람마다의 금액을 같은 자로 더할 수 있다고 둔 계산입니다. 반반으로 나뉘는 것은 두 줄의 기울기가 같게 잡혀 있어서입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한 개당 세금 4가 거래 수와 몫을 바꾸는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <Figure s={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((x) => x.note)} />
      </div>
    </VizFrame>
  );
}
