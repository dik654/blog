import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: not-enough·own-position 절. 두 실패와 자기 소개는 요세푸스 『유대 전쟁사』 서문 1절 */
const SCENES = [
  "없던 사람",
  "있던 사람",
  "남는 질문",
  "자기 자리",
] as const;

const ABSENT = "#94a3b8";
const PRESENT = "#ef4444";
const SELF = "#0ea5e9";
const INK = "#334155";

export default function PresenceIsNotEnoughViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `첫 번째 실패는 그 일에 관여하지 않은 사람들의 것입니다. 저자는 그들이 들은 말을 모아 헛되고 서로 어긋나는 이야기를 만들고 그것을 말재주로 적어 냈다고 적습니다. 자리에 없었다는 것이 실패의 원인입니다.`,
    `두 번째 실패는 그 자리에 있던 사람들의 것입니다. 저자는 현장에 있던 자들도 거짓된 서술을 했다고 적고, 그 까닭을 로마에 아첨하는 기분이거나 유대인을 미워하는 마음이라고 둡니다. 그래서 그들의 글에는 고발과 찬사가 번갈아 들어 있고 사실의 정확한 진실은 어디에도 없다고 합니다.`,
    `두 실패를 나란히 두면 질문이 남습니다. 자리에 있었다는 것으로는 글의 신뢰를 세울 수 없으니, 있었던 사람이 무엇을 더 적어야 하는가입니다. 저자가 다음 줄에서 한 일이 그 답입니다.`,
    `저자는 자기 이름과 자리를 먼저 적습니다. 마티아스의 아들 요셉, 태생이 히브리인이고 제사장이며, 처음에는 로마와 맞서 싸웠고 그 뒤에 벌어진 일에는 있도록 강제되었다고 적습니다. 자기가 양쪽을 다 거쳤다는 사실을 글머리에 두어, 독자가 치우침의 방향을 짐작할 재료를 먼저 받습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="두 실패"
      title="자리에 있었다는 것만으로는 기록의 신뢰가 서지 않습니다"
      description="없던 사람은 들은 말을 모아 어긋나는 이야기를 적고, 있던 사람은 아첨이나 증오 때문에 거짓을 적었습니다. 저자는 두 실패를 먼저 적고 나서 자기 자리를 밝힙니다."
      note="두 실패와 저자의 자기 소개는 요세푸스 『유대 전쟁사』 서문 1절의 것입니다. Whiston 영역본으로 읽었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="자리에 없던 사람과 있던 사람의 실패를 각각 보이고 저자가 밝힌 자기 자리를 보이는 그림"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
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
              <rect x={20} y={16} width={214} height={74} rx={5}
                fill={ABSENT} opacity={s === 0 ? 0.16 : 0.06}
                stroke={ABSENT} strokeWidth={s === 0 ? 1.25 : 0.75} />
              <text x={127} y={32} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                그 일에 관여하지 않은 사람
              </text>
              <text x={127} y={50} fontSize={7.5} fill={INK} textAnchor="middle">
                들은 말을 모음
              </text>
              <text x={127} y={64} fontSize={7.5} fill={INK} textAnchor="middle">
                헛되고 서로 어긋나는 이야기
              </text>
              <text x={127} y={80} fontSize={7.5} fontWeight={700} fill={ABSENT} textAnchor="middle">
                말재주로 적어 냄
              </text>

              <rect x={246} y={16} width={214} height={74} rx={5}
                fill={PRESENT} opacity={s === 1 ? 0.16 : 0.06}
                stroke={PRESENT} strokeWidth={s === 1 ? 1.25 : 0.75} />
              <text x={353} y={32} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                그 자리에 있던 사람
              </text>
              <text x={353} y={50} fontSize={7.5} fill={INK} textAnchor="middle">
                로마에 아첨하거나 유대인을 미워함
              </text>
              <text x={353} y={64} fontSize={7.5} fill={INK} textAnchor="middle">
                고발과 찬사가 번갈아 들어감
              </text>
              <text x={353} y={80} fontSize={7.5} fontWeight={700} fill={PRESENT} textAnchor="middle">
                거짓된 서술을 적음
              </text>

              {s >= 2 && (
                <g>
                  <rect x={20} y={100} width={440} height={26} rx={4} fill={INK} opacity={0.07} stroke={INK} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={240} y={117} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    있었다는 것으로는 신뢰가 서지 않는다면, 있었던 사람은 무엇을 더 적어야 하는가
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={134} width={440} height={50} rx={5} fill={SELF} opacity={0.13} stroke={SELF} strokeWidth={1.25} />
                  <text x={32} y={150} fontSize={8} fontWeight={700} fill={SELF}>
                    저자가 글머리에 적은 자기 자리
                  </text>
                  <text x={32} y={165} fontSize={7.5} fill={INK}>
                    마티아스의 아들 요셉 · 태생이 히브리인 · 제사장
                  </text>
                  <text x={32} y={178} fontSize={7.5} fill={INK}>
                    처음에는 로마와 맞서 싸웠고, 그 뒤의 일에는 있도록 강제되었다
                  </text>
                </g>
              )}

              {s < 3 && (
                <text x={20} y={194} fontSize={8} fontWeight={700} fill={INK}>
                  {s === 0
                    ? "자리에 없던 것이 첫 번째 실패의 원인입니다"
                    : s === 1
                      ? "자리에 있었는데도 거짓을 적은 것이 두 번째 실패입니다"
                      : "그래서 있었던 사람에게도 더 적을 것이 남습니다"}
                </text>
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
