import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: NegativeGate.tsx — 세 라운드 정리와 남는 방법론 */
const SCENES = ["세 라운드 정리", "다른 관찰과 맞물림", "실제로 필요했던 것", "남는 방법론"] as const;
const NOTES = [
  "각 라운드가 다른 방식으로 무너졌고 그 기록이 다음 판단을 바꿉니다.",
  "여기서 안 움직이던 축이 텍스트 경로에서도 안 움직이던 바로 그 축입니다.",
  "서로 다른 인물이 필요하면 참조에서 정체성을 가져오면 됩니다.",
  "셋 다 이 회차에서 각각 한 번씩 결론을 바꿨습니다.",
] as const;

const R = "#ef4444";
const LINK = "#f59e0b";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="실패한 경로를 지우지 않는 것이 다음 판단을 바꿉니다"
      description="세 라운드의 결과와 그로부터 남는 방법론입니다."
      note="실패한 것은 이 세 방법이며 3차원 형태 제어 일반이 불가능하다는 뜻이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="음성 결과의 정리"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                {[
                  { n: "조립식 메쉬", f: "형태는 전달, 부속물까지 복사" },
                  { n: "단일 두상", f: "깨끗한 대신 결과가 수렴" },
                  { n: "매 단계 조건화", f: "분리가 난수와 구분되지 않음" },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={46 + i * 44} width={150} height={32} fill={R} fillOpacity={0.1} stroke={R} strokeWidth={1.25} />
                    <text x={99} y={66 + i * 44} textAnchor="middle" fontSize={9} fontWeight={700} fill={R}>
                      {r.n}
                    </text>
                    <text x={190} y={66 + i * 44} fontSize={9} fill={R}>
                      {r.f}
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
                  같은 발상이 다시 떠올랐을 때 같은 세 라운드를 반복하지 않습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={24} y={48} width={200} height={60} fill={R} fillOpacity={0.1} stroke={R} strokeWidth={1.25} />
                <text x={124} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={R}>
                  3차원 형태 경로
                </text>
                <text x={124} y={92} textAnchor="middle" fontSize={8} fill={R}>
                  광대·턱 너비 축이 안 움직임
                </text>
                <rect x={256} y={48} width={200} height={60} fill={LINK} fillOpacity={0.1} stroke={LINK} strokeWidth={1.25} />
                <text x={356} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={LINK}>
                  텍스트 묘사 경로
                </text>
                <text x={356} y={92} textAnchor="middle" fontSize={8} fill={LINK}>
                  같은 축이 노이즈 수준에서 멈춤
                </text>
                <line x1={224} y1={78} x2={256} y2={78} stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
                <text x={24} y={144} fontSize={9} fontWeight={700} fill={LINK}>
                  두 경로 모두에서 움직이지 않는다면 방법의 문제가 아닙니다.
                </text>
                <text x={24} y={166} fontSize={8} fill={MUTED}>
                  모델이 그 축의 제어를 배우지 않았다는 쪽에 무게가 실립니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  원래 필요했던 것
                </text>
                <rect x={24} y={48} width={432} height={40} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                <text x={240} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                  서로 다른 인물이 필요하면 참조에서 정체성을 가져온다
                </text>
                <text x={24} y={118} fontSize={9} fill={MUTED}>
                  이 답은 3차원 경로의 실패를 확인한 뒤에 찾았습니다.
                </text>
                <text x={24} y={142} fontSize={8} fill={MUTED}>
                  실패를 확인하지 않았다면 같은 경로를 더 밀고 있었을 것입니다.
                </text>
                <text x={24} y={172} fontSize={8} fontWeight={700} fill={OK}>
                  음성 결과가 탐색 공간을 줄여 준 사례입니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {[
                  "같은 조정을 두 번 했는데 변화가 없으면 세 번째 대신 측정한다",
                  "고정해 둔 변수를 의심하고 대조군을 붙인다",
                  "지표가 좋아지는 방향으로 밀기 전에 끝점의 이미지를 직접 본다",
                ].map((r, i) => (
                  <g key={r}>
                    <rect x={24} y={48 + i * 42} width={432} height={32} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                    <circle cx={44} cy={64 + i * 42} r={6} fill="none" stroke={OK} strokeWidth={1.25} />
                    <path d={`M 41 ${64 + i * 42} l 2.5 3 l 5 -6`} fill="none" stroke={OK} strokeWidth={1.25} />
                    <text x={62} y={68 + i * 42} fontSize={9} fontWeight={700} fill={OK}>
                      {r}
                    </text>
                  </g>
                ))}
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  이 회차에서 각각 한 번씩 결론을 바꾼 것
                </text>
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
                  새 모델이나 새 파라미터가 아니라 이미 가진 결과를 다시 본 것이 차이를 만들었습니다.
                </text>
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
