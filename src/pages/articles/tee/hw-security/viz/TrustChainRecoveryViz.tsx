import HwSceneShell from "./HwSceneShell";

/**
 * 본문 대응: #roots-resilience — RoT(Boot ROM 또는 CPU의 hardware-backed key)가 다음 firmware를
 * 검증하고, firmware가 다음 단계를 검증하거나 측정한다. 서명 확인 성공은 runtime 정상을 보장하지
 * 않으므로 변경 탐지와 복구 경로가 함께 필요하다. 부팅 뒤 변경은 경계를 보이려는 가정 사건이다.
 */
const SCENES = [
  {
    label: "작고 고정된 시작점",
    summary: "Root of Trust",
    note: "Root of Trust(RoT)는 모든 software를 믿는다는 뜻이 아니라, 첫 검증이나 첫 측정을 수행하는 최소 시작점입니다. 여기서는 Boot ROM이나 CPU의 hardware-backed key입니다.",
  },
  {
    label: "RoT가 firmware를 검증",
    summary: "RoT → firmware",
    note: "RoT가 다음 firmware를 검증합니다. 신뢰는 검증을 통과한 다음 단계로만 넘어갑니다.",
  },
  {
    label: "Firmware가 다음 단계를 검증·측정",
    summary: "firmware → 다음 단계",
    note: "검증을 통과한 firmware가 다시 다음 단계를 검증하거나 측정합니다. 여기까지가 boot 시점에 일어나는 확인입니다.",
  },
  {
    label: "부팅 뒤 runtime의 변경 (가정)",
    summary: "서명 통과 ≠ 계속 정상",
    note: "서명 확인에 성공했어도 runtime이 계속 정상이라는 보장은 없습니다. Boot 시점에 남은 통과 표시는 이 변경을 알려 주지 않습니다.",
  },
  {
    label: "탐지한 뒤 정상 상태로 복구",
    summary: "Detect → Recover",
    note: "Boot measurement·runtime health·failed validation을 관측해 변경을 탐지하고, 독립 recovery image와 실패 receipt로 정상 상태를 되찾습니다. Firmware 보호만으로는 이 경로가 생기지 않습니다.",
  },
] as const;

const NODES = [
  { title: "Root of Trust", sub: "Boot ROM · HW key", pass: "" },
  { title: "Firmware", sub: "RoT가 검증", pass: "✓ 검증 통과" },
  { title: "다음 단계", sub: "firmware가 검증·측정", pass: "✓ 검증 또는 측정" },
] as const;

function Arrow({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 10" width={16} height={10} aria-hidden className="mt-7 shrink-0">
      <line x1={0} x2={11} y1={5} y2={5} stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={1.25} />
      <path d="M 16 5 l -6 -4 v 8 z" fill={on ? "#2563eb" : "#cbd5e1"} />
    </svg>
  );
}

export default function TrustChainRecoveryViz() {
  return (
    <HwSceneShell
      eyebrow="신뢰의 시작점과 복구"
      title="Boot 때 통과한 검증은 runtime을 지켜 주지 않습니다"
      description="위 줄은 boot 시점에 신뢰가 한 단계씩 이어지는 순서, 아래 줄은 그 뒤 runtime에서 필요한 탐지와 복구입니다. ‘다음 단계’는 특정 component가 아니라 일반화한 자리입니다."
      note="부팅 뒤 변경은 경계를 보이려는 가정 사건입니다."
      ariaLabel="Root of Trust에서 firmware와 다음 단계로 이어지는 검증, 그리고 runtime 변경의 탐지와 복구"
      scenes={SCENES}
      render={(active) => {
        const changed = active === 3;
        const recovered = active === 4;
        return (
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-muted-foreground">boot 시점</p>
            <div className="mt-2 flex min-w-0 items-start gap-1 sm:gap-2">
              {NODES.map((node, index) => {
                const on = active >= index;
                const current = active === index;
                const broken = index === 2 && changed;
                const border = broken
                  ? "border-red-600"
                  : current
                    ? "border-blue-600"
                    : on
                      ? "border-border"
                      : "border-dashed border-border/60";
                return (
                  <div key={node.title} className="flex min-w-0 flex-1 items-start gap-1 sm:gap-2">
                    {index > 0 && <Arrow on={on} />}
                    <div className="min-w-0 flex-1">
                      <div className={`rounded-lg border px-1 py-2 text-center sm:px-2 ${border} ${on ? "bg-background" : "bg-muted/20"}`}>
                        <strong className={`block break-keep text-[11px] leading-5 sm:text-sm ${on ? "text-foreground" : "text-muted-foreground/60"}`}>{node.title}</strong>
                        <span className={`mt-0.5 block break-keep text-[10px] leading-4 sm:text-[11px] ${on ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{node.sub}</span>
                      </div>
                      <p className="mt-1 h-8 break-keep text-center sm:h-5 text-[10px] font-semibold leading-4 text-green-700 dark:text-green-400 sm:text-[11px]">
                        {index > 0 && on ? node.pass : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-1 border-t border-border pt-2 text-[11px] font-bold text-muted-foreground">runtime (부팅 뒤)</p>
            <div className="mt-2 flex h-24 min-w-0 items-stretch gap-2 sm:h-16">
              {recovered ? (
                <>
                  <div className="min-w-0 flex-1 rounded-lg border border-blue-600 px-2 py-2 text-center">
                    <strong className="block text-xs text-blue-700 dark:text-blue-400 sm:text-sm">Detect</strong>
                    <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">boot measurement · runtime health · failed validation 관측</span>
                  </div>
                  <Arrow on />
                  <div className="min-w-0 flex-1 rounded-lg border border-green-600 px-2 py-2 text-center">
                    <strong className="block text-xs text-green-700 dark:text-green-400 sm:text-sm">Recover</strong>
                    <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">독립 recovery image와 실패 receipt로 정상 상태를 되찾음</span>
                  </div>
                </>
              ) : changed ? (
                <>
                  <div className="min-w-0 flex-[2]" />
                  <div className="min-w-0 flex-1 rounded-lg border border-dashed border-red-600 px-2 py-2 text-center">
                    <strong className="block break-keep text-xs text-red-700 dark:text-red-400 sm:text-sm">변경 발생 (가정)</strong>
                    <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground sm:text-[11px]">위의 ✓ 표시는 그대로 남음</span>
                  </div>
                </>
              ) : (
                <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/60 text-[11px] text-muted-foreground/70">아직 runtime 사건 없음</p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
