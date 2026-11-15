import RecoverySceneShell from "./RecoverySceneShell";

/**
 * 본문 대응: #rollback — router가 참조하는 revision만 바꾸는 승격과 롤백.
 * 왼쪽 = 직전 검증 revision, 오른쪽 = 새 artifact revision, 맨 아래 = 계속 보관하는 원본.
 * "일부 요청"의 비율은 본문에 없어 숫자로 적지 않는다.
 */
type RevState = "active" | "standby" | "canary" | "draining" | "idle";

interface RollbackScene {
  label: string;
  summary: string;
  note: string;
  prev: RevState;
  next: RevState;
  keep: boolean;
}

const SCENES: readonly RollbackScene[] = [
  { label: "새 artifact를 별도 revision으로", summary: "active release = 직전 revision", note: "새 artifact는 기존 revision을 덮어쓰지 않고 별도 revision으로 올립니다. 아직 요청은 직전 검증 revision으로만 갑니다.", prev: "active", next: "idle", keep: false },
  { label: "일부 요청만 새 revision으로", summary: "기준 통과 전 active 변경 없음", note: "일부 요청만 새 revision에 보내 quality·오류율·peak memory·지연시간을 확인합니다. 기준을 통과하기 전에는 active release가 바뀌지 않습니다.", prev: "active", next: "canary", keep: false },
  { label: "기준 통과 → 승격", summary: "active release = 새 revision", note: "기준을 통과하면 router가 참조하는 active release가 새 revision으로 바뀝니다. 직전 artifact는 지우지 않고 남겨 둡니다.", prev: "standby", next: "active", keep: false },
  { label: "승격 뒤 문제 → 롤백", summary: "router → 직전 artifact", note: "문제가 생기면 router가 참조하는 revision을 직전 artifact로 되돌리고 새 replica를 drain합니다. Mask를 되돌리는 일이 아니라 트래픽 방향을 바꾸는 일입니다.", prev: "active", next: "draining", keep: false },
  { label: "제거한 weight는 복원하지 않는다", summary: "원본 보관 · 새 시험 = 새 generation", note: "롤백은 제거한 weight를 원래 값으로 복원하지 않습니다. 원본 checkpoint와 pruning artifact를 보관해 같은 generation을 재현하고, 다른 mask나 kernel은 새 generation으로 시험합니다.", prev: "active", next: "draining", keep: true },
];

const STATE_TEXT: Record<RevState, string> = {
  active: "active release · 요청 받음",
  standby: "대기 · 지우지 않음",
  canary: "일부 요청으로 확인 중",
  draining: "replica drain",
  idle: "올라감 · 요청 없음",
};

function Revision({ title, sub, state }: { title: string; sub: string; state: RevState }) {
  const strong = state === "active" || state === "canary";
  const warn = state === "draining";
  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2.5 text-xs leading-5 ${
        strong ? "border-primary bg-background" : warn ? "border-dashed border-amber-600" : "border-dashed border-border"
      }`}
    >
      <p className="break-words font-semibold">{title}</p>
      <p className="break-words text-muted-foreground">{sub}</p>
      <p className={`mt-1 break-words font-semibold ${strong ? "text-primary" : warn ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>{STATE_TEXT[state]}</p>
    </div>
  );
}

function Wire({ on, text }: { on: boolean; text: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center py-1" aria-hidden>
      <svg width="12" height="28" viewBox="0 0 12 28" className="shrink-0">
        <line x1={6} y1={0} x2={6} y2={22} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} opacity={on ? 1 : 0.5} />
        <path d="M2 21 L6 27 L10 21" fill="none" stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} opacity={on ? 1 : 0.5} />
      </svg>
      <span className={`text-[11px] ${on ? "font-semibold text-primary" : "text-muted-foreground"}`}>{text}</span>
    </div>
  );
}

export default function RollbackRevisionViz() {
  return (
    <RecoverySceneShell
      eyebrow="승격과 롤백"
      title="롤백은 router가 가리키는 revision을 바꾸는 일입니다"
      description="Revision은 배포 시스템이 따로 관리하는 artifact 한 벌이고, router는 요청을 어느 revision으로 보낼지 정합니다. 바뀌는 것은 화살표뿐이고 artifact 안의 weight는 그대로입니다."
      ariaLabel="직전 revision과 새 revision 사이에서 요청 방향이 바뀌는 승격과 롤백 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active] ?? SCENES[0];
        const prevTraffic = s.prev === "active";
        const nextTraffic = s.next === "active" || s.next === "canary";
        return (
          <div className="min-w-0">
            <div className="mx-auto max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-center text-xs font-semibold">Router · 요청 분배</div>
            <div className="grid min-w-0 grid-cols-2 gap-3">
              <Wire on={prevTraffic} text={prevTraffic ? (s.next === "canary" ? "나머지 요청" : "요청") : "요청 없음"} />
              <Wire on={nextTraffic} text={nextTraffic ? (s.next === "canary" ? "일부 요청" : "요청") : "요청 없음"} />
              <Revision title="직전 검증 revision" sub="이전 artifact" state={s.prev} />
              <Revision title="새 revision" sub="recovery 뒤 새 artifact" state={s.next} />
            </div>
            <div
              className={`mt-4 rounded-lg border px-3 py-2.5 text-xs leading-5 ${s.keep ? "border-primary bg-background" : "border-dashed border-border/60 text-muted-foreground"}`}
            >
              <p className="font-semibold">계속 보관: 원본 checkpoint · pruning artifact</p>
              <p className="text-muted-foreground">같은 generation 재현용 · 다른 mask나 kernel은 새 generation</p>
            </div>
          </div>
        );
      }}
    />
  );
}
