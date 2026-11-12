import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #state-boundary — "PEFT는 또 다른 축입니다".
 * 행 = 무엇을 학습할지(학습 신호), 열 = 어느 parameter를 바꿀지(업데이트 범위).
 * SFT는 행, LoRA(PEFT)는 열이라 둘은 경쟁하지 않고 한 칸에서 만난다.
 * 본문이 명시한 조합은 "SFT objective × LoRA update" 하나뿐이라 나머지 칸은 평가하지 않는다.
 */
const SCENES = [
  {
    label: "첫 축: 무엇을 학습하는가",
    summary: "행 = 학습 신호",
    note: "Continued pretraining은 unlabeled corpus로 language-model objective를 이어 갑니다. SFT는 input과 원하는 response의 예시로 행동을 학습합니다. 두 행은 학습 신호가 다릅니다.",
  },
  {
    label: "둘째 축: 어느 parameter를 바꾸는가",
    summary: "열 = 업데이트 범위",
    note: "LoRA처럼 base weight 대부분을 고정하고 작은 update만 학습하는 방법을 PEFT라고 부릅니다. 이 열은 “무엇을 학습할지”가 아니라 “어느 parameter를 바꿀지”를 정합니다.",
  },
  {
    label: "두 축은 한 칸에서 만납니다",
    summary: "SFT objective × LoRA update",
    note: "그래서 SFT objective를 LoRA update로 학습할 수 있습니다. 행 하나와 열 하나를 함께 고르는 것이지, 둘 중 하나를 고르는 것이 아닙니다.",
  },
  {
    label: "SFT 대 PEFT를 한 줄에 놓으면",
    summary: "행과 열을 맞세운 비교",
    note: "SFT는 행의 이름이고 PEFT는 열의 이름입니다. 둘을 경쟁 방법처럼 한 줄에 놓으면 서로 다른 질문의 답을 비교하게 되어 판단이 흐려집니다.",
  },
] as const;

const ROWS = [
  { name: "Continued pretraining", detail: "unlabeled corpus · language-model objective" },
  { name: "SFT", detail: "input + 원하는 response 예시" },
] as const;

const COLS = [
  { name: "전체 weight 갱신", detail: "base weight 자체가 학습 대상" },
  { name: "LoRA (PEFT)", detail: "base 대부분 고정 · 작은 update만 학습" },
] as const;

const ROW_COLOR = "#2563eb";
const COL_COLOR = "#d97706";

export default function ObjectiveUpdateAxesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const labels = SCENES.map((scene) => scene.label);
  const rowsOn = active === 0 || active >= 2;
  const colsOn = active === 1 || active >= 2;

  return (
    <VizFrame
      eyebrow="Two axes"
      title="학습 신호와 업데이트 범위는 서로 다른 축입니다"
      description="행은 무엇을 학습할지, 열은 어느 parameter를 바꿀지를 정합니다. 칸 하나가 한 번의 학습 설정입니다."
      note="본문이 직접 든 조합은 SFT objective를 LoRA update로 학습하는 칸 하나입니다. 나머지 칸은 이 글이 평가하지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="학습 신호 두 행과 업데이트 범위 두 열로 만든 격자"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="break-keep text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-xs font-bold text-primary sm:text-sm">{scene.summary}</span>
            </div>
          ))}
        />

        <div className="mt-4 min-w-0" role="img" aria-label={(SCENES as readonly (typeof SCENES)[number][])[active].note}>
          <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 text-xs sm:gap-2">
            <div className="flex items-end px-1 pb-1 text-[10px] leading-4 text-muted-foreground">
              <span>
                <span style={{ color: ROW_COLOR }} className="font-bold">행</span> 무엇을 ·{" "}
                <span style={{ color: COL_COLOR }} className="font-bold">열</span> 어디를
              </span>
            </div>
            {COLS.map((col) => (
              <div
                key={col.name}
                className="min-w-0 rounded-md border px-2 py-2"
                style={{ borderColor: colsOn ? COL_COLOR : "#94a3b866" }}
              >
                <strong className="block break-keep leading-5" style={{ color: colsOn ? COL_COLOR : undefined }}>{col.name}</strong>
                <span className="mt-0.5 block break-keep text-[10px] leading-4 text-muted-foreground">{col.detail}</span>
              </div>
            ))}

            {ROWS.map((row, r) => (
              <div key={row.name} className="contents">
                <div className="min-w-0 rounded-md border px-2 py-2" style={{ borderColor: rowsOn ? ROW_COLOR : "#94a3b866" }}>
                  <strong className="block break-keep leading-5" style={{ color: rowsOn ? ROW_COLOR : undefined }}>{row.name}</strong>
                  <span className="mt-0.5 block break-keep text-[10px] leading-4 text-muted-foreground">{row.detail}</span>
                </div>
                {COLS.map((col, c) => {
                  const named = r === 1 && c === 1;
                  const lit = named && active >= 2;
                  return (
                    <div
                      key={col.name}
                      className={`flex min-h-[3.5rem] sm:min-h-[4.5rem] min-w-0 items-center justify-center rounded-md border px-2 py-2 text-center leading-5 ${
                        lit ? "border-primary bg-primary/[0.08]" : "border-dashed border-border"
                      }`}
                    >
                      {named ? (
                        <span className={lit ? "font-bold text-foreground" : "text-muted-foreground"}>
                          SFT objective
                          <br />× LoRA update
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/70">이 글은 평가하지 않음</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-3 grid min-h-[3.25rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-md border border-border px-3 py-2 text-xs leading-5">
            {active === 3 ? (
              <>
                <span className="font-mono font-bold">
                  <span style={{ color: ROW_COLOR }}>SFT</span>
                  <span className="mx-1 text-red-600 line-through">vs</span>
                  <span style={{ color: COL_COLOR }}>PEFT</span>
                </span>
                <span className="text-muted-foreground">행 이름과 열 이름을 경쟁 방법처럼 맞세우면 서로 다른 질문의 답을 비교하게 되어 판단이 흐려집니다.</span>
              </>
            ) : (
              <>
                <span className="font-bold">RAG</span>
                <span className="text-muted-foreground">요청 시점의 context를 바꾸므로 weight를 바꾸는 이 격자 밖에 있습니다.</span>
              </>
            )}
          </div>
        </div>

        <StableSceneStack
          active={active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
