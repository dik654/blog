import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trust-gate — worker 생성 때 정한 trust_auto_resolve가 화면의 trust 문구를 만난 뒤
 * 자동 해제(→ Spawning)와 수동 resolve_trust 두 갈래로 나뉜다. 마지막 장면은 경로 문자열만 보는
 * matcher가 checkout의 revision·owner 차이를 구분하지 못한다는 한계를 같은 그림에 표시한다.
 */
const SCENES = [
  {
    label: "생성 때 경로 비교",
    summary: "cwd ↔ trusted root",
    note: "Worker를 만들 때 registry는 cwd가 trusted root와 맞는지(정규화된 문자열의 exact·prefix 관계) 확인해 trust_auto_resolve 값을 정합니다. 아직 화면은 보지 않았습니다.",
  },
  {
    label: "화면에서 trust 문구 발견",
    summary: "TrustRequired event",
    note: "이후 terminal 화면에서 workspace trust 문구를 찾으면 TrustRequired event를 남깁니다. 이 순간 task prompt는 보내지 않습니다.",
  },
  {
    label: "갈래 A: allowlist 일치",
    summary: "자동 해제 → Spawning",
    note: "생성 때 allowlist에 맞았던 worker는 gate를 자동으로 풀고 다시 Spawning으로 돌아갑니다. 사람이 승인 화면에 답하지 않아도 이 갈래로 지나갑니다.",
  },
  {
    label: "갈래 B: 수동 승인",
    summary: "resolve_trust(status 검사)",
    note: "자동 해제 대상이 아니면 수동 승인을 기다립니다. resolve_trust도 현재 status를 먼저 검사한 뒤에야 처리합니다.",
  },
  {
    label: "경로가 같아도 대상은 다를 수 있음",
    summary: "같은 문자열 → 같은 판정",
    note: "이 snapshot의 path matching은 정규화된 문자열의 exact·prefix 관계를 중심으로 하며 repository remote·commit·filesystem owner를 묶지 않습니다. 그래서 같은 경로에 revision·owner가 다른 checkout이 놓여도 판정이 같습니다. 둘을 receipt로 묶는 일은 source 밖의 추가 hardening입니다.",
  },
] as const;

function Box({
  on,
  tone,
  title,
  body,
}: {
  on: boolean;
  tone: "blue" | "amber" | "emerald" | "violet" | "rose";
  title: string;
  body: string;
}) {
  const border: Record<typeof tone, string> = {
    blue: "border-blue-600",
    amber: "border-amber-600",
    emerald: "border-emerald-600",
    violet: "border-violet-600",
    rose: "border-rose-600",
  };
  return (
    <div
      className={`min-w-0 rounded-lg border bg-background px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${
        on ? `${border[tone]} opacity-100` : "border-border opacity-40"
      }`}
    >
      <p className="text-sm font-bold leading-6">{title}</p>
      <p className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}

function Arrow({ on, label }: { on: boolean; label?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-1 text-xs ${on ? "text-foreground" : "text-muted-foreground/50"}`} aria-hidden>
      <span>↓</span>
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export default function TrustGateBranchViz() {
  return (
    <SceneShell
      eyebrow="Trust gate 갈래"
      title="화면에 trust 질문이 뜬 뒤 w-17이 가는 두 갈래"
      description="TrustRequired는 trust 문구를 발견했다는 기록이고, trust_auto_resolve는 worker 생성 때 cwd가 trusted root(허용 경로 목록, allowlist)와 맞았는지로 정한 값입니다. 두 값이 만나 갈래가 나뉩니다."
      ariaLabel="worker 생성 때 경로 비교, trust 문구 발견, 자동 해제와 수동 승인 두 갈래, 경로 문자열 판정의 한계"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
            <Box on={active === 0} tone="blue" title="생성 시 경로 비교" body="cwd ↔ trusted root → trust_auto_resolve" />
            <Box on={active === 1} tone="amber" title="화면에 trust 문구" body="→ TrustRequired event" />
          </div>
          <Arrow on={active >= 2} label="trust_auto_resolve 값으로 갈림" />
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
            <Box on={active === 2} tone="emerald" title="일치: 자동 해제" body="→ Spawning 복귀" />
            <Box on={active === 3} tone="violet" title="불일치: 수동" body="resolve_trust(status 검사)" />
          </div>
          <div
            className={`mt-3 rounded-lg border border-dashed px-3 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${
              active === 4 ? "border-rose-600 opacity-100" : "border-border opacity-40"
            }`}
          >
            <p className="font-bold">같은 경로 문자열 아래</p>
            <div className="mt-1 grid min-w-0 grid-cols-2 gap-2">
              <p className="min-w-0 rounded-md border border-border bg-background px-2 py-1">checkout X (가정)<br />revision r1 · owner A</p>
              <p className="min-w-0 rounded-md border border-border bg-background px-2 py-1">checkout Y (가정)<br />revision r2 · owner B</p>
            </div>
            <p className="mt-1 text-muted-foreground">→ 둘 다 같은 일치 판정</p>
          </div>
        </div>
      )}
    />
  );
}
