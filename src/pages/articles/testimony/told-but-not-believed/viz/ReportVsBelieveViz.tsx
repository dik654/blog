import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-duties·scope 절. 두 의무의 분리는 헤로도토스 7권 152절 */
const SCENES = [
  "묶여 있을 때",
  "둘을 가름",
  "규칙의 범위",
  "읽는 쪽이 얻는 것",
] as const;

const DUTY = "#0ea5e9";
const BELIEF = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function ReportVsBelieveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `적는 일과 믿는 일을 하나로 묶으면 믿지 못하는 이야기는 책에 들어오지 못합니다. 그러면 빠진 이야기가 있었다는 사실 자체가 기록에서 사라져, 뒷사람은 저자가 무엇을 버렸는지 알 수 없습니다.`,
    `저자는 둘을 가릅니다. 전해지는 것을 전할 의무는 있지만 그것을 다 믿을 의무는 없다고 적습니다. 그래서 믿지 않는 이야기도 책에 들어오고, 믿지 않는다는 사실도 함께 들어옵니다.`,
    `이 규칙의 범위를 저자가 직접 적어 둡니다. 아르고스 이야기 한 대목에만 쓰는 것이 아니라 이 역사의 모든 서술에 해당한다고 둡니다. 범위가 적혀 있으므로 독자는 다른 대목에서도 같은 기준으로 읽을 수 있습니다.`,
    `읽는 쪽이 얻는 것은 확정된 답이 아니라 두 가지 정보입니다. 무엇이 전해졌는지, 그리고 저자가 그것을 어디까지 받아들였는지입니다. 둘이 따로 적혀 있으면 판정은 미뤄지지만 판정에 필요한 재료는 남습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="두 의무"
      title="전할 의무와 믿을 의무를 따로 두면 믿지 않는 이야기도 기록에 남습니다"
      description="저자는 전해지는 것을 전할 의무와 그것을 믿을 의무를 가르고, 그 규칙이 이 역사의 모든 서술에 해당한다고 적어 두었습니다."
      note="두 의무를 가른 문장과 그 범위는 헤로도토스 『역사』 7권 152절의 것입니다. Macaulay 영역본으로 읽었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="전할 의무와 믿을 의무를 가르면 믿지 않는 이야기도 남는다는 것을 보이는 그림"
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
              {/* 들어오는 이야기 */}
              <text x={20} y={22} fontSize={8} fontWeight={700} fill={MUTED}>
                전해지는 이야기
              </text>
              {["믿을 만한 것", "의심스러운 것"].map((t, i) => (
                <g key={t}>
                  <rect x={20} y={30 + i * 26} width={96} height={20} rx={3} fill={i === 0 ? DUTY : BELIEF} opacity={0.14} stroke={i === 0 ? DUTY : BELIEF} strokeWidth={0.75} />
                  <text x={68} y={44 + i * 26} fontSize={7.5} fill={INK} textAnchor="middle">
                    {t}
                  </text>
                </g>
              ))}

              {/* 관문 */}
              {s === 0 ? (
                <g>
                  <rect x={160} y={28} width={120} height={48} rx={4} fill={MUTED} opacity={0.12} stroke={MUTED} strokeWidth={1.25} />
                  <text x={220} y={48} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    적는 일 = 믿는 일
                  </text>
                  <text x={220} y={64} fontSize={7.5} fill={MUTED} textAnchor="middle">
                    하나의 관문
                  </text>
                  <text x={330} y={44} fontSize={8} fontWeight={700} fill={DUTY}>
                    믿을 만한 것만 남음
                  </text>
                  <text x={330} y={62} fontSize={8} fill={MUTED}>
                    의심스러운 것은 버려짐
                  </text>
                  <text x={330} y={78} fontSize={7.5} fill={MUTED}>
                    버린 사실도 함께 사라짐
                  </text>
                </g>
              ) : (
                <g>
                  <rect x={160} y={26} width={120} height={22} rx={3} fill={DUTY} opacity={0.18} stroke={DUTY} strokeWidth={1.25} />
                  <text x={220} y={41} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    전할 의무 · 있음
                  </text>
                  <rect x={160} y={56} width={120} height={22} rx={3} fill={BELIEF} opacity={0.18} stroke={BELIEF} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={220} y={71} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    믿을 의무 · 없음
                  </text>
                  <text x={330} y={38} fontSize={8} fontWeight={700} fill={DUTY}>
                    두 이야기가 다 남음
                  </text>
                  <text x={330} y={56} fontSize={8} fill={INK}>
                    각각에 꼬리표가 붙음
                  </text>
                  <text x={330} y={74} fontSize={7.5} fill={MUTED}>
                    믿지 않는다는 사실도 남음
                  </text>
                </g>
              )}

              {/* 범위 */}
              {s >= 2 && (
                <g>
                  <rect x={20} y={94} width={440} height={32} rx={4} fill={DUTY} opacity={0.1} stroke={DUTY} strokeWidth={1.25} />
                  <text x={32} y={107} fontSize={8} fontWeight={700} fill={INK}>
                    규칙의 범위 · 저자가 직접 적음
                  </text>
                  <text x={32} y={121} fontSize={7.5} fill={INK}>
                    이 한 대목에만 쓰는 것이 아니라 이 역사의 모든 서술에 해당한다고 둡니다
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  {[
                    "무엇이 전해졌는가",
                    "저자가 어디까지 받아들였는가",
                  ].map((t, i) => (
                    <g key={t}>
                      <rect x={20 + i * 226} y={136} width={214} height={26} rx={4} fill={i === 0 ? DUTY : BELIEF} opacity={0.14} stroke={i === 0 ? DUTY : BELIEF} strokeWidth={1.25} />
                      <text x={127 + i * 226} y={152} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                        {t}
                      </text>
                    </g>
                  ))}
                  <text x={240} y={176} fontSize={8} fill={MUTED} textAnchor="middle">
                    둘이 따로 적혀 있어 판정의 재료가 남습니다
                  </text>
                </g>
              )}

              <text x={20} y={194} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "두 일이 묶여 있으면 버린 이야기가 기록에서 사라집니다"
                  : s === 1
                    ? "전할 의무는 있고 믿을 의무는 없다고 적습니다"
                    : s === 2
                      ? "규칙이 책 전체에 걸린다는 것까지 적혀 있습니다"
                      : "확정된 답 대신 판정에 필요한 두 정보가 남습니다"}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground max-[390px]:min-h-[12.25rem] min-[390px]:max-sm:min-h-[8.75rem]">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
