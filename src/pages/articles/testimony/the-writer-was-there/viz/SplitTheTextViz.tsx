import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: split·hostile-witness·audience 절. 요세푸스 『유대 전쟁사』 서문 4·8·12절 */
const SCENES = [
  "한 덩이로 읽을 때",
  "두 칸으로 나눔",
  "바깥 고정점 둘",
  "읽는 쪽이 하는 일",
] as const;

const FACT = "#0ea5e9";
const GRIEF = "#f59e0b";
const OUT = "#10b981";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function SplitTheTextViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `저자는 자기 나라가 겪은 일에 애도를 섞겠다고 미리 말합니다. 그것을 한 덩이로 읽으면 글 전체가 한쪽 편의 글이 되고, 사실 서술까지 같은 의심을 받습니다. 애도가 섞여 있다는 것을 저자가 숨기지 않았다는 점도 함께 묻힙니다.`,
    `그래서 저자는 읽는 쪽에 나눠 읽기를 요청합니다. 자기를 끝까지 비난하려는 사람이라도 사실은 역사 부분으로 돌리고 애도는 글쓴이 자신에게만 돌리라는 것입니다. 1편의 저자는 자기가 두 칸을 나눠 만들었고, 여기서는 나누는 일이 독자에게 넘어옵니다.`,
    `나눠 읽기가 작동하려면 바깥에 고정점이 있어야 합니다. 저자는 둘을 댑니다. 자기 나라를 망친 것이 내부의 폭군들이었다는 주장에는 그 성을 무너뜨린 티투스를 증인으로 세우고, 서술 전체에는 그 전쟁을 겪어 아는 독자를 둡니다.`,
    `읽는 쪽이 할 일은 두 가지입니다. 어느 문장이 사실 서술이고 어느 문장이 애도인지 가르는 것, 그리고 저자가 댄 증인과 독자가 각 주장에 실제로 닿는지를 따지는 것입니다. 증인이 어느 쪽에 유리한가를 함께 보는 것은 이 글의 읽기이고 저자가 적어 둔 것은 아닙니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="나눠 읽기"
      title="사실과 애도를 나눠 읽으라는 요청에는 바깥 고정점이 따라옵니다"
      description="저자는 애도를 섞겠다고 미리 밝히고 그것을 글쓴이에게만 돌리라고 요청하며, 사실 쪽에는 적장의 증언과 전쟁을 겪은 독자를 고정점으로 댑니다."
      note="나눠 읽기 요청은 서문 4절, 겪은 이들이 독자라는 대목은 서문 8·12절의 것입니다. Whiston 영역본으로 읽었습니다. 증인의 유리함을 함께 보는 읽기는 이 글이 더한 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사실과 애도를 나눠 읽는 요청과 두 바깥 고정점을 보이는 그림"
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
              {s === 0 ? (
                <g>
                  <rect x={20} y={20} width={200} height={70} rx={5} fill={MUTED} opacity={0.12} stroke={MUTED} strokeWidth={1.25} />
                  <text x={120} y={42} fontSize={9} fontWeight={700} fill={INK} textAnchor="middle">
                    한 덩이의 글
                  </text>
                  <text x={120} y={60} fontSize={7.5} fill={INK} textAnchor="middle">
                    사실 서술과 애도가 섞여 있음
                  </text>
                  <text x={120} y={76} fontSize={7.5} fill={MUTED} textAnchor="middle">
                    저자가 섞겠다고 미리 밝힘
                  </text>
                  <text x={250} y={42} fontSize={8} fontWeight={700} fill={MUTED}>
                    한쪽 편의 글로 읽힘
                  </text>
                  <text x={250} y={60} fontSize={8} fill={INK}>
                    사실 서술까지 같은 의심을 받음
                  </text>
                  <text x={250} y={78} fontSize={7.5} fill={MUTED}>
                    숨기지 않았다는 점도 묻힘
                  </text>
                </g>
              ) : (
                <g>
                  <rect x={20} y={20} width={214} height={34} rx={4} fill={FACT} opacity={0.15} stroke={FACT} strokeWidth={1.25} />
                  <text x={127} y={34} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    사실 · 역사 부분으로 돌릴 것
                  </text>
                  <text x={127} y={48} fontSize={7.5} fill={INK} textAnchor="middle">
                    양쪽의 행적을 정확히 다루겠다고 적음
                  </text>

                  <rect x={246} y={20} width={214} height={34} rx={4} fill={GRIEF} opacity={0.15} stroke={GRIEF} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={353} y={34} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    애도 · 글쓴이에게만 돌릴 것
                  </text>
                  <text x={353} y={48} fontSize={7.5} fill={INK} textAnchor="middle">
                    자기 나라의 비참에 대한 탄식
                  </text>
                </g>
              )}

              {s >= 2 && (
                <g>
                  <rect x={20} y={66} width={214} height={52} rx={4} fill={OUT} opacity={0.12} stroke={OUT} strokeWidth={1.25} />
                  <text x={32} y={81} fontSize={8} fontWeight={700} fill={OUT}>
                    고정점 1 · 적장의 증언
                  </text>
                  <text x={32} y={95} fontSize={7.5} fill={INK}>
                    나라를 망친 것이 내부의 폭군들이라는
                  </text>
                  <text x={32} y={108} fontSize={7.5} fill={INK}>
                    주장에 티투스를 증인으로 댐
                  </text>

                  <rect x={246} y={66} width={214} height={52} rx={4} fill={OUT} opacity={0.12} stroke={OUT} strokeWidth={1.25} />
                  <text x={258} y={81} fontSize={8} fontWeight={700} fill={OUT}>
                    고정점 2 · 겪은 사람이 독자
                  </text>
                  <text x={258} y={95} fontSize={7.5} fill={INK}>
                    진실을 아는 이들에게 말하므로
                  </text>
                  <text x={258} y={108} fontSize={7.5} fill={INK}>
                    자기가 겪은 일도 숨기지 않겠다고 적음
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={128} width={440} height={50} rx={5} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={32} y={144} fontSize={8} fontWeight={700} fill={INK}>
                    읽는 쪽이 하는 두 가지
                  </text>
                  <text x={32} y={158} fontSize={7.5} fill={INK}>
                    하나 · 사실 서술과 애도를 문장 단위로 가른다
                  </text>
                  <text x={32} y={171} fontSize={7.5} fill={INK}>
                    둘 · 댄 증인과 독자가 그 주장에 실제로 닿는지 따진다
                  </text>
                </g>
              )}

              {s < 3 && (
                <text x={20} y={194} fontSize={8} fontWeight={700} fill={INK}>
                  {s === 0
                    ? "섞인 채로 읽으면 사실 서술까지 함께 의심받습니다"
                    : s === 1
                      ? "나누는 일이 저자에게서 독자에게로 넘어옵니다"
                      : "나눠 읽기가 작동하려면 바깥에 댈 것이 있어야 합니다"}
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
