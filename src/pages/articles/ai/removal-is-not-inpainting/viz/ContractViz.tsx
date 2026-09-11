import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ToolContract.tsx — 프롬프트를 받지 않고 grow 0, 그리고 두 가지 거절 */
const SCENES = ["프롬프트를 받지 않음", "확장 기본값 0", "두 가지 거절", "좁은 계약"] as const;
const NOTES = [
  "칸을 만들어 두면 채워지고, 채워진 설명은 무시되거나 이 도구를 다시 그리는 모델로 되돌립니다.",
  "24픽셀만 넓혀도 띠 아래 벨트까지 사라지고, 96픽셀에서 마스크 밖이 0.16에서 4.12로 뜁니다.",
  "다른 도구가 할 수 있는 요청과 아무도 못 하는 요청을 다른 응답으로 구분합니다.",
  "셋 다 기능을 빼는 결정이고, 그 좁음이 이 도구가 무엇을 보장하는지를 말합니다.",
] as const;

const OK = "#10b981";
const NO = "#ef4444";
const HAND = "#8b5cf6";
const MUTED = "#94a3b8";

/** 실측 — 확장 스윕의 마스크 밖 변화 (/255) */
const GROW = [
  { g: 0, o: 0.157 },
  { g: 8, o: 0.313 },
  { g: 24, o: 0.595 },
  { g: 48, o: 0.882 },
  { g: 96, o: 4.12 },
];

export default function ContractViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="도구 계약"
      title="받지 않는 것이 보장의 근거입니다"
      description="세 가지 좁은 계약과 각각의 근거입니다."
      note="확장 수치는 한 소스·한 마스크의 스윕이며 대상 크기에 따라 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="지우기 도구의 호출 계약"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  설명 칸을 만들면 어떻게 되는가
                </text>
                <rect x={24} y={44} width={200} height={60} fill={NO} fillOpacity={0.1} stroke={NO} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={NO}>
                  받아 두고 무시
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={NO}>
                  호출하는 쪽이 문구를 계속 다듬음
                </text>
                <text x={124} y={96} textAnchor="middle" fontSize={8} fill={MUTED}>
                  효과 없는 작업이 생김
                </text>
                <rect x={256} y={44} width={200} height={60} fill={NO} fillOpacity={0.1} stroke={NO} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={NO}>
                  받아서 실제로 전달
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={NO}>
                  조건을 받는 모델로 갈아 끼워야 함
                </text>
                <text x={356} y={96} textAnchor="middle" fontSize={8} fill={MUTED}>
                  일곱 모델이 실패한 자리로 복귀
                </text>
                <rect x={140} y={126} width={200} height={40} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                <text x={240} y={144} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  받지 않는다
                </text>
                <text x={240} y={158} textAnchor="middle" fontSize={8} fill={OK}>
                  영역과 세기만 받습니다
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  마스크 확장에 따른 마스크 밖 변화 (/255)
                </text>
                {GROW.map((p, i) => {
                  const bad = p.g >= 24;
                  const h = Math.max(3, Math.min(p.o, 4.2) * 24);
                  return (
                    <g key={p.g}>
                      <rect x={60 + i * 80} y={130 - h} width={52} height={h} fill={bad ? NO : OK} fillOpacity={0.28} stroke={bad ? NO : OK} strokeWidth={1} />
                      <text x={86 + i * 80} y={144} textAnchor="middle" fontSize={8} fill={bad ? NO : MUTED}>
                        {p.g}px
                      </text>
                      <text x={86 + i * 80} y={126 - h} textAnchor="middle" fontSize={7} fontWeight={700} fill={bad ? NO : OK}>
                        {p.o.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                <text x={24} y={168} fontSize={9} fontWeight={700} fill={NO}>
                  24px에서 띠 아래에 있던 가죽 벨트가 함께 사라집니다.
                </text>
                <text x={24} y={186} fontSize={8} fill={MUTED}>
                  교체는 96px를 열어야 좋아집니다. 같은 손잡이가 반대 방향입니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  잘못 들어온 요청을 넘기는 두 방식
                </text>
                <rect x={24} y={46} width={200} height={64} fill={HAND} fillOpacity={0.12} stroke={HAND} strokeWidth={1.25} />
                <text x={124} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={HAND}>
                  다른 도구가 합니다
                </text>
                <text x={124} y={84} textAnchor="middle" fontSize={8} fill={HAND}>
                  인페인팅 호출에 의도가 "지우기"
                </text>
                <text x={124} y={100} textAnchor="middle" fontSize={8} fill={MUTED}>
                  그 도구를 부르면 되는 상황
                </text>
                <rect x={256} y={46} width={200} height={64} fill={NO} fillOpacity={0.1} stroke={NO} strokeWidth={1.25} />
                <text x={356} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={NO}>
                  아무도 못 합니다
                </text>
                <text x={356} y={84} textAnchor="middle" fontSize={8} fill={NO}>
                  이 도구도 할 수 없는 요청
                </text>
                <text x={356} y={100} textAnchor="middle" fontSize={8} fill={MUTED}>
                  접근 자체를 바꿔야 하는 상황
                </text>
                <text x={24} y={144} fontSize={8} fill={MUTED}>
                  같은 거절로 뭉뚱그리면 호출하는 쪽이 같은 요청을 다른 표현으로 계속 시도합니다.
                </text>
                <text x={24} y={164} fontSize={8} fontWeight={700} fill={OK}>
                  둘 다 연산을 시작하기 전에 답합니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {[
                  { n: "프롬프트", v: "받지 않음", why: "받는 순간 다시 그리는 모델로 돌아감" },
                  { n: "확장 기본값", v: "0", why: "넓히면 아래 레이어까지 지워짐" },
                  { n: "세기 상한", v: "254", why: "255에서 프레임 전체가 파괴됨" },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={44 + i * 42} width={110} height={32} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                    <text x={79} y={64 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                      {r.n}
                    </text>
                    <text x={150} y={58 + i * 42} fontSize={10} fontWeight={700} fill={OK}>
                      {r.v}
                    </text>
                    <text x={150} y={72 + i * 42} fontSize={8} fill={MUTED}>
                      {r.why}
                    </text>
                  </g>
                ))}
                <text x={24} y={188} fontSize={8} fontWeight={700} fill={MUTED}>
                  셋 다 기능을 빼는 결정입니다. 좁음 자체가 보장의 내용입니다.
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
