import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 step 안에서 사진 입력을 고르는 의사코드를 한 줄씩 실행한다.
 * 상태는 남은 encoder 계산 예산, encoder cache 자리, 요청별 결과 세 가지다.
 * 사진 하나는 embedding 1,369개, 예산과 cache는 모두 8,192로 둔다(가정).
 */
const SCENES = ["R1 · 사진 P", "R2 · 같은 P", "R3~R6 · Q R S T", "R7 · 사진 U", "다음 step · U"] as const;


const CODE = [
  "for item in 사진들 ∩ 이번 계산 범위:",
  "  if item.hash in 이번 step 선택: continue",
  "  if cache.has(item.hash): 참조 추가; continue",
  "  if not can_allocate(예산, 자리):",
  "    new = item.start − computed if computed < item.start else 0; break",
  "  예산 −= item.embeds; 선택에 추가",
] as const;

interface State {
  ran: readonly number[];
  decided: number;
  budget: number;
  cacheUsed: number;
  cacheItems: string;
  results: readonly string[];
  note: string;
}

const REQUESTS = ["R1 P", "R2 P", "R3 Q", "R4 R", "R5 S", "R6 T", "R7 U"] as const;

const STATES: readonly State[] = [
  {
    ran: [0, 1, 2, 3, 5],
    decided: 5,
    budget: 6823,
    cacheUsed: 1369,
    cacheItems: "P(R1)",
    results: ["encode", "", "", "", "", "", ""],
    note: "R1은 앞 1,376 token을 prefix cache에서 찾아 30 token만 계산하지만, 그중 9칸이 사진 P입니다. P가 cache에 없어 사진 전체 1,369를 빼고 예산은 6,823입니다.",
  },
  {
    ran: [0, 1, 2],
    decided: 2,
    budget: 6823,
    cacheUsed: 1369,
    cacheItems: "P(R1,R2)",
    results: ["encode", "재사용", "", "", "", "", ""],
    note: "R2의 P는 이미 자리를 잡아 둔 같은 hash입니다. 참조만 추가하고 예산은 그대로 6,823입니다.",
  },
  {
    ran: [0, 1, 2, 3, 5],
    decided: 5,
    budget: 1347,
    cacheUsed: 6845,
    cacheItems: "P Q R S T",
    results: ["encode", "재사용", "encode", "encode", "encode", "encode", ""],
    note: "서로 다른 사진 네 장이 1,369씩 가져가 예산은 6,823−4×1,369=1,347, cache는 5×1,369=6,845칸을 씁니다.",
  },
  {
    ran: [0, 1, 2, 3, 4],
    decided: 4,
    budget: 1347,
    cacheUsed: 6845,
    cacheItems: "P Q R S T",
    results: ["encode", "재사용", "encode", "encode", "encode", "encode", "0 token"],
    note: "U의 1,369는 남은 예산 1,347보다 큽니다. 계산 시작점 1,376이 사진 시작 16보다 뒤라 R7은 이번 step에 0 token입니다. text 예산은 210만 썼습니다.",
  },
  {
    ran: [0, 1, 2, 3, 5],
    decided: 3,
    budget: 6823,
    cacheUsed: 6845,
    cacheItems: "Q R S T U",
    results: ["decode", "decode", "decode", "decode", "decode", "decode", "encode"],
    note: "예산은 다시 8,192입니다. R1·R2가 사진 구간을 KV에 다 써서 P의 참조가 0이 됐으므로, 빈 자리 1,347이 모자라도 P를 지우고 U를 넣습니다.",
  },
];

const FULL = 8192;

export default function EncoderScheduleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];

  return (
    <VizFrame
      eyebrow="Encoder budget step"
      title="encoder 예산이 다 차면 사진 앞까지만 진행합니다"
      description="위는 사진 입력을 고르는 의사코드이고, 배경을 칠한 줄이 이번 장면의 결과를 정한 줄, 진한 글씨가 지나온 줄입니다. 아래는 예산과 cache 상태입니다."
      note="일곱 요청 모두 앞 1,376 token을 prefix cache에서 찾고 30 token만 남은 상태입니다. 예산·cache 8,192와 순서는 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="encoder 예산과 cache 상태"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-3 space-y-0.5 border-l border-border pl-3 font-mono text-[11px] leading-[1.15rem]">
            {CODE.map((line, index) => (
              <li
                key={line}
                className={
                  index === state.decided
                    ? "bg-primary/10 font-bold text-foreground"
                    : state.ran.includes(index)
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                }
              >
                <span className="mr-2 text-primary">{index + 1}</span>
                <span className="whitespace-pre-wrap break-keep">{line}</span>
              </li>
            ))}
          </ol>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:gap-4">
            <div>
              <div className="flex justify-between gap-3">
                <span className="font-bold text-foreground">남은 encoder 예산</span>
                <span className="font-mono text-muted-foreground">{state.budget.toLocaleString()} / 8,192</span>
              </div>
              <div className="mt-1 h-3 rounded-sm bg-muted/60">
                <div className="h-full rounded-sm bg-[#0d9488] transition-[width] duration-500" style={{ width: `${(state.budget / FULL) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between gap-3">
                <span className="font-bold text-foreground">encoder cache 사용</span>
                <span className="font-mono text-muted-foreground">{state.cacheUsed.toLocaleString()} · {state.cacheItems}</span>
              </div>
              <div className="mt-1 h-3 rounded-sm bg-muted/60">
                <div className="h-full rounded-sm bg-[#d97706] transition-[width] duration-500" style={{ width: `${(state.cacheUsed / FULL) * 100}%` }} />
              </div>
            </div>
          </div>

          <ul className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[11px] sm:grid-cols-7">
            {REQUESTS.map((request, index) => (
              <li
                key={request}
                className={`border px-1 py-1 ${state.results[index] ? "border-primary/50 bg-primary/5 text-foreground" : "border-border text-muted-foreground"}`}
              >
                <span className="block font-bold">{request}</span>
                <span className="block min-h-[1rem]">{state.results[index] || "대기"}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 min-h-[8.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
