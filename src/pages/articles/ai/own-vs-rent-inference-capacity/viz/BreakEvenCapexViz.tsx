import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: unit-mismatch 절 — 하드웨어 가격을 넣지 않고,
 * SLO를 지키는 처리량과 가동률에서 API와 비용이 같아지는 최대 시스템 가격을 역산한다.
 * 값은 docs/moe-serving-research-2026-11-03/raw/slo_scenarios_output_2026-11-03.txt 출력 그대로다.
 */
const TPS = [250, 400, 650, 900] as const;

const SCENES = [
  "SLO를 지키며 250토큰/s를 낼 때",
  "SLO를 지키며 400토큰/s를 낼 때",
  "SLO를 지키며 650토큰/s를 낼 때",
  "900토큰/s는 상한 참고용입니다",
] as const;

/** [K2.5 API 가동 50%, K2.5 API 가동 70%, V4-Pro 할인 시간대 가동 70%] 단위: 천 달러 */
type Row = readonly [number, number, number];
const CAPEX: Record<(typeof TPS)[number], { light: Row; heavy: Row }> = {
  250: { light: [52, 82, 36], heavy: [147, 216, 68] },
  400: { light: [91, 137, 67], heavy: [229, 331, 112] },
  650: { light: [149, 218, 113], heavy: [342, 488, 172] },
  900: { light: [199, 288, 152], heavy: [432, 614, 220] },
};

const TAB_LABELS = ["250토큰/s", "400토큰/s", "650토큰/s", "900토큰/s 참고"] as const;

const BAR_LABELS = ["K2.5 API · 가동 50%", "K2.5 API · 가동 70%", "V4-Pro 할인 · 가동 70%"] as const;

/** 예시 시스템 가격: GPU 8장 + 섀시·망 약 $45k. 가격은 매일 움직이므로 기준선 예시일 뿐이다 */
const REF_LOW = 151;
const REF_HIGH = 229;

const WIN = "#10b981";
const MID = "#f59e0b";
const LOSE = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 104;
const SCALE_MAX = 650;
const BAR_W = 200;
const xOf = (k: number) => X0 + (k / SCALE_MAX) * BAR_W;
const colorOf = (k: number) => (k >= REF_HIGH ? WIN : k >= REF_LOW ? MID : LOSE);

const NOTES = [
  "요청당 20~30토큰/s를 지키는 총량의 아래쪽 추정입니다. 입력이 적은 30:1 부하에서는 어느 막대도 $151k 예시선을 넘지 못합니다. 100:1 부하에서도 K2.5 API 대비 가동 70%여야 $216k입니다.",
  "입력이 많은 100:1 부하에서 K2.5 API 대비 $229k~$331k까지 낼 수 있습니다. 같은 부하라도 DeepSeek V4-Pro 할인 시간대와 견주면 $112k로 내려가 예시 가격보다 낮습니다.",
  "추정 범위의 위쪽입니다. 100:1 부하의 K2.5 비교는 두 예시선을 모두 넘지만 V4-Pro 할인 시간대 비교는 가동 70%에서도 $172k입니다. 어느 API와 견주는지가 결론을 바꿉니다.",
  "900은 동시 100개에서 나온 커뮤니티 측정이라 요청당 약 9토큰/s입니다. 에이전트 SLO를 지키는 처리량이 아니므로 이 장면의 막대는 결정에 쓰지 않고 위쪽 상한으로만 봅니다.",
] as const;

function Bars({ row, y0, active }: { row: Row; y0: number; active: boolean }) {
  return (
    <>
      {row.map((k, i) => {
        const y = y0 + i * 16;
        const w = Math.max(xOf(k) - X0, 1);
        const c = colorOf(k);
        return (
          <g key={BAR_LABELS[i]} opacity={active ? 1 : 0.45}>
            <text x={X0 - 6} y={y + 9} textAnchor="end" fontSize={7.5} fill={MUTED}>
              {BAR_LABELS[i]}
            </text>
            <rect x={X0} y={y} width={w} height={12} fill={c} fillOpacity={0.35} stroke={c} strokeWidth={1} />
            <text x={X0 + w + 4} y={y + 9} fontSize={8.5} fontWeight={700} fill={c}>
              ${k}k
            </text>
          </g>
        );
      })}
    </>
  );
}

function Scene({ index }: { index: number }) {
  const tps = TPS[index];
  const data = CAPEX[tps];
  const usable = index < 3;
  return (
    <svg viewBox="0 0 360 200" role="img" aria-label={SCENES[index]} className="h-auto w-full max-w-md">
      <text x={14} y={16} fontSize={9} fontWeight={700} fill={usable ? ACCENT : MUTED}>
        SLO 충족 출력 {tps}토큰/s{usable ? "" : "(미달 측정)"} · 8× PRO 6000 · K2.5
      </text>

      <text x={14} y={34} fontSize={8} fontWeight={700} fill={MUTED}>
        입력:출력 30:1 · 캐시 적중 90%
      </text>
      <Bars row={data.light} y0={40} active={usable} />

      <text x={14} y={96} fontSize={8} fontWeight={700} fill={MUTED}>
        입력:출력 100:1 · 캐시 적중 95%
      </text>
      <Bars row={data.heavy} y0={102} active={usable} />

      <line x1={X0} y1={152} x2={X0 + BAR_W} y2={152} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.6} />
      {[0, 200, 400, 600].map((k) => (
        <text key={k} x={xOf(k)} y={160} textAnchor="middle" fontSize={7} fill={MUTED}>
          ${k}k
        </text>
      ))}

      <line x1={xOf(REF_LOW)} y1={38} x2={xOf(REF_LOW)} y2={152} stroke={ACCENT} strokeWidth={1} strokeDasharray="3 2" />
      <line x1={xOf(REF_HIGH)} y1={38} x2={xOf(REF_HIGH)} y2={152} stroke={ACCENT} strokeWidth={1} strokeDasharray="3 2" />
      <text x={xOf(REF_LOW)} y={176} fontSize={7.5} fontWeight={700} fill={ACCENT}>
        $151k: 장당 $13.25k 예시
      </text>
      <text x={xOf(REF_HIGH)} y={190} fontSize={7.5} fontWeight={700} fill={ACCENT}>
        $229k: 장당 $23k 예시
      </text>
    </svg>
  );
}

export default function BreakEvenCapexViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;

  return (
    <VizFrame
      eyebrow="가격을 넣지 않고 거꾸로 셉니다"
      title="API와 비용이 같아지는 최대 시스템 가격"
      description="막대보다 실제 시스템 가격이 낮으면 자체 호스팅이 쌉니다. 점선 두 개는 가격을 넣어 보는 예시일 뿐이고, 초록 막대는 두 예시를 모두 넘고 주황은 낮은 예시만, 빨강은 낮은 예시보다도 낮습니다."
      note="전기 200원/kWh, PUE 1.4, 유지보수 연 5%, 인건비 제외, 프리필 8,000토큰/s(추정), 캐시 적중 입력은 자체 비용 0으로 둔 계산입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="SLO 처리량별 손익분기 최대 시스템 가격"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <StableSceneStack
            active={s}
            scenes={SCENES.map((label) => (
              <h4 key={label} className="mt-2 text-base font-bold">
                {label}
              </h4>
            ))}
          />
          <div className="mt-4 w-full min-w-0">
            <StableSceneStack active={s} scenes={SCENES.map((label, index) => <Scene key={label} index={index} />)} />
          </div>
          <StableSceneStack
            active={s}
            className="mt-3"
            scenes={NOTES.map((note) => (
              <p key={note} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
                {note}
              </p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={TAB_LABELS} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{index + 1}. {label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
