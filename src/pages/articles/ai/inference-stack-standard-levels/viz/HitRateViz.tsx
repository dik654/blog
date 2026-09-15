import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: hit-rate 절의 ExplainedFormula — 라우팅 정책이 적중률을 정하고 그것이 큐를 좌우한다 */
const SCENES = [
  "돌아가며 보내면 흩어집니다",
  "캐시를 보고 보내면 모입니다",
  "다시 계산할 일감이 줄어듭니다",
  "그런데 첫 토큰은 더 크게 줄었습니다",
] as const;

/** 공개된 실험 구성 */
const REPLICAS = 8;
/** 같은 prefix를 쓰는 요청 다섯 개가 어디로 가는지 */
const GROUP = 5;

/** 돌아가며 보낼 때의 적중률은 복제본 수의 역수 수준 */
const HIT_RR = 1 / REPLICAS;
/** 모아 보내면 그룹의 첫 요청만 계산하므로 (g-1)/g */
const HIT_AWARE = (GROUP - 1) / GROUP;

/** 보고된 값 */
const TTFT_BEFORE_S = 35;
const TTFT_AFTER_MS = 120;
const THROUGHPUT_GAIN = 1.51;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const work = (h: number) => 1 - h;
const WORK_RATIO = Math.round((work(HIT_RR) / work(HIT_AWARE)) * 10) / 10;
const TTFT_RATIO = (TTFT_BEFORE_S * 1000) / TTFT_AFTER_MS;

const pct = (v: number) => `${Math.round(v * 100)}`;

const POD_X = 120;
const POD_W = 38;

export default function HitRateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const aware = s >= 1;

  const NOTES = [
    `같은 앞부분을 쓰는 요청 ${GROUP}개가 복제본 ${REPLICAS}개에 차례로 뿌려지면 서로 다른 곳에 떨어집니다. 앞 요청이 만들어 둔 캐시를 뒤 요청이 못 쓰므로 적중률이 복제본 수의 역수 수준인 ${pct(HIT_RR)}퍼센트에 머뭅니다.`,
    `캐시가 어디 있는지를 보고 고르면 같은 앞부분을 쓰는 요청이 한 곳으로 모입니다. 적중률이 ${pct(HIT_AWARE)}퍼센트 근처로 올라가고, 첫 요청만 앞부분을 계산하면 나머지는 건너뜁니다.`,
    `다시 계산해야 하는 양은 적중하지 않은 비율에 비례합니다. ${pct(work(HIT_RR))}퍼센트에서 ${pct(work(HIT_AWARE))}퍼센트로 내려갔으니 일감이 약 ${WORK_RATIO.toFixed(1)}분의 1이 됩니다. 여기까지는 산술입니다.`,
    `그런데 공개된 실험에서 첫 토큰은 ${TTFT_BEFORE_S}초에서 ${TTFT_AFTER_MS}밀리초로 약 ${TTFT_RATIO.toFixed(0)}배 줄었습니다. 일감이 준 것보다 훨씬 큽니다. 줄어든 일감이 큐를 포화에서 빼냈기 때문이고, 포화 근처에서는 대기가 비선형으로 움직입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="라우팅 정책이 정하는 것"
      title="어디로 보낼지가 다시 계산할 양을 정합니다"
      description="같은 앞부분을 쓰는 요청을 흩뿌리면 캐시를 못 쓰고, 모으면 첫 요청만 계산하면 됩니다."
      note="공개된 실험 구성은 H100 16장에 복제본 8개, 공유 앞부분이 있는 합성 워크로드 초당 60요청입니다. 적중률 값은 그 구성에서의 어림이고 측정치가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="라우팅 정책과 캐시 적중률"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={14} y={22} fontSize={8} fontWeight={700} fill={MUTED}>
                같은 앞부분 {GROUP}개
              </text>
              <text x={POD_X} y={22} fontSize={8} fontWeight={700} fill={MUTED}>
                복제본 {REPLICAS}개
              </text>

              {Array.from({ length: REPLICAS }, (_, i) => {
                /** 돌아가며 보내면 앞의 다섯 곳에 하나씩, 캐시를 보면 첫 곳에 모두 */
                const count = aware ? (i === 0 ? GROUP : 0) : i < GROUP ? 1 : 0;
                const hot = count > 0;
                return (
                  <g key={i}>
                    <rect
                      x={POD_X + (i % 4) * POD_W}
                      y={32 + Math.floor(i / 4) * 34}
                      width={POD_W - 6}
                      height={26}
                      fill={hot ? (aware ? OK : ACCENT) : MUTED}
                      fillOpacity={hot ? 0.34 : 0.08}
                      stroke={hot ? (aware ? OK : ACCENT) : MUTED}
                      strokeWidth={1}
                      strokeOpacity={hot ? 1 : 0.3}
                    />
                    <text
                      x={POD_X + (i % 4) * POD_W + 6}
                      y={32 + Math.floor(i / 4) * 34 + 17}
                      fontSize={9}
                      fontWeight={700}
                      fill={hot ? (aware ? OK : ACCENT) : MUTED}
                      fillOpacity={hot ? 1 : 0.4}
                    >
                      {count > 0 ? `${count}개` : "—"}
                    </text>
                  </g>
                );
              })}

              <text x={296} y={44} fontSize={8} fontWeight={700} fill={MUTED}>
                앞부분 적중률
              </text>
              <text x={296} y={62} fontSize={14} fontWeight={700} fill={aware ? OK : WARN}>
                {pct(aware ? HIT_AWARE : HIT_RR)}%
              </text>
              <text x={296} y={80} fontSize={8} fill={MUTED}>
                {aware ? "첫 요청만 계산" : "거의 매번 다시 계산"}
              </text>

              <line x1={14} y1={106} x2={456} y2={106} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={124} fontSize={8} fontWeight={700} fill={MUTED}>
                다시 계산할 양
              </text>
              <rect
                x={120}
                y={114}
                width={work(aware ? HIT_AWARE : HIT_RR) * 200}
                height={14}
                fill={aware ? OK : WARN}
                fillOpacity={0.35}
                stroke={aware ? OK : WARN}
                strokeWidth={1}
              />
              <text x={330} y={125} fontSize={9.5} fontWeight={700} fill={aware ? OK : WARN}>
                {pct(work(aware ? HIT_AWARE : HIT_RR))}%
              </text>
              {s >= 2 && (
                <text x={374} y={125} fontSize={9} fontWeight={700} fill={MUTED}>
                  약 {WORK_RATIO.toFixed(1)}분의 1
                </text>
              )}

              {s >= 3 && (
                <>
                  <text x={14} y={152} fontSize={8} fontWeight={700} fill={MUTED}>
                    첫 토큰까지
                  </text>
                  <text x={120} y={152} fontSize={9.5} fontWeight={700} fill={WARN}>
                    {TTFT_BEFORE_S}초
                  </text>
                  <text x={168} y={152} fontSize={9} fill={MUTED}>
                    →
                  </text>
                  <text x={188} y={152} fontSize={9.5} fontWeight={700} fill={OK}>
                    {TTFT_AFTER_MS}밀리초
                  </text>
                  <text x={262} y={152} fontSize={9} fontWeight={700} fill={ACCENT}>
                    약 {TTFT_RATIO.toFixed(0)}배
                  </text>
                  <text x={14} y={172} fontSize={8} fontWeight={700} fill={MUTED}>
                    처리량
                  </text>
                  <text x={120} y={172} fontSize={9.5} fontWeight={700} fill={OK}>
                    +{Math.round(THROUGHPUT_GAIN * 100)}%
                  </text>
                  <text x={14} y={192} fontSize={9} fontWeight={700} fill={ACCENT}>
                    일감은 {WORK_RATIO.toFixed(1)}분의 1인데 첫 토큰은 {TTFT_RATIO.toFixed(0)}배 줄었습니다 · 포화에서 빠져나온 몫입니다
                  </text>
                </>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
