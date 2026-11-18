import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: on-policy-distillation #motif-mopd-case — 같은 on-policy·multi-teacher 틀에서도
 * teacher interface는 full distribution, top-k logits, chosen-token scalar로 달라질 수 있다.
 * 6-token vocabulary와 확률은 설명용 가정. Student가 sample한 token은 v4(q=0.10),
 * 선택 token scalar = ln 0.10 ≈ −2.30. 합계 0.45+0.25+0.12+0.10+0.05+0.03 = 1.00.
 */
const VOCAB = ["v1", "v2", "v3", "v4", "v5", "v6"] as const;
const PROBS: readonly number[] = [0.45, 0.25, 0.12, 0.1, 0.05, 0.03];
const SAMPLED = 3;
const TOP_K = 3;
const LOG_SAMPLED = Math.log(PROBS[SAMPLED]);

const SCENES = [
  {
    label: "전체 분포",
    summary: "위치당 6개 확률 전달",
    note: "앞 절의 방식입니다. Teacher가 vocabulary 전체에 둔 확률을 넘기고 student 분포와 forward KL로 비교합니다. 선택 token 하나가 아니라 token 사이의 상대 정보까지 feedback이 됩니다.",
  },
  {
    label: "상위 k개 logit",
    summary: `위치당 ${TOP_K}개 (k=${TOP_K}, 가정)`,
    note: "Teacher가 점수가 높은 k개 token의 logit만 넘기는 interface도 있을 수 있습니다. 그림은 k=3으로 가정했고, 나머지 token의 값은 전달되지 않습니다(logit 값 자체는 생략).",
  },
  {
    label: "선택 token 하나",
    summary: `위치당 1개 · log q(v4) ≈ ${LOG_SAMPLED.toFixed(2)}`,
    note: "Motif 3의 MOPD가 쓴 방식입니다. Student가 실제로 sample한 token 하나(그림의 v4)에 teacher가 scalar log probability 하나, ln 0.10 ≈ −2.30을 줍니다. 전체 분포 KL보다 항상 좋다는 뜻은 아닙니다.",
  },
] as const;

const W = 340;
const H = 200;
const LEFT = 14;
const BASE_Y = 160;
const TOP_Y = 34;
const BAR_W = 36;
const GAP = (W - 2 * LEFT - VOCAB.length * BAR_W) / (VOCAB.length - 1);
const bx = (i: number) => LEFT + i * (BAR_W + GAP);
const bh = (p: number) => (p / 0.5) * (BASE_Y - TOP_Y);

const TEACHER = "#2563eb";
const STUDENT = "#dc2626";
const MUTED = "#cbd5e1";
const TEXT = "#64748b";

export default function TeacherInterfaceViz() {
  return (
    <KdSceneShell
      eyebrow="Teacher interface"
      title="Teacher가 한 위치에서 넘기는 숫자는 6개, 3개, 1개일 수 있습니다"
      description="같은 student prefix에서 teacher가 다음 token에 둔 확률입니다. Vocabulary 6개와 확률값은 설명용 가정이며 실제 vocabulary는 이보다 훨씬 큽니다. 빨간 테두리는 student가 실제로 sample한 token입니다."
      ariaLabel="teacher가 전체 분포, 상위 k개, 선택 token 하나를 넘길 때 전달되는 정보 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {VOCAB.map((token, i) => {
            const p = PROBS[i];
            const sent = active === 0 || (active === 1 && i < TOP_K) || (active === 2 && i === SAMPLED);
            const showValue = active === 0 || (active === 2 && i === SAMPLED);
            const label = active === 2 ? `log ${LOG_SAMPLED.toFixed(2)}` : p.toFixed(2);
            return (
              <g key={token}>
                <rect x={bx(i)} y={BASE_Y - bh(p)} width={BAR_W} height={bh(p)} rx={3} fill={sent ? TEACHER : MUTED} opacity={sent ? 0.85 : 0.6} />
                {i === SAMPLED && (
                  <rect x={bx(i) - 3} y={BASE_Y - bh(p) - 3} width={BAR_W + 6} height={bh(p) + 3} rx={4} fill="none" stroke={STUDENT} strokeWidth={1.25} />
                )}
                {showValue && (
                  <text x={bx(i) + BAR_W / 2} y={BASE_Y - bh(p) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={i === SAMPLED && active === 2 ? STUDENT : TEACHER}>{label}</text>
                )}
                {active === 1 && i < TOP_K && (
                  <text x={bx(i) + BAR_W / 2} y={BASE_Y - bh(p) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={TEACHER}>{`${i + 1}위`}</text>
                )}
                {!sent && (
                  <text x={bx(i) + BAR_W / 2} y={BASE_Y - bh(p) - 8} textAnchor="middle" fontSize={11} fill={TEXT}>미전달</text>
                )}
                <text x={bx(i) + BAR_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={13} fontWeight={i === SAMPLED ? 700 : 400} fill={i === SAMPLED ? STUDENT : TEXT}>{token}</text>
              </g>
            );
          })}
          <line x1={LEFT - 8} x2={W - LEFT + 8} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
          <text x={W - LEFT + 8} y={BASE_Y + 34} textAnchor="end" fontSize={12} fill={STUDENT}>v4 = student가 sample한 token</text>
        </svg>
      )}
    />
  );
}
