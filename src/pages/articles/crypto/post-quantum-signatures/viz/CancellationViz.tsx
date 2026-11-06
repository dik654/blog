import { Op, PublicTable, ColumnVector, ValueBox } from "./MathCells";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — z=[3,3]에 A를 곱하면 [15,15], ct=[9,6]을 빼면 [6,9].
 * 서명자의 Ay−ce=[7,9]−[1,0]도 [6,9]. c=1이므로 Az=Ay+As=[7,9]+[8,6], ct=As+e=[8,6]+[1,0].
 */
const INK = "#64748b";
const RED = "#dc2626";
const W = 360;
const H = 206;

const SCENES = [
  { label: "검증자가 응답에 표를 곱합니다", summary: "Az = [15, 15]", note: "검증자는 공개 표 A와 서명에 담긴 응답 z만 씁니다. 비밀 s는 받지 않았습니다." },
  { label: "공개값을 뺍니다", summary: "[15, 15] − [9, 6] = [6, 9]", note: "c=1이므로 ct는 공개값 t=[9,6] 그대로입니다. 여기까지 전부 공개된 값으로 한 계산입니다." },
  { label: "서명자 쪽 값과 만납니다", summary: "두 길 모두 [6, 9]", note: "서명자가 만든 약속 Ay=[7,9]에서 ce=[1,0]을 빼도 [6,9]입니다. 검증자의 계산이 처음 약속과 연결됩니다. 다만 Az−ct 계산만으로 서명 검증이 끝나지는 않습니다." },
  { label: "왜 같아지는가", summary: "s가 든 항 [8, 6]이 상쇄", note: "z=y+cs이므로 Az에는 As=[8,6]이 들어 있고, t=As+e이므로 ct에도 같은 [8,6]이 들어 있습니다. 빼면 비밀이 든 큰 항이 사라지고 약속 Ay와 작은 오류 ce만 남습니다." },
] as const;

export default function CancellationViz() {
  return (
    <SceneShell
      eyebrow="두 길의 합류"
      title="비밀을 받지 않은 검증자의 계산이 약속과 만납니다"
      description="3절의 작은 예입니다(A의 두 행 [2,3]·[4,1], z=[3,3], t=[9,6], Ay=[7,9], e=[1,0], c=1). 벡터는 [첫째 성분, 둘째 성분]으로 적었습니다."
      ariaLabel="검증자의 Az−ct와 서명자의 Ay−ce가 모두 [6,9]가 되고 비밀 항이 상쇄되는 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <>
              <PublicTable x={4} y={52} />
              <Op x={72} y={82}>×</Op>
              <ColumnVector x={84} y={52} values={[3, 3]} name="z" tone="ok" />
              <Op x={128} y={82}>=</Op>
              {["2×3 + 3×3", "4×3 + 1×3"].map((line, i) => (
                <text key={line} x={140} y={52 + i * 26 + 18} fontSize={12} fontFamily="monospace" fill={INK}>{line}</text>
              ))}
              <Op x={232} y={82}>=</Op>
              <ColumnVector x={246} y={52} values={[15, 15]} name="Az" />
            </>
          )}
          {active === 1 && (
            <>
              <text x={4} y={60} fontSize={12} fontWeight={700} fill={INK}>검증자</text>
              <ValueBox x={4} y={70} w={92} name="Az" value="[15,15]" />
              <Op x={112} y={98}>−</Op>
              <ValueBox x={128} y={70} w={92} name="ct" value="[9,6]" tone="public" />
              <Op x={236} y={98}>=</Op>
              <ValueBox x={252} y={70} w={104} name="결과" value="[6,9]" tone="ok" />
            </>
          )}
          {active === 2 && (
            <>
              <text x={4} y={20} fontSize={12} fontWeight={700} fill={INK}>검증자</text>
              <ValueBox x={4} y={28} w={92} name="Az" value="[15,15]" />
              <Op x={112} y={56}>−</Op>
              <ValueBox x={128} y={28} w={92} name="ct" value="[9,6]" tone="public" />
              <text x={4} y={132} fontSize={12} fontWeight={700} fill={INK}>서명자</text>
              <ValueBox x={4} y={140} w={92} name="Ay" value="[7,9]" tone="secret" />
              <Op x={112} y={168}>−</Op>
              <ValueBox x={128} y={140} w={92} name="ce" value="[1,0]" tone="secret" />
              <path d="M220 50 L262 84 M220 162 L262 124" fill="none" stroke={INK} strokeWidth={1} />
              <ValueBox x={252} y={84} w={104} h={40} name="같은 값" value="[6,9]" tone="ok" />
            </>
          )}
          {active === 3 && (
            <>
              <ValueBox x={4} y={8} w={88} name="Az" value="[15,15]" />
              <Op x={106} y={36}>=</Op>
              <ValueBox x={120} y={8} w={88} name="Ay" value="[7,9]" tone="secret" />
              <Op x={222} y={36}>+</Op>
              <ValueBox x={236} y={8} w={120} name="As · s가 든 항" value="[8,6]" tone="bad" />
              <ValueBox x={4} y={68} w={88} name="ct" value="[9,6]" tone="public" />
              <Op x={106} y={96}>=</Op>
              <ValueBox x={120} y={68} w={88} name="ce" value="[1,0]" tone="secret" />
              <Op x={222} y={96}>+</Op>
              <ValueBox x={236} y={68} w={120} name="As · s가 든 항" value="[8,6]" tone="bad" />
              <line x1={296} x2={296} y1={56} y2={68} stroke={RED} strokeWidth={1} />
              <text x={296} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>빼면 상쇄</text>
              <ValueBox x={4} y={148} w={88} name="Az − ct" value="[6,9]" tone="ok" />
              <Op x={106} y={176}>=</Op>
              <ValueBox x={120} y={148} w={236} name="Ay − ce" value="[7,9] − [1,0]" tone="secret" />
            </>
          )}
        </svg>
      )}
    />
  );
}
