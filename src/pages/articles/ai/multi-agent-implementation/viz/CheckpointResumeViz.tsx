import SceneShell from "./SceneShell";

/**
 * 본문 대응: #langgraph — checkpoint 경계, 같은 작업 키의 DB 행·outbox 이벤트, 중단 뒤 두 번 재개.
 * 장면마다 첫 실행이 어디서 멈췄는지와 재개한 실행이 각 단계에서 무엇을 하는지를 나란히 보이고,
 * 맨 아래에 남는 행·외부 동작 수를 보인다. 작업 키 K-7은 그림을 위한 가정.
 */
const STEPS = [
  { code: "CP", title: "Checkpoint 경계" },
  { code: "N", title: "노드 실행" },
  { code: "TX", title: "DB 행+outbox 커밋 · 키 K-7 고유" },
  { code: "OUT", title: "외부 전송" },
  { code: "RES", title: "처리 결과 저장" },
] as const;

type Mark = "done" | "commit" | "sent" | "saved" | "crash" | "crashAfter" | "resume" | "rerun" | "blocked" | "dedup" | "human" | "idle";

const SCENES = [
  {
    label: "경계만 저장",
    summary: "노드를 처음부터",
    note: "Checkpointer는 경계의 상태만 저장합니다. 노드 도중에 멈추면 재개할 때 그 노드가 처음부터 다시 실행될 수 있습니다.",
    first: ["done", "crash", "idle", "idle", "idle"] as Mark[],
    resume: ["resume", "rerun", "commit", "sent", "saved"] as Mark[],
    rows: "1",
    actions: "1",
  },
  {
    label: "커밋 전에 중단",
    summary: "행 1 · 동작 1",
    note: "커밋 전이라 행도 이벤트도 남지 않았습니다. 재개한 실행이 커밋하면 행과 이벤트가 같은 작업 키로 함께 생깁니다.",
    first: ["done", "done", "crash", "idle", "idle"] as Mark[],
    resume: ["resume", "rerun", "commit", "sent", "saved"] as Mark[],
    rows: "1",
    actions: "1",
  },
  {
    label: "커밋한 뒤 중단",
    summary: "고유 제약이 막음",
    note: "행과 이벤트는 이미 K-7로 커밋됐습니다. 다시 실행된 노드가 K-7을 또 써도 고유 제약에 걸려 두 번째 행이 생기지 않습니다.",
    first: ["done", "done", "crashAfter", "idle", "idle"] as Mark[],
    resume: ["resume", "rerun", "blocked", "sent", "saved"] as Mark[],
    rows: "1",
    actions: "1",
  },
  {
    label: "외부 전송 뒤 중단",
    summary: "중복 방지 시 1회",
    note: "외부 동작은 이미 일어났지만 노드는 다시 실행될 수 있습니다. 제공자가 중복 방지를 지원하면 외부 동작은 한 번만 남습니다.",
    first: ["done", "done", "commit", "crashAfter", "idle"] as Mark[],
    resume: ["resume", "rerun", "blocked", "dedup", "saved"] as Mark[],
    rows: "1",
    actions: "1",
  },
  {
    label: "되돌릴 수 없고 방지 없음",
    summary: "사람·보상으로",
    note: "제공자가 중복 방지를 지원하지 않으면 되돌릴 수 없는 외부 동작이 한 번만 남는다고 보장할 수 없어 사람 승인·보상 절차로 넘깁니다.",
    first: ["done", "done", "commit", "crashAfter", "idle"] as Mark[],
    resume: ["resume", "rerun", "blocked", "human", "idle"] as Mark[],
    rows: "1",
    actions: "보장 불가",
  },
] as const;

const BLUE = "border-[#2563eb] text-[#1d4ed8] dark:text-[#93c5fd]";
const RED = "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]";
const AMBER = "border-[#d97706] text-[#b45309] dark:text-[#fbbf24]";
const GREEN = "border-[#16a34a] text-[#15803d] dark:text-[#86efac]";

const BADGE: Record<Mark, { text: string; cls: string }> = {
  done: { text: "완료", cls: BLUE },
  commit: { text: "커밋", cls: BLUE },
  sent: { text: "1회 전송", cls: BLUE },
  saved: { text: "저장", cls: BLUE },
  crash: { text: "여기서 중단", cls: RED },
  crashAfter: { text: "완료 뒤 중단", cls: RED },
  resume: { text: "여기서 재개", cls: BLUE },
  rerun: { text: "처음부터", cls: AMBER },
  blocked: { text: "중복 행 차단", cls: GREEN },
  dedup: { text: "재전송 무시됨", cls: GREEN },
  human: { text: "사람·보상", cls: RED },
  idle: { text: "—", cls: "border-transparent text-muted-foreground" },
};

const ROW = "grid grid-cols-[minmax(0,1fr)_5.25rem_5.25rem] items-center gap-1.5 sm:grid-cols-[3rem_minmax(0,1fr)_7rem_7rem] sm:gap-2";

export default function CheckpointResumeViz() {
  return (
    <SceneShell
      eyebrow="중단 지점별 재개"
      title="어디서 멈췄는지에 따라 무엇이 두 번 일어날 수 있는지가 달라집니다"
      description="위에서 아래가 노드 하나의 실행 순서이고, 왼쪽 열은 첫 실행이 멈춘 곳, 오른쪽 열은 재개한 실행이 각 단계에서 하는 일입니다. Outbox 이벤트는 보낼 메시지를 DB 행과 같은 트랜잭션 안에 먼저 적어 둔 기록입니다. 맨 아래 숫자는 그 지점에서 멈추고 두 번 재개한 뒤 남아야 할 수입니다."
      ariaLabel="checkpoint 경계, 트랜잭션 커밋, 외부 전송 앞뒤에서 중단하고 재개했을 때 첫 실행과 재개 실행이 각 단계에서 하는 일과 남는 DB 행·외부 동작 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className={`${ROW} pb-1 text-[11px] font-semibold text-muted-foreground`}>
              <span className="hidden sm:block" />
              <span>단계</span>
              <span className="text-center">첫 실행</span>
              <span className="text-center">재개 뒤</span>
            </div>
            <ol className="divide-y divide-border border-y border-border">
              {STEPS.map((step, i) => {
                const first = BADGE[scene.first[i]];
                const resume = BADGE[scene.resume[i]];
                return (
                  <li key={step.code} className={`${ROW} py-1`}>
                    <span className="hidden font-mono text-[11px] font-black text-primary sm:block">{step.code}</span>
                    <span className="min-w-0 break-keep text-xs font-semibold leading-5 sm:text-sm">{step.title}</span>
                    <span className={`rounded-md border px-1 py-1 text-center text-[11px] font-bold leading-4 ${first.cls}`}>{first.text}</span>
                    <span className={`rounded-md border px-1 py-1 text-center text-[11px] font-bold leading-4 ${resume.cls}`}>{resume.text}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <span>
                <span className="text-muted-foreground">두 번 재개 뒤 DB 행 </span>
                <strong className="font-mono">{scene.rows}</strong>
              </span>
              <span>
                <span className="text-muted-foreground">외부 동작 </span>
                <strong className="font-mono">{scene.actions}</strong>
              </span>
            </p>
          </div>
        );
      }}
    />
  );
}
