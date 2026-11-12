import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: central-calculation 절 — "모으는 데 걸린 시간만큼 낡은 자료로 계산하게 되고
 * 그 사이에 바뀐 사정은 다음 주기까지 반영되지 않습니다."
 * 시장은 앞 절과 같다: 낼 수 있는 금액 10…5, 드는 값 4…9, 바뀐 뒤 6…11.
 * 수집 직후에 드는 값이 바뀌었다는 시점 배치는 설명용 가정이다.
 * 바뀌기 전: 쌍별 차이 6,4,2,0 → 4쌍 합 12. 바뀐 뒤 4쌍: 4,2,0,−2 → 4. 바뀐 뒤 3쌍: 4,2,0 → 6.
 */
const WTP: readonly number[] = [10, 9, 8, 7, 6, 5];
const MC_OLD: readonly number[] = [4, 5, 6, 7, 8, 9];
const SHOCK = 2;
const MC_NEW: readonly number[] = MC_OLD.map((m) => m + SHOCK);

const STAGES = ["수집", "확인", "계산", "배포"] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  /** 실제 드는 값이 바뀌었는가 */
  shocked: boolean;
  /** 중앙이 지금 있는 단계 */
  stage: number;
  /** 중앙의 배분이 실제로 적용되고 있는 쌍 수 (null이면 아직 내려오지 않음) */
  centralPairs: number | null;
  /** 중앙이 쓰는 자료의 시점 */
  centralData: "old" | "new";
  marketPrice: number;
}

const SCENES: readonly Scene[] = [
  {
    label: "숫자가 그대로라면",
    summary: "두 경로 모두 4쌍",
    note: "숫자가 한 주기 동안 그대로라면, 중앙이 열두 개의 숫자를 모아 끝까지 풀어 내려보낸 답은 4쌍이고, 시장에서도 값 7에서 4쌍이 남습니다. 숫자가 그대로인 동안에는 같은 배분에 이릅니다. 여기서는 모두가 사실대로 답했다고 둡니다(가정). 본문이 말하듯 실제로는 그럴 이유가 없습니다.",
    shocked: false,
    stage: 3,
    centralPairs: 4,
    centralData: "old",
    marketPrice: 7,
  },
  {
    label: "모은 뒤 드는 값이 오릅니다",
    summary: "드는 값 모두 +2 (가정)",
    note: "같은 주기를 다시 보되, 이번에는 모으기를 마치고 확인과 계산을 하는 사이에 드는 값이 모두 2씩 올랐다고 둡니다(앞 절의 예를 이 시점에 놓은 가정). 중앙의 자료는 여전히 4…9입니다. 시장에서는 값이 8로 움직이고 8을 못 내는 쪽이 물러나 3쌍이 남습니다.",
    shocked: true,
    stage: 2,
    centralPairs: null,
    centralData: "old",
    marketPrice: 8,
  },
  {
    label: "낡은 자료의 답이 내려옵니다",
    summary: "중앙 4쌍 · 시장 3쌍",
    note: "중앙은 바뀌기 전 자료로 정확히 풀었으므로 4쌍을 내려보냅니다. 그런데 지금 드는 값으로 넷째 쌍은 7을 낼 수 있는 사람과 9가 드는 사람이라 차이가 −2입니다. 실제 총량은 4로, 시장의 6보다 작습니다.",
    shocked: true,
    stage: 3,
    centralPairs: 4,
    centralData: "old",
    marketPrice: 8,
  },
  {
    label: "다음 주기에야 따라잡습니다",
    summary: "중앙도 3쌍 · 총량 6",
    note: "다음 주기에 새 숫자를 모아 풀면 중앙도 3쌍, 총량 6에 이릅니다. 그 사이에 또 바뀌면 다시 한 주기 뒤처집니다. 어느 쪽이 나은지는 숫자가 한 주기 안에 얼마나 바뀌는지에 달려 있습니다.",
    shocked: true,
    stage: 3,
    centralPairs: 3,
    centralData: "new",
    marketPrice: 8,
  },
];

const LABELS: readonly string[] = SCENES.map((s) => s.label);
const NOTES: readonly string[] = SCENES.map((s) => s.note);

function diffAt(i: number, shocked: boolean) {
  return WTP[i] - (shocked ? MC_NEW[i] : MC_OLD[i]);
}

function totalOf(pairs: number, shocked: boolean) {
  return Array.from({ length: pairs }, (_, i) => diffAt(i, shocked)).reduce<number>((a, b) => a + b, 0);
}

function signed(v: number) {
  return v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : "0";
}

function PairRow({ pairs, shocked }: { pairs: number | null; shocked: boolean }) {
  return (
    <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
      {WTP.map((w, i) => {
        const traded = pairs !== null && i < pairs;
        const d = diffAt(i, shocked);
        const tone = !traded
          ? "border-dashed border-border text-muted-foreground/60"
          : d > 0
            ? "border-emerald-600 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
            : d < 0
              ? "border-red-600 bg-red-600/10 text-red-700 dark:text-red-400"
              : "border-slate-400 bg-slate-400/10 text-foreground";
        return (
          <div key={i} className={`min-w-0 rounded-md border px-0.5 py-1 text-center ${tone}`}>
            <span className="block font-mono text-[10px] leading-4 sm:text-xs">
              {w}−{shocked ? MC_NEW[i] : MC_OLD[i]}
            </span>
            <span className="block font-mono text-xs font-bold leading-4 sm:text-sm">
              {traded ? signed(d) : pairs === null ? "?" : "안 함"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Figure({ scene }: { scene: Scene }) {
  const centralTotal = scene.centralPairs === null ? null : totalOf(scene.centralPairs, scene.shocked);
  const marketPairs = WTP.filter((w, i) => w >= scene.marketPrice && (scene.shocked ? MC_NEW[i] : MC_OLD[i]) <= scene.marketPrice).length;
  const marketTotal = totalOf(marketPairs, scene.shocked);
  const centralMc = scene.centralData === "old" ? MC_OLD : MC_NEW;

  return (
    <div className="min-w-0 space-y-3">
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-bold">중앙 계산</p>
          <p className="font-mono text-xs text-muted-foreground">
            가진 자료의 드는 값 {centralMc.join(" ")}
            {scene.centralData === "old" && scene.shocked ? " (낡음)" : ""}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center text-[11px] sm:text-xs">
          {STAGES.map((st, i) => (
            <span
              key={st}
              className={`rounded-md border py-1 ${
                i === scene.stage
                  ? "border-primary bg-primary/10 font-bold text-primary"
                  : i < scene.stage
                    ? "border-border text-foreground"
                    : "border-dashed border-border text-muted-foreground/60"
              }`}
            >
              {i + 1}. {st}
            </span>
          ))}
        </div>
        <PairRow pairs={scene.centralPairs} shocked={scene.shocked} />
        <p className="text-xs leading-5 sm:text-sm">
          실제 총량{" "}
          <span className="font-mono font-bold">{centralTotal === null ? "아직 없음 (배분 전)" : centralTotal}</span>
        </p>
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-bold">시장</p>
          <p className="font-mono text-xs text-muted-foreground">공개된 값 {scene.marketPrice} · 각자 자기 숫자와 견줌</p>
        </div>
        <PairRow pairs={marketPairs} shocked={scene.shocked} />
        <p className="text-xs leading-5 sm:text-sm">
          실제 총량 <span className="font-mono font-bold">{marketTotal}</span>
        </p>
      </div>
    </div>
  );
}

export default function StaleDataViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);

  return (
    <VizFrame
      eyebrow="모으는 동안 바뀌는 자료"
      title="낡은 자료로 정확히 푼 답과 최신 값에 반응한 답"
      description="칸 하나가 한 쌍입니다. 칸 위는 '낼 수 있는 금액−지금 드는 값', 아래는 그 쌍별 차이이며 거래한 쌍의 차이를 더한 것이 실제 총량입니다. 숫자는 앞 절과 같은 시장입니다."
      note="드는 값이 수집 직후에 바뀌었다는 시점 배치는 설명용 가정입니다. 이 그림의 시장은 값이 한 번에 8로 옮겨 간 깔끔한 경우이고, 본문은 시장 쪽 반응을 거칠다고 적습니다. 어느 쪽이 나은지는 자료가 바뀌는 속도에 달려 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="중앙 계산과 시장이 자료 변화에 반응하는 시점 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene, i) => (
            <div key={scene.label} className="min-w-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-base font-bold">
                  {i + 1}. {scene.label}
                </h4>
                <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
              </div>
              <div className="mt-3">
                <Figure scene={scene} />
              </div>
              <p className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
            </div>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
