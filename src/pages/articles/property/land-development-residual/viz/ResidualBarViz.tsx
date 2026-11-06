import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #mechanism — 매각액·비용·지연을 바꾼 네 계산과 두 가지 지연 읽기.
 * 막대 길이 = 억 원. 90−70−15=5, 100−80−15=5, 90−80−15=−5, 100−72−15=13은 본문의 식입니다.
 */
const W = 340;
const H = 176;
const X0 = 14;
const UNIT = 3.1;
const SALE_Y = 18;
const SALE_H = 30;
const COST_Y = 76;
const COST_H = 40;

const px = (value: number) => X0 + value * UNIT;

const SALE_COLOR = "#475569";
const COST_COLOR = "#64748b";
const PROFIT_COLOR = "#b45309";
const LAND_COLOR = "#475569";
const REMAIN_COLOR = "#2563eb";
const CHANGE_COLOR = "#dc2626";
const TEXT = "#64748b";

type Scene = {
  label: string;
  summary: string;
  note: string;
  sale: number;
  cost: number;
  interest: number;
  /** 중간 칸: 고정한 몫 */
  fixedName: string;
  fixedColor: string;
  fixed: number;
  /** 맨 끝에 남는 칸 */
  remainName: string;
};

const SCENES: readonly Scene[] = [
  { label: "기준 계획", summary: "100 − 70 − 15 = 15억", note: "토지와 취득에 쓸 수 있는 돈은 맨 끝에 남은 칸입니다. 목표 이익 15억 원과 숫자만 같고 다른 칸입니다.", sale: 100, cost: 70, interest: 0, fixedName: "이익", fixedColor: PROFIT_COLOR, fixed: 15, remainName: "토지·취득 잔여" },
  { label: "매각액만 90억 원", summary: "90 − 70 − 15 = 5억", note: "오른쪽 끝이 10억 원 당겨집니다. 비용과 이익은 그대로이므로 남는 칸이 15억 원에서 5억 원으로 줄어듭니다.", sale: 90, cost: 70, interest: 0, fixedName: "이익", fixedColor: PROFIT_COLOR, fixed: 15, remainName: "토지·취득 잔여" },
  { label: "비용만 80억 원", summary: "100 − 80 − 15 = 5억", note: "끝은 그대로인데 비용 칸이 10억 원 늘어 이익 칸을 오른쪽으로 밉니다. 남는 칸은 같은 5억 원입니다.", sale: 100, cost: 80, interest: 0, fixedName: "이익", fixedColor: PROFIT_COLOR, fixed: 15, remainName: "토지·취득 잔여" },
  { label: "두 일이 함께", summary: "90 − 80 − 15 = −5억", note: "비용과 이익을 합치면 95억 원인데 끝은 90억 원입니다. 토지 거래가격이 음수라는 뜻이 아니라 양의 토지대금을 내면서 목표 이익까지 남길 예산이 없다는 뜻입니다.", sale: 90, cost: 80, interest: 0, fixedName: "이익", fixedColor: PROFIT_COLOR, fixed: 15, remainName: "토지·취득 잔여" },
  { label: "6개월 지연, 토지를 사기 전", summary: "100 − 72 − 15 = 13억", note: "대출 50억 원에 연 8% 단리만 더한 이자 2억 원이 비용에 붙습니다(수수료·추가 관리비·복리 제외 가정). 이익 15억 원을 고정하면 줄어드는 쪽은 토지·취득 예산입니다.", sale: 100, cost: 70, interest: 2, fixedName: "이익", fixedColor: PROFIT_COLOR, fixed: 15, remainName: "토지·취득 예산" },
  { label: "6개월 지연, 토지를 산 뒤", summary: "100 − 72 − 15 = 13억", note: "이미 토지와 취득에 15억 원을 썼다면 그 칸은 저절로 줄지 않습니다. 같은 2억 원이 이번에는 실제 남는 돈을 13억 원으로 줄입니다.", sale: 100, cost: 70, interest: 2, fixedName: "토지", fixedColor: LAND_COLOR, fixed: 15, remainName: "실제 남는 돈" },
];

const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

export default function ResidualBarViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const active = scenes.active;
  const scene = SCENES[active];

  const costEnd = scene.cost + scene.interest;
  const fixedEnd = costEnd + scene.fixed;
  const remain = scene.sale - fixedEnd;
  // 모자란 장면에서는 빨간 점선이 칸 오른쪽을 덮으므로 글자를 매각액 끝 안쪽에 둡니다.
  const fixedLabelAt = remain < 0 ? (costEnd + scene.sale) / 2 : costEnd + scene.fixed / 2;

  return (
    <VizFrame
      eyebrow="가정 바꾸기"
      title="어떤 가정이 바뀌어도 줄어드는 것은 맨 끝의 남는 칸입니다"
      description="위 막대는 매각액, 아래 막대는 먼저 뺄 돈입니다. 같은 눈금이고 단위는 억 원이며, 사업과 금액은 모두 (가정)입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="매각액과 비용, 지연을 바꿀 때 잔여 칸이 어떻게 달라지는지 보여 주는 막대"
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
          {/* 매각액 */}
          <rect x={px(0)} y={SALE_Y} width={scene.sale * UNIT} height={SALE_H} rx={3} fill={SALE_COLOR} />
          <text x={px(0) + 8} y={SALE_Y + 20} fontSize={13} fontWeight={700} fill="#ffffff">매각액 {scene.sale}억</text>
          {scene.sale < 100 && (
            <g>
              <rect x={px(scene.sale)} y={SALE_Y} width={(100 - scene.sale) * UNIT} height={SALE_H} fill="none" stroke={CHANGE_COLOR} strokeWidth={1} strokeDasharray="3 3" />
              <text x={px(95)} y={SALE_Y - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={CHANGE_COLOR}>−10억</text>
            </g>
          )}

          {/* 매각액의 끝을 아래 막대까지 내린 선 */}
          <line x1={px(scene.sale)} x2={px(scene.sale)} y1={SALE_Y} y2={COST_Y + COST_H + 6} stroke={SALE_COLOR} strokeWidth={1} strokeDasharray="2 3" />

          {/* 비용 */}
          <rect x={px(0)} y={COST_Y} width={scene.cost * UNIT} height={COST_H} fill={COST_COLOR} />
          <text x={px(0) + 8} y={COST_Y + 25} fontSize={13} fontWeight={700} fill="#ffffff">비용 {scene.cost}억</text>
          {scene.cost > 70 && (
            <text x={px(75)} y={COST_Y - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill={CHANGE_COLOR}>+10억</text>
          )}

          {/* 지연 이자 */}
          {scene.interest > 0 && (
            <g>
              <rect x={px(scene.cost)} y={COST_Y} width={scene.interest * UNIT} height={COST_H} fill={CHANGE_COLOR} />
              <text x={px(scene.cost + 1)} y={COST_Y - 7} textAnchor="middle" fontSize={12} fontWeight={700} fill={CHANGE_COLOR}>이자 +2억</text>
            </g>
          )}

          {/* 고정한 칸 */}
          <rect x={px(costEnd)} y={COST_Y} width={scene.fixed * UNIT} height={COST_H} fill={scene.fixedColor} />
          <text x={px(fixedLabelAt)} y={COST_Y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{scene.fixedName}</text>
          <text x={px(fixedLabelAt)} y={COST_Y + 32} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">15억</text>

          {/* 남는 칸 또는 모자란 칸 */}
          {remain > 0 ? (
            <rect x={px(fixedEnd)} y={COST_Y} width={remain * UNIT} height={COST_H} fill={REMAIN_COLOR} />
          ) : (
            <rect x={px(scene.sale)} y={COST_Y - 3} width={-remain * UNIT} height={COST_H + 6} fill="none" stroke={CHANGE_COLOR} strokeWidth={1.25} strokeDasharray="3 2" />
          )}
          <text
            x={px(fixedEnd > scene.sale ? fixedEnd : scene.sale)}
            y={COST_Y + COST_H + 22}
            textAnchor="end"
            fontSize={14}
            fontWeight={700}
            fill={remain > 0 ? REMAIN_COLOR : CHANGE_COLOR}
          >
            {scene.remainName} {fmt(remain)}억
          </text>

          {/* 눈금 */}
          {[0, 50, 100].map((value) => (
            <g key={value}>
              <line x1={px(value)} x2={px(value)} y1={H - 22} y2={H - 16} stroke={TEXT} strokeWidth={1} />
              <text x={px(value)} y={H - 3} textAnchor={value === 0 ? "start" : value === 100 ? "end" : "middle"} fontSize={12} fill={TEXT}>{value}</text>
            </g>
          ))}
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
