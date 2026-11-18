import SceneShell from "./SceneShell";

/**
 * 본문 대응: #restart, #failure-boundary — with-head stream은 저장한 ExExHead의 canonicality를 먼저 확인한다.
 * 비canonical이면 WAL inverse, 근거가 없으면 오류(fail-closed). canonical이지만 node head보다 뒤면 backfill하고,
 * 그동안 들어온 live notification은 pending queue에 보관했다가 backfill 뒤 먼저 전달한 다음 regular stream으로 돌아간다.
 * ①② 두 개의 live notification은 설명용 개수다.
 */
const SCENES = [
  {
    label: "head 확인",
    summary: "저장한 head 102가 canonical인가",
    note: "B가 head 102를 저장한 채 재시작하면 ExExNotificationsWithHead가 먼저 그 hash가 현재 canonical chain에 있는지 확인합니다. 102는 새 branch의 공통 조상이므로 이 사례에서는 canonical입니다.",
  },
  {
    label: "비canonical이라면",
    summary: "WAL inverse 먼저 · 근거 없으면 오류",
    note: "저장한 head가 비canonical이었다면 WAL에서 그 block을 포함한 notification을 찾아 뒤집은 notification을 먼저 돌려줍니다. WAL에도 없고 node head보다 앞선 경우도 아니면 현재 canonical로 임의 점프하지 않고 오류를 반환합니다.",
  },
  {
    label: "backfill",
    summary: "103′~105′를 node DB에서 채움",
    note: "B의 head는 canonical이지만 node head 105′보다 뒤이므로 빠진 103′~105′를 node DB에서 backfill합니다. 그동안 live channel을 막아 두지 않고 비우면서, backfill 범위 뒤의 notification과 reorg·revert를 pending queue에 보관합니다.",
  },
  {
    label: "pending 전달",
    summary: "보관한 live notification을 먼저",
    note: "Backfill을 끝내면 pending queue에 모아 둔 notification을 먼저 전달합니다. 그래서 historical catch-up이 끝난 자리와 live 변화가 시작되는 자리 사이의 공백이 줄어듭니다.",
  },
  {
    label: "regular stream",
    summary: "평소 경로로 복귀",
    note: "pending queue가 비면 stream은 regular stream으로 돌아가 이후 notification을 평소처럼 전달합니다.",
  },
] as const;

const ACCENT = "border-[#2563eb] text-[#2563eb] bg-[#2563eb]/10";
const MUTED = "border-border text-muted-foreground opacity-50";
const WARN = "border-[#dc2626] text-[#dc2626] bg-[#dc2626]/10";

function Box({ on, tone = ACCENT, title, body }: { on: boolean; tone?: string; title: string; body: string }) {
  return (
    <div className={`min-w-0 rounded-md border px-2 py-1.5 ${on ? tone : MUTED}`}>
      <strong className="block break-keep text-[11px] leading-4 sm:text-xs">{title}</strong>
      <span className="mt-0.5 block break-keep text-[10px] leading-4 sm:text-[11px]">{body}</span>
    </div>
  );
}

const LANE = ["103′", "104′", "105′", "①", "②", "이후"] as const;

export default function ExExRestartHandoffViz() {
  return (
    <SceneShell
      eyebrow="재시작 handoff"
      title="재시작한 ExEx는 head 확인, backfill, 보관한 live 순서로 따라잡습니다"
      description="Extension B가 head 102를 저장한 채 재시작하는 사례입니다. 위는 분기, 아래는 B가 실제로 받는 순서입니다. backfill은 node DB에 이미 있는 canonical block으로 빠진 구간을 채우는 일입니다."
      note="①② 두 개의 live notification은 설명용 개수입니다(가정)."
      ariaLabel="재시작한 Extension B가 head canonicality를 확인하고 backfill, pending, regular stream으로 넘어가는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const delivered = active === 2 ? 3 : active === 3 ? 5 : active === 4 ? 6 : 0;
        const pending = active === 2 ? ["①", "②"] : [];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="grid min-w-0 gap-2">
                <Box on={active === 0} title="저장한 ExExHead" body="(102, hash 102)" />
                <Box on={active <= 1} title="canonical인가?" body="현재 canonical chain에 그 hash가 있는지" />
              </div>
              <div className="grid min-w-0 gap-2">
                <Box on={active === 1} tone={WARN} title="아니오 → WAL inverse" body="근거가 없으면 오류 (임의 점프 없음)" />
                <Box on={active === 0 || active === 2} title="예 · node head보다 뒤 → backfill" body="B의 경우: 102 canonical, node head 105′" />
              </div>
            </div>

            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-[11px] sm:grid-cols-[6rem_minmax(0,1fr)]">
              <span className="text-muted-foreground">pending queue</span>
              <div className="flex h-8 min-w-0 items-center gap-1 rounded-md border border-dashed border-border px-1.5">
                {pending.length ? (
                  pending.map((item) => (
                    <span key={item} className="rounded border border-[#d97706] bg-[#d97706]/15 px-1.5 font-mono font-bold text-[#b45309]">{item}</span>
                  ))
                ) : (
                  <span className="text-muted-foreground">{active === 3 || active === 4 ? "비움" : "—"}</span>
                )}
                {active === 2 ? <span className="ml-1 truncate text-muted-foreground">live 보관</span> : null}
              </div>

              <span className="text-muted-foreground">B가 받는 순서</span>
              <div className="grid min-w-0 grid-cols-6 gap-1">
                {LANE.map((item, index) => {
                  const done = index < delivered;
                  const isLive = index === 3 || index === 4;
                  const tone = !done ? "border-dashed border-border text-muted-foreground/60" : isLive ? "border-[#d97706] bg-[#d97706]/15 text-[#b45309]" : index === 5 ? "border-[#16a34a] bg-[#16a34a]/10 text-[#15803d]" : "border-[#2563eb] bg-[#2563eb]/10 text-[#2563eb]";
                  return (
                    <span key={item} className={`truncate rounded border px-0.5 py-1.5 text-center font-mono text-[10px] font-bold sm:text-[11px] ${tone}`}>
                      {item}
                    </span>
                  );
                })}
              </div>
              <span />
              <div className="grid min-w-0 grid-cols-6 gap-1 text-center text-[9px] leading-3 text-muted-foreground sm:text-[10px]">
                <span className="col-span-3">backfill</span>
                <span className="col-span-2">pending</span>
                <span>regular</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
