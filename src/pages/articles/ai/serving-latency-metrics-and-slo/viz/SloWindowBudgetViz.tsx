import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 하루 288개의 5분 구간을 12행(2시간) × 24열(5분)로 그리고, 구간마다 P95 TTFT ≤ 1.5초 통과·실패·누락을 칠한다.
 * 한 mechanism: 판정 단위는 요청이 아니라 구간 한 칸이고, 허용 실패는 floor(288 × 0.01) = 2칸이다.
 */
const TOTAL = 288;
const COLS = 24;
const ROWS = TOTAL / COLS;
const BUDGET = Math.floor(TOTAL * 0.01);

const NINE = 108; // 9시 00분 구간: 9절의 P95 1.45초
const FAILS = [158, 236, 271]; // 13:10, 19:40, 22:35 (설명용 위치)
const MISSING = [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]; // 3:20~4:05 수집 중단 (설명용 위치)
const LIGHT = 30; // 요청 1개 구간 (설명용 위치)
const HEAVY = 210; // 요청 10,000개 구간 (설명용 위치)

type State = "pass" | "fail" | "missing";

interface Scene {
  label: string;
  fails: number;
  missing: boolean;
  votes: boolean;
  verdict: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "실패 0", fails: 0, missing: false, votes: false, verdict: "달성", note: "모든 칸이 통과입니다. 표시한 칸이 9절의 구간이며 P95 1.45초가 1.5초 이하라 통과로 칠합니다." },
  { label: "실패 2", fails: 2, missing: false, votes: false, verdict: "달성 · 2/288 ≈ 0.6944%", note: "실패 칸 2개가 허용 칸 2개를 정확히 채웁니다. 1% 이내라 하루 목표를 지킵니다." },
  { label: "실패 3", fails: 3, missing: false, votes: false, verdict: "초과 · 3/288 ≈ 1.0417%", note: "세 번째 실패 칸은 허용 칸에 들어갈 자리가 없어 넘칩니다. 하루 99% 목표를 지키지 못합니다." },
  { label: "누락 10", fails: 0, missing: true, votes: false, verdict: "달성 미확인", note: "점선 빈칸 10개는 측정이 빠진 구간입니다. 나머지 278칸이 모두 통과해도 분모는 그대로 288이라 달성을 선언하지 않습니다." },
  { label: "구간마다 한 표", fails: 0, missing: false, votes: true, verdict: "칸 하나 = 한 표", note: "요청 1개인 칸과 10,000개인 칸이 똑같이 한 칸으로 셉니다. 전체 요청의 95%를 묻는 약속과는 다른 집계입니다." },
];

const PASS_COLOR = "#93c5fd";
const FAIL_COLOR = "#f97316";
const OVER_COLOR = "#dc2626";

export default function SloWindowBudgetViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const failSet = new Set(FAILS.slice(0, scene.fails));
  const missSet = new Set(scene.missing ? MISSING : []);
  const stateOf = (i: number): State => (failSet.has(i) ? "fail" : missSet.has(i) ? "missing" : "pass");
  const passed = TOTAL - failSet.size - missSet.size;
  const over = Math.max(0, scene.fails - BUDGET);

  return (
    <VizFrame
      eyebrow="Window budget"
      title="하루 288칸 중 실패는 2칸까지 담을 수 있습니다"
      description="칸 하나가 5분 구간 하나입니다. 한 줄이 2시간(24칸), 위에서 아래로 0시부터 24시까지입니다. 파랑은 P95 TTFT ≤ 1.5초 통과, 주황은 실패, 점선 빈칸은 측정 누락입니다."
      note="칸의 위치는 설명용 배치입니다. 288칸·허용 2칸·10칸 누락은 본문 12~13절의 가정 숫자입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="하루 288개 5분 구간의 SLO 통과와 허용 실패"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9.5rem]">
            <div className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-1.5">
              <div className="grid gap-[2px]" style={{ gridTemplateRows: `repeat(${ROWS}, minmax(0,1fr))` }}>
                {Array.from({ length: ROWS }, (_, r) => (
                  <span key={r} className="flex items-center font-mono text-[9px] text-muted-foreground">
                    {r * 2}시
                  </span>
                ))}
              </div>
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))` }} aria-label={`통과 ${passed}칸`}>
                {Array.from({ length: TOTAL }, (_, i) => {
                  const state = stateOf(i);
                  const isNew = state !== "pass";
                  const overflow = state === "fail" && FAILS.indexOf(i) >= BUDGET;
                  const marked = (scenes.active === 0 && i === NINE) || (scene.votes && (i === LIGHT || i === HEAVY));
                  const bg = state === "fail" ? (overflow ? OVER_COLOR : FAIL_COLOR) : state === "missing" ? "transparent" : PASS_COLOR;
                  return (
                    <motion.span
                      key={i}
                      className="relative aspect-square rounded-[2px]"
                      style={{
                        backgroundColor: bg,
                        border: state === "missing" ? "1px dashed #64748b" : undefined,
                        outline: marked ? "1.25px solid #0f172a" : undefined,
                        outlineOffset: marked ? 1 : 0,
                      }}
                      initial={isNew ? { scale: 0.4, opacity: 0.4 } : false}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: reduced ? 0 : 0.2 + (FAILS.indexOf(i) >= 0 ? FAILS.indexOf(i) * 0.35 : 0), duration: reduced ? 0 : 0.3 }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 space-y-3 text-xs">
              <div>
                <p className="font-bold text-muted-foreground">허용 실패 floor(288×0.01)</p>
                <div className="mt-1.5 flex gap-1">
                  {Array.from({ length: BUDGET }, (_, b) => (
                    <span
                      key={b}
                      className="flex h-7 w-9 items-center justify-center rounded-sm border text-[11px] font-bold"
                      style={b < scene.fails ? { backgroundColor: FAIL_COLOR, borderColor: FAIL_COLOR, color: "#fff" } : { borderColor: "#94a3b8", borderStyle: "dashed" }}
                    >
                      {b < scene.fails ? "실패" : ""}
                    </span>
                  ))}
                  <span
                    className="flex h-7 w-9 items-center justify-center rounded-sm text-[11px] font-bold"
                    style={over ? { backgroundColor: OVER_COLOR, color: "#fff" } : { color: "transparent" }}
                  >
                    +{over}
                  </span>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono sm:grid-cols-1">
                <div>
                  <dt className="text-muted-foreground">통과 · 실패 · 누락</dt>
                  <dd className="font-bold text-foreground">
                    {passed} · {failSet.size} · {missSet.size}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">분모</dt>
                  <dd className="font-bold text-foreground">{TOTAL}칸</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-muted-foreground">판정</dt>
                  <dd className="font-bold" style={{ color: over ? OVER_COLOR : scene.missing ? "#64748b" : "#2563eb" }}>
                    {scene.verdict}
                  </dd>
                </div>
              </dl>
              <p className={`text-[11px] leading-5 ${scene.votes ? "text-foreground" : "text-transparent"}`} aria-hidden={!scene.votes}>
                테두리 칸: 왼쪽 위 요청 1개 · 오른쪽 아래 요청 10,000개
              </p>
            </div>
          </div>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
