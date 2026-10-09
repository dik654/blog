import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: rungs·same-ladder 절. 조항 번호는 함무라비 법전 196~201·209~217·221~223 */
const SCENES = ["눈과 뼈", "유산", "의사 사례", "같은 사다리"] as const;

const TOP = "#ef4444";
const MID = "#0ea5e9";
const LOW = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#334155";

type Row = { who: string; answer: string; kind: "mirror" | "fixed" | "share" };

const CASES: readonly { title: string; cite: string; rows: readonly Row[] }[] = [
  {
    title: "눈을 잃게 하거나 뼈를 부러뜨렸을 때",
    cite: "196~199조",
    rows: [
      { who: "상대가 신사", answer: "그의 눈을 잃게 한다", kind: "mirror" },
      { who: "상대가 가난한 사람", answer: "은 1마나 (60세켈)", kind: "fixed" },
      { who: "상대가 신사의 종", answer: "그 값의 절반", kind: "share" },
    ],
  },
  {
    title: "때려서 아이를 잃게 했을 때",
    cite: "209·211·213조",
    rows: [
      { who: "신사의 딸", answer: "은 10세켈", kind: "fixed" },
      { who: "가난한 사람의 딸", answer: "은 5세켈", kind: "fixed" },
      { who: "신사의 여종", answer: "은 2세켈", kind: "fixed" },
    ],
  },
  {
    title: "의사가 큰 상처나 눈을 고쳤을 때 받는 돈",
    cite: "215~217조",
    rows: [
      { who: "환자가 신사", answer: "은 10세켈", kind: "fixed" },
      { who: "환자가 가난한 사람", answer: "은 5세켈", kind: "fixed" },
      { who: "환자가 신사의 종", answer: "은 2세켈", kind: "fixed" },
    ],
  },
];

const COLOR = { mirror: TOP, fixed: MID, share: LOW } as const;

export default function LadderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;
  const c = CASES[Math.min(s, 2)];

  const NOTES = [
    `같은 상해에 대한 답이 상대의 신분에 따라 세 칸으로 갈립니다. 그런데 갈리는 것이 금액만이 아닙니다. 맨 위 칸은 돈이 아니라 같은 해를 돌려주고, 가운데 칸은 정해진 금액이며, 아래 칸은 그 사람의 값에 대한 비율입니다. 한 사다리 안에서 답의 종류가 바뀝니다.`,
    `때려서 아이를 잃게 한 경우에는 세 칸이 모두 금액입니다. 10세켈, 5세켈, 2세켈로 내려갑니다. 맨 위 칸에도 숫자가 들어간 것이 앞 경우와 다른 점입니다.`,
    `의사가 큰 상처를 고치거나 눈의 종기를 째서 고쳤을 때 받는 돈도 10세켈, 5세켈, 2세켈입니다. 앞의 배상과 완전히 다른 일인데 숫자의 사다리가 같습니다.`,
    `두 사다리를 겹쳐 보면 10 · 5 · 2가 그대로 포개집니다. 한쪽은 해를 입힌 쪽이 물어 주는 돈이고 다른 쪽은 고쳐 준 사람이 받는 돈인데, 같은 수가 쓰였습니다. 이 숫자가 담고 있는 것은 그 일의 크기가 아니라 상대가 어느 칸의 사람인가입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="사다리"
      title="같은 수가 배상에도 사례금에도 쓰입니다"
      description="상해의 사다리에서는 칸마다 답의 종류가 바뀌고, 배상과 의사 사례금에서는 10·5·2라는 같은 사다리가 서로 다른 일에 그대로 쓰입니다."
      note="조항과 금액은 함무라비 법전 196~199·209~217조의 것입니다. C. H. W. Johns 영역본으로 읽었고, 1마나 = 60세켈 환산은 같은 판의 색인 주에 적힌 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="신분에 따라 답이 갈리는 사다리와 같은 수가 다른 일에 쓰이는 것을 보이는 그림"
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
              {s < 3 ? (
                <g>
                  <text x={20} y={22} fontSize={9} fontWeight={700} fill={INK}>
                    {c.title}
                  </text>
                  <text x={460} y={22} fontSize={8} fill={MUTED} textAnchor="end">
                    {c.cite}
                  </text>
                  {c.rows.map((r, i) => {
                    const y = 34 + i * 38;
                    const col = COLOR[r.kind];
                    return (
                      <g key={r.who}>
                        <rect x={20} y={y} width={180} height={30} rx={4} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={0.75} />
                        <text x={32} y={y + 20} fontSize={8.5} fontWeight={700} fill={INK}>
                          {r.who}
                        </text>
                        <text x={212} y={y + 20} fontSize={9} fill={MUTED}>
                          →
                        </text>
                        <rect x={232} y={y} width={228} height={30} rx={4} fill={col} opacity={0.14} stroke={col} strokeWidth={1.25} />
                        <text x={244} y={y + 20} fontSize={8.5} fontWeight={700} fill={INK}>
                          {r.answer}
                        </text>
                        <text x={450} y={y + 20} fontSize={7.5} fill={col} textAnchor="end">
                          {r.kind === "mirror" ? "같은 해" : r.kind === "fixed" ? "고정액" : "값의 비율"}
                        </text>
                      </g>
                    );
                  })}
                </g>
              ) : (
                <g>
                  <text x={126} y={24} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    아이를 잃게 한 배상
                  </text>
                  <text x={354} y={24} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    의사가 받는 사례금
                  </text>
                  {["10세켈", "5세켈", "2세켈"].map((v, i) => {
                    const y = 36 + i * 36;
                    return (
                      <g key={v}>
                        <rect x={20} y={y} width={212} height={28} rx={4} fill={MID} opacity={0.14} stroke={MID} strokeWidth={1.25} />
                        <text x={126} y={y + 18} fontSize={9} fontWeight={700} fill={INK} textAnchor="middle">
                          {v}
                        </text>
                        <rect x={248} y={y} width={212} height={28} rx={4} fill={MID} opacity={0.14} stroke={MID} strokeWidth={1.25} />
                        <text x={354} y={y + 18} fontSize={9} fontWeight={700} fill={INK} textAnchor="middle">
                          {v}
                        </text>
                        <text x={240} y={y + 18} fontSize={8} fontWeight={700} fill={MID} textAnchor="middle">
                          =
                        </text>
                      </g>
                    );
                  })}
                  <rect x={20} y={146} width={440} height={30} rx={4} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} />
                  <text x={32} y={165} fontSize={8} fontWeight={700} fill={INK}>
                    수가 담고 있는 것은 그 일의 크기가 아니라 상대가 어느 칸의 사람인가입니다
                  </text>
                </g>
              )}

              <text x={20} y={194} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "한 사다리 안에서 답의 종류가 바뀝니다"
                  : s === 1
                    ? "여기서는 세 칸이 모두 금액입니다"
                    : s === 2
                      ? "전혀 다른 일인데 금액이 같습니다"
                      : "두 사다리가 그대로 포개집니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-h-[15.75rem] min-[390px]:min-h-[10.5rem] sm:min-h-0">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
