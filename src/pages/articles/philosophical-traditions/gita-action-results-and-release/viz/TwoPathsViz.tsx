import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 행동이 외부 결과를 낳는 경로와, 결과를 내 몫으로 가져야 한다는 기대의 경로.
 * 기대가 무너지면 행동 포기나 타인의 수단화로 가기 쉽다. 카르마 요가는 행위를 두고 붙잡는 연결만 내려놓는다.
 */
const SCENES = [
  { label: "바깥 경로", summary: "해야 할 일 → 행동 → 외부 결과", note: "관계와 삶의 단계 속에서 해야 한다고 여기는 일을 만나고, 행동하면 외부 결과가 생깁니다.", step: 0 },
  { label: "마음의 경로", summary: "결과 → 기대 → 무너짐 → 두 갈래", note: "결과를 내 뜻대로 만들어 내 몫으로 가져야 한다는 기대도 생깁니다. 기대가 무너지면 행동을 포기하거나 다른 사람을 수단으로 다루기 쉽습니다.", step: 1 },
  { label: "카르마 요가", summary: "행동은 두고 붙잡는 연결만 내려놓음", note: "카르마 요가는 필요한 행위를 하되 결과를 자아의 보상으로 붙잡지 않는 훈련입니다. 바깥 경로는 그대로 두고 아래로 내려가는 연결을 내려놓습니다.", step: 2 },
] as const;

function Box({ x, y, w, h = 34, label, on, tone = "#475569" }: { x: number; y: number; w: number; h?: number; label: string; on: boolean; tone?: string }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={tone} strokeWidth={1.25} />
      <text x={x + w / 2} y={y + h / 2 + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{label}</text>
    </g>
  );
}

function Arrow({ d, on, tone = "#475569", tip }: { d: string; on: boolean; tone?: string; tip: string }) {
  return (
    <g opacity={on ? 1 : 0.28}>
      <path d={d} fill="none" stroke={tone} strokeWidth={1.25} />
      <path d={tip} fill={tone} />
    </g>
  );
}

export default function TwoPathsViz() {
  return (
    <SceneShell
      eyebrow="네 흐름"
      title="행위는 밖의 결과와 마음의 기대, 두 경로를 남깁니다"
      description="위쪽 줄이 밖에서 일어나는 일, 아래쪽이 그 결과를 두고 마음에서 일어나는 일입니다."
      ariaLabel="해야 할 일, 행동, 외부 결과의 경로와 기대, 무너짐, 행동 포기 또는 타인의 수단화 경로"
      scenes={SCENES}
      render={(active) => {
        const { step } = SCENES[active];
        const inner = step === 1;
        return (
          <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={6} y={8} w={96} label="해야 할 일" on />
            <Arrow d="M102 25 H126" tip="M132 25 L125 21 L125 29 Z" on />
            <Box x={132} y={8} w={84} label="행동" on tone="#2563eb" />
            <Arrow d="M216 25 H252" tip="M258 25 L251 21 L251 29 Z" on />
            <Box x={258} y={8} w={96} label="외부 결과" on />
            <Arrow d="M306 42 V68" tip="M306 74 L302 67 L310 67 Z" on={inner} tone="#d97706" />
            <Box x={186} y={74} w={168} label="내 뜻대로, 내 몫으로" on={inner} tone="#d97706" />
            <Arrow d="M186 91 H136" tip="M130 91 L137 87 L137 95 Z" on={inner} tone="#d97706" />
            <Box x={18} y={74} w={112} label="기대가 무너짐" on={inner} tone="#dc2626" />
            <Arrow d="M50 108 V168" tip="M50 174 L46 167 L54 167 Z" on={inner} tone="#dc2626" />
            <Arrow d="M100 108 L190 170" tip="M196 174 L187.6 173.3 L192.3 166.7 Z" on={inner} tone="#dc2626" />
            <Box x={6} y={174} w={118} label="행동 포기" on={inner} tone="#dc2626" />
            <Box x={170} y={174} w={184} label="다른 사람을 수단으로" on={inner} tone="#dc2626" />
            {step === 2 && (
              <g>
                <line x1={294} y1={50} x2={318} y2={66} stroke="#dc2626" strokeWidth={1.25} />
                <line x1={318} y1={50} x2={294} y2={66} stroke="#dc2626" strokeWidth={1.25} />
                <text x={288} y={63} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">붙잡지 않음</text>
                <text x={8} y={63} fontSize={12} fontWeight={700} fill="#2563eb">행동·예측·준비는 계속</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
