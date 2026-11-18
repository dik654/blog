import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: on-policy-distillation #state-mismatch — 고정 prefix A→B(→C)와
 * student가 만든 A→X는 서로 다른 상태다. 고정 sequence에는 X 뒤의 target이 없고,
 * on-policy에서는 teacher가 A→X 뒤를 채점한다. λ는 example마다 student prefix를 고를 확률.
 */
const SCENES = [
  {
    label: "고정 sequence",
    summary: "A→B→C · 다음 token이 데이터에 있음",
    note: "고정 teacher response A→B→C에서는 위치마다 다음 token이 데이터에 적혀 있습니다. Student는 A 다음에 B, A→B 다음에 C를 배웁니다.",
  },
  {
    label: "Student가 A 뒤에 X",
    summary: "A→X · 고정 데이터에 없는 상태",
    note: "Autoregressive decoding에서는 방금 생성한 token이 다음 입력이 됩니다. Student가 A 뒤에 X를 내면 다음 입력은 A→X이고, 고정 sequence만 배운 student는 X 뒤에 무엇을 내야 하는지 관측한 적이 없습니다.",
  },
  {
    label: "Teacher가 A→X 뒤를 채점",
    summary: "같은 prefix → teacher 다음-token 분포",
    note: "On-policy distillation은 student가 만든 A→X를 frozen teacher에 그대로 넣고, 같은 prefix에서 teacher가 낸 다음-token 분포를 target으로 받습니다. Student가 실제로 낸 실수 뒤의 correction을 배웁니다.",
  },
  {
    label: "λ가 고르는 것",
    summary: "b=0 → A→B · b=1 → A→X",
    note: "λ는 example마다 student prefix를 쓸 확률입니다. 0/1 flag b가 0이면 고정 A→B, 1이면 student의 A→X를 고르고, 어느 쪽이든 target은 teacher가 줍니다. λ=0은 fixed response만, λ=1은 student rollout만 쓰며 teacher weight가 아닙니다.",
  },
] as const;

const W = 360;
const H = 196;
const TOK_W = 40;
const TOK_H = 30;
const TOP_Y = 44;
const LOW_Y = 136;
const MID_Y = (TOP_Y + LOW_Y) / 2;
const A_X = 4;
const COL1 = 80;
const COL2 = 148;
const TEACHER_X = 214;
const TEACHER_W = 142;
const TEACHER_Y = 56;
const TEACHER_H = 86;

const FIXED = "#475569";
const STUDENT = "#dc2626";
const TEACHER = "#2563eb";
const FAINT = 0.18;
const BARS = [0.55, 1, 0.7, 0.35, 0.2] as const;

function Token({ x, y, label, color, dashed = false, opacity = 1 }: { x: number; y: number; label: string; color: string; dashed?: boolean; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y - TOK_H / 2} width={TOK_W} height={TOK_H} rx={6} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + TOK_W / 2} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function PrefixSourceViz() {
  return (
    <KdSceneShell
      eyebrow="학습하는 상태"
      title="고정 A→B와 student의 A→X는 다른 prefix입니다"
      description="Prefix는 지금까지 이어 붙인 token 열입니다. 위 줄은 teacher가 미리 만든 고정 response, 아래 줄은 현재 student가 직접 생성한 rollout이며, X는 student가 낸 실수 token입니다."
      ariaLabel="고정 sequence와 student rollout의 prefix가 갈라지고 teacher가 어느 prefix를 채점하는지 보여 주는 그림"
      scenes={SCENES}
      render={(active) => {
        const upper = active === 0 || active === 3 ? 1 : FAINT;
        const lower = active === 0 ? FAINT : 1;
        const scoreUpper = active === 3;
        const scoreLower = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={COL1} y={18} fontSize={12} fill={FIXED} opacity={upper}>고정 response</text>
            <text x={COL1} y={LOW_Y + 36} fontSize={12} fill={STUDENT} opacity={lower}>student rollout</text>
            <Token x={A_X} y={MID_Y} label="A" color={FIXED} />
            <line x1={A_X + TOK_W} y1={MID_Y} x2={COL1} y2={TOP_Y} stroke={FIXED} strokeWidth={1} opacity={upper} />
            <line x1={A_X + TOK_W} y1={MID_Y} x2={COL1} y2={LOW_Y} stroke={STUDENT} strokeWidth={1} opacity={lower} />
            <Token x={COL1} y={TOP_Y} label="B" color={FIXED} opacity={upper} />
            <line x1={COL1 + TOK_W} y1={TOP_Y} x2={COL2} y2={TOP_Y} stroke={FIXED} strokeWidth={1} opacity={active === 3 ? FAINT : upper} />
            <Token x={COL2} y={TOP_Y} label="C" color={FIXED} opacity={active === 3 ? FAINT : upper} />
            {active === 0 && (
              <>
                <text x={COL1 + TOK_W / 2} y={TOP_Y + 30} textAnchor="middle" fontSize={11} fill={FIXED}>정답 있음</text>
                <text x={COL2 + TOK_W / 2} y={TOP_Y + 30} textAnchor="middle" fontSize={11} fill={FIXED}>정답 있음</text>
              </>
            )}
            <Token x={COL1} y={LOW_Y} label="X" color={STUDENT} opacity={lower} />
            <line x1={COL1 + TOK_W} y1={LOW_Y} x2={COL2} y2={LOW_Y} stroke={STUDENT} strokeWidth={1} strokeDasharray="3 3" opacity={lower} />
            <Token x={COL2} y={LOW_Y} label="?" color={active >= 2 ? TEACHER : STUDENT} dashed opacity={lower} />
            {active === 1 && (
              <text x={COL2 + TOK_W / 2} y={LOW_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={STUDENT}>정답 관측 없음</text>
            )}
            {active === 3 && (
              <>
                <text x={A_X + TOK_W + 12} y={TOP_Y + 14} textAnchor="end" fontSize={12} fontWeight={700} fill={FIXED}>b=0</text>
                <text x={A_X + TOK_W + 12} y={LOW_Y - 4} textAnchor="end" fontSize={12} fontWeight={700} fill={STUDENT}>b=1</text>
              </>
            )}
            <g opacity={active >= 2 ? 1 : FAINT}>
              <rect x={TEACHER_X} y={TEACHER_Y} width={TEACHER_W} height={TEACHER_H} rx={8} fill="none" stroke={TEACHER} strokeWidth={1.25} />
              <text x={TEACHER_X + 10} y={TEACHER_Y + 18} fontSize={13} fontWeight={700} fill={TEACHER}>frozen teacher</text>
              <text x={TEACHER_X + 10} y={TEACHER_Y + 33} fontSize={11} fill={TEACHER}>다음-token 분포</text>
              {BARS.map((h, i) => (
                <rect key={i} x={TEACHER_X + 16 + i * 24} y={TEACHER_Y + TEACHER_H - 10 - h * 36} width={14} height={h * 36} rx={2} fill={TEACHER} opacity={0.75} />
              ))}
            </g>
            {scoreLower && (
              <path d={`M${COL2 + TOK_W} ${LOW_Y} C ${COL2 + TOK_W + 40} ${LOW_Y}, ${TEACHER_X - 30} ${TEACHER_Y + TEACHER_H - 14}, ${TEACHER_X} ${TEACHER_Y + TEACHER_H - 14}`} fill="none" stroke={STUDENT} strokeWidth={1.25} />
            )}
            {scoreUpper && (
              <path d={`M${COL1 + TOK_W} ${TOP_Y} C ${COL1 + TOK_W + 80} ${TOP_Y}, ${TEACHER_X - 40} ${TEACHER_Y + 14}, ${TEACHER_X} ${TEACHER_Y + 14}`} fill="none" stroke={FIXED} strokeWidth={1.25} />
            )}
            {active === 2 && (
              <text x={COL2 + TOK_W / 2} y={LOW_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEACHER}>teacher target</text>
            )}
          </svg>
        );
      }}
    />
  );
}
