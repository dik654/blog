import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: last-digits·the-check 절. 수치는 헤로도토스 7권 184~187절, 나눗셈은 이 글의 검산 */
const SCENES = ["끝자리 3220", "하나뿐인 출처", "검산", "남는 것"] as const;

const KEEP = "#0ea5e9";
const SLIP = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function LastDigitsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `적힌 총계는 528만 3220입니다. 끝자리까지 0이 아니어서 하나하나 센 수처럼 보입니다. 앞 글에서 본 170만과 달리 이 수는 정밀해 보이는 자리를 가지고 있습니다.`,
    `그 자리가 어디서 왔는지 거슬러 가면 하나로 모입니다. 재료 가운데 만 단위나 천 단위가 아닌 것은 배마다 전사 30명을 곱해 얻은 3만 6210 하나뿐입니다. 1,207 × 30 = 36,210이고, 그 610이 전투원 합계 264만 1610의 끝에 남았다가 두 배가 되어 3220이 된 것입니다.`,
    `저자는 이 총계로 검산까지 해 둡니다. 한 사람에게 하루 한 코이닉스의 밀만 준다고 해도 하루에 11만 340 메딤노이가 든다는 것입니다. 1 메딤노스는 48 코이닉스이므로 5,283,220을 48로 나누면 11만 67 메딤노이와 4 코이닉스가 나옵니다. 적힌 수와 맞지 않고, 영역자도 주석에서 이 계산이 틀렸다고 적습니다.`,
    `그래서 이 총계에서 쓸 수 있는 것이 정해집니다. 끝 네 자리는 센 결과가 아니라 가정 하나가 곱해져 생긴 자리이고, 검산은 저자 쪽에서 어긋납니다. 남는 것은 총계의 자릿수와, 그 자릿수가 어떤 가정들 위에 올라가 있는지입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="끝자리"
      title="정밀해 보이는 끝자리의 출처는 가정 하나이고, 저자의 검산은 맞지 않습니다"
      description="총계의 끝 네 자리는 배마다 전사 30명이라는 비율에서만 나오고, 그 총계로 한 하루치 식량 계산은 48로 나눠 보면 어긋납니다."
      note="총계와 식량 계산은 헤로도토스 7권 184~187절의 것이고, 영역자가 그 계산이 틀렸다고 주석에 적었습니다. 나눗셈을 다시 해 본 것은 이 글입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="총계의 끝자리 출처와 식량 검산의 어긋남을 보이는 그림"
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
              {s <= 1 && (
                <g>
                  <text x={240} y={44} fontSize={20} fontWeight={700} fill={INK} textAnchor="middle">
                    <tspan fill={MUTED}>528만 </tspan>
                    <tspan fill={s === 1 ? SLIP : INK}>3220</tspan>
                  </text>
                  <text x={240} y={60} fontSize={8} fill={MUTED} textAnchor="middle">
                    책에 적힌 총계
                  </text>
                </g>
              )}

              {s === 0 && (
                <g>
                  <rect x={64} y={80} width={160} height={54} rx={4} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={144} y={98} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    앞 글의 보병
                  </text>
                  <text x={144} y={114} fontSize={11} fontWeight={700} fill={MUTED} textAnchor="middle">
                    1,700,000
                  </text>
                  <text x={144} y={128} fontSize={7.5} fill={MUTED} textAnchor="middle">
                    끝자리가 모두 0
                  </text>

                  <rect x={256} y={80} width={160} height={54} rx={4} fill={KEEP} opacity={0.12} stroke={KEEP} strokeWidth={1.25} />
                  <text x={336} y={98} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    이 글의 총계
                  </text>
                  <text x={336} y={114} fontSize={11} fontWeight={700} fill={KEEP} textAnchor="middle">
                    5,283,220
                  </text>
                  <text x={336} y={128} fontSize={7.5} fill={INK} textAnchor="middle">
                    끝자리가 0이 아님
                  </text>
                </g>
              )}

              {s === 1 && (
                <g>
                  {[
                    ["배 1,207척 × 30명", "36,210", true],
                    ["나머지 모든 재료", "만·천 단위", false],
                  ].map(([t, v, lit], i) => (
                    <g key={String(t)}>
                      <rect x={40} y={78 + i * 34} width={240} height={28} rx={4}
                        fill={lit ? SLIP : MUTED} opacity={lit ? 0.14 : 0.07}
                        stroke={lit ? SLIP : MUTED} strokeWidth={lit ? 1.25 : 0.75} />
                      <text x={52} y={96 + i * 34} fontSize={8} fontWeight={700} fill={INK}>
                        {String(t)}
                      </text>
                      <text x={270} y={96 + i * 34} fontSize={8.5} fontWeight={700} fill={lit ? SLIP : MUTED} textAnchor="end">
                        {String(v)}
                      </text>
                    </g>
                  ))}
                  <text x={300} y={96} fontSize={8} fill={INK}>
                    → 610이 남음
                  </text>
                  <text x={300} y={116} fontSize={8} fill={INK}>
                    → 합계 2,641,610
                  </text>
                  <text x={300} y={136} fontSize={8} fontWeight={700} fill={SLIP}>
                    → 두 배로 3220
                  </text>
                </g>
              )}

              {s === 2 && (
                <g>
                  <rect x={20} y={26} width={214} height={66} rx={4} fill={KEEP} opacity={0.12} stroke={KEEP} strokeWidth={1.25} />
                  <text x={32} y={42} fontSize={8} fontWeight={700} fill={KEEP}>
                    저자가 적은 검산
                  </text>
                  <text x={32} y={58} fontSize={7.5} fill={INK}>
                    한 사람에게 하루 한 코이닉스
                  </text>
                  <text x={32} y={74} fontSize={10} fontWeight={700} fill={INK}>
                    하루 110,340 메딤노이
                  </text>
                  <text x={32} y={87} fontSize={7.5} fill={MUTED}>
                    책에 적힌 값
                  </text>

                  <rect x={246} y={26} width={214} height={66} rx={4} fill={SLIP} opacity={0.1} stroke={SLIP} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={258} y={42} fontSize={8} fontWeight={700} fill={SLIP}>
                    다시 나눠 보면
                  </text>
                  <text x={258} y={58} fontSize={7.5} fill={INK}>
                    1 메딤노스 = 48 코이닉스
                  </text>
                  <text x={258} y={74} fontSize={10} fontWeight={700} fill={INK}>
                    110,067 메딤노이 + 4
                  </text>
                  <text x={258} y={87} fontSize={7.5} fill={MUTED}>
                    5,283,220 ÷ 48
                  </text>

                  <rect x={20} y={104} width={440} height={38} rx={4} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} />
                  <text x={32} y={120} fontSize={8} fontWeight={700} fill={INK}>
                    수와 규칙을 함께 적어 두었기 때문에 2,400년 뒤에도 검산이 됩니다
                  </text>
                  <text x={32} y={134} fontSize={7.5} fill={INK}>
                    영역자도 주석에서 이 계산이 틀렸다고 적어 두었습니다
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={26} width={214} height={72} rx={5} fill={KEEP} opacity={0.13} stroke={KEEP} strokeWidth={1.25} />
                  <text x={32} y={44} fontSize={8.5} fontWeight={700} fill={KEEP}>
                    남는 것
                  </text>
                  <text x={32} y={60} fontSize={7.5} fill={INK}>
                    총계의 자릿수
                  </text>
                  <text x={32} y={74} fontSize={7.5} fill={INK}>
                    어떤 가정들 위에 올라가 있는지
                  </text>
                  <text x={32} y={90} fontSize={7.5} fill={INK}>
                    셀 수 없다고 적어 둔 경계
                  </text>

                  <rect x={246} y={26} width={214} height={72} rx={5} fill={SLIP} opacity={0.1} stroke={SLIP} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={258} y={44} fontSize={8.5} fontWeight={700} fill={SLIP}>
                    남지 않는 것
                  </text>
                  <text x={258} y={60} fontSize={7.5} fill={INK}>
                    끝 네 자리의 뜻
                  </text>
                  <text x={258} y={74} fontSize={7.5} fill={INK}>
                    다른 기록과의 자릿수 아래 비교
                  </text>
                  <text x={258} y={90} fontSize={7.5} fill={INK}>
                    저자의 검산 결과
                  </text>

                  <rect x={20} y={110} width={440} height={32} rx={4} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} />
                  <text x={32} y={130} fontSize={8} fontWeight={700} fill={INK}>
                    계산을 적어 둔 덕분에 무엇이 남고 무엇이 남지 않는지를 가를 수 있습니다
                  </text>
                </g>
              )}

              <text x={20} y={178} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "끝자리가 0이 아니면 센 수처럼 보입니다"
                  : s === 1
                    ? "그 자리를 만든 재료는 하나뿐입니다"
                    : s === 2
                      ? "저자의 검산을 48로 나눠 보면 맞지 않습니다"
                      : "자릿수는 남고 끝자리는 남지 않습니다"}
              </text>
              <text x={20} y={192} fontSize={7.5} fill={MUTED}>
                계산이 적혀 있어 어느 자리가 어디서 왔는지 따라갈 수 있습니다
              </text>
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
