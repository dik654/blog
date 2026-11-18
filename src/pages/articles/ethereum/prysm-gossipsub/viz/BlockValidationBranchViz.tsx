import SceneShell from "./SceneShell";

/**
 * 본문 대응: #message-validation — Prysm v7.3.1에서 B352가 일곱 단계 중 어디서 빠져 어떤 판정을 받는가.
 * 단계와 출구는 본문 목록(1~7)과 DECISIONS 카드의 예시만 사용한다. 마지막 장면은 timeout wrapper.
 */
type Verdict = "Accept" | "Reject" | "Ignore";

const STEPS: readonly { label: string; exits: readonly { when: string; verdict: Verdict }[] }[] = [
  {
    label: "직접 publish · initial sync 확인",
    exits: [
      { when: "우리가 publish", verdict: "Accept" },
      { when: "initial sync 중 외부 block", verdict: "Ignore" },
    ],
  },
  { label: "fork별 type으로 SSZ-Snappy decode", exits: [{ when: "decode 불가 · block type 아님", verdict: "Reject" }] },
  { label: "중복 · slot 시간 · DB/pending queue", exits: [{ when: "이미 본 block · 너무 이름", verdict: "Ignore" }] },
  {
    label: "finalized 경계 · known-bad parent",
    exits: [
      { when: "bad parent", verdict: "Reject" },
      { when: "이미 처리한 후보", verdict: "Ignore" },
    ],
  },
  { label: "parent를 아는가", exits: [{ when: "모름 → 서명 확인·pending·parent 요청", verdict: "Ignore" }] },
  { label: "ancestry · 서명 · proposer · fork별 조건", exits: [{ when: "invalid signature · proposer index", verdict: "Reject" }] },
  { label: "msg.ValidatorData에 typed block", exits: [{ when: "모두 통과", verdict: "Accept" }] },
];

const COLOR: Record<Verdict, string> = { Accept: "#16a34a", Reject: "#dc2626", Ignore: "#d97706" };

const SCENES = [
  { label: "출처와 sync 상태", summary: "자기 publish → Accept · sync 중 → Ignore", note: "우리 노드가 직접 publish한 메시지는 다시 검증하지 않고 Accept합니다. Initial sync 중 외부 block은 Ignore합니다. 이 둘은 block 내용을 보기 전에 갈립니다." },
  { label: "형식 복원", summary: "decode 불가 → Reject", note: "Topic이 가리킨 fork-specific type으로 SSZ-Snappy를 decode합니다. Decode할 수 없거나 block type이 아니면 Reject합니다." },
  { label: "중복과 시간", summary: "이미 본 block · 너무 이름 → Ignore", note: "같은 slot·proposer의 block을 이미 보았는지, slot 시간이 맞는지, block root가 DB나 pending queue에 있는지 확인합니다. 이미 본 block이나 너무 이른 block은 전파하지 않되 peer가 악의적이라고 단정하지 않습니다." },
  { label: "finalized와 bad parent", summary: "bad parent → Reject · 처리한 후보 → Ignore", note: "Finalized 경계와 known-bad parent를 확인합니다. 같은 단계에서도 bad parent는 Reject, 이미 처리한 후보는 Ignore로 출구가 둘입니다." },
  { label: "parent를 모를 때", summary: "pending queue + parent 요청 → Ignore", note: "Parent를 모르면 먼저 proposer signature를 확인하고 pending queue에 넣은 뒤 parent를 요청합니다. 우리 노드에 아직 없는 정보 때문이므로 현재 전파 판정은 Ignore입니다." },
  { label: "비싼 합의 검사", summary: "invalid signature · proposer → Reject", note: "Parent가 있으면 fork choice ancestry, block signature, proposer index와 fork별 execution·data 조건을 검사합니다. Invalid signature나 proposer index는 Reject입니다." },
  { label: "Accept", summary: "ValidatorData → subscriber", note: "통과한 typed block을 msg.ValidatorData에 넣고 Accept를 반환합니다. 여기서 Accept는 전파 허용이며, state transition·fork choice는 subscriber 뒤의 다음 단계입니다." },
  { label: "timeout wrapper", summary: "timeout과 함께 나온 Reject → Ignore", note: "위 일곱 단계를 감싸는 validation wrapper는 내부 timeout과 함께 나온 Reject를 Ignore로 바꿉니다. 우리 노드의 CPU·state lookup 지연을 보낸 peer의 잘못으로 둔갑시키지 않기 위해서입니다." },
] as const;

function Chip({ verdict, when, strong, dim }: { verdict: Verdict; when: string; strong: boolean; dim: boolean }) {
  return (
    <span
      className={`inline-flex min-w-0 items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[11px] leading-4 ${dim ? "opacity-35" : ""}`}
      style={{ borderColor: strong ? COLOR[verdict] : "#cbd5e1", borderWidth: strong ? 1.25 : 1 }}
    >
      <span className="font-mono text-[10px] font-black" style={{ color: COLOR[verdict] }}>
        {verdict}
      </span>
      <span className="break-keep text-muted-foreground">{when}</span>
    </span>
  );
}

export default function BlockValidationBranchViz() {
  return (
    <SceneShell
      eyebrow="B352의 검증 경로"
      title="일곱 단계마다 빠지는 출구가 있고, 출구마다 판정이 다릅니다"
      description="한 줄이 본문 목록의 한 단계입니다. 오른쪽 칩은 그 단계에서 빠져나가는 조건과 판정입니다. Accept는 전파 허용, Reject는 전파 중단과 penalty 근거가 될 수 있음, Ignore는 전파하지 않되 peer를 탓하지 않음입니다."
      note="단계 순서와 출구는 Prysm v7.3.1 기준 본문 설명을 따릅니다. 3단계와 6단계의 칩은 본문 판정 표의 예시를 해당 단계에 놓은 것입니다."
      ariaLabel="beacon block gossip 검증 일곱 단계와 각 단계의 Accept, Reject, Ignore 출구"
      scenes={SCENES}
      compact
      render={(active) => {
        const wrapperOn = active === 7;
        const current = wrapperOn ? -1 : active;
        return (
          <div className={`min-w-0 rounded-lg border p-2 ${wrapperOn ? "border-[#d97706]" : "border-dashed border-border"}`}>
            <ol className="mb-2 grid grid-cols-7 gap-1 sm:hidden" aria-hidden="true">
              {STEPS.map((step, index) => (
                <li
                  key={step.label}
                  className={`rounded border py-1 text-center font-mono text-[11px] ${
                    index === current ? "border-primary font-bold" : !wrapperOn && index < current ? "border-green-600 text-green-700 dark:text-green-400" : "border-border text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </li>
              ))}
            </ol>
            <ol className="space-y-1">
              {STEPS.map((step, index) => {
                const isCurrent = index === current;
                const passed = !wrapperOn && index < current;
                return (
                  <li
                    key={step.label}
                    className={`${isCurrent ? "grid" : "hidden sm:grid"} min-w-0 gap-1 rounded-md border px-2 py-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center ${
                      isCurrent ? "border-primary bg-primary/5" : "border-border bg-background"
                    }`}
                  >
                    <span className={`break-keep text-xs leading-5 ${isCurrent ? "font-bold" : passed ? "" : "text-muted-foreground"}`}>
                      <span className="mr-1 font-mono">{index + 1}.</span>
                      {step.label}
                      {passed && <span className="ml-1 text-[10px] text-green-700 dark:text-green-400">통과</span>}
                    </span>
                    <span className={`min-w-0 flex-wrap gap-1 ${isCurrent || wrapperOn ? "flex" : "hidden sm:flex"}`}>
                      {step.exits.map((exit) => (
                        <Chip key={exit.when} verdict={exit.verdict} when={exit.when} strong={isCurrent} dim={!isCurrent && !wrapperOn} />
                      ))}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className={`mt-2 flex flex-wrap items-center gap-1.5 px-1 text-[11px] leading-5 ${wrapperOn ? "" : "opacity-35"}`}>
              <span className="font-bold">wrapper:</span>
              <span className="font-mono font-black" style={{ color: COLOR.Reject }}>Reject</span>
              <span className="text-muted-foreground">+ 내부 timeout →</span>
              <span className="font-mono font-black" style={{ color: COLOR.Ignore }}>Ignore</span>
            </p>
          </div>
        );
      }}
    />
  );
}
