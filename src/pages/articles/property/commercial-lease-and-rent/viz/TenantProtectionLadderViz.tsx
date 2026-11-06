import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #source — 계약서 → 인도·등록 신청 → 확정일자 → 배당 재원으로 요건이 쌓일 때 무엇이 새로 생기고 무엇이 아직 아닌지.
 * 조항과 요건은 본문이 인용한 한국 상가건물 임대차보호법 제3조·제5조 범위 안에서만 씁니다.
 */
const RUNGS = [
  { need: "계약서 서명", gets: "이것만으로는 요건 부족" },
  { need: "+ 건물 인도 · 사업자등록 신청", gets: "다음 날부터 대항력 (제3조)" },
  { need: "+ 확정일자 · 법의 적용 범위 확인", gets: "우선변제권 (제5조)" },
  { need: "남는 변수: 선순위 권리 · 실제 배당 재원", gets: "3천만 원 전액 회수 여부" },
] as const;

const SCENES = [
  { label: "계약서만 있을 때", summary: "요건 부족", note: "건물 소유자가 바뀌면 새 소유자에게 임대차를 주장할 수 있는지가 문제입니다. 계약서에 서명했다는 사실만으로는 효력 요건이 모두 갖춰지지 않습니다." },
  { label: "인도와 등록 신청", summary: "다음 날부터 대항력", note: "대항력은 제3자에게 임대차의 효력을 주장할 수 있는 힘입니다. 건물을 넘겨받은 사람은 임대인의 지위를 승계합니다." },
  { label: "확정일자를 더하면", summary: "우선변제권은 별도 요건", note: "확정일자는 관할 세무서장이 임대차계약서에 받아 두는 날짜입니다. 우선변제권은 경매·공매에서 후순위 권리자나 다른 채권자보다 먼저 받을 권리입니다. 대항력이 있다는 사실만으로 제5조가 적용되지는 않습니다." },
  { label: "그래도 남는 것", summary: "전액 회수는 보장 아님", note: "앞의 요건을 갖춰도 3천만 원을 전부 받을지는 선순위 권리와 실제 배당 재원에 달려 있습니다." },
] as const;

export default function TenantProtectionLadderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;

  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="요건 쌓기"
      title="요건이 하나씩 쌓일 때 무엇이 새로 생길까요"
      description="위에서 아래로 요건이 더해집니다. 아래 칸의 결과에는 위 칸의 요건도 그대로 필요합니다."
      note="한국 상가건물 임대차보호법 기준이며 3천만 원은 이 글의 (가정)입니다. 개별 점포의 적용 여부나 배당액을 판정한 그림이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="계약서, 인도와 등록 신청, 확정일자, 배당 재원 순으로 요건과 결과를 쌓는 과정"
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
        <ol className="mx-auto mt-4 w-full max-w-[620px] space-y-2">
          {RUNGS.map((rung, index) => {
            const state = index === active ? "now" : index < active ? "done" : "later";
            return (
              <li
                key={rung.need}
                aria-current={state === "now" ? "step" : undefined}
                className={`grid gap-x-3 gap-y-1 rounded-lg border px-3 py-2.5 text-sm transition-colors sm:grid-cols-[1fr_auto_1fr] sm:items-center ${
                  state === "now"
                    ? "border-primary bg-primary/10"
                    : state === "done"
                      ? "border-border bg-background"
                      : "border-dashed border-border/70 text-muted-foreground/60"
                }`}
              >
                <span className="font-medium">{rung.need}</span>
                <span aria-hidden className="hidden text-muted-foreground sm:block">→</span>
                <span className={state === "now" ? "font-bold text-primary" : state === "done" ? "font-semibold" : ""}>
                  <span aria-hidden className="sm:hidden">→ </span>
                  {rung.gets}
                </span>
              </li>
            );
          })}
        </ol>
        <StableSceneStack
          active={active}
          className="mt-4"
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
