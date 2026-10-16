import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 3절의 다섯 도착(1.000·1.040·1.085·1.285·1.327초)을 첫 도착 뒤 경과 ms 축에 찍는다.
 * 한 mechanism: 간격 칸의 폭이 곧 기다린 시간이다. 평균으로 펴면 200ms 칸이 사라지고,
 * 1·1·3개 묶음으로 받으면 관측 가능한 간격 칸 자체가 2개(40·287)로 줄어든다.
 */
const SPAN = 327; // 첫 도착(1.000초)부터 마지막 도착(1.327초)까지 ms

interface Event {
  at: number; // 첫 도착 뒤 ms
  tokens: number;
}

interface Scene {
  label: string;
  events: readonly Event[];
  showGaps: boolean;
  ghost: boolean; // 실제 기록의 도착 점을 흐리게 겹쳐 둠
  note: string;
}

const REAL: readonly Event[] = [0, 40, 85, 285, 327].map((at) => ({ at, tokens: 1 }));
const FLAT: readonly Event[] = [0, 81.75, 163.5, 245.25, 327].map((at) => ({ at, tokens: 1 }));
const BUNDLED: readonly Event[] = [
  { at: 0, tokens: 1 },
  { at: 40, tokens: 1 },
  { at: 327, tokens: 3 },
];

const SCENES: readonly Scene[] = [
  {
    label: "다섯 번의 도착",
    events: REAL,
    showGaps: false,
    ghost: false,
    note: "보낸 뒤 1초에 첫 토큰이 보이고, 그 뒤로 네 번 더 도착합니다. 축은 첫 도착을 0으로 둔 경과 ms이며 마지막 도착은 327ms 뒤입니다.",
  },
  {
    label: "간격 네 칸",
    events: REAL,
    showGaps: true,
    ghost: false,
    note: "이웃한 도착 사이를 칸으로 채우면 40·45·200·42ms 네 칸이 생깁니다. 칸 폭이 기다린 시간이라 세 번째 칸 하나가 나머지 셋을 합친 것보다 깁니다.",
  },
  {
    label: "평균 81.75로 펴면",
    events: FLAT,
    showGaps: true,
    ghost: true,
    note: "같은 327ms를 네 칸에 똑같이 나누면 칸마다 81.75ms입니다. 평균은 같지만 200ms 멈춤은 그림에서 사라집니다. 흐린 점이 실제 도착 위치입니다.",
  },
  {
    label: "1·1·3개 묶음으로 받으면",
    events: BUNDLED,
    showGaps: true,
    ghost: false,
    note: "마지막 세 토큰이 327ms에 한 이벤트로 오면 측정할 수 있는 간격은 40·287ms 두 칸뿐입니다. 토큰은 여전히 5개지만 그 안의 실제 간격은 기록에 남지 않습니다.",
  },
];

const pct = (ms: number) => `${(ms / SPAN) * 100}%`;
const fmt = (ms: number) => (Number.isInteger(ms) ? String(ms) : ms.toFixed(2));

export default function TokenArrivalGapsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dur = reduced ? 0 : 0.5;
  const gaps = scene.events.slice(1).map((e, i) => ({ from: scene.events[i].at, to: e.at }));
  const tokenCount = scene.events.reduce((sum, e) => sum + e.tokens, 0);
  const longest = gaps.length ? Math.max(...gaps.map((g) => g.to - g.from)) : 0;

  return (
    <VizFrame
      eyebrow="Arrival gaps"
      title="간격 칸의 폭이 기다린 시간이고, 평균과 묶음 수신은 그 칸을 바꿉니다"
      description="가로축은 첫 토큰이 도착한 뒤 지난 ms입니다. 점은 수신 이벤트, 점 아래 숫자는 그 이벤트에 든 토큰 수, 점 사이 칸은 관측한 간격입니다."
      note="도착 시각은 본문 3절의 설명용 가정입니다. 묶음 수신은 10절의 1·1.040·1.327초 사례와 같습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="토큰 도착 시각과 간격"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          {/* 도착 점 */}
          <p className="mt-4 text-[11px] font-bold text-muted-foreground">수신 이벤트 · 토큰 수</p>
          <div className="relative mx-3 mt-2 h-12">
            <div className="absolute inset-x-0 top-3 border-t border-border" />
            {scene.ghost
              ? REAL.map((e) => (
                  <span
                    key={`g${e.at}`}
                    aria-hidden
                    className="absolute top-1.5 size-3 -translate-x-1/2 rounded-full border border-dashed border-[#94a3b8]"
                    style={{ left: pct(e.at) }}
                  />
                ))
              : null}
            {scene.events.map((e, i) => (
              <motion.div
                key={`e${i}`}
                className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
                initial={false}
                animate={{ left: pct(e.at) }}
                transition={{ duration: dur }}
              >
                <span className="size-6 rounded-full border border-[#2563eb] bg-[#2563eb] text-center font-mono text-[11px] font-bold leading-6 text-white">
                  {e.tokens}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 간격 칸 */}
          <p className="mt-1 text-[11px] font-bold text-muted-foreground">관측한 간격 (ms)</p>
          <div className="relative mx-3 mt-2 h-9">
            {scene.showGaps
              ? gaps.map((g, i) => {
                  const w = g.to - g.from;
                  const long = w === longest && w >= 200;
                  return (
                    <motion.div
                      key={`gap${i}`}
                      className={`absolute top-0 flex h-9 items-center justify-center overflow-hidden rounded-sm border font-mono text-[11px] font-bold ${
                        long ? "border-[#ea580c] bg-[#ffedd5] text-[#9a3412]" : "border-[#93c5fd] bg-[#dbeafe] text-[#1e3a8a]"
                      }`}
                      initial={false}
                      animate={{ left: pct(g.from), width: pct(w) }}
                      transition={{ duration: dur }}
                    >
                      {fmt(w)}
                    </motion.div>
                  );
                })
              : (
                <div className="flex h-9 items-center justify-center rounded-sm border border-dashed border-border text-[11px] text-muted-foreground">
                  아직 칸을 채우지 않음
                </div>
              )}
          </div>

          {/* 눈금 */}
          <div className="relative mx-3 mt-1 h-4 font-mono text-[10px] text-muted-foreground">
            {[0, 100, 200, 300].map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: pct(t) }}>
                {t}
              </span>
            ))}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">수신 이벤트</dt>
              <dd className="font-bold">{scene.events.length}번</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">토큰</dt>
              <dd className="font-bold">{tokenCount}개</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">간격 칸</dt>
              <dd className="font-bold">{scene.showGaps ? `${gaps.length}칸 · 합 ${SPAN}` : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">가장 긴 칸</dt>
              <dd className={`font-bold ${longest >= 200 && scene.showGaps ? "text-[#c2410c]" : ""}`}>{scene.showGaps ? `${fmt(longest)}ms` : "—"}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
