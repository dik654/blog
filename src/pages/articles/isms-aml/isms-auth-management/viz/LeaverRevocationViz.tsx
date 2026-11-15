import SceneShell from "./SceneShell";

/**
 * 본문 대응: #account-lifecycle Mover 문단 뒷부분과 "VPN certificate, cloud role ..." 문단.
 * 칸 하나 = 퇴직자에게 남아 있을 수 있는 접근 수단 하나(본문에 나온 열 가지).
 * 장면 3에서 SaaS account의 결과가 불명인 것은 가정이다.
 */
type Status = "live" | "revoked" | "unknown";

const ITEMS = [
  "interactive login",
  "active session",
  "refresh token",
  "API key",
  "SSH key",
  "VPN certificate",
  "cloud role",
  "database grant",
  "SaaS account",
  "shared secret",
] as const;

const UNKNOWN_ITEM = "SaaS account";

const STATUS_TEXT: Record<Status, string> = {
  live: "살아 있음",
  revoked: "폐기됨",
  unknown: "결과 불명",
};

const STATUS_CLASS: Record<Status, string> = {
  live: "border-red-600 text-red-700 dark:text-red-400",
  revoked: "border-border/60 text-muted-foreground",
  unknown: "border-dashed border-amber-600 text-amber-700 dark:text-amber-400",
};

const SCENES = [
  {
    label: "퇴직 event 직후",
    summary: "10개 모두 살아 있음",
    mode: 0,
    queue: "비어 있음",
    note: "퇴직 event가 들어온 순간에는 로그인 계정뿐 아니라 이미 발급된 session·token·key·권한이 모두 살아 있습니다.",
  },
  {
    label: "로그인만 막음",
    summary: "1개 폐기 · 9개 남음",
    mode: 1,
    queue: "비어 있음",
    note: "interactive login을 막아도 refresh token(다시 로그인하지 않고 새 접근 token을 받는 값), API key, SSH key 같은 나머지 아홉 개는 그대로 쓸 수 있습니다. 이 상태로는 퇴직 처리가 끝난 것이 아닙니다.",
  },
  {
    label: "connector별 회수",
    summary: "9개 폐기 · 1개 결과 불명",
    mode: 2,
    queue: `${UNKNOWN_ITEM} — 성공으로 세지 않음`,
    note: "시스템마다 연결된 connector가 정해진 SLA(처리 기한) 안에 회수합니다. 한 곳의 결과를 확인하지 못했다면(가정) 성공으로 처리하지 않고, 실제 상태를 다시 대조할 reconciliation queue에 남깁니다.",
  },
] as const;

function statusOf(item: string, mode: number): Status {
  if (mode === 0) return "live";
  if (mode === 1) return item === "interactive login" ? "revoked" : "live";
  return item === UNKNOWN_ITEM ? "unknown" : "revoked";
}

export default function LeaverRevocationViz() {
  return (
    <SceneShell
      eyebrow="Leaver revocation"
      title="계정 하나를 막는 것과 모든 접근 수단을 회수하는 것은 다릅니다"
      description="칸 하나가 퇴직자에게 남아 있을 수 있는 접근 수단 하나이며, 본문에 나온 열 가지를 그대로 놓았습니다. 상태는 색과 글자로 함께 표시합니다."
      ariaLabel="퇴직 event 이후 접근 수단 열 가지의 회수 상태 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {ITEMS.map((item) => {
                const status = statusOf(item, scene.mode);
                return (
                  <div key={item} className={`min-w-0 rounded-md border px-2 py-2 text-xs leading-5 ${STATUS_CLASS[status]}`}>
                    <span className={`block truncate font-semibold ${status === "revoked" ? "line-through" : ""}`}>{item}</span>
                    <span className="block">{STATUS_TEXT[status]}</span>
                  </div>
                );
              })}
            </div>
            <p className="rounded-md border border-border/70 px-3 py-2 text-xs leading-5 sm:text-sm">
              <span className="font-semibold">reconciliation queue · </span>
              {scene.queue}
            </p>
          </div>
        );
      }}
    />
  );
}
