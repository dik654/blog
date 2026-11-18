import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: on-policy-distillation #multi-teacher — checkpoint 평균과 policy-space
 * integration의 차이. Domain k를 ρ로 뽑고, 공유 student가 rollout s를 만들고,
 * 그 domain의 frozen teacher q_k만 같은 prefix를 채점한다. Loss는 Σ ρ_k E D(q_k‖p_s).
 * ρ의 실제 값은 본문에 없으므로 숫자를 적지 않는다.
 */
const DOMAINS = ["Math", "Instruction", "SWE"] as const;

const SCENES = [
  {
    label: "Checkpoint 평균",
    summary: "teacher weight 셋 → 하나로 합침",
    note: "세 teacher의 checkpoint를 평균해 한 model로 합치는 방식입니다. 이렇게 하면 세 teacher의 representation이 서로 정렬돼 있다고 가정하게 됩니다.",
  },
  {
    label: "Math prompt",
    summary: "k=Math → student rollout → Math teacher",
    note: "목표 비율 ρ로 domain k를 먼저 뽑습니다. Math prompt가 뽑히면 공유 student가 rollout s를 만들고, 같은 prefix s를 frozen Math teacher만 채점합니다. Teacher는 갱신되지 않고 student만 갱신됩니다.",
  },
  {
    label: "SWE prompt",
    summary: "k=SWE → 같은 student → SWE teacher",
    note: "다음 example에서 SWE prompt가 뽑히면 같은 student가 rollout을 만들고, 이번에는 SWE teacher가 target을 줍니다. Teacher weight를 섞지 않고 prompt domain이 채점자를 고릅니다.",
  },
  {
    label: "목표 비율로 합산",
    summary: "L = Σ ρ_k · E D(q_k‖p_s)",
    note: "Domain별 loss를 목표 비율 ρ_k로 합쳐 한 student objective를 만듭니다. 평균 score만으로 승인하지 않고, 한 specialist를 통합하는 동안 다른 domain이 무너지는지 worst-domain slice를 함께 봅니다.",
  },
] as const;

const W = 360;
const H = 222;
const ROW_Y = [46, 112, 178] as const;
const PROMPT_X = 2;
const PROMPT_W = 76;
const BOX_H = 38;
const MID_X = 108;
const MID_W = 132;
const MID_Y = 86;
const MID_H = 52;
const T_X = 270;
const T_W = 88;

const STUDENT = "#2563eb";
const TEACHER = "#7c3aed";
const MUTED = "#94a3b8";
const TEXT = "#475569";
const FAINT = 0.2;

export default function TeacherRoutingViz() {
  return (
    <KdSceneShell
      eyebrow="여러 teacher"
      title="Weight를 섞지 않고 prompt domain이 채점할 teacher를 고릅니다"
      description="왼쪽은 domain별 prompt, 가운데는 모든 domain을 담을 하나의 student, 오른쪽은 domain별 frozen teacher입니다. ρ_k는 학습과 배포에서 원하는 domain 비율이며 값은 정하지 않았습니다."
      ariaLabel="checkpoint 평균과 domain별 teacher routing 비교"
      scenes={SCENES}
      render={(active) => {
        const merge = active === 0;
        const pick = active === 1 ? 0 : active === 2 ? 2 : null;
        const rowOpacity = (i: number) => (merge ? FAINT : pick === null ? 1 : pick === i ? 1 : FAINT);
        const routeWidth = pick === null ? 1 : 1.25;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {DOMAINS.map((name, i) => {
              const y = ROW_Y[i];
              const o = rowOpacity(i);
              return (
                <g key={name}>
                  <g opacity={o}>
                    <rect x={PROMPT_X} y={y - BOX_H / 2} width={PROMPT_W} height={BOX_H} rx={6} fill="none" stroke={TEXT} strokeWidth={1} />
                    <text x={PROMPT_X + PROMPT_W / 2} y={y - 1} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEXT}>{name}</text>
                    <text x={PROMPT_X + PROMPT_W / 2} y={y + 12} textAnchor="middle" fontSize={11} fill={TEXT}>prompt</text>
                    {!merge && (
                      <>
                        <line x1={PROMPT_X + PROMPT_W} y1={y} x2={MID_X} y2={MID_Y + MID_H / 2} stroke={STUDENT} strokeWidth={routeWidth} />
                        <line x1={MID_X + MID_W} y1={MID_Y + MID_H / 2} x2={T_X} y2={y} stroke={TEACHER} strokeWidth={routeWidth} />
                      </>
                    )}
                    {active === 3 && (
                      <text x={PROMPT_X + PROMPT_W + 6} y={y - BOX_H / 2 - 2} fontSize={11} fontWeight={700} fill={STUDENT}>ρ_{i === 0 ? "math" : i === 1 ? "inst" : "SWE"}</text>
                    )}
                  </g>
                  <g opacity={merge || pick === null || pick === i ? 1 : FAINT}>
                    <rect x={T_X} y={y - BOX_H / 2} width={T_W} height={BOX_H} rx={6} fill="none" stroke={TEACHER} strokeWidth={1.25} />
                    <text x={T_X + T_W / 2} y={y - 1} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEACHER}>{name}</text>
                    <text x={T_X + T_W / 2} y={y + 12} textAnchor="middle" fontSize={11} fill={TEACHER}>teacher · frozen</text>
                  </g>
                  {merge && (
                    <line x1={T_X} y1={y} x2={MID_X + MID_W} y2={MID_Y + MID_H / 2} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                  )}
                </g>
              );
            })}
            <rect x={MID_X} y={MID_Y} width={MID_W} height={MID_H} rx={8} fill="none" stroke={merge ? MUTED : STUDENT} strokeWidth={1.25} strokeDasharray={merge ? "4 3" : undefined} />
            <text x={MID_X + MID_W / 2} y={MID_Y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={merge ? TEXT : STUDENT}>{merge ? "평균 checkpoint" : "공유 student p_s"}</text>
            <text x={MID_X + MID_W / 2} y={MID_Y + 39} textAnchor="middle" fontSize={11} fill={merge ? TEXT : STUDENT}>{merge ? "representation 정렬 가정" : "rollout s 생성 · 갱신"}</text>
            {pick !== null && (
              <text x={T_X + T_W / 2} y={pick === 0 ? ROW_Y[0] - BOX_H / 2 - 7 : ROW_Y[2] + BOX_H / 2 + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEACHER}>같은 s 채점</text>
            )}
            {active === 3 && (
              <text x={MID_X + MID_W / 2} y={MID_Y + MID_H + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>worst-domain도 확인</text>
            )}
          </svg>
        );
      }}
    />
  );
}
