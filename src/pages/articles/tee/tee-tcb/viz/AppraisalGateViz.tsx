import TcbSceneShell from "./TcbSceneShell";

/**
 * 본문 대응: #pcr-log-appraisal, #release-gate — 네 판정(Authenticity·Freshness·Replay·Meaning)을
 * 차례로 통과해야 하며, log·PCR 일치(Replay)는 "일관된 기록"일 뿐 "좋은 software"가 아니다.
 * 주입 사례는 release gate 목록(reordered log, missing event, newly approved update, revoked old image)과
 * 본문의 "악성 image를 측정해 정직하게 보고" 사례에서 가져왔다.
 */
type GateState = "pass" | "stop" | "skip";
type Verdict = "accept" | "reject" | "false-reject";

const GATES = [
  ["1", "Authenticity", "서명·chain"],
  ["2", "Freshness", "nonce·epoch"],
  ["3", "Replay", "log → PCR"],
  ["4", "Meaning", "reference·revoke"],
] as const;

const CASES: readonly { label: string; summary: string; note: string; stopAt: number | null; verdict: Verdict }[] = [
  {
    label: "정상 sequence",
    summary: "1·2·3·4 통과 → 수락",
    note: "Quote 서명과 chain이 맞고, 이번 nonce가 결속돼 있고, log를 같은 초기값부터 replay한 값이 서명된 PCR과 같으며, 각 digest가 reference manifest와 정책을 만족합니다. 네 판정이 모두 통과해야 수락합니다.",
    stopAt: null,
    verdict: "accept",
  },
  {
    label: "Log 순서가 바뀜",
    summary: "3 Replay에서 멈춤 → 거부",
    note: "Extend는 순서를 접기 때문에, 실제와 다른 순서로 적힌 log를 replay하면 서명된 PCR과 다른 값이 나옵니다. 서명과 nonce가 멀쩡해도 Replay에서 멈춥니다.",
    stopAt: 2,
    verdict: "reject",
  },
  {
    label: "Log에서 event 누락",
    summary: "3 Replay에서 멈춤 → 거부",
    note: "PCR에는 접혀 있는 event가 log에서 빠지면, log만으로 다시 접은 값이 서명된 PCR에 이르지 못합니다. 이 역시 Replay 불일치입니다.",
    stopAt: 2,
    verdict: "reject",
  },
  {
    label: "악성 image를 정직하게 측정",
    summary: "1·2·3 통과 → manifest에 없으면 4에서 거부",
    note: "공격자가 악성 image를 측정해 그대로 보고하면 log와 PCR은 서로 맞습니다. Replay 통과는 ‘일관되게 기록됐다’는 뜻일 뿐이고, 그 digest가 reference manifest에 없어야 Meaning 단계에서 멈춥니다. 이런 모르는 값을 trusted로 올리는 verifier는 release gate에서 배포하지 않습니다.",
    stopAt: 3,
    verdict: "reject",
  },
  {
    label: "새로 승인된 update, 낡은 manifest",
    summary: "4에서 거부 → false reject",
    note: "정상 update인데 reference manifest가 아직 그 digest를 포함하지 않으면 Meaning에서 거부됩니다. 막아서는 안 될 것을 막은 false reject이므로, reference value의 서명·owner·validity window·rollback 절차도 TCB 운영에 들어갑니다.",
    stopAt: 3,
    verdict: "false-reject",
  },
  {
    label: "Revoke된 이전 image",
    summary: "4에서 거부 → 올바른 거부",
    note: "기록은 정직하고 log와 PCR도 맞지만, revoke·minimum TCB 정책이 이 version을 더 이상 허용하지 않습니다. Meaning 단계가 정책으로 거부하고 reason code를 남깁니다.",
    stopAt: 3,
    verdict: "reject",
  },
];

const STATE_STYLE: Record<GateState, { color: string; text: string }> = {
  pass: { color: "#16a34a", text: "통과" },
  stop: { color: "#dc2626", text: "멈춤" },
  skip: { color: "#94a3b8", text: "미도달" },
};

const VERDICT_STYLE: Record<Verdict, { color: string; text: string }> = {
  accept: { color: "#16a34a", text: "수락" },
  reject: { color: "#dc2626", text: "거부" },
  "false-reject": { color: "#d97706", text: "거부 · false reject" },
};

function stateOf(gate: number, stopAt: number | null): GateState {
  if (stopAt === null || gate < stopAt) return "pass";
  return gate === stopAt ? "stop" : "skip";
}

function render(active: number) {
  const item = CASES[active];
  const verdict = VERDICT_STYLE[item.verdict];
  return (
    <div className="min-w-0">
      <ol className="grid min-w-0 grid-cols-2 gap-2 md:grid-cols-4">
        {GATES.map(([num, name, detail], gate) => {
          const style = STATE_STYLE[stateOf(gate, item.stopAt)];
          return (
            <li key={name} className="min-w-0 rounded-lg border p-3" style={{ borderColor: style.color }}>
              <p className="text-xs font-bold text-muted-foreground">
                {num} · {detail}
              </p>
              <p className="mt-1 text-sm font-semibold">{name}</p>
              <p className="mt-2 text-xs font-bold" style={{ color: style.color }}>
                {style.text}
              </p>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
        <span className="text-xs text-muted-foreground">주입한 경우: {item.label}</span>
        <span className="rounded-md border px-2 py-1 text-xs font-bold" style={{ borderColor: verdict.color, color: verdict.color }}>
          판정: {verdict.text}
        </span>
      </div>
    </div>
  );
}

export default function AppraisalGateViz() {
  return (
    <TcbSceneShell
      eyebrow="Appraisal 네 판정"
      title="Log와 PCR이 맞아도 Meaning 판정이 남는다"
      description="아래 네 칸이 바로 앞 목록의 1~4단계입니다. 장면마다 배포 전에 일부러 넣어 보는 경우(04절 release gate의 목록과 이 절의 악성 image 사례) 하나를 흘려 보내 어느 칸에서 멈추는지 봅니다. 멈춘 칸 뒤는 ‘미도달’로 표시했습니다(그림을 위한 단순화)."
      ariaLabel="정상·순서 변경·누락·악성 image·낡은 manifest·revoked image가 네 판정 중 어디에서 멈추는지"
      scenes={CASES}
      render={render}
    />
  );
}
