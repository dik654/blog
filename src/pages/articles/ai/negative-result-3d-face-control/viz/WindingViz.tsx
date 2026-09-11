import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: WindingBug.tsx — 추측 두 번, 측정 두 개, 원인 확정 */
const SCENES = ["증상", "추측하고 조정", "멈추고 측정", "1차도 같은 버그"] as const;
const NOTES = [
  "정점을 밀고 당겨 만든 두상이 렌더하면 특징 없는 매끈한 덩어리로만 나왔습니다.",
  "변형 진폭이 부족하다고 보고 두 번 키웠습니다. 그대로였습니다.",
  "코가 존재하는지와 그 면이 카메라를 향하는지를 각각 쟀습니다.",
  "조립식이라 부품별 뒷면 실루엣이 우연히 얼굴처럼 보였을 뿐이었습니다.",
] as const;

const GUESS = "#f59e0b";
const MEASURE = "#10b981";
const BUG = "#ef4444";
const MUTED = "#94a3b8";

export default function WindingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="디버깅"
      title="같은 조정을 두 번 했는데 변화가 없으면 잽니다"
      description="추측으로 두 번, 측정으로 한 번에 원인이 나왔습니다."
      note="렌더링 파이프라인의 버그이며 생성 모델 쪽 문제가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="메쉬 법선 와인딩 버그 진단"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  메쉬에는 눈 홈·코·입·눈썹 융기가 들어 있는데
                </text>
                <circle cx={140} cy={100} r={44} fill={MUTED} fillOpacity={0.12} stroke={MUTED} strokeWidth={1.25} />
                <text x={140} y={164} textAnchor="middle" fontSize={9} fill={MUTED}>
                  렌더 결과
                </text>
                <text x={220} y={92} fontSize={9} fontWeight={700} fill={BUG}>
                  특징 없는 매끈한 덩어리
                </text>
                <text x={220} y={112} fontSize={8} fill={MUTED}>
                  어떤 형태를 넣어도 같은 모양으로 나옵니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  가설: 변형 진폭이 부족하다
                </text>
                {[1, 2].map((n, i) => (
                  <g key={n}>
                    <rect x={24 + i * 150} y={50} width={130} height={44} fill={GUESS} fillOpacity={0.12} stroke={GUESS} strokeWidth={1.25} />
                    <text x={89 + i * 150} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={GUESS}>
                      진폭 {n}차 증가
                    </text>
                    <text x={89 + i * 150} y={86} textAnchor="middle" fontSize={8} fill={BUG}>
                      변화 없음
                    </text>
                  </g>
                ))}
                <rect x={324} y={50} width={132} height={44} fill={MEASURE} fillOpacity={0.12} stroke={MEASURE} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={390} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={MEASURE}>
                  3차 대신
                </text>
                <text x={390} y={86} textAnchor="middle" fontSize={9} fontWeight={700} fill={MEASURE}>
                  측정
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={MEASURE}>
                  같은 조정을 두 번 했는데 변화가 없으면 가설이 틀렸을 가능성이 큽니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  두 가지를 각각 쟀습니다
                </text>
                <rect x={24} y={44} width={200} height={56} fill={MEASURE} fillOpacity={0.12} stroke={MEASURE} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={MEASURE}>
                  코가 존재하는가
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={MEASURE}>
                  중심선 최대 1.181 · 옆면 0.850
                </text>
                <text x={124} y={96} textAnchor="middle" fontSize={8} fontWeight={700} fill={MEASURE}>
                  존재함
                </text>
                <rect x={256} y={44} width={200} height={56} fill={BUG} fillOpacity={0.12} stroke={BUG} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={BUG}>
                  그 면이 카메라를 향하는가
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={BUG}>
                  앞쪽 면 5,986개 중
                </text>
                <text x={356} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={BUG}>
                  0개
                </text>
                <text x={24} y={132} fontSize={9} fontWeight={700} fill={BUG}>
                  면 감김 순서가 뒤집혀 래스터라이저가 뒤통수 안쪽을 그리고 있었습니다.
                </text>
                <text x={24} y={156} fontSize={8} fill={MUTED}>
                  진폭을 아무리 키워도 보일 리가 없었습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  1차 조립식 메쉬도 같은 버그였습니다
                </text>
                <rect x={24} y={44} width={200} height={60} fill={BUG} fillOpacity={0.1} stroke={BUG} strokeWidth={1.25} />
                <text x={124} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={BUG}>
                  부품마다 뒷면이 그려짐
                </text>
                <text x={124} y={86} textAnchor="middle" fontSize={8} fill={BUG}>
                  우연히 얼굴처럼 보였을 뿐
                </text>
                <rect x={256} y={44} width={200} height={60} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={356} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  그 위에 해석을 쌓고 있었음
                </text>
                <text x={356} y={86} textAnchor="middle" fontSize={8} fill={MUTED}>
                  1차 결과를 정상으로 여김
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={MEASURE}>
                  눈으로 봤을 때 그럴듯한 것이 정상이라는 증거는 아닙니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={MUTED}>
                  이 습관이 시리즈 전체에서 반복됩니다 — 답을 아는 입력으로 먼저 확인하기.
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
