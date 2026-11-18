import SceneShell from "./SceneShell";

/**
 * 본문 대응: #commitment — 기록을 먼저 약속하고, 두 질문 뒤 마지막 주장 5를 그 약속에 연결합니다.
 * 정직: a(u,v)=13, b(u,v)=6, 13×6=5. 꾸민 값 5×1=5는 곱 검사만으로는 구분되지 않습니다(그림용 가정).
 * 세로축은 시간 순서, 왼쪽 줄은 증명자, 오른쪽 줄은 검증자입니다.
 */
const BLUE = "#2563eb";
const ORANGE = "#d97706";
const RED = "#dc2626";
const LINE = "#64748b";
const MUTED = "#cbd5e1";
const TEXT = "#334155";

const PROVER_X = 64;
const VERIFIER_X = 296;

type Msg = { y: number; dir: "right" | "left"; text: string; step: number };
const MESSAGES: readonly Msg[] = [
  { y: 46, dir: "right", text: "기록 A, B를 약속", step: 0 },
  { y: 76, dir: "right", text: "g₁(t)", step: 1 },
  { y: 96, dir: "left", text: "r₁ = u", step: 1 },
  { y: 118, dir: "right", text: "g₂(t)", step: 1 },
  { y: 138, dir: "left", text: "r₂ = v", step: 1 },
];

const SCENES = [
  { label: "먼저 약속", summary: "기록을 질문보다 앞에 고정", note: "증명자는 질문을 받기 전에 기록 A와 B를 짧은 약속에 묶습니다. 검증자가 질문을 낸 뒤 증명자가 기록 자체를 바꿀 수 있다면 확인의 의미가 사라집니다." },
  { label: "질문 두 번", summary: "메시지 → 질문 → 메시지 → 질문", note: "합 확인은 메시지를 받은 뒤 질문하는 순서를 지킵니다. 두 질문이 끝나면 마지막 주장은 한 점의 값 5로 줄어듭니다." },
  { label: "정직한 마지막 값", summary: "13 × 6 = 5", note: "정직한 프로그램은 실제 A와 B를 접어서 (u,v)의 값 13과 6을 얻습니다. 곱은 5로 마지막 주장과 맞고, 이 두 값은 처음 약속한 기록에서 나온 값입니다." },
  { label: "꾸민 마지막 값", summary: "5 × 1 = 5도 곱은 맞음", note: "외부 증명자가 마지막에 두 수를 마음대로 고를 수 있다면 5와 1처럼 곱만 5로 맞추는 값을 낼 수 있습니다(가정한 예). 그래서 마지막 평가를 처음 약속한 다항식에 연결해 여는 PCS가 필요합니다. 이 글의 실행은 그 열기를 구현하지 않았습니다." },
] as const;

function Message({ msg, on }: { msg: Msg; on: boolean }) {
  const color = on ? BLUE : MUTED;
  const fromX = msg.dir === "right" ? PROVER_X : VERIFIER_X;
  const toX = msg.dir === "right" ? VERIFIER_X : PROVER_X;
  const tip = msg.dir === "right" ? toX - 2 : toX + 2;
  const back = msg.dir === "right" ? -7 : 7;
  return (
    <g>
      <line x1={fromX} y1={msg.y} x2={tip} y2={msg.y} stroke={color} strokeWidth={on ? 1.25 : 1} />
      <polygon points={`${tip},${msg.y} ${tip + back},${msg.y - 4} ${tip + back},${msg.y + 4}`} fill={color} />
      <text x={(PROVER_X + VERIFIER_X) / 2} y={msg.y - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? TEXT : "#94a3b8"}>{msg.text}</text>
    </g>
  );
}

export default function CommitOrderViz() {
  return (
    <SceneShell
      eyebrow="순서와 연결"
      title="마지막 값 5는 처음 약속한 기록에서 나왔을 때만 의미가 있습니다"
      description="위에서 아래로 시간이 흐릅니다. 왼쪽 세로줄은 증명자, 오른쪽은 검증자입니다. 약속(commitment)은 기록을 나중에 바꿀 수 없게 미리 묶어 두는 짧은 값입니다."
      ariaLabel="기록 약속, 두 번의 질문, 마지막 값의 곱 검사와 약속 대조 순서"
      scenes={SCENES}
      render={(active) => {
        const forged = active === 3;
        const finalOn = active >= 2;
        return (
          <svg viewBox="0 0 360 220" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={PROVER_X} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>증명자</text>
            <text x={VERIFIER_X} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>검증자</text>
            <line x1={PROVER_X} y1={24} x2={PROVER_X} y2={210} stroke={LINE} strokeWidth={1} />
            <line x1={VERIFIER_X} y1={24} x2={VERIFIER_X} y2={210} stroke={LINE} strokeWidth={1} />
            {MESSAGES.map((msg) => (
              <Message key={msg.text} msg={msg} on={msg.step === active || (msg.step === 0 && active > 0)} />
            ))}
            {active >= 1 && <circle cx={PROVER_X} cy={46} r={4} fill={BLUE} />}
            <Message msg={{ y: 168, dir: "right", text: forged ? "a = 5, b = 1 (가정)" : "a = 13, b = 6", step: 2 }} on={finalOn} />
            {finalOn && (
              <g>
                <text x={VERIFIER_X + 8} y={164} fontSize={10} fontWeight={700} fill={BLUE}>곱 5 ✓</text>
                <text x={VERIFIER_X + 8} y={190} fontSize={10} fontWeight={700} fill={forged ? RED : BLUE}>{forged ? "약속 ✕" : "약속 ✓"}</text>
                <text x={(PROVER_X + VERIFIER_X) / 2} y={206} textAnchor="middle" fontSize={10} fill={forged ? RED : ORANGE}>
                  {forged ? "처음 기록의 (u,v) 값 13과 다름" : "PCS로 처음 약속과 대조"}
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
