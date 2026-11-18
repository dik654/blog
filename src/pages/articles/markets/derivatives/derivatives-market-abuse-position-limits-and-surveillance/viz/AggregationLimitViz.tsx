import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 공통 지배 계좌 A 400계약 + B 200계약, 가정 한도 500.
 * 계좌별로는 둘 다 500 아래, 합산하면 400+200=600으로 100 초과.
 * 실물 헤지 200을 600−200=400으로 자동 차감하지 않는다. 예외 범위는 입증으로 정해지며 크기는 본문에 없어 칸으로 그리지 않는다.
 */
const A = 400;
const B = 200;
const LIMIT = 500;
const TOTAL = A + B;
const OVER = TOTAL - LIMIT;

const SCENES = [
  { label: "계좌를 하나씩 보면", summary: "A 400 · B 200 — 각각 500 아래", note: "계좌 A와 B를 따로 놓으면 어느 쪽도 가정 한도 500에 닿지 않습니다. 그러나 두 계좌는 한 사람이 지배합니다." },
  { label: "공통 지배로 합산하면", summary: `${A} + ${B} = ${TOTAL} → ${OVER} 초과`, note: "적용되는 합산 규칙 아래에서는 두 계좌를 한 사람의 포지션으로 더합니다. 600은 한도 500보다 100 크므로, 먼저 어떤 계좌를 줄일지와 보고·승인 절차를 확인합니다." },
  { label: "헤지 200을 그냥 빼면", summary: "600 − 200 = 400 ✗ 자동 계산 아님", note: "실물 헤지 200이 있다는 사실만으로 600에서 200을 빼 400으로 만들 수는 없습니다. 아래 줄의 400은 쓰면 안 되는 계산입니다." },
  { label: "예외 범위는 서류로 정해집니다", summary: "정의 · 수량 · 시점 · 신청 요건", note: "그 포지션이 규정상 선의의 헤지 정의와 수량·시점·신청 요건을 충족한다고 문서로 입증해야 예외 범위가 정해집니다. 범위의 크기는 입증 전에는 정해지지 않아 막대로 그리지 않았습니다." },
] as const;

const CHECKS = ["선의의 헤지 정의", "수량", "시점", "신청 요건"] as const;

const W = 360;
const H = 150;
const X0 = 70;
const X1 = 340;
const MAX = 700;
const x = (value: number) => X0 + (value / MAX) * (X1 - X0);
const ROW1 = 30;
const ROW2 = 86;
const BAR_H = 26;

export default function AggregationLimitViz() {
  return (
    <SceneShell
      eyebrow="합산과 헤지 예외"
      title="두 계좌를 합치면 한도를 넘고, 헤지는 뺄셈이 아닙니다"
      description="포지션 한도는 한 사람이 특정 계약에서 직접 또는 합산해 보유할 수 있는 최대 수량입니다. 막대 길이는 계약 수이고, 한도 500은 원리를 보이려는 가정값입니다."
      ariaLabel="계좌 A 400계약과 계좌 B 200계약을 합산하면 600으로 가정 한도 500을 100 넘고, 헤지 200은 자동으로 차감되지 않는 과정"
      scenes={SCENES}
      render={(active) => {
        const separate = active === 0;
        const wrong = active === 2;
        const proof = active === 3;
        /** 헤지 200은 3장면에서 처음 나오므로, 2장면에서는 아래 줄을 미리 보여 주지 않습니다. */
        const hedgeShown = active >= 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {separate ? (
                <>
                  <text x={X0 - 8} y={ROW1 + 17} textAnchor="end" fontSize={13} fontWeight={700} fill="#475569">계좌 A</text>
                  <rect x={X0} y={ROW1} width={x(A) - X0} height={BAR_H} rx={3} fill="#475569" />
                  <text x={x(A) + 5} y={ROW1 + 17} fontSize={13} fontWeight={700} fill="#475569">{A}</text>
                  <text x={X0 - 8} y={ROW2 + 17} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">계좌 B</text>
                  <rect x={X0} y={ROW2} width={x(B) - X0} height={BAR_H} rx={3} fill="#2563eb" />
                  <text x={x(B) + 5} y={ROW2 + 17} fontSize={13} fontWeight={700} fill="#2563eb">{B}</text>
                </>
              ) : (
                <>
                  <text x={X0 - 8} y={ROW1 + 17} textAnchor="end" fontSize={13} fontWeight={700} fill="#334155">합산</text>
                  <rect x={X0} y={ROW1} width={x(A) - X0} height={BAR_H} fill="#475569" />
                  <rect x={x(A)} y={ROW1} width={x(TOTAL) - x(A)} height={BAR_H} fill="#2563eb" />
                  <rect x={x(LIMIT)} y={ROW1} width={x(TOTAL) - x(LIMIT)} height={BAR_H} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                  <text x={(X0 + x(A)) / 2} y={ROW1 + 17} textAnchor="middle" fontSize={12} fill="#ffffff">A 400</text>
                  <text x={(x(A) + x(LIMIT)) / 2} y={ROW1 + 17} textAnchor="middle" fontSize={12} fill="#ffffff">B</text>
                  <text x={x(TOTAL) + 4} y={ROW1 + 11} fontSize={13} fontWeight={700} fill="#334155">{TOTAL}</text>
                  <text x={x(TOTAL) + 4} y={ROW1 + 24} fontSize={12} fontWeight={700} fill="#dc2626">+{OVER}</text>
                  {hedgeShown && <text x={X0 - 8} y={ROW2 + 17} textAnchor="end" fontSize={13} fontWeight={700} fill={wrong ? "#dc2626" : "#94a3b8"}>헤지 차감?</text>}
                  {!hedgeShown ? null : proof ? (
                    <text x={X0} y={ROW2 + 17} fontSize={13} fill="#64748b">예외 범위: 입증 전에는 크기 미정</text>
                  ) : (
                    <>
                      <rect x={X0} y={ROW2} width={x(TOTAL - B) - X0} height={BAR_H} rx={3} fill="none" stroke={wrong ? "#dc2626" : "#cbd5e1"} strokeWidth={1} strokeDasharray="4 3" />
                      <text x={(X0 + x(TOTAL - B)) / 2} y={ROW2 + 17} textAnchor="middle" fontSize={13} fill={wrong ? "#dc2626" : "#cbd5e1"}>600 − 200 = 400</text>
                      {wrong && <line x1={X0} y1={ROW2 + BAR_H} x2={x(TOTAL - B)} y2={ROW2} stroke="#dc2626" strokeWidth={1.25} />}
                    </>
                  )}
                </>
              )}
              <line x1={x(LIMIT)} x2={x(LIMIT)} y1={18} y2={ROW2 + BAR_H + 8} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={x(LIMIT)} y={13} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">한도 500 (가정)</text>
              <line x1={X0} x2={X1} y1={ROW2 + BAR_H + 22} y2={ROW2 + BAR_H + 22} stroke="#94a3b8" strokeWidth={1} />
              {[0, 200, 400, 600].map((tick) => (
                <text key={tick} x={x(tick)} y={ROW2 + BAR_H + 35} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
              ))}
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CHECKS.map((check) => (
                <span
                  key={check}
                  className={`rounded-md border px-2 py-1.5 text-center text-xs leading-5 ${proof ? "border-primary/60 font-semibold" : "border-border/50 text-muted-foreground/60"}`}
                >
                  {proof ? "□ " : ""}{check}
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
