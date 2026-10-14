import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 실제로 yes일 확률이 0.7인 질문에 보고 확률 q를 바꿔 가며 기대 보상을 비교한다.
 * 한 mechanism: 기대 보상 = 0.7·r(q, yes) + 0.3·r(q, no). strictly proper rule이면 q = 0.7에서 최대.
 * 막대는 장면 안에서 가장 낮은 값을 0, 가장 높은 값을 100%로 둔 상대 길이다.
 */
const TRUE_P = 0.7;
const QS = [0.5, 0.6, 0.7, 0.8, 0.9, 0.99] as const;
const SCENES = ["log score", "구면 score", "log + 0.75·구면", "정답만 맞히면 1점"] as const;

function logScore(q: number) {
  return TRUE_P * Math.log(q) + (1 - TRUE_P) * Math.log(1 - q);
}
function sphScore(q: number) {
  const norm = Math.sqrt(q * q + (1 - q) * (1 - q));
  return (TRUE_P * q + (1 - TRUE_P) * (1 - q)) / norm;
}
function accuracy(q: number) {
  return q > 0.5 ? TRUE_P : 0.5;
}

const RULES: ((q: number) => number)[] = [logScore, sphScore, (q) => logScore(q) + 0.75 * sphScore(q), accuracy];

const NOTES = [
  "0.7을 그대로 보고하면 기대 log score가 −0.611로 가장 높습니다. 0.9로 부풀리면 −0.765, 0.99면 −1.389로 떨어집니다. 틀렸을 때 log(0.01)이 크게 깎이기 때문입니다.",
  "구면 score는 정답 쪽 확률을 분포의 길이로 나눕니다. 이것도 0.7에서 0.762로 가장 높고, 0.9에서는 0.729입니다. log보다 벌점이 완만합니다.",
  "Laya 학습 기본값은 log에 구면을 0.75배 더합니다. 두 rule이 모두 0.7에서 최대라 합도 0.7에서 −0.040으로 가장 높습니다.",
  "정답 쪽을 고르기만 하면 1점을 주는 보상은 0.6이든 0.99든 기대값이 0.7로 같습니다. 확률을 정직하게 보고할 이유가 없는 improper rule입니다.",
] as const;

export default function ScoringRuleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const values = QS.map((q) => RULES[scene](q));
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const best = Math.max(...values);

  return (
    <VizFrame
      eyebrow="Proper scoring rule"
      title="참 확률 0.7을 그대로 말할 때 기대 보상이 가장 큽니다"
      description="행 하나가 모델이 보고한 yes 확률 q입니다. 막대는 그 보고로 받는 기대 보상이며, 진한 막대가 최댓값입니다."
      note="참 확률 0.7은 설명용 가정입니다. 기대 보상은 0.7×(yes일 때 점수) + 0.3×(no일 때 점수)로 계산했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="보고 확률에 따른 기대 보상 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-4 space-y-2">
            {QS.map((q, i) => {
              const v = values[i];
              const frac = hi === lo ? 1 : (v - lo) / (hi - lo);
              const isBest = Math.abs(v - best) < 1e-9;
              return (
                <li key={q} className="grid grid-cols-[3.25rem_minmax(0,1fr)_4rem] items-center gap-2">
                  <span className="font-mono text-xs font-bold">q {q}</span>
                  <div className="h-4 rounded-sm bg-muted/60">
                    <div
                      className="h-full rounded-sm transition-[width] duration-500"
                      style={{ width: `${Math.max(frac * 100, 2)}%`, backgroundColor: isBest ? "#2563eb" : "#93c5fd" }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs">{v.toFixed(3)}</span>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
