import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "같은 95km/h에서 시작합니다",
  "선을 행동 전에 정합니다",
  "사정을 사건 뒤에 판단합니다",
  "비용과 어긋남을 함께 봅니다",
] as const;

const NOTES = [
  "빙판길을 시속 95킬로미터로 달린 같은 행동도 법이 답을 구체화하는 시점에 따라 다른 판정에 이를 수 있습니다.",
  "시속 100킬로미터라는 선을 미리 정하면 운전자는 행동 전에 결과를 압니다. 대신 빙판에서도 95는 선을 넘지 않았다는 어긋남이 남습니다.",
  "안전한 속도라는 기준을 두면 판단자는 사건 뒤에 노면과 시야를 봅니다. 실제 위험에는 더 잘 맞출 수 있지만 결과를 미리 아는 비용과 사건마다 판단하는 비용이 생깁니다.",
  "반복되는 사안이 많고 고정선의 어긋남이 작으면 미리 정하는 쪽이 유리합니다. 사안마다 사정이 크게 다르면 나중에 판단하는 쪽이 유리할 수 있습니다.",
] as const;

const STEP_DATA = [
  {
    when: "같은 행동",
    rule: "빙판길 · 95km/h",
    standard: "빙판길 · 95km/h",
    resultRule: "아직 판정하지 않음",
    resultStandard: "아직 판정하지 않음",
  },
  {
    when: "행동 전",
    rule: "100km/h 선을 이미 정함",
    standard: "안전한 속도라고만 적음",
    resultRule: "95 < 100 → 위반 아님",
    resultStandard: "판정은 사건 뒤로 남음",
  },
  {
    when: "사건 뒤",
    rule: "측정값만 선과 비교",
    standard: "빙판·시야·교통량을 조사",
    resultRule: "위반 아님 · 위험은 남음",
    resultStandard: "위험했다면 위반 가능",
  },
  {
    when: "선택할 때",
    rule: "반복이 많을수록 비용 절약",
    standard: "사정 차이가 클수록 오판 감소",
    resultRule: "판단비용 ↓ · 어긋남 ↑",
    resultStandard: "판단비용 ↑ · 어긋남 ↓",
  },
] as const;

function Lane({
  title,
  timing,
  body,
  result,
  active,
}: {
  title: string;
  timing: string;
  body: string;
  result: string;
  active: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-2xl border p-4 transition-colors sm:p-5 ${
        active
          ? "border-primary/50 bg-primary/[0.06]"
          : "border-border bg-background/70"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h5 className="font-bold text-foreground">{title}</h5>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          {timing}
        </span>
      </div>
      <div className="mt-4 border-l-2 border-primary/40 pl-3">
        <p className="text-sm leading-6 text-foreground">{body}</p>
        <p className="mt-2 text-sm font-bold leading-6 text-primary">{result}</p>
      </div>
    </div>
  );
}

export default function DecisionTimingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const step = scenes.active;
  const data = STEP_DATA[step];

  return (
    <VizFrame
      documentFlow
      eyebrow="한 사건을 두 번 판정하기"
      title="같은 행동도 답을 정하는 시점에 따라 경로가 달라집니다"
      description="왼쪽은 행동 전에 선을 정하고, 오른쪽은 사건 뒤에 사정을 판단합니다."
      note="시속 100킬로미터와 빙판길은 두 방식의 차이를 드러내기 위한 가상 사례입니다. 실제 위반 여부는 적용 법령과 사실관계에 따라 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 속도 사건에서 규칙과 기준의 판정 시점을 비교하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-[36rem] py-1 sm:min-h-[27rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {step + 1} / {SCENES.length}
          </p>
          <h4 className="mt-2 text-base font-bold text-foreground">
            {SCENES[step]}
          </h4>

          <div className="mt-4 rounded-xl border border-border bg-muted/35 px-4 py-3 text-sm">
            <span className="font-bold text-muted-foreground">지금 보는 시점</span>
            <span className="ml-2 font-black text-foreground">{data.when}</span>
          </div>

          <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
            <Lane
              title="미리 선을 정한 경로"
              timing="행동 전 구체화"
              body={data.rule}
              result={data.resultRule}
              active={step === 1 || step === 3}
            />
            <Lane
              title="사건에서 사정을 보는 경로"
              timing="행동 후 구체화"
              body={data.standard}
              result={data.resultStandard}
              active={step === 2 || step === 3}
            />
          </div>

          <p className="mt-4 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
