import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: ModernArticle #execution-profile — T=2에 6p=78을 더하면 80이 되고,
 * 80의 낮은 4 bit가 0이라 16으로 나누는 일이 shift가 됩니다. 출력 때는 5+7×13=96 → 6.
 * 칸 하나 = 1 bit, 설명용 word 폭 w=4이므로 8칸 = 높은 word 4칸 + 낮은 word 4칸.
 */
const P = 13;
const R = 16;
const N_PRIME = 11;

const SCENES = [
  {
    label: "넓은 곱 T",
    summary: "T = 2 × 1 = 2",
    t: 2,
    stage: 0,
    note: "칸 하나가 1 bit입니다. 설명용 word 폭이 4 bit라 오른쪽 네 칸이 낮은 word, 왼쪽 네 칸이 높은 word입니다. T=2는 낮은 word에 1이 남아 있어 16으로 나누면 나머지가 생깁니다.",
  },
  {
    label: "p의 배수 고르기",
    summary: "m = (2 × 11) mod 16 = 6",
    t: 2,
    stage: 1,
    note: "소거 상수 N′=11을 T의 낮은 word에 곱해 m=6을 고르고 m·p=6×13=78을 준비합니다. 78은 13의 배수라 mod 13으로는 0입니다.",
  },
  {
    label: "더하면 낮은 word가 0",
    summary: "2 + 78 = 80",
    t: 2,
    stage: 2,
    note: "낮은 word끼리 0010+1110을 더하면 16이 되어 올림 1이 높은 word로 넘어가고 낮은 네 칸은 모두 0이 됩니다. mod 13 값은 T와 같은 2입니다.",
  },
  {
    label: "낮은 word 버리기",
    summary: "80 ÷ 16 = 5",
    t: 2,
    stage: 3,
    note: "R=16=2⁴로 나누는 일은 낮은 네 칸을 버리고 높은 word를 오른쪽으로 옮기는 shift입니다. 5<13이라 p를 뺄 필요가 없고, 5는 6의 Montgomery 표현입니다(6×16 mod 13=5).",
  },
  {
    label: "출력 때 한 번 더",
    summary: "(5 + 7 × 13) ÷ 16 = 6",
    t: 5,
    stage: 3,
    note: "출력 경계에서 같은 소거를 한 번 더 합니다. m=(5×11) mod 16=7, 5+91=96이고 낮은 네 칸이 다시 0이 되어 shift 결과 6이 공개 정수입니다.",
  },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

const ONE = "#2563eb";
const DROP = "#dc2626";

function bitsOf(value: number) {
  return Array.from({ length: 8 }, (_, i) => (value >> (7 - i)) & 1);
}

function BitRow({
  label,
  value,
  visible,
  lowState,
  right,
}: {
  label: string;
  value: number;
  visible: boolean;
  lowState: "plain" | "zero" | "dropped";
  right: string;
}) {
  const bits = bitsOf(value);
  return (
    <div
      className={`grid grid-cols-[4.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 sm:grid-cols-[6rem_minmax(0,1fr)_5rem] ${
        visible ? "" : "opacity-15"
      }`}
    >
      <span className="break-keep text-[11px] font-bold leading-4 sm:text-xs">{label}</span>
      <div className="grid min-w-0 grid-cols-[repeat(4,minmax(0,1fr))_0.5rem_repeat(4,minmax(0,1fr))] gap-0.5 sm:gap-1">
        {bits.flatMap((bit, index) => {
          const low = index >= 4;
          const dropped = low && lowState === "dropped";
          const zeroed = low && lowState === "zero";
          return [
            ...(index === 4 ? [<span key="gap" aria-hidden />] : []),
            <span
              key={index}
              className={`flex h-6 min-w-0 sm:h-7 items-center justify-center rounded-sm border font-mono text-xs ${
                dropped
                  ? "border-dashed border-red-600 text-red-700 line-through dark:text-red-400"
                  : zeroed
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                    : "border-border"
              }`}
              style={bit === 1 && !dropped ? { backgroundColor: ONE, color: "#ffffff", borderColor: ONE } : undefined}
            >
              {bit}
            </span>,
          ];
        })}
      </div>
      <span className="text-right font-mono text-[11px] leading-4 sm:text-xs">{right}</span>
    </div>
  );
}

export default function LowWordShiftViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const m = ((scene.t % R) * N_PRIME) % R;
  const mp = m * P;
  const sum = scene.t + mp;
  const shifted = sum / R;
  const outputScene = scenes.active === SCENES.length - 1;

  return (
    <VizFrame
      eyebrow="bit 칸으로 보는 reduction"
      title="16으로 나누기는 낮은 4 bit를 버리는 일입니다"
      description="설명용 4-bit word 두 개(8칸)에 T, m·p, 그 합을 적어 낮은 word가 0이 되는 과정을 셉니다. 오른쪽 칸은 십진값과 mod 13 값입니다."
      note="실제 arkworks는 64-bit word 여러 개에서 이 소거를 word마다 carry와 함께 반복합니다. 8칸은 같은 관계를 손으로 세기 위한 축소입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="T에 p의 배수를 더해 낮은 word를 0으로 만들고 shift하는 과정"
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
        <div className="mt-3 min-w-0 space-y-1.5 sm:mt-4 sm:space-y-2">
          <div className="grid grid-cols-[4.25rem_minmax(0,1fr)_3.25rem] gap-2 text-[10px] text-muted-foreground sm:grid-cols-[6rem_minmax(0,1fr)_5rem] sm:text-xs">
            <span />
            <div className="grid grid-cols-[minmax(0,1fr)_0.5rem_minmax(0,1fr)] text-center">
              <span>높은 word</span>
              <span />
              <span>낮은 word</span>
            </div>
            <span className="text-right">값 · mod 13</span>
          </div>
          <BitRow
            label={outputScene ? "내부 결과" : "T"}
            value={scene.t}
            visible
            lowState="plain"
            right={`${scene.t} · ${scene.t % P}`}
          />
          <BitRow
            label={`+ m·p (m=${m})`}
            value={mp}
            visible={scene.stage >= 1}
            lowState="plain"
            right={`${mp} · ${mp % P}`}
          />
          <BitRow
            label="= 합"
            value={sum}
            visible={scene.stage >= 2}
            lowState={scene.stage >= 3 ? "dropped" : "zero"}
            right={`${sum} · ${sum % P}`}
          />
          <div className="border-t border-border pt-2">
            <BitRow
              label="÷ 16 (shift)"
              value={shifted}
              visible={scene.stage >= 3}
              lowState="plain"
              right={`${shifted} ${shifted < P ? "< 13" : "≥ 13"}`}
            />
          </div>
          <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-muted-foreground sm:text-xs">
            <span>
              <span className="mr-1 inline-block h-3 w-3 rounded-sm align-middle" style={{ backgroundColor: ONE }} />
              1인 bit
            </span>
            <span>
              <span className="mr-1 inline-block h-3 w-3 rounded-sm border border-emerald-600 align-middle" />
              0이 된 낮은 word
            </span>
            <span>
              <span className="mr-1 inline-block h-3 w-3 rounded-sm border border-dashed align-middle" style={{ borderColor: DROP }} />
              버리는 칸
            </span>
          </p>
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-3 sm:mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-7">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
