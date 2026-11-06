import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 여섯 행동의 검사 결과 [1,1,0,1,1,0]은 통과하지 못한 시점을 보존하고,
 * 마지막 0만 있거나 합계 4만 남으면 위치 정보가 없습니다.
 * 두 번째 경로 [0,1,1,1,1,0]은 같은 합계를 보이려는 가정입니다.
 */
const A = [1, 1, 0, 1, 1, 0];
const B = [0, 1, 1, 1, 1, 0];

const SCENES = [
  { label: "마지막 점수만", summary: "? ? ? ? ? 0", note: "결과가 0이라는 것만 남아 첫 다섯 행동이 옳았는지 중간에 잘못된 행동이 있었는지 알 수 없습니다." },
  { label: "행동마다 검사", summary: "1 1 0 1 1 0", note: "과정 검증 논문 VPR(Verifiable Process Rewards)의 식 (2)는 각 상태·행동을 verifier V(sₜ,aₜ)로 검사해 그 결과를 과정 reward로 둡니다. 3번과 6번 행동이 통과하지 못했다는 위치가 여섯 값으로 남습니다." },
  { label: "합계만 남기면", summary: "합 4 = 합 4", note: "단순 합계 4만 남기면 위치 정보가 다시 사라집니다. 3번이 통과하지 못한 경로 A와 1번이 통과하지 못한 경로 B(가정)가 같은 4로 보입니다." },
] as const;

const BOX = 40;
const STEP = 47;
const LEFT = 56;

function Row({ y, name, sub, values, hide }: { y: number; name: string; sub?: string; values: readonly number[]; hide: number }) {
  return (
    <g>
      <text x={0} y={sub ? y + 17 : y + 24} fontSize={11} fill="#64748b">{name}</text>
      {sub && <text x={0} y={y + 33} fontSize={12} fontWeight={700} fill="#2563eb">{sub}</text>}
      {values.map((value, index) => {
        const hidden = index < hide;
        const failed = !hidden && value === 0;
        return (
          <g key={index}>
            <rect x={LEFT + index * STEP} y={y} width={BOX} height={BOX} rx={5} fill={failed ? "#d97706" : "none"} fillOpacity={failed ? 0.14 : 0} stroke={failed ? "#d97706" : "#94a3b8"} strokeWidth={failed ? 1.25 : 1} strokeDasharray={hidden ? "3 3" : undefined} />
            <text x={LEFT + index * STEP + BOX / 2} y={y + 25} textAnchor="middle" fontSize={14} fontWeight={700} fill={hidden ? "#94a3b8" : failed ? "#d97706" : "#2563eb"}>{hidden ? "?" : value}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function ProcessTraceViz() {
  return (
    <SceneShell
      eyebrow="여섯 값과 하나의 값"
      title="점수를 몇 개로 남기느냐에 따라 틀린 위치가 보이거나 사라집니다"
      description="칸 하나가 행동 하나의 검사 결과입니다. 1은 통과, 0은 통과하지 못함, ?는 기록이 없어 알 수 없음을 뜻합니다. 여섯 값은 논문 결과가 아니라 설명을 위한 (가정)입니다."
      note="여섯 값은 그 행동을 믿을 만하게 검사할 수 있을 때의 이야기입니다. 과정 verifier의 품질에 의존합니다."
      ariaLabel="마지막 점수, 여섯 값, 합계 세 가지 기록 방식 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 128" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[1, 2, 3, 4, 5, 6].map((step, index) => (
            <text key={step} x={LEFT + index * STEP + BOX / 2} y={12} textAnchor="middle" fontSize={11} fill="#64748b">행동{step}</text>
          ))}
          <Row y={20} name={active === 2 ? "경로 A" : "경로"} sub={active === 2 ? "합 4" : undefined} values={A} hide={active === 0 ? 5 : 0} />
          {active === 2 && <Row y={76} name="경로 B" sub="합 4" values={B} hide={0} />}
        </svg>
      )}
    />
  );
}
