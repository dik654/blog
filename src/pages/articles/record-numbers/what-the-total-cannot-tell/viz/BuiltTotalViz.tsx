import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ingredients·tags 절. 재료와 꼬리표는 헤로도토스 7권 184~186절 */
const SCENES = ["아시아 해군", "아시아 육군", "유럽", "두 배로"] as const;

const RATE = "#f59e0b";
const PROC = "#0ea5e9";
const GUESS = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

type Row = { label: string; value: string; kind: "rate" | "proc" | "guess"; tag: string };

const GROUPS: readonly (readonly Row[])[] = [
  [
    { label: "배 1,207척 × 1척당 200명", value: "241,400", kind: "rate", tag: "비율로 환산" },
    { label: "배마다 전사 30명", value: "36,210", kind: "rate", tag: "비율로 환산" },
    { label: "오십노선 3,000척 × 여든 남짓", value: "240,000", kind: "guess", tag: "어림한 비율" },
  ],
  [
    { label: "보병", value: "1,700,000", kind: "proc", tag: "담으로 센 수" },
    { label: "기병", value: "80,000", kind: "proc", tag: "앞에서 적은 수" },
    { label: "낙타·전차 몰이", value: "20,000", kind: "guess", tag: "2만으로 잡음" },
  ],
  [
    { label: "트라키아 배 120척", value: "24,000", kind: "rate", tag: "비율로 환산" },
    { label: "트라키아 등 육군", value: "300,000", kind: "guess", tag: "어림한 값" },
  ],
  [
    { label: "전투원 합계", value: "2,641,610", kind: "proc", tag: "위의 합" },
    { label: "종자·수송 인원", value: "2,641,610", kind: "guess", tag: "같다고 가정" },
  ],
];

const COLOR = { rate: RATE, proc: PROC, guess: GUESS } as const;

export default function BuiltTotalViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;
  const rows = GROUPS[s];

  const NOTES = [
    `아시아에서 온 배는 1,207척이고, 한 척에 200명씩으로 치면 24만 1400명입니다. 배마다 페르시아·메디아·사카이 사람 30명이 더 탔다고 해서 3만 6210을 더하고, 오십노선 3,000척에는 여든 남짓씩 보아 24만을 더합니다. 합이 51만 7610입니다.`,
    `육군 쪽은 앞 글에서 본 보병 170만과 기병 8만이 들어갑니다. 여기에 아라비아 낙타몰이와 리비아 전차몰이를 2만으로 잡아 더합니다. 아시아에서 온 전체가 231만 7610이 됩니다.`,
    `유럽 쪽은 저자가 어림을 내놓아야 한다고 먼저 적습니다. 트라키아와 그 앞바다 섬들이 낸 배 120척에서 2만 4000명이 나오고, 트라키아·마케도니아를 비롯한 여러 민족의 육군을 30만으로 어림합니다. 전투원 합계가 264만 1610이 됩니다.`,
    `마지막이 가장 큰 가정입니다. 종자와 곡식을 실은 배의 사람들이 전투원보다 적지 않고 오히려 많을 것이라고 적은 뒤, 더도 덜도 아니고 같다고 가정하겠다며 두 배로 만듭니다. 그렇게 나온 수가 528만 3220입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="총계의 재료"
      title="528만 3220은 센 수가 아니라 여섯 개의 비율과 어림을 쌓아 만든 수입니다"
      description="배 한 척당 인원, 오십노선의 인원, 몰이꾼 수, 유럽 육군, 종자의 수까지 저자가 가정하거나 어림한 값이 차례로 더해지고 마지막에 두 배가 됩니다."
      note="재료와 각 값은 헤로도토스 『역사』 7권 184~186절의 것입니다. Macaulay 영역본으로 읽었고 괄호 안 환산은 영역자 주석을 따랐습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="총계가 어떤 재료를 쌓아 만들어졌는지 보이는 그림"
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
              {rows.map((r, i) => {
                const y = 24 + i * 34;
                const c = COLOR[r.kind];
                return (
                  <g key={r.label}>
                    <rect x={20} y={y} width={300} height={28} rx={4} fill={c} opacity={0.12} stroke={c} strokeWidth={1.25} />
                    <text x={32} y={y + 13} fontSize={8} fontWeight={700} fill={INK}>
                      {r.label}
                    </text>
                    <text x={32} y={y + 24} fontSize={7.5} fill={c}>
                      {r.tag}
                    </text>
                    <text x={310} y={y + 19} fontSize={9} fontWeight={700} fill={INK} textAnchor="end">
                      {r.value}
                    </text>
                  </g>
                );
              })}

              <rect x={332} y={24} width={128} height={62} rx={4} fill={MUTED} opacity={0.09} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
              <text x={344} y={40} fontSize={8} fontWeight={700} fill={INK}>
                이 묶음의 합
              </text>
              <text x={344} y={58} fontSize={10} fontWeight={700} fill={INK}>
                {s === 0 ? "517,610" : s === 1 ? "2,317,610" : s === 2 ? "2,641,610" : "5,283,220"}
              </text>
              <text x={344} y={74} fontSize={7.5} fill={MUTED}>
                {s === 0 ? "아시아 해군" : s === 1 ? "아시아 전체" : s === 2 ? "전투원 합계" : "적힌 총계"}
              </text>

              {/* 범례 */}
              <g>
                {[
                  { c: PROC, t: "절차나 앞 기록에서 온 수" },
                  { c: RATE, t: "비율을 곱해 만든 수" },
                  { c: GUESS, t: "어림하거나 가정한 수" },
                ].map((l, i) => (
                  <g key={l.t}>
                    <rect x={332} y={100 + i * 18} width={10} height={10} rx={2} fill={l.c} opacity={0.4} stroke={l.c} strokeWidth={0.75} />
                    <text x={348} y={109 + i * 18} fontSize={7.5} fill={INK}>
                      {l.t}
                    </text>
                  </g>
                ))}
              </g>

              <text x={20} y={178} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "배의 수는 적혀 있고 1척당 인원은 저자가 정한 비율입니다"
                  : s === 1
                    ? "보병만 절차에서 왔고 몰이꾼 2만은 잡은 수입니다"
                    : s === 2
                      ? "유럽 쪽은 어림을 내놓겠다고 먼저 적습니다"
                      : "종자를 전투원과 같다고 가정해 두 배로 만듭니다"}
              </text>
              <text x={20} y={192} fontSize={7.5} fill={MUTED}>
                각 재료에 어떤 종류의 수인지가 본문에 적혀 있습니다
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
