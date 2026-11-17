import SceneShell from "./SceneShell";

/**
 * 본문 대응: #report-evidence-confidentiality 둘째 문단 — Submit은 external effect다.
 * Attempt ID·idempotency key를 만들고 결과를 accepted·rejected·unknown으로 나눈다.
 * Timeout 뒤 blind resend하지 않고 FIU acknowledgement나 조회 절차로 reconcile한다.
 * Accepted receipt가 있어야 filed, reject는 고친 새 revision을 다시 승인한다.
 */
type NodeId = "approved" | "attempt" | "accepted" | "filed" | "rejected" | "revise" | "unknown" | "reconcile";

const SCENES = [
  {
    label: "제출 시도 만들기",
    summary: "attempt ID + idempotency key",
    on: ["approved", "attempt"],
    note: "승인된 revision을 보내기 전에 시도마다 attempt ID와 idempotency key(같은 요청이 여러 번 도착해도 한 건으로 알아보게 붙이는 고유 키)를 만듭니다. 제출은 기관 밖에 결과가 남는 external effect라서, 나중에 어느 시도가 무엇이 됐는지 이 두 값으로 찾습니다.",
  },
  {
    label: "accepted",
    summary: "receipt가 있어야 filed",
    on: ["attempt", "accepted", "filed"],
    note: "Accepted receipt를 받은 경우에만 case 상태를 filed로 옮깁니다. 전송 버튼을 눌렀다는 사실만으로는 filed가 아닙니다.",
  },
  {
    label: "rejected",
    summary: "고친 새 revision → 다시 승인",
    on: ["attempt", "rejected", "revise", "approved"],
    note: "Reject는 schema나 authority 사유를 고친 새 revision으로 만들고, 그 revision을 다시 승인한 뒤 새 시도로 보냅니다. 거절된 revision을 그대로 다시 보내지 않습니다.",
  },
  {
    label: "timeout → unknown",
    summary: "재전송 대신 reconcile",
    on: ["attempt", "unknown", "reconcile"],
    note: "응답 없이 시간이 지나면 접수됐는지 모르는 unknown입니다. 이때 같은 보고를 그냥 다시 보내면(blind resend) 두 번 접수될 수 있으므로, FIU acknowledgement나 조회 절차로 실제 결과를 맞춰 본 뒤(reconcile) 다음 상태를 정합니다.",
  },
] as const satisfies readonly { label: string; summary: string; on: readonly NodeId[]; note: string }[];

const NODES: Record<NodeId, { tag: string; title: string; body: string }> = {
  approved: { tag: "승인", title: "승인된 revision", body: "narrative·reviewer·approver 고정" },
  attempt: { tag: "SUBMIT", title: "제출 시도", body: "attempt ID · idempotency key" },
  accepted: { tag: "결과 1", title: "accepted", body: "FIU 접수 receipt" },
  filed: { tag: "상태", title: "filed", body: "receipt를 case에 연결" },
  rejected: { tag: "결과 2", title: "rejected", body: "schema·authority 사유" },
  revise: { tag: "다음", title: "새 revision", body: "사유 수정 → 다시 승인" },
  unknown: { tag: "결과 3", title: "unknown", body: "timeout · 접수 여부 모름" },
  reconcile: { tag: "다음", title: "reconcile", body: "ack·조회로 확인 · 확인 전 재전송 ✕" },
};

function Node({ id, active }: { id: NodeId; active: boolean }) {
  const node = NODES[id];
  return (
    <div
      className={`min-w-0 rounded-lg border p-2.5 transition-opacity duration-300 motion-reduce:transition-none sm:p-3 ${
        active ? "border-primary bg-primary/5 opacity-100" : "border-border bg-background opacity-45"
      }`}
    >
      <p className={`text-[11px] font-bold tracking-[.06em] ${active ? "text-primary" : "text-muted-foreground"}`}>{node.tag}</p>
      <p className="mt-1 break-keep text-sm font-semibold leading-5">{node.title}</p>
      {/* 좁은 화면에서는 켜진 칸만 설명을 보여 줘 결과 세 줄이 한 화면에 들어오게 합니다. */}
      <p className={`mt-1 break-keep text-xs leading-5 text-muted-foreground ${active ? "block" : "hidden sm:block"}`}>{node.body}</p>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <span aria-hidden className="flex items-center justify-center text-sm text-muted-foreground">
      {label}
    </span>
  );
}

export default function FilingStateViz() {
  return (
    <SceneShell
      eyebrow="STR 제출 상태"
      title="보냈다고 filed가 아니고, 응답이 없다고 확인 없이 다시 보내지 않습니다"
      description="한 번의 제출 시도가 세 결과 중 하나로 갈라집니다. 결과 칸에서 화살표가 가리키는 칸이 그 결과 뒤에 하는 일입니다."
      ariaLabel="승인된 STR revision의 제출 시도가 accepted, rejected, unknown으로 갈라지고 각각 filed, 새 revision 재승인, reconcile로 이어지는 흐름"
      scenes={SCENES}
      render={(active) => {
        const on = new Set<NodeId>(SCENES[active].on);
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-2">
              <Node id="approved" active={on.has("approved")} />
              <Arrow label="→" />
              <Node id="attempt" active={on.has("attempt")} />
            </div>
            <p className="text-center text-xs font-semibold text-muted-foreground">↓ 결과는 셋 중 하나 ↓</p>
            {/* 좁은 화면은 결과마다 한 줄(결과 → 다음), 넓은 화면은 결과마다 한 열(결과 ↓ 다음)로 놓아 높이를 줄입니다. */}
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              {(
                [
                  ["accepted", "filed"],
                  ["rejected", "revise"],
                  ["unknown", "reconcile"],
                ] as const
              ).map(([result, next]) => (
                <div key={result} className="grid min-w-0 grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-2 sm:grid-cols-1 sm:gap-1">
                  <Node id={result} active={on.has(result)} />
                  <span aria-hidden className="flex items-center justify-center text-sm text-muted-foreground">
                    <span className="sm:hidden">→</span>
                    <span className="hidden sm:inline">↓</span>
                  </span>
                  <Node id={next} active={on.has(next)} />
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
