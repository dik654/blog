import SceneShell from "./SceneShell";

/**
 * 본문 대응: #routing-policy-taxonomy — 다섯 기준을 겹쳐 쓰는 순서.
 * 후보 4개와 그 값은 TermBreakdown의 예(EU 리전, 128K vs 32K, 1M output token당 10달러 vs 3달러,
 * 대기 2건 vs 15건)를 한 장면에 모은 가정이다.
 * Policy(EU만) → Capability(128K) → Cost(동률) → Load(대기 2건) 순서로 D가 남는다.
 * 대조: Cost만 보면 3달러인 A·B를 고르는데 둘 다 이 요청을 수행할 수 없다.
 */
type Status = "kept" | "out" | "picked" | "cheap";

const CANDIDATES = [
  { id: "A", region: "US", context: "128K", price: 3, queue: "−" },
  { id: "B", region: "EU", context: "32K", price: 3, queue: "−" },
  { id: "C", region: "EU", context: "128K", price: 10, queue: "15건" },
  { id: "D", region: "EU", context: "128K", price: 10, queue: "2건" },
] as const;

const SCENES = [
  { label: "등록된 후보 4개", summary: "요청: EU 고객 · 128K context", focus: "none", status: ["kept", "kept", "kept", "kept"], reason: ["", "", "", ""], note: "같은 model alias 뒤에 endpoint 4개가 등록돼 있습니다. 이번 요청은 EU 고객의 요청이고 128K context가 필요합니다." },
  { label: "Policy: EU 리전만", summary: "4개 → 3개", focus: "region", status: ["out", "kept", "kept", "kept"], reason: ["리전 US", "", "", ""], note: "조직 규칙은 성능·비용과 무관하게 먼저 적용합니다. 가장 싼 축에 드는 A도 리전이 US라 빠집니다." },
  { label: "Capability: 128K 이상", summary: "3개 → 2개", focus: "context", status: ["out", "out", "kept", "kept"], reason: ["리전 US", "32K만 지원", "", ""], note: "필요한 context 길이를 지원하지 못하는 B를 뺍니다. 이 기준은 걸러낼 뿐 남은 C와 D 중 무엇을 고를지는 정하지 않습니다." },
  { label: "Cost로 순위 매기기", summary: "C·D 모두 10달러 → 동률", focus: "price", status: ["out", "out", "kept", "kept"], reason: ["리전 US", "32K만 지원", "", ""], note: "남은 두 후보의 토큰 단가가 같아 비용 기준으로는 순위가 갈리지 않습니다." },
  { label: "Load로 결정", summary: "대기 2건인 D 선택", focus: "queue", status: ["out", "out", "kept", "picked"], reason: ["리전 US", "32K만 지원", "대기 15건", ""], note: "지금 처리 중인 대기열이 짧은 D로 보냅니다. 걸러내는 기준 둘과 순위를 매기는 기준 둘을 겹쳐 하나를 골랐습니다." },
  { label: "대조: Cost만 보는 router", summary: "$3 A·B → 규칙 위반·128K 미지원", focus: "price", status: ["cheap", "cheap", "kept", "kept"], reason: ["리전 규칙 위반", "128K 미지원", "", ""], note: "Policy와 capability로 거르지 않고 비용만 보면 3달러인 A나 B를 고릅니다. A는 조직 규칙을 어기고 B는 이 요청을 수행할 수 없습니다." },
] as const satisfies readonly { label: string; summary: string; focus: string; status: readonly Status[]; reason: readonly string[]; note: string }[];

type Focus = "none" | "region" | "context" | "price" | "queue";

const BOX: Record<Status, string> = {
  kept: "border-border bg-background",
  out: "border-dashed border-border/50 bg-transparent opacity-50",
  picked: "border-primary bg-primary/10",
  cheap: "border-dashed border-red-600 bg-red-500/5",
};

function Row({ label, value, on }: { label: string; value: string; on: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-2 rounded px-1.5 sm:py-0.5 ${on ? "bg-amber-500/15 font-semibold" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export default function RouterFilterViz() {
  return (
    <SceneShell
      eyebrow="걸러내는 기준과 순위 매기는 기준"
      title="Router는 먼저 거르고 남은 후보에 순위를 매깁니다"
      description="후보 하나가 model endpoint 하나입니다. 리전·context·단가·대기 값은 아래 용어 설명의 예를 한 장면에 모은 가정입니다. 단가는 1M output token당 달러입니다."
      note="네 후보와 그 값, 그리고 동률일 때 load로 고르는 순서는 기준을 겹쳐 쓰는 방식을 보이려는 가정이며 특정 서비스의 설정이 아닙니다."
      ariaLabel="네 endpoint 후보가 policy와 capability로 걸러지고 cost와 load로 하나가 선택되는 과정, 그리고 cost만 볼 때의 실패"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focus: Focus = scene.focus;
        return (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CANDIDATES.map((item, index) => {
              const status: Status = scene.status[index];
              const reason: string = scene.reason[index];
              const statusText = status === "picked" ? "선택" : reason || (status === "kept" ? "후보" : "");
              const statusColor = status === "picked" ? "text-primary" : status === "cheap" ? "text-red-700 dark:text-red-400" : "text-muted-foreground";
              return (
                <div key={item.id} className={`rounded-lg border p-2 text-xs leading-4 transition-colors sm:leading-5 ${BOX[status]}`}>
                  {/* 좁은 화면에서는 판정을 머리줄에 올려 결정에 쓰이는 '대기' 줄까지 첫 화면에 들어오게 합니다. */}
                  <div className="mb-0.5 flex items-baseline justify-between gap-1 sm:mb-1">
                    <p className="shrink-0 font-bold">endpoint {item.id}</p>
                    <span className={`min-w-0 truncate text-[11px] font-semibold sm:hidden ${statusColor}`}>{statusText}</span>
                  </div>
                  <Row label="리전" value={item.region} on={focus === "region"} />
                  <Row label="context" value={item.context} on={focus === "context"} />
                  <Row label="단가" value={"$" + item.price} on={focus === "price"} />
                  <Row label="대기" value={item.queue} on={focus === "queue"} />
                  <p className={`mt-1 hidden h-5 truncate text-center font-semibold sm:block ${statusColor}`}>{statusText}</p>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
