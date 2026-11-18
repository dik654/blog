import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 셋째 문단 — 이름에 같은 OFED가 붙어도 만든 곳은 둘이다.
 * 왼쪽 = OpenFabrics Alliance의 OFED, 오른쪽 = NVIDIA의 MLNX_OFED → DOCA-OFED.
 * 날짜는 본문이 인용한 NVIDIA 문서(2026-10-09 확인), 원장 예시는 #source 원장의 2026-09-14 값.
 */
const SCENES = [
  {
    label: "이름은 같고 만든 곳은 둘",
    summary: "OFED 두 갈래",
    note: "두 묶음 모두 RDMA용 커널 드라이버·사용자 라이브러리·도구를 담지만 만든 주체가 다릅니다. 왼쪽은 linux-rdma와 kernel.org 코드에서 가져온 OpenFabrics 배포판, 오른쪽은 NVIDIA가 자사 network adapter에 맞춘 별도 stack입니다.",
  },
  {
    label: "NVIDIA 쪽은 DOCA-OFED로",
    summary: "2024-10 마지막 단독 → 2025-01부터 DOCA-OFED만",
    note: "NVIDIA 문서는 MLNX_OFED가 DOCA-OFED로 옮겨 갔고, 2024년 10월 LTS가 마지막 단독 release이며, 2025년 1월부터 새 기능은 DOCA-OFED에만 들어간다고 적습니다(2026-10-09 확인). 이 전환은 오른쪽 NVIDIA 갈래의 일입니다.",
  },
  {
    label: "원장에는 배포판과 버전까지",
    summary: "‘OFED’ 한 단어로는 행이 닫히지 않음",
    note: "‘OFED’라고만 쓰면 어느 갈래인지 알 수 없습니다. 8절 원장의 2026-09-14 행처럼 ‘DOCA OFED 3.2.3 LTS’로 배포판과 버전을 함께 적어야 다른 노드와 비교할 수 있습니다.",
  },
] as const;

function Step({ text, sub, on, tone }: { text: string; sub?: string; on: boolean; tone: "base" | "accent" | "muted" }) {
  const border = !on ? "border-border/50" : tone === "accent" ? "border-[#2563eb]" : "border-border";
  return (
    <div className={`rounded-lg border bg-background px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${border} ${on ? "opacity-100" : "opacity-40"}`}>
      <p className={`break-words text-sm font-semibold ${tone === "accent" && on ? "text-[#2563eb] dark:text-[#60a5fa]" : "text-foreground"}`}>{text}</p>
      {sub ? <p className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function Arrow({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 12 16" width={12} height={16} className={`mx-auto my-1 ${on ? "opacity-100" : "opacity-30"}`} aria-hidden>
      <path d="M6 1v12M2 9l4 4 4-4" fill="none" stroke="#64748b" strokeWidth={1} />
    </svg>
  );
}

export default function OfedLineageViz() {
  return (
    <SceneShell
      eyebrow="같은 이름, 두 배포판"
      title="‘OFED’는 두 갈래라서 원장에 배포판까지 적습니다"
      description="RDMA는 다른 노드의 메모리로 CPU를 거의 거치지 않고 데이터를 옮기는 방식이고, OFED는 그 드라이버·라이브러리·도구 묶음입니다. 칸 하나가 한 배포판 또는 한 시점입니다."
      ariaLabel="OpenFabrics OFED와 NVIDIA MLNX_OFED에서 DOCA-OFED로 이어지는 두 갈래"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold text-muted-foreground">갈래 1 · OpenFabrics Alliance</p>
              <Step text="OFED" sub="linux-rdma·kernel.org 코드에서 가져온 OpenFabrics 배포판" on={active !== 2} tone="base" />
              <div className="hidden sm:block">
                <Arrow on={false} />
                <Step text="이후 변화는 본문 범위 밖" sub="이 글은 NVIDIA 갈래의 전환만 다룹니다" on={false} tone="muted" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold text-muted-foreground">갈래 2 · NVIDIA</p>
              <Step text="MLNX_OFED" sub="2024년 10월 LTS가 마지막 단독 release" on={active !== 2} tone="base" />
              <Arrow on={active >= 1} />
              <Step text="DOCA-OFED" sub="2025년 1월부터 새 기능은 여기에만" on={active >= 1} tone="accent" />
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className={`rounded-lg border border-dashed px-3 py-2 text-sm transition-opacity duration-300 motion-reduce:transition-none ${active === 2 ? "border-[#dc2626] opacity-100" : "border-border/50 opacity-40"}`}>
              <span className="text-xs font-bold text-[#dc2626] dark:text-[#f87171]">닫히지 않는 행 ✕</span>
              <p className="mt-1 font-mono text-xs">NIC stack = OFED</p>
            </div>
            <div className={`rounded-lg border px-3 py-2 text-sm transition-opacity duration-300 motion-reduce:transition-none ${active === 2 ? "border-[#16a34a] opacity-100" : "border-border/50 opacity-40"}`}>
              <span className="text-xs font-bold text-[#16a34a] dark:text-[#4ade80]">닫힌 행 ✓</span>
              <p className="mt-1 font-mono text-xs">NIC stack = DOCA OFED 3.2.3 LTS</p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
