import SceneShell from "./SceneShell";

/**
 * 본문 대응: #truncation — limit 512, special 2, instruction 30 → content budget 480.
 * 800-token 문서는 앞 480만 남고 뒤 320이 잘린다 → retention 480/800 = 0.6.
 * 위 막대 = encoder 입력 512칸, 아래 막대 = 문서 원문 800 token. 두 막대는 같은 축척이며,
 * 아래 막대는 본문 자리(32칸 뒤)에 맞춰 시작한다. 정답 위치는 설명용 가정이다.
 */
const LIMIT = 512;
const SPECIAL = 2;
const INSTRUCTION = 30;
const BUDGET = LIMIT - SPECIAL - INSTRUCTION;
const DOC = 800;
const CUT = DOC - BUDGET;
const RETENTION = BUDGET / DOC;
const EVIDENCE_FROM = 620;
const EVIDENCE_TO = 700;

const W = 360;
const H = 176;
const X0 = 16;
const PX = (W - 2 * X0) / (SPECIAL + INSTRUCTION + DOC);
const x = (token: number) => X0 + token * PX;
const DOC_X0 = x(SPECIAL + INSTRUCTION);
const dx = (token: number) => DOC_X0 + token * PX;
const ROW1 = 46;
const ROW2 = 112;
const BAR_H = 18;

const SCENES = [
  {
    label: "512칸을 먼저 나눕니다",
    summary: `${LIMIT} − ${SPECIAL} − ${INSTRUCTION} = ${BUDGET}`,
    note: "Special token은 tokenizer가 입력에 자동으로 넣는 표시용 token이고, instruction은 role·task prompt입니다. 둘이 먼저 32칸을 쓰므로 본문이 쓸 수 있는 자리는 480칸입니다. 막대 안의 순서는 묶음을 보이려는 것이며 실제 token 위치를 뜻하지 않습니다.",
  },
  {
    label: "800-token 문서를 넣으면",
    summary: `앞 ${BUDGET} 유지 · 뒤 ${CUT} 잘림`,
    note: "아래 막대는 같은 축척의 문서 원문입니다. 본문 자리는 480칸뿐이라, 앞부분만 남기는 방식에서는 481번째 token부터 끝까지 320개가 encoder에 들어가지 못합니다.",
  },
  {
    label: "보존 비율",
    summary: `κ = ${BUDGET} / ${DOC} = ${RETENTION}`,
    note: "원문 800 token 가운데 encoder가 실제로 본 token은 480개라 retention은 0.6입니다. 원문 길이가 다른 문서끼리도 이 비율로 비교할 수 있습니다.",
  },
  {
    label: "정답이 뒤쪽에 있다면",
    summary: "κ = 0.6이어도 evidence 0",
    note: "빨간 구간은 정답 문장이 잘린 쪽에 있다고 둔 설명용 가정입니다. 이때 retention은 그대로 0.6이지만 핵심 evidence를 전부 잃을 수 있습니다. Token 보존 비율이 evidence 보존 확률과 같지 않은 이유입니다.",
  },
] as const;

export default function TokenBudgetViz() {
  return (
    <SceneShell
      eyebrow="Token 예산"
      title="본문은 512칸이 아니라 480칸 안에서만 살아남습니다"
      description="위 막대는 encoder 입력 512칸, 아래 막대는 원문 800 token입니다. 두 막대는 같은 축척이며 limit 512·special 2·instruction 30은 본문 해석의 예시 값입니다."
      ariaLabel="512 token limit에서 special과 instruction을 뺀 본문 예산과 800 token 문서의 truncation"
      scenes={SCENES}
      render={(active) => {
        const showDoc = active >= 1;
        const showEvidence = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={ROW1 - 24} fontSize={12.5} fontWeight={700} fill="#64748b">encoder 입력 {LIMIT}칸</text>
            <rect x={x(0)} y={ROW1} width={Math.max(2, SPECIAL * PX)} height={BAR_H} fill="#64748b" />
            <rect x={x(SPECIAL)} y={ROW1} width={INSTRUCTION * PX} height={BAR_H} fill="#d97706" />
            <rect x={x(SPECIAL + INSTRUCTION)} y={ROW1} width={BUDGET * PX} height={BAR_H} fill="#2563eb" opacity={active === 0 ? 0.9 : 0.6} />
            <text x={x(0)} y={ROW1 - 6} fontSize={11.5} fill="#64748b">special {SPECIAL}</text>
            <text x={x(SPECIAL + INSTRUCTION) + 4} y={ROW1 + 13} fontSize={12.5} fontWeight={700} fill="#ffffff">본문 예산 {BUDGET}</text>
            <text x={x(SPECIAL + INSTRUCTION / 2)} y={ROW1 + BAR_H + 13} textAnchor="start" fontSize={11.5} fill="#b45309">instruction {INSTRUCTION}</text>

            <line x1={x(LIMIT)} x2={x(LIMIT)} y1={ROW1 - 4} y2={ROW2 + BAR_H + 6} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(LIMIT) + 4} y={ROW1 - 6} fontSize={11.5} fill="#64748b">{LIMIT}번째 칸 끝</text>

            <g opacity={showDoc ? 1 : 0.18}>
              <text x={DOC_X0} y={ROW2 - 8} fontSize={12.5} fontWeight={700} fill="#64748b">문서 원문 {DOC} token</text>
              <rect x={dx(0)} y={ROW2} width={BUDGET * PX} height={BAR_H} fill="#2563eb" opacity={0.9} />
              <rect x={dx(BUDGET) + 0.5} y={ROW2 + 0.5} width={CUT * PX - 1} height={BAR_H - 1} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={dx(4)} y={ROW2 + 13} fontSize={12.5} fontWeight={700} fill="#ffffff">앞 {BUDGET} 유지</text>
              <text x={dx(BUDGET + CUT / 2)} y={ROW2 + BAR_H + 14} textAnchor="middle" fontSize={12.5} fill="#64748b">뒤 {CUT} 잘림</text>
              {showEvidence && (
                <>
                  <rect x={dx(EVIDENCE_FROM)} y={ROW2 + 3} width={(EVIDENCE_TO - EVIDENCE_FROM) * PX} height={BAR_H - 6} fill="#dc2626" />
                  <text x={dx((EVIDENCE_FROM + EVIDENCE_TO) / 2)} y={ROW2 - 8} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#dc2626">정답(가정)</text>
                </>
              )}
            </g>

            {active >= 2 && (
              <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">
                κ = {BUDGET} / {DOC} = {RETENTION}{showEvidence ? " · 남은 evidence 0" : ""}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
