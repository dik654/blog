import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mlflow-genai-evaluation — (가정) 고정 질문 100개·고정 답변 100개.
 * 평가 실행 1 통과율 78%, 평가 실행 2 86%. 두 번째에 지침 "간결성" 추가 + judge model 변경.
 * 생성 실행과 평가 실행을 나누고, 같은 trace 묶음을 다시 채점한다. 회귀 비교에는 scorer version을 고정한다.
 */
const W = 360;
const H = 236;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#94a3b8";
const TEXT = "#64748b";

const SCENES = [
  { label: "생성 실행이 답변 100개를 남깁니다", summary: "trace 100개 고정", note: "생성 실행은 어떤 prompt와 model이 어떤 trace를 만들었는지 남깁니다. trace는 질문·답변을 포함한 생성 기록입니다. 이 답변 100개가 뒤의 두 평가에 똑같이 들어갑니다." },
  { label: "평가 실행 1: 78%", summary: "100개 중 78개 통과", note: "평가 실행은 고정된 trace 묶음에 어떤 기대값, scorer 코드, judge 지침과 judge model(채점하는 model)을 적용했는지 남깁니다. 생성은 다시 돌리지 않습니다." },
  { label: "평가 실행 2: 86%", summary: "같은 답변 · 다른 자", note: "두 번째 평가에서 지침에 간결성을 추가하고 judge model도 바꿨습니다. 답변 bytes가 같아도 78%와 86%는 같은 자로 잰 결과가 아닙니다. 답변은 그대로이므로 8%p 차이를 답변이 좋아진 것으로 읽을 수 없습니다." },
  { label: "회귀 비교는 채점자를 고정합니다", summary: "scorer version 고정", note: "점수 하락을 걸러 내는 회귀 비교(regression gate)에서는 \"latest\"를 암묵적으로 읽지 않고 채점자(scorer)의 version을 고정합니다. 새 judge를 기준으로 삼으려면 사람 평가와의 일치, 보호 slice, 비용과 parsing failure(judge 응답을 판정값으로 읽지 못한 경우)를 비교한 뒤 기준선을 새로 만듭니다." },
] as const;

function Box({ x, y, w, title, sub, color, on, dashed = false }: { x: number; y: number; w: number; title: string; sub: string; color: string; on: boolean; dashed?: boolean }) {
  return (
    <g opacity={on ? 1 : 0.3}>
      <rect x={x} y={y} width={w} height={42} rx={8} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {title}
      </text>
      <text x={x + w / 2} y={y + 32} textAnchor="middle" fontSize={11} fill={TEXT}>
        {sub}
      </text>
    </g>
  );
}

function PassBar({ x, w, rate, color, on }: { x: number; w: number; rate: number; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.15}>
      <rect x={x} y={176} width={w} height={14} rx={2} fill="none" stroke={GRAY} strokeWidth={1} />
      <rect x={x} y={176} width={(w * rate) / 100} height={14} rx={2} fill={color} opacity={0.7} />
      <text x={x} y={206} fontSize={12} fontWeight={700} fill={color}>
        {on ? `${rate}/100 통과` : ""}
      </text>
    </g>
  );
}

export default function JudgeRerunViz() {
  return (
    <SceneShell
      eyebrow="생성 실행과 평가 실행"
      title="같은 답변 100개를 다른 채점자로 재면 점수가 달라집니다"
      description="위에서 만든 trace 묶음이 아래 두 평가 실행에 그대로 들어갑니다. 질문 100개·78%·86%는 본문의 가정 사례입니다."
      ariaLabel="생성 실행이 만든 trace 100개를 두 평가 실행이 서로 다른 judge로 채점해 78퍼센트와 86퍼센트가 나오는 흐름"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Box x={8} y={14} w={100} title="질문 100" sub="고정 자료" color={TEXT} on />
          <line x1={110} x2={124} y1={35} y2={35} stroke={GRAY} strokeWidth={1} />
          <Box x={126} y={14} w={104} title="생성 실행" sub="prompt · model" color={TEXT} on={active === 0} />
          <line x1={232} x2={246} y1={35} y2={35} stroke={GRAY} strokeWidth={1} />
          <Box x={248} y={14} w={104} title="trace 100" sub={active === 3 ? "고정 · 재사용" : "답변 bytes 고정"} color={BLUE} on />
          <path d="M300 58 L300 74 L85 74 L85 98" fill="none" stroke={active >= 1 ? BLUE : GRAY} strokeWidth={1} />
          <path d="M300 74 L275 74 L275 98" fill="none" stroke={active >= 2 ? BLUE : GRAY} strokeWidth={1} />
          <Box x={10} y={100} w={150} title="평가 실행 1" sub="처음 지침 · 처음 judge" color={BLUE} on={active === 1 || active === 3} />
          <Box x={200} y={100} w={150} title="평가 실행 2" sub={active === 3 ? "새 기준선 후보 · 검토 뒤" : "+간결성 · judge 변경"} color={AMBER} on={active === 2 || active === 3} dashed={active === 3} />
          <PassBar x={10} w={150} rate={78} color={BLUE} on={active >= 1} />
          <PassBar x={200} w={150} rate={86} color={AMBER} on={active >= 2} />
          <text x={W / 2} y={228} textAnchor="middle" fontSize={12} fontWeight={700} fill={active === 3 ? BLUE : active === 2 ? AMBER : TEXT}>
            {active === 2 ? "자가 달라 78%와 86%를 바로 비교 못 함" : active === 3 ? "회귀 비교: scorer version을 하나로 고정" : " "}
          </text>
        </svg>
      )}
    />
  );
}
