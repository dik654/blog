import SceneShell from "./SceneShell";

/**
 * 본문 대응: 9절(#kubernetes). 초안 YAML과 멀티노드 명령, Kueue·GPU Operator·Network Operator 문단.
 * 장면 1: LWS size 1 = 노드 하나 = 복제본 하나. 장면 2: size 2, 리더·워커(--headless), TP8 × PP2, 실행기 mp.
 * 장면 3: 카드는 DRA, NIC는 device plugin으로 따로 받아 같은 NUMA를 맞춰 줄 장치가 없다(본문의 추론).
 * 버전은 본문 그대로이며, 이 구성은 어느 클러스터에도 적용하지 않은 초안이다.
 */
const SCENES = [
  {
    label: "노드 하나 = 복제본 하나",
    summary: "LWS size 1 · TP8",
    note: "요청 분배기가 복제본 앞에 서고, 복제본 하나(LWS 그룹 size 1)가 노드 한 대의 카드 여덟 장을 통째로 잡습니다. 노드 2는 다른 복제본 몫입니다.",
  },
  {
    label: "두 노드에 층을 나눌 때",
    summary: "LWS size 2 · TP8 × PP2",
    note: "size 2에서는 리더와 워커가 같은 vllm serve 명령을 쓰고 워커만 --headless를 붙입니다(v0.32.0은 이때 실행기를 mp로 정하고 Ray를 거부). 쿠버네티스 1.34에서는 LWS 자체의 gang 기능을 못 써 두 Pod를 Kueue Workload 하나로 승인받습니다.",
  },
  {
    label: "카드와 NIC는 따로 받습니다",
    summary: "DRA ≠ device plugin",
    note: "카드는 GPU Operator가 DRA로, NIC는 Network Operator의 RDMA shared device plugin이 따로 줍니다. 둘을 같은 NUMA에 맞춰 줄 장치가 없다는 것은 본문의 추론이라 수락 단계에서 확인합니다.",
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#b45309";

function Box({ title, lines, tone = "base", dim = false }: { title: string; lines: readonly string[]; tone?: "base" | "blue" | "amber"; dim?: boolean }) {
  const border = dim ? "#cbd5e1" : tone === "blue" ? BLUE : tone === "amber" ? AMBER : "#64748b";
  return (
    <div
      className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${dim ? "border-dashed text-muted-foreground/60" : ""}`}
      style={{ borderColor: border }}
    >
      <p className="break-keep font-bold" style={dim ? undefined : { color: tone === "base" ? undefined : border }}>{title}</p>
      {lines.map((line) => (
        <p key={line} className={`break-words ${dim ? "" : "text-muted-foreground"}`}>{line}</p>
      ))}
    </div>
  );
}

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-muted-foreground">
      <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden>
        <path d="M5 0 V12 M1 8 L5 12 L9 8" fill="none" stroke="#64748b" strokeWidth={1} />
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
}

export default function KubePlacementViz() {
  return (
    <SceneShell
      eyebrow="쿠버네티스 배치"
      title="복제본 하나가 노드 하나를 통째로 잡고, 카드와 NIC는 다른 길로 들어옵니다"
      description="LWS(LeaderWorkerSet)는 리더 Pod와 워커 Pod를 한 그룹으로 실행하는 객체이고, Kueue는 그 그룹을 승인·배치하는 큐입니다. DRA는 쿠버네티스가 장치를 요청서(ResourceClaim)로 나눠 주는 방식, device plugin은 노드의 장치를 개수 자원으로 알리는 방식입니다."
      note="9절의 초안을 그린 것이며 어느 클러스터에도 적용하지 않았습니다. 같은 NUMA를 맞춰 줄 장치가 없다는 판단은 본문의 추론입니다."
      ariaLabel="쿠버네티스에서 LWS 그룹, Kueue 승인, 카드와 NIC 할당 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className="text-center text-xs font-semibold" style={{ color: BLUE }}>요청 분배기(llm-d EPP) → 복제본</p>
          <Arrow />
          {active === 1 ? (
            <div className="rounded-lg border border-dashed px-2 pb-2 pt-1" style={{ borderColor: "#64748b" }}>
              <p className="pb-1 text-[11px] font-semibold text-muted-foreground">Kueue: LWS 그룹(size 2) 전체 = Workload 하나로 승인</p>
              <div className="grid grid-cols-2 gap-2">
                <Box title="노드 1 · 리더" lines={["TP8 · 층 일부", "카드 8장"]} />
                <Box title="노드 2 · 워커" lines={["--headless", "나머지 층 · 카드 8장"]} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-lg border border-dashed px-2 pb-2 pt-1" style={{ borderColor: "#64748b" }}>
                <p className="pb-1 text-[11px] font-semibold text-muted-foreground">Kueue: LWS 그룹(size 1) = Workload 하나</p>
                <Box title="노드 1" lines={["TP8 · DCP8", "카드 8장 통째로"]} tone={active === 2 ? "amber" : "base"} />
              </div>
              <div className="flex min-w-0 flex-col justify-end">
                <Box title="노드 2" lines={["이 그룹 밖", "(다른 복제본)"]} dim />
              </div>
            </div>
          )}
          <Arrow label={active === 2 ? "노드 1의 Pod가 장치를 두 경로로 받음" : undefined} />
          <div className="grid grid-cols-2 gap-2">
            <Box title="카드 8장" lines={["GPU Operator · DRA"]} tone="blue" dim={active !== 2} />
            <Box title="NIC" lines={["Network Operator · device plugin"]} tone="blue" dim={active !== 2} />
          </div>
          <p
            className={`mt-2 rounded-lg border px-2 py-1 text-xs leading-5 ${active === 2 ? "font-semibold" : "border-dashed text-muted-foreground/60"}`}
            style={{ borderColor: active === 2 ? AMBER : "#cbd5e1", color: active === 2 ? AMBER : undefined }}
          >
            두 경로를 같은 NUMA(같은 소켓 쪽)에 맞춰 줄 장치 없음 (추론)
          </p>
        </div>
      )}
    />
  );
}
