import SceneShell from "./SceneShell";

/**
 * 본문 대응: #admission — Pod 생성 요청이 API 서버의 admission에서 LimitRange·ResourceQuota를 지나는 길.
 * 거절되면 Pod 객체가 생기지 않고, event는 Pod를 만들려던 ReplicaSet에 FailedCreate로 남는다.
 * LimitRange 검사는 admission 때만 하므로 나중에 바꿔도 이미 도는 Pod는 그대로다.
 */
type Mark = "idle" | "pass" | "fill" | "reject" | "skip" | "either";

interface Scene {
  label: string;
  summary: string;
  note: string;
  request: string;
  limitRange: Mark;
  quota: Mark;
  pod: "none" | "pending" | "created" | "old";
  rsEvent: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "Pod 생성 요청", summary: "ReplicaSet → API 서버", request: "requests·limits 일부만 적힘", limitRange: "idle", quota: "idle", pod: "pending", rsEvent: false, note: "Deployment가 만든 ReplicaSet이 Pod 객체를 만들어 달라고 API 서버에 요청합니다. 저장되기 전에 admission controller(요청을 받아들이기 전 검사·수정하는 단계)가 requests·limits를 봅니다." },
  { label: "LimitRange · 빈칸 채움", summary: "빠진 값에 기본값", request: "빈칸 → 기본값", limitRange: "fill", quota: "idle", pod: "pending", rsEvent: false, note: "namespace에 LimitRange가 있으면 빠진 request·limit에 기본값을 채웁니다. cpu·memory quota가 걸린 namespace에서 값이 없는 Pod는 거부될 수 있어 이 기본값을 미리 두는 것이 보통입니다." },
  { label: "LimitRange · 범위 밖", summary: "403 Forbidden", request: "범위를 벗어난 값", limitRange: "reject", quota: "skip", pod: "none", rsEvent: true, note: "값이 LimitRange의 범위를 벗어나면 admission이 403 Forbidden으로 거절합니다. Pod 객체는 만들어지지 않습니다." },
  { label: "quota 합계 초과", summary: "403 · exceeded quota", request: "범위 안의 값", limitRange: "pass", quota: "reject", pod: "none", rsEvent: true, note: "LimitRange를 통과해도 ResourceQuota가 namespace 합계를 봅니다. 이미 있는 Pod들의 requests에 새 Pod의 requests를 더해 quota를 넘으면 역시 403으로 거절되고 Pod 객체가 생기지 않습니다." },
  { label: "event는 ReplicaSet에", summary: "Pod 0개 · FailedCreate", request: "앞 두 장면 중 하나로 거절됨", limitRange: "either", quota: "either", pod: "none", rsEvent: true, note: "거절은 Pod가 아니라 Pod를 만들려던 ReplicaSet에 남습니다. Deployment와 ReplicaSet은 정상인데 Pod가 0개라면 ReplicaSet의 event에서 FailedCreate와 'exceeded quota' 또는 'forbidden'을 찾습니다." },
  { label: "통과하면 생성", summary: "그 뒤 LimitRange를 바꿔도 그대로", request: "범위 안 · quota 안", limitRange: "pass", quota: "pass", pod: "old", rsEvent: false, note: "두 검사를 통과하면 Pod 객체가 생기고 scheduler의 4절 장부로 넘어갑니다. 검사는 admission 때만 하므로 나중에 LimitRange를 바꿔도 이미 도는 Pod는 그대로입니다." },
];

const MARK_TEXT: Record<Mark, string> = { idle: "대기", pass: "통과", fill: "기본값 채움", reject: "403 거절", skip: "도달 안 함", either: "둘 중 하나가 거절" };

function markClass(m: Mark) {
  if (m === "reject" || m === "either") return "border-[#b91c1c] bg-[#b91c1c]/10 text-[#b91c1c] dark:text-[#fca5a5]";
  if (m === "pass") return "border-[#16a34a] text-[#15803d] dark:text-[#86efac]";
  if (m === "fill") return "border-[#2563eb] bg-[#2563eb]/10 text-[#1d4ed8] dark:text-[#93c5fd]";
  if (m === "skip") return "border-dashed border-border text-muted-foreground/60";
  return "border-border text-muted-foreground";
}

function Arrow() {
  return <span aria-hidden className="self-center text-center text-sm text-muted-foreground lg:px-0.5">→</span>;
}

export default function AdmissionPathViz() {
  return (
    <SceneShell
      eyebrow="admission 단계"
      title="Pod가 생기기 전에 두 검사가 막을 수 있고, 그 흔적은 ReplicaSet에 남습니다"
      description="왼쪽부터 Pod를 만드는 소유자 사슬, API 서버의 두 검사(LimitRange는 값의 기본값과 범위, ResourceQuota는 namespace 합계), 결과 Pod입니다. 거절되면 Pod 칸이 비고 event 표시가 ReplicaSet 칸에 붙습니다."
      ariaLabel="LimitRange와 ResourceQuota admission을 지나 Pod가 생성되거나 거절되는 경로"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-2 lg:grid-cols-[minmax(5.75rem,0.75fr)_auto_minmax(0,0.9fr)_auto_minmax(13.5rem,2.1fr)_auto_minmax(0,0.85fr)]">
              <div className="rounded-lg border border-border px-2 py-2 text-center text-xs">
                <span className="block font-bold">Deployment</span>
                <span className="block text-muted-foreground">정상</span>
              </div>
              <Arrow />
              <div className={`rounded-lg border px-2 py-2 text-center text-xs ${s.rsEvent ? "border-[#b45309]" : "border-border"}`}>
                <span className="block font-bold">ReplicaSet</span>
                <span className={`block ${s.rsEvent ? "font-bold text-[#b45309] dark:text-[#fbbf24]" : "text-muted-foreground"}`}>{s.rsEvent ? "event: FailedCreate" : "Pod 생성 요청"}</span>
              </div>
              <span aria-hidden className="col-span-3 text-center text-sm text-muted-foreground lg:col-span-1 lg:self-center">
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
              <div className="col-span-3 rounded-lg border border-border p-2 lg:col-span-1">
                <span className="block text-center text-[11px] font-bold text-muted-foreground">API 서버 admission</span>
                <div className="mt-1 grid grid-cols-2 gap-1.5">
                  <div className={`rounded-md border px-1 py-1.5 text-center text-xs ${markClass(s.limitRange)}`}>
                    <span className="block font-semibold text-foreground">LimitRange</span>
                    <span className="block font-bold">{MARK_TEXT[s.limitRange]}</span>
                  </div>
                  <div className={`rounded-md border px-1 py-1.5 text-center text-xs ${markClass(s.quota)}`}>
                    <span className="block font-semibold text-foreground">ResourceQuota</span>
                    <span className="block font-bold">{MARK_TEXT[s.quota]}</span>
                  </div>
                </div>
              </div>
              <span aria-hidden className="col-span-3 text-center text-sm text-muted-foreground lg:col-span-1 lg:self-center">
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
              <div className={`col-span-3 rounded-lg border px-2 py-2 text-center text-xs lg:col-span-1 ${s.pod === "none" ? "border-dashed border-[#b91c1c]" : s.pod === "old" ? "border-[#16a34a]" : "border-dashed border-border"}`}>
                <span className="block font-bold">Pod</span>
                <span className={`block ${s.pod === "none" ? "font-bold text-[#b91c1c] dark:text-[#fca5a5]" : s.pod === "old" ? "font-bold text-[#15803d] dark:text-[#86efac]" : "text-muted-foreground"}`}>
                  {s.pod === "none" ? "객체 없음 · event 없음" : s.pod === "old" ? "생성됨 → scheduler" : "아직 없음"}
                </span>
              </div>
            </div>
            <p className="mt-3 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              요청에 담긴 값: <span className="font-semibold text-foreground">{s.request}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
