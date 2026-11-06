import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — 환산보증금을 지역별 기준액과 비교하고, 넘으면 어떤 조항이 남고 빠지는지.
 * 환산보증금 = 보증금 + 월세 × 100. 기준액은 2026-07-01 시행 시행령 제2조, 조항 목록은 법 제2조 제3항으로 본문과 같습니다.
 */
const REGIONS = [
  { name: "서울특별시", limit: 9, text: "9억" },
  { name: "과밀억제권역(서울 제외)·부산광역시", limit: 6.9, text: "6억9천" },
  { name: "광역시 등", limit: 5.4, text: "5억4천" },
  { name: "그 밖의 지역", limit: 3.7, text: "3억7천" },
] as const;

const W = 340;
const LEFT = 8;
const RIGHT = 14;
const TOP = 24;
const ROW = 44;
const BAR = 12;
const H = TOP + ROW * REGIONS.length + 24;
const V_MAX = 11;

const px = (v: number) => LEFT + (v / V_MAX) * (W - LEFT - RIGHT);

const BAR_COLOR = "#94a3b8";
const TEXT_COLOR = "#64748b";
const CASE_COLOR = "#2563eb";
const OVER_COLOR = "#dc2626";

const SCENES = [
  { label: "이 글의 사례", summary: "3천만 + 200만 × 100 = 2억3천만", note: "막대 끝이 지역별 기준액입니다. 2억3천만 원은 어느 막대에서도 끝을 넘지 않으므로 어느 지역에서도 기준 안에 듭니다." },
  { label: "기준을 넘는 사례", summary: "1억 + 900만 × 100 = 10억", note: "서울에서 보증금 1억 원, 월세 900만 원(가정)이면 10억 원으로 서울 기준 9억 원을 넘습니다. 보증금만 보면 넘지 않을 금액입니다." },
  { label: "넘으면 달라지는 것", summary: "남는 조항과 빠지는 조항", note: "기준을 넘어도 법 전체가 사라지지 않습니다. 제2조 제3항이 나열한 조항은 그대로 적용되고, 목록에 없는 조항은 적용되지 않습니다." },
] as const;

const KEPT = ["제3조 대항력", "제10조 제1·2·3항 본문 갱신요구", "제10조의2~제10조의9 (권리금 회수 기회 보호 포함)", "제11조의2", "제19조"] as const;
const DROPPED = ["제5조 우선변제권", "제11조 증액 제한"] as const;

function ThresholdChart({ value, label, color, focusFirstOnly }: { value: number; label: string; color: string; focusFirstOnly: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`환산보증금 ${label}과 지역별 기준액 비교`}>
      <text x={Math.min(px(value), W - RIGHT)} y={14} textAnchor={value > 5 ? "end" : "middle"} fontSize={13} fontWeight={700} fill={color}>{label}</text>
      {REGIONS.map((region, index) => {
        const y = TOP + ROW * index;
        const dim = focusFirstOnly && index > 0;
        return (
          <g key={region.name} opacity={dim ? 0.3 : 1}>
            <text x={LEFT} y={y + 14} fontSize={13} fill={TEXT_COLOR}>{region.name} <tspan fontWeight={700}>{region.text}</tspan></text>
            <rect x={px(0)} y={y + 20} width={px(region.limit) - px(0)} height={BAR} fill={BAR_COLOR} opacity={0.35} stroke={BAR_COLOR} strokeWidth={1} />
            {!dim && <line x1={px(value)} x2={px(value)} y1={y + 16} y2={y + 20 + BAR + 4} stroke={color} strokeWidth={1.25} />}
          </g>
        );
      })}
      {[0, 5, 10].map((v) => (
        <text key={v} x={px(v)} y={H - 6} textAnchor="middle" fontSize={12} fill={TEXT_COLOR}>{v === 0 ? "0" : `${v}억`}</text>
      ))}
    </svg>
  );
}

export default function ConvertedDepositThresholdViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="적용 범위"
      title="월세까지 넣은 금액이 지역 기준선을 넘으면 무엇이 달라질까요"
      description="월세에 100을 곱해 보증금에 더한 금액을 지역별 기준액과 비교합니다. 이 합계를 환산보증금이라고 부릅니다."
      note="기준액은 2026-07-01 시행 시행령 제2조이며 2026-10-09에 확인했습니다. 개별 점포의 적용 여부를 판정한 그림이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="환산보증금을 지역별 기준액과 비교하고 기준을 넘을 때 남는 조항과 빠지는 조항을 보는 과정"
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
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={[
            <ThresholdChart key="case" value={2.3} label="2억3천만" color={CASE_COLOR} focusFirstOnly={false} />,
            <ThresholdChart key="over" value={10} label="10억" color={OVER_COLOR} focusFirstOnly />,
            <div key="split" className="mx-auto grid w-full max-w-[620px] gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background px-3 py-2.5">
                <p className="font-bold">그대로 적용</p>
                <ul className="mt-2 space-y-1.5">
                  {KEPT.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border border-dashed border-red-600 px-3 py-2.5">
                <p className="font-bold text-red-700 dark:text-red-400">적용되지 않음</p>
                <ul className="mt-2 space-y-1.5">
                  {DROPPED.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>,
          ]}
        />
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
