import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: maturity-transformation·bank-run — 만기 불일치가 조정 실패로 터지는 경로 */
const SCENES = [
  "짧은 빚이 긴 자산을 떠받친다",
  "급하게 팔면 제값을 못 받는다",
  "먼저 찾는 쪽이 유리해진다",
  "보장을 걸면 서두를 이유가 사라진다",
] as const;

const NOTES = [
  "부채는 오늘 찾을 수 있고 자산은 몇 년 뒤에 돌아옵니다. 평소에는 전부 동시에 찾지 않기에 굴러갑니다.",
  "긴 자산을 오늘 현금으로 바꾸려면 할인해 팔아야 합니다. 팔수록 남은 사람의 몫이 줄어듭니다.",
  "덜 받을 위험이 뒤로 갈수록 커지므로, 남들이 찾을 것 같으면 나도 먼저 찾는 쪽이 합리적이 됩니다.",
  "한도까지 돌려받는다고 미리 약속하면 먼저 찾을 이유가 없어져, 실제로 지급하지 않고도 인출이 멎습니다.",
] as const;

const ASSET = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** 자산 100(긴 대출), 예금 92, 자본 8. 급매 손실률 30%를 가정한 예시. */
const ASSETS = 100;
const DEPOSITS = 92;
const FIRE_SALE_LOSS = 0.3;

const QUEUE = [0, 1, 2, 3, 4];

export default function BankRunViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;
  const recovered = Math.round(ASSETS * (1 - FIRE_SALE_LOSS));

  return (
    <VizFrame
      eyebrow="만기 불일치"
      title="자산이 멀쩡해도 순서가 늦으면 덜 받게 됩니다"
      description="뱅크런의 원인은 부실이 아니라 '남들이 먼저 찾을 것'이라는 예상입니다."
      note="급매 손실률 30%는 구조를 보이기 위한 예시 값이며 특정 사건의 실측이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="만기 불일치와 자기실현적 인출"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <rect x={24} y={40} width={120} height={54} fill={ASSET} fillOpacity={0.14} stroke={ASSET} strokeWidth={1} />
              <text x={84} y={62} textAnchor="middle" fontSize={10} fontWeight={700} fill={ASSET}>
                자산 {ASSETS}
              </text>
              <text x={84} y={78} textAnchor="middle" fontSize={8} fill={MUTED}>
                만기 수년짜리 대출
              </text>

              <rect x={24} y={104} width={120} height={44} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1} />
              <text x={84} y={122} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                예금 {DEPOSITS}
              </text>
              <text x={84} y={138} textAnchor="middle" fontSize={8} fill={MUTED}>
                오늘 전부 청구 가능
              </text>

              <text x={84} y={168} textAnchor="middle" fontSize={8} fill={MUTED}>
                평소 전제: 동시에 찾지 않는다
              </text>

              {step >= 1 && (
                <g>
                  <line x1={148} y1={68} x2={188} y2={68} stroke={WARN} strokeWidth={1} />
                  <rect x={190} y={44} width={110} height={48} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1} />
                  <text x={245} y={64} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>
                    급매가 {recovered}
                  </text>
                  <text x={245} y={80} textAnchor="middle" fontSize={8} fill={MUTED}>
                    손실 {Math.round(FIRE_SALE_LOSS * 100)}%
                  </text>
                  <text x={245} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    {recovered} &lt; {DEPOSITS}
                  </text>
                  <text x={245} y={124} textAnchor="middle" fontSize={8} fill={MUTED}>
                    전부에게 액면대로 줄 수 없다
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <text x={318} y={36} fontSize={9} fontWeight={700} fill={step === 3 ? OK : WARN}>
                    인출 순서
                  </text>
                  {QUEUE.map((index) => {
                    const paid = step === 3 || index < 3;
                    return (
                      <g key={index}>
                        <rect
                          x={318}
                          y={44 + index * 22}
                          width={64}
                          height={16}
                          fill={paid ? OK : WARN}
                          fillOpacity={0.14}
                          stroke={paid ? OK : WARN}
                          strokeWidth={1}
                        />
                        <text x={350} y={56 + index * 22} textAnchor="middle" fontSize={8} fill={paid ? OK : WARN}>
                          {index + 1}번째
                        </text>
                        <text x={390} y={56 + index * 22} fontSize={8} fill={paid ? OK : WARN}>
                          {paid ? "전액" : "덜 받음"}
                        </text>
                      </g>
                    );
                  })}
                  <text x={318} y={170} fontSize={8} fill={step === 3 ? OK : WARN}>
                    {step === 3
                      ? "보장 한도 안에서는 순서가 무의미해진다"
                      : "그래서 모두가 1번이 되려 한다"}
                  </text>
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
