import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — requests와 limits의 조합이 QoS class를 정하는 두 질문.
 * Q1 모든 컨테이너가 cpu·memory 모두 request = limit > 0인가 → Guaranteed
 * Q2 아니면, 어느 컨테이너든 request나 limit이 하나라도 있는가 → Burstable / BestEffort
 * 4절 Pod(requests만)와 8절 Pod B(없음)·C(memory request = limit 4Gi)는 본문 값, 나머지 값은 (가정)입니다.
 */
type Cell = string | null;
interface Container {
  name: string;
  cpu: [Cell, Cell];
  mem: [Cell, Cell];
}
type QosClass = "Guaranteed" | "Burstable" | "BestEffort";

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  containers: readonly Container[];
  q1: boolean;
  q2: boolean | null;
  result: QosClass;
}[] = [
  {
    label: "전부 request = limit",
    summary: "→ Guaranteed",
    note: "8절의 Pod C처럼 memory를 request = limit 4Gi로 두고, cpu도 같은 값으로 둔 경우입니다(cpu 1은 가정). 모든 컨테이너가 cpu와 memory 둘 다 0보다 크게 같은 값을 적었으니 첫 질문에서 바로 Guaranteed입니다.",
    containers: [{ name: "app", cpu: ["1", "1"], mem: ["4Gi", "4Gi"] }],
    q1: true,
    q2: null,
    result: "Guaranteed",
  },
  {
    label: "컨테이너 하나가 빈칸",
    summary: "→ Burstable",
    note: "(가정) 같은 app 옆에 아무것도 적지 않은 컨테이너가 하나 더 있습니다. 조건은 '모든 컨테이너'라서 첫 질문에서 떨어지고, app에 값이 있으니 두 번째 질문에서 Burstable이 됩니다.",
    containers: [
      { name: "app", cpu: ["1", "1"], mem: ["4Gi", "4Gi"] },
      { name: "보조", cpu: [null, null], mem: [null, null] },
    ],
    q1: false,
    q2: true,
    result: "Burstable",
  },
  {
    label: "requests만 적음",
    summary: "→ Burstable",
    note: "4절에서 cpu 1,000m만 요청한 Pod입니다. limit이 없으니 request = limit이 아니고, request가 하나 있으니 Burstable입니다.",
    containers: [{ name: "새 Pod", cpu: ["1000m", null], mem: [null, null] }],
    q1: false,
    q2: true,
    result: "Burstable",
  },
  {
    label: "request ≠ limit",
    summary: "→ Burstable",
    note: "(가정) memory는 같게 두고 cpu만 request 500m · limit 1000m으로 적었습니다. 한 칸이라도 다르면 첫 질문에서 떨어지고 Burstable입니다.",
    containers: [{ name: "app", cpu: ["500m", "1000m"], mem: ["1Gi", "1Gi"] }],
    q1: false,
    q2: true,
    result: "Burstable",
  },
  {
    label: "아무것도 없음",
    summary: "→ BestEffort",
    note: "8절의 Pod B처럼 request도 limit도 없으면 두 질문 모두 '아니오'라 BestEffort입니다. kubelet은 이 컨테이너의 oom_score_adj를 1000으로 둡니다.",
    containers: [{ name: "Pod B", cpu: [null, null], mem: [null, null] }],
    q1: false,
    q2: false,
    result: "BestEffort",
  },
];

const OOM: readonly { cls: QosClass; adj: string }[] = [
  { cls: "Guaranteed", adj: "−997" },
  { cls: "Burstable", adj: "request 비율로 계산" },
  { cls: "BestEffort", adj: "1000" },
];

function Value({ v, highlight }: { v: Cell; highlight: boolean }) {
  return (
    <span className={`rounded px-1.5 py-0.5 text-center font-mono text-xs ${highlight ? "bg-[#fef3c7] font-bold text-[#92400e]" : v === null ? "text-muted-foreground/60" : "font-semibold"}`}>
      {v ?? "—"}
    </span>
  );
}

function Step({ text, state }: { text: string; state: "yes" | "no" | "skip" }) {
  const tone =
    state === "yes"
      ? "border-[#16a34a] text-[#15803d]"
      : state === "no"
        ? "border-[#b91c1c] text-[#b91c1c]"
        : "border-dashed border-border text-muted-foreground/60";
  return (
    <div className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs leading-5 sm:text-sm ${tone}`}>
      <span className="text-foreground">{text}</span>
      <strong className="shrink-0">{state === "yes" ? "예" : state === "no" ? "아니오" : "묻지 않음"}</strong>
    </div>
  );
}

export default function QosClassViz() {
  return (
    <SceneShell
      eyebrow="QoS class 판정"
      title="두 질문에 차례로 답하면 QoS class가 정해집니다"
      description="QoS class는 requests·limits 조합으로 정해지는 Pod의 등급입니다. 왼쪽은 Pod spec의 컨테이너별 값(—은 적지 않음, 노란 칸은 첫 질문을 떨어뜨린 칸), 오른쪽은 판정 순서입니다. 아래 칸은 정해진 class에 따라 kubelet이 매기는 oom_score_adj(커널이 OOM 때 죽일 프로세스를 고르는 점수의 보정값)입니다."
      ariaLabel="컨테이너의 request와 limit 조합에 따른 QoS class 판정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="min-h-[9.5rem] min-w-0 space-y-2">
              {scene.containers.map((c) => {
                const mismatch = (pair: [Cell, Cell]) => pair[0] !== pair[1] || pair[0] === null;
                return (
                  <div key={c.name} className="rounded-lg border border-border p-2">
                    <p className="text-xs font-bold">{c.name}</p>
                    <div className="mt-1 grid grid-cols-[3.5rem_repeat(2,minmax(0,1fr))] items-center gap-1 text-xs">
                      <span />
                      <span className="text-center text-muted-foreground">request</span>
                      <span className="text-center text-muted-foreground">limit</span>
                      <span className="text-muted-foreground">cpu</span>
                      <Value v={c.cpu[0]} highlight={!scene.q1 && mismatch(c.cpu)} />
                      <Value v={c.cpu[1]} highlight={!scene.q1 && mismatch(c.cpu)} />
                      <span className="text-muted-foreground">memory</span>
                      <Value v={c.mem[0]} highlight={!scene.q1 && mismatch(c.mem)} />
                      <Value v={c.mem[1]} highlight={!scene.q1 && mismatch(c.mem)} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="min-w-0 space-y-2">
              <Step text="① 모든 컨테이너가 cpu·memory 둘 다 request = limit > 0인가?" state={scene.q1 ? "yes" : "no"} />
              <Step text="② 어느 컨테이너든 request나 limit이 하나라도 있는가?" state={scene.q2 === null ? "skip" : scene.q2 ? "yes" : "no"} />
              <div className="grid grid-cols-3 gap-2 pt-1">
                {OOM.map((o) => {
                  const on = o.cls === scene.result;
                  return (
                    <div key={o.cls} className={`rounded-lg border px-1.5 py-2 text-center ${on ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border"}`}>
                      <span className={`block text-[11px] font-bold sm:text-xs ${on ? "text-[#1d4ed8] dark:text-[#93c5fd]" : "text-muted-foreground"}`}>{o.cls}</span>
                      <span className="mt-1 block text-[10px] leading-4 text-muted-foreground sm:text-[11px]">oom_score_adj</span>
                      <span className={`block font-mono text-[11px] leading-4 sm:text-xs ${on ? "font-bold text-foreground" : "text-muted-foreground"}`}>{o.adj}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
