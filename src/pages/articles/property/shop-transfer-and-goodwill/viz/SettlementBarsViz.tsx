import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 인수일 재고 250만 원이면 총액 3천250만, 잔금 2천950만.
 * 막대 길이 = 만 원. 위는 대금의 대상, 아래는 지급 순서이며 같은 눈금입니다.
 */
const W = 340;
const H = 176;
const X0 = 8;
const UNIT = (W - 2 * X0) / 3300;
const ROW_H = 44;
const WHAT_Y = 24;
const WHEN_Y = 110;

const px = (value: number) => X0 + value * UNIT;

const FACILITY = "#64748b";
const STOCK = "#b45309";
const GOODWILL = "#475569";
const DEPOSIT = "#2563eb";
const BALANCE = "#1d4ed8";
const CHANGE = "#dc2626";
const TEXT = "#64748b";

const SCENES = [
  { label: "합의한 대금", summary: "2,000 + 300 + 1,000 = 3,300만", note: "시설, 재고, 기존 손님이 계속 올 가능성에 각각 값을 매겼습니다. 이 막대는 무엇에 돈을 내는지를 나눈 것입니다.", stock: 300, showWhen: false },
  { label: "같은 돈을 지급 순서로", summary: "3,300 − 300 = 3,000만", note: "먼저 내는 300만 원은 지급 순서를 정한 금액입니다. 왼쪽 끝의 이 칸과 위의 재고 칸은 숫자만 같고 다른 칸입니다.", stock: 300, showWhen: true },
  { label: "인수일에 센 재고 250만", summary: "2,000 + 250 + 1,000 = 3,250만", note: "약정한 단가로 인수일 재고를 세니 250만 원입니다. 다른 조건이 같으므로 재고 칸만 50만 원 줄고 총액도 그만큼 줄어듭니다.", stock: 250, showWhen: true },
  { label: "잔금이 받는 변화", summary: "3,250 − 300 = 2,950만", note: "먼저 낸 300만 원은 그대로이므로 50만 원은 잔금에서 빠집니다. 사용기한이 지난 물건을 뺄지와 수량 차이를 어떻게 반영할지도 미리 합의합니다.", stock: 250, showWhen: true },
] as const;

const money = (value: number) => value.toLocaleString("en-US");

export default function SettlementBarsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];
  const total = 2000 + scene.stock + 1000;
  // 3번째 장면에서 총액이 먼저 줄고, 4번째 장면에서 잔금 칸이 따라 줄어듭니다.
  const balance = active === 3 ? total - 300 : 3000;
  const recounted = scene.stock !== 300;

  return (
    <VizFrame
      eyebrow="인수일 정산"
      title="300만 원이 두 번 나오지만 재고를 다시 세면 움직이는 칸은 정해져 있습니다"
      description="위 막대는 무엇에 내는지, 아래 막대는 언제 내는지입니다. 같은 눈금이고 단위는 만 원이며 설명용 가격 합의 (가정)입니다."
      note="보증금·세금·중개비와 인수 뒤 운영 자금은 제외했습니다. 지급 비율은 업계 표준이나 법정 비율이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="재고를 다시 셀 때 대금 구성과 잔금이 어떻게 달라지는지 보여 주는 두 막대"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          {/* 무엇에 내나 */}
          <text x={X0} y={WHAT_Y - 8} fontSize={13} fontWeight={700} fill={TEXT}>무엇에 내나</text>
          <text x={W - X0} y={WHAT_Y - 8} textAnchor="end" fontSize={13} fontWeight={700} fill={TEXT}>총액 {money(total)}</text>
          <rect x={px(0)} y={WHAT_Y} width={2000 * UNIT} height={ROW_H} fill={FACILITY} />
          <text x={px(1000)} y={WHAT_Y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">시설</text>
          <text x={px(1000)} y={WHAT_Y + 35} textAnchor="middle" fontSize={13} fill="#ffffff">2,000</text>

          <rect x={px(2000)} y={WHAT_Y} width={scene.stock * UNIT} height={ROW_H} fill={STOCK} />
          <text x={px(2000 + scene.stock / 2)} y={WHAT_Y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">재고</text>
          <text x={px(2000 + scene.stock / 2)} y={WHAT_Y + 35} textAnchor="middle" fontSize={12} fill="#ffffff">{scene.stock}</text>

          <rect x={px(2000 + scene.stock)} y={WHAT_Y} width={1000 * UNIT} height={ROW_H} fill={GOODWILL} />
          <text x={px(2000 + scene.stock + 500)} y={WHAT_Y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">영업상 이점</text>
          <text x={px(2000 + scene.stock + 500)} y={WHAT_Y + 35} textAnchor="middle" fontSize={13} fill="#ffffff">1,000</text>

          {recounted && (
            <g>
              <rect x={px(total)} y={WHAT_Y} width={50 * UNIT} height={ROW_H} fill="none" stroke={CHANGE} strokeWidth={1} strokeDasharray="2 2" />
              <text x={W - X0} y={WHAT_Y + ROW_H + 15} textAnchor="end" fontSize={13} fontWeight={700} fill={CHANGE}>재고 −50</text>
            </g>
          )}

          {/* 언제 내나 */}
          {scene.showWhen && (
            <g>
              <text x={X0} y={WHEN_Y - 8} fontSize={13} fontWeight={700} fill={TEXT}>언제 내나</text>
              <rect x={px(0)} y={WHEN_Y} width={300 * UNIT} height={ROW_H} fill={DEPOSIT} />
              <text x={px(150)} y={WHEN_Y + 19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">먼저</text>
              <text x={px(150)} y={WHEN_Y + 35} textAnchor="middle" fontSize={12} fill="#ffffff">300</text>
              <rect x={px(300)} y={WHEN_Y} width={balance * UNIT} height={ROW_H} fill={BALANCE} stroke="#ffffff" strokeWidth={0.5} />
              <text x={px(300 + balance / 2)} y={WHEN_Y + 19} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">인수일 잔금</text>
              <text x={px(300 + balance / 2)} y={WHEN_Y + 35} textAnchor="middle" fontSize={13} fill="#ffffff">{money(balance)}</text>
              {active === 3 && (
                <g>
                  <rect x={px(3250)} y={WHEN_Y} width={50 * UNIT} height={ROW_H} fill="none" stroke={CHANGE} strokeWidth={1} strokeDasharray="2 2" />
                  <text x={W - X0} y={WHEN_Y + ROW_H + 15} textAnchor="end" fontSize={13} fontWeight={700} fill={CHANGE}>잔금 −50</text>
                </g>
              )}
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
