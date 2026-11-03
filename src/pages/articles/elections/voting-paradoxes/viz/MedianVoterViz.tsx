import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: median-voter — 처음의 같은 세 표에서 위반 한 줄을 고치면 중위가 이긴다. */
const SCENES = [
  "가·나·다를 한 줄에 놓는다",
  "3번의 순서가 축을 거스른다",
  "3번의 순서 한 줄만 고친다",
  "가운데 안이 두 대결을 이긴다",
] as const;

const CONTROL_LABELS = [
  "한 줄",
  "깨진 조건",
  "한 줄 수정",
  "가운데 승리",
] as const;
const NOTES = [
  "가-나-다를 하나의 정책 축이라고 둡니다. 1번의 최고점은 가, 2번은 나, 3번은 다입니다.",
  "3번은 다를 가장 좋아하면서 바로 옆 나를 맨 아래에 둡니다. 최고점에서 멀어질수록 덜 좋아진다는 모양이 이 한 줄에서 깨집니다.",
  "3번의 순서를 다>나>가로 바꿉니다. 이제 세 사람 모두 자기 최고점에서 한 칸 멀어질 때마다 선호가 내려갑니다.",
  "나는 가를 2대 1로, 다도 2대 1로 이깁니다. 규칙은 그대로이고 들어오는 선호의 모양만 바뀌었습니다.",
] as const;

const BEFORE = [
  ["가", "나", "다"],
  ["나", "다", "가"],
  ["다", "가", "나"],
] as const;

const AFTER = [
  ["가", "나", "다"],
  ["나", "다", "가"],
  ["다", "나", "가"],
] as const;

function Axis() {
  return (
    <div className="px-3" aria-label="가 나 다 순서의 정책 축">
      <div className="relative grid grid-cols-3 pt-5">
        <div className="absolute left-[16.67%] right-[16.67%] top-[2.15rem] border-t border-border" />
        {["가", "나", "다"].map((option, index) => (
          <div key={option} className="relative flex flex-col items-center">
            <span
              className={`z-10 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-sm font-bold ${
                index === 1
                  ? "border-primary text-primary"
                  : "border-border text-foreground"
              }`}
            >
              {option}
            </span>
            <span className="mt-2 text-[11px] text-muted-foreground">
              {index === 0 ? "왼쪽" : index === 1 ? "가운데" : "오른쪽"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreferenceRows({
  rows,
  highlightThird = false,
}: {
  rows: readonly (readonly string[])[];
  highlightThird?: boolean;
}) {
  return (
    <div className="space-y-2">
      {rows.map((row, voter) => (
        <div
          key={voter}
          className={`grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-2 border p-2 ${
            highlightThird && voter === 2
              ? "border-amber-500 bg-amber-500/[0.06]"
              : "border-border bg-background"
          }`}
        >
          <span className="text-xs font-bold text-muted-foreground">
            {voter + 1}번
          </span>
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
            {row.map((option, rank) => (
              <span key={option} className="contents">
                {rank > 0 && (
                  <span className="text-muted-foreground">&gt;</span>
                )}
                <span
                  className={rank === 0 ? "text-primary" : "text-foreground"}
                >
                  {option}
                </span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MedianVoterViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200, {
    loop: false,
    autoPlay: false,
  });
  const step = scenes.active;

  return (
    <VizFrame
      className="mobile-viz-stable-height"
      eyebrow="같은 사례의 복구"
      title="규칙을 바꾸지 않고 선호의 모양을 바꿉니다"
      description="처음의 세 사람을 그대로 두고, 축을 거스르던 한 줄을 찾아 고칩니다."
      note="전제가 깨지면 안정성이 보장되지 않는다는 뜻이지, 한 사람만 어기면 언제나 순환한다는 뜻은 아닙니다. 이 사례에서는 실제로 순환합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 세 사람의 선호를 단일정점으로 고쳐 가운데 안이 이기는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-full min-w-0 flex-col overflow-hidden outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <div id={scenes.playbackId} className="min-w-0 py-1">
            <p className="text-[11px] font-black text-primary">
              장면 {step + 1} / {SCENES.length}
            </p>
            <h4 className="mt-2 text-base font-bold leading-6">
              {SCENES[step]}
            </h4>

            <div className="mt-4 space-y-5">
              <Axis />

              {step === 0 && <PreferenceRows rows={BEFORE} />}

              {step === 1 && (
                <div className="space-y-4">
                  <PreferenceRows rows={BEFORE} highlightThird />
                  <div className="grid grid-cols-3 items-center text-center text-sm">
                    <strong className="text-primary">다 · 1위</strong>
                    <strong className="text-amber-700 dark:text-amber-400">
                      나 · 3위
                    </strong>
                    <span className="text-xs leading-5 text-muted-foreground">
                      바로 옆을 건너뜀
                    </span>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] sm:items-center">
                    <div className="border border-amber-500 bg-amber-500/[0.06] p-4">
                      <p className="text-xs font-bold text-muted-foreground">
                        바꾸기 전 · 3번
                      </p>
                      <p className="mt-2 text-lg font-bold">
                        다 &gt; 가 &gt; 나
                      </p>
                    </div>
                    <span className="text-center text-xl text-muted-foreground">
                      →
                    </span>
                    <div className="border border-primary bg-primary/[0.06] p-4">
                      <p className="text-xs font-bold text-muted-foreground">
                        바꾼 뒤 · 3번
                      </p>
                      <p className="mt-2 text-lg font-bold text-primary">
                        다 &gt; 나 &gt; 가
                      </p>
                    </div>
                  </div>
                  <PreferenceRows rows={AFTER} />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border border-border bg-background p-4">
                      <p className="text-xs font-bold text-muted-foreground">
                        가 대 나
                      </p>
                      <p className="mt-2 text-base font-bold text-primary">
                        나 승 · 2대 1
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        2번과 3번이 나를 선택
                      </p>
                    </div>
                    <div className="border border-border bg-background p-4">
                      <p className="text-xs font-bold text-muted-foreground">
                        나 대 다
                      </p>
                      <p className="mt-2 text-base font-bold text-primary">
                        나 승 · 2대 1
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        1번과 2번이 나를 선택
                      </p>
                    </div>
                  </div>
                  <div className="border-l border-primary pl-4 text-sm leading-7">
                    나는 다른 두 안을 모두 이깁니다. 이제 먼저 무엇을 표결해도
                    최종 승자는 나입니다.
                  </div>
                </div>
              )}
            </div>

            <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {NOTES[step]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={CONTROL_LABELS}
          playLabel="복구 과정 재생"
        />
      </div>

      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
