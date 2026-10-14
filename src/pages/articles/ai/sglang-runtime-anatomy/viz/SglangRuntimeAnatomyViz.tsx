import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 요청 하나가 SGLang scheduler 안의 네 부품을 지나는 길을 한 장에 그린다.
 * 한 mechanism: 장부가 받아들이고, 표가 칸 번호를 잇고, GPU가 계산하는 동안 CPU는 다음 batch를 고르며, 칸이 모자라면 대기열로 되돌린다.
 */
const SCENES = ["대기열", "수용 장부", "칸 번호 표", "겹치는 실행", "되돌리기"] as const;

interface Box {
  id: string;
  label: string;
  sub: string;
}

const BOXES: readonly Box[] = [
  { id: "queue", label: "대기열", sub: "D·E·F" },
  { id: "budget", label: "수용 장부", sub: "1,201 < 1,398.1" },
  { id: "table", label: "req_to_token 표", sub: "D행: 위치 0~199 → 칸 번호" },
  { id: "gpu", label: "GPU forward", sub: "step n 계산" },
  { id: "cpu", label: "CPU", sub: "step n−1 결과 처리, step n+1 고르기" },
];

const ACTIVE: readonly (readonly string[])[] = [
  ["queue"],
  ["queue", "budget"],
  ["budget", "table"],
  ["table", "gpu", "cpu"],
  ["cpu", "queue"],
];

const NOTES = [
  "새 요청 D는 입력 200 token과 출력 상한 1,000을 들고 대기열에서 기다립니다. 아직 GPU 메모리는 한 칸도 쓰지 않았습니다.",
  "장부는 남은 칸에서 실행 중 요청의 예상 몫을 뺀 1,398.1칸과 D의 1,201칸을 비교합니다. 작으므로 D를 이번 batch에 넣습니다.",
  "D에게 표의 한 행을 주고 입력 위치마다 KV를 쓸 칸 번호를 적습니다. 칸은 한 token 단위라 번호가 연속일 필요가 없습니다.",
  "GPU가 step n을 계산하는 동안 CPU는 step n−1의 결과를 처리하고 step n+1을 고릅니다. 다음 입력 token은 GPU 버퍼에서 읽습니다.",
  "다음 decode에 쓸 칸이 모자라면 출력을 가장 적게 만든 요청을 빼서 KV를 돌려주고 대기열 앞으로 보냅니다. 장부의 비율도 다시 셉니다.",
] as const;

export default function SglangRuntimeAnatomyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const active = ACTIVE[scenes.active];

  return (
    <VizFrame
      eyebrow="SGLang scheduler"
      title="장부가 받고, 표가 칸을 잇고, CPU와 GPU가 겹쳐 돕니다"
      description="상자는 scheduler 안의 부품입니다. 진하게 칠한 상자가 이 장면에서 일하는 부품입니다."
      note="부품 이름은 고정한 SGLang 원문의 역할을 줄여 부른 것입니다. 수치는 본문 3절의 가정을 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="SGLang scheduler의 네 부품을 요청 하나가 지나는 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {BOXES.map((box, index) => {
              const on = active.includes(box.id);
              return (
                <li
                  key={box.id}
                  className={`min-w-0 border px-2.5 py-2 last:col-span-2 sm:last:col-span-1 ${on ? "border-primary bg-primary/10" : "border-border bg-muted/30"}`}
                >
                  <p className={`text-xs font-bold ${on ? "text-foreground" : "text-muted-foreground"}`}>
                    {index + 1}. {box.label}
                  </p>
                  <p className={`mt-1 break-words text-[11px] leading-4 ${on ? "text-foreground" : "text-muted-foreground"}`}>{box.sub}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 text-[11px] text-muted-foreground">5번 CPU가 고른 다음 batch와 retract한 요청은 다시 1번 대기열로 돌아갑니다.</p>

          <p className="mt-4 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4rem]">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
