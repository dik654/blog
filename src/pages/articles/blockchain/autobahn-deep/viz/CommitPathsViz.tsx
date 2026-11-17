import AutobahnSceneShell from "./AutobahnSceneShell";

/**
 * 본문 대응: #commit-recovery 첫 두 문단 — n=4, f=1에서 PrepareQC = Prep-Vote 2f+1=3,
 * 느린 CommitQC = Confirm-Ack 2f+1=3, 빠른 CommitQC = Prep-Vote n=4(Confirm 단계 생략).
 */
const N = 4;
const QUORUM = 3; // 2f+1, f=1

interface PathScene {
  label: string;
  summary: string;
  note: string;
  prepVotes: number;
  /** pending: 느린 경로라면 다음에 올 단계, sent: 진행함, skipped: 빠른 경로라 생략 */
  confirm: "pending" | "sent" | "skipped";
  confirmAcks: number;
  result: string;
}

const SCENES: readonly PathScene[] = [
  {
    label: "준비 표 3개 → PrepareQC",
    summary: "Prep-Vote 3 = 2f+1",
    note: "주 노드가 cut을 제안하고 복제본 넷 중 셋(2f+1)의 준비 표가 모이면 PrepareQC가 됩니다. 이것은 '이 view에서 준비된 cut'이라는 증거이지 아직 확정은 아닙니다.",
    prepVotes: 3,
    confirm: "pending",
    confirmAcks: 0,
    result: "PrepareQC (준비됨)",
  },
  {
    label: "느린 경로: Confirm 한 단계 더",
    summary: "Confirm-Ack 3 = 2f+1 → CommitQC",
    note: "주 노드가 PrepareQC를 Confirm으로 다시 알리고, 확인 응답 셋이 모이면 느린 CommitQC가 됩니다. 이 사이 여러 정상 노드가 PrepareQC를 저장했으므로 주 노드가 바뀌어도 결정 후보를 복구할 수 있습니다.",
    prepVotes: 3,
    confirm: "sent",
    confirmAcks: 3,
    result: "느린 CommitQC",
  },
  {
    label: "빠른 경로: 준비 표 4개 전부",
    summary: "Prep-Vote 4 = n → CommitQC",
    note: "넷 모두의 준비 표가 모이면 Confirm 단계 없이 곧바로 빠른 CommitQC가 됩니다. 기준(n표)과 재료(준비 표)가 느린 CommitQC(확인 응답 2f+1개)와 다르므로 두 증거를 같은 이름으로 뭉치면 안 됩니다.",
    prepVotes: 4,
    confirm: "skipped",
    confirmAcks: 0,
    result: "빠른 CommitQC",
  },
];

function VoteRow({ title, count, threshold, dim, dimLabel = "생략", marks }: { title: string; count: number; threshold: string; dim: boolean; dimLabel?: string; marks: readonly number[] }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${dim ? "border-dashed border-border/60" : "border-border"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <p className={`text-xs font-bold ${dim ? "text-muted-foreground/60" : ""}`}>{title}</p>
        <p className={`font-mono text-xs font-bold ${dim ? "text-muted-foreground/60" : "text-primary"}`}>{dim ? dimLabel : `${count}/${N} · ${threshold}`}</p>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {Array.from({ length: N }, (_, index) => {
          const filled = !dim && index < count;
          const mark = marks.includes(index + 1);
          return (
            <span
              key={index}
              className={`relative rounded border px-1 py-1.5 text-center text-[11px] font-bold ${
                filled ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-border/60 text-muted-foreground/40"
              } ${mark ? "outline outline-1 outline-offset-2 outline-amber-600" : ""}`}
            >
              {index + 1}표
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function CommitPathsViz() {
  return (
    <AutobahnSceneShell
      eyebrow="cut 확정의 두 경로 · n=4, f=1"
      title="느린 확정은 확인 응답 3개, 빠른 확정은 준비 표 4개를 셉니다"
      description="칸 하나가 복제본 한 곳의 표입니다. 주황 테두리는 기준선(3표 = 2f+1, 4표 = n)입니다. Prep-Vote는 제안된 cut에 대한 준비 표, Confirm-Ack는 Confirm 메시지에 대한 확인 응답, view는 주 노드 한 명이 제안을 맡는 회차입니다."
      ariaLabel="PrepareQC, 느린 CommitQC, 빠른 CommitQC가 만들어지는 세 장면"
      playLabel="확정 경로 비교 재생"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <p className="rounded-lg border border-border px-2 py-1.5 text-xs font-semibold">주 노드 → cut 제안</p>
            <VoteRow title="준비 표 (Prep-Vote)" count={scene.prepVotes} threshold={scene.prepVotes === N ? "n" : "2f+1"} dim={false} marks={[QUORUM, N]} />
            <p className={`rounded-lg border px-2 py-1.5 text-xs font-semibold ${scene.confirm === "sent" ? "border-border" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
              {scene.confirm === "sent" ? "주 노드 → Confirm (PrepareQC를 다시 알림)" : scene.confirm === "pending" ? "Confirm 아직 전 (느린 경로의 다음 단계)" : "Confirm 단계 생략 (빠른 경로)"}
            </p>
            <VoteRow title="확인 응답 (Confirm-Ack)" count={scene.confirmAcks} threshold="2f+1" dim={scene.confirm !== "sent"} dimLabel={scene.confirm === "pending" ? "아직" : "생략"} marks={[QUORUM]} />
            <p className="rounded-lg border border-primary bg-primary/5 px-2 py-2 text-sm font-black text-primary">결과 · {scene.result}</p>
          </div>
        );
      }}
    />
  );
}
