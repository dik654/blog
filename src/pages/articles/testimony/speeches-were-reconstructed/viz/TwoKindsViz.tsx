import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-kinds·speeches·events 절. 구분은 투키디데스 1권 22절 */
const SCENES = [
  "한 책 안에 성격이 다른 두 가지가 있습니다",
  "연설은 기억으로 옮길 수 없었습니다",
  "사건은 자기 인상조차 믿지 않았습니다",
  "두 칸을 섞으면 책을 잘못 읽습니다",
] as const;

const SPEECH = "#ef4444";
const EVENT = "#0ea5e9";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function TwoKindsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `같은 책에 연설과 사건이 함께 들어 있습니다. 읽는 사람에게는 둘 다 똑같이 "적힌 것"으로 보이지만, 저자는 둘을 전혀 다른 방법으로 만들었다고 밝혔습니다.`,
    `연설은 말 그대로 옮길 수 없었습니다. 직접 들은 것도 있고 남에게서 받은 것도 있는데, 어느 쪽이든 한 마디씩 기억에 담아 두기가 어려웠다고 적습니다. 그래서 그 자리에서 요구되었다고 자기가 판단한 말을 하게 하되, 실제로 한 말의 전체 뜻에는 되도록 가깝게 맞췄다고 합니다.`,
    `사건은 반대입니다. 손에 닿는 첫 이야기에서 가져오지 않았고 자기 인상조차 믿지 않았다고 적습니다. 자기가 본 것과 남이 자기를 위해 본 것을 두고, 보고의 정확함을 할 수 있는 한 엄하고 자세하게 시험했다고 합니다.`,
    `두 칸의 신뢰 근거가 다릅니다. 연설 칸은 저자의 판단이 섞인 재구성이고, 사건 칸은 교차 확인을 거친 보고입니다. 이 구분을 지우고 "투키디데스가 그렇게 적었다"로 뭉뚱그리면, 저자가 스스로 그어 둔 선을 독자가 지우는 셈이 됩니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="두 칸"
      title="같은 책 안에서 연설과 사건은 서로 다른 방법으로 만들어졌습니다"
      description="저자가 두 칸을 만드는 방법을 각각 밝혀 두었으므로, 읽는 쪽은 어느 칸에서 가져온 문장인지를 먼저 보아야 합니다."
      note="구분과 서술은 투키디데스 『펠로폰네소스 전쟁사』 1권 22절의 것입니다. Crawley 영역본으로 읽었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="연설과 사건이 서로 다른 방법으로 만들어졌음을 보이는 그림"
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
              {/* 책 */}
              <rect x={22} y={34} width={192} height={132} rx={5} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={1.25} />
              <text x={118} y={28} fontSize={8.5} fontWeight={700} fill={MUTED} textAnchor="middle">
                한 권의 책
              </text>

              <rect x={36} y={48} width={164} height={48} rx={4}
                fill={SPEECH} opacity={s === 1 || s === 3 ? 0.22 : 0.09}
                stroke={SPEECH} strokeWidth={s === 1 || s === 3 ? 1.25 : 0.75} />
              <text x={118} y={70} fontSize={9} fontWeight={700} fill={SPEECH} textAnchor="middle">
                연설
              </text>
              <text x={118} y={86} fontSize={7.5} fill={INK} textAnchor="middle">
                {s >= 1 ? "그 자리에 요구된 말로 지음" : "사람들이 한 말"}
              </text>

              <rect x={36} y={106} width={164} height={48} rx={4}
                fill={EVENT} opacity={s === 2 || s === 3 ? 0.22 : 0.09}
                stroke={EVENT} strokeWidth={s === 2 || s === 3 ? 1.25 : 0.75} />
              <text x={118} y={128} fontSize={9} fontWeight={700} fill={EVENT} textAnchor="middle">
                사건
              </text>
              <text x={118} y={144} fontSize={7.5} fill={INK} textAnchor="middle">
                {s >= 2 ? "교차 확인을 거친 보고" : "일어난 일"}
              </text>

              {/* 만들어진 경로 */}
              {s === 1 && (
                <g>
                  {["직접 들은 것", "남에게서 받은 것"].map((t, i) => (
                    <g key={t}>
                      <rect x={252} y={44 + i * 28} width={118} height={20} rx={3} fill={SPEECH} opacity={0.14} stroke={SPEECH} strokeWidth={0.75} />
                      <text x={311} y={58 + i * 28} fontSize={8} fill={INK} textAnchor="middle">
                        {t}
                      </text>
                    </g>
                  ))}
                  <text x={311} y={116} fontSize={8} fontWeight={700} fill={SPEECH} textAnchor="middle">
                    한 마디씩 담아 둘 수 없었음
                  </text>
                  <text x={311} y={136} fontSize={8} fontWeight={700} fill={SPEECH} textAnchor="middle">
                    ↓
                  </text>
                  <text x={311} y={154} fontSize={8.5} fontWeight={700} fill={SPEECH} textAnchor="middle">
                    전체 뜻에 되도록 가깝게 지음
                  </text>
                </g>
              )}

              {s === 2 && (
                <g>
                  {["자기가 본 것", "남이 자기를 위해 본 것"].map((t, i) => (
                    <g key={t}>
                      <rect x={252} y={44 + i * 28} width={140} height={20} rx={3} fill={EVENT} opacity={0.14} stroke={EVENT} strokeWidth={0.75} />
                      <text x={322} y={58 + i * 28} fontSize={8} fill={INK} textAnchor="middle">
                        {t}
                      </text>
                    </g>
                  ))}
                  <text x={322} y={116} fontSize={8} fontWeight={700} fill={EVENT} textAnchor="middle">
                    자기 인상도 믿지 않음
                  </text>
                  <text x={322} y={136} fontSize={8} fontWeight={700} fill={EVENT} textAnchor="middle">
                    ↓
                  </text>
                  <text x={322} y={154} fontSize={8.5} fontWeight={700} fill={EVENT} textAnchor="middle">
                    엄하고 자세하게 시험함
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <text x={252} y={52} fontSize={8} fontWeight={700} fill={MUTED}>
                    문장을 인용하기 전에
                  </text>
                  <text x={252} y={76} fontSize={8.5} fontWeight={700} fill={SPEECH}>
                    연설 칸 · 저자의 판단이 섞임
                  </text>
                  <text x={252} y={98} fontSize={8.5} fontWeight={700} fill={EVENT}>
                    사건 칸 · 교차 확인을 거침
                  </text>
                  <text x={252} y={128} fontSize={8} fill={INK}>
                    어느 칸에서 왔는지를
                  </text>
                  <text x={252} y={142} fontSize={8} fill={INK}>
                    먼저 보아야 합니다
                  </text>
                </g>
              )}

              <text x={22} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "읽는 사람에게는 둘 다 똑같이 적힌 것으로 보입니다"
                  : s === 1
                    ? "연설은 저자가 판단해 지어 넣은 것입니다"
                    : s === 2
                      ? "사건은 두 출처를 두고 시험한 것입니다"
                      : "구분을 지우면 저자가 그어 둔 선을 독자가 지웁니다"}
              </text>
              <text x={22} y={196} fontSize={7.5} fill={MUTED}>
                이 구분은 해석이 아니라 저자가 직접 적어 둔 것입니다
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
