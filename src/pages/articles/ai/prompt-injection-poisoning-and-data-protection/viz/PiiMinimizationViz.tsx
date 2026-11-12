import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pii-detection — 탐지는 놓칠 수 있고, 최소화는 탐지와 무관하게 노출 필드 수를 줄인다.
 * 주문 상태 질문에 전체 레코드 대신 order_id·status 두 필드만 넣는다. 이메일·전화 필드는 앞 문단의 예를 레코드에 넣은 가정.
 */
type Status = "in" | "found" | "miss" | "depends" | "need" | "out";

const FIELDS = [
  { name: "이름", detect: "depends" },
  { name: "이메일", detect: "found" },
  { name: "전화 · “공일공에 일이삼사”", detect: "miss" },
  { name: "주소", detect: "depends" },
  { name: "결제수단", detect: "depends" },
  { name: "order_id", detect: "need" },
  { name: "status", detect: "need" },
] as const satisfies readonly { name: string; detect: Status }[];

const NEEDED = FIELDS.filter((field) => field.detect === "need").length;

const SCENES = [
  { label: "전체 레코드를 넣으면", summary: `context에 ${FIELDS.length}필드`, note: "주문 상태만 묻는 요청인데 고객 레코드 전체를 model context에 넣었습니다. 이름·주소·결제수단까지 모두 들어갑니다." },
  { label: "탐지로 거르면", summary: "찾기 쉬운 값 · 피할 수 있는 값", note: "이메일처럼 형식이 일정한 값은 정규식으로 찾기 쉽지만, 문장으로 풀어 쓴 전화번호는 같은 규칙을 피할 수 있습니다. NER model을 더해도 오탐이 생길 수 있어, 나머지 필드가 걸러질지는 탐지 성능에 달립니다." },
  { label: "애초에 두 필드만 넣으면", summary: `${FIELDS.length}필드 → ${NEEDED}필드`, note: `order_id와 status만 context에 넣으면 나머지 ${FIELDS.length - NEEDED}필드는 들어가지 않습니다. 탐지가 무엇을 놓치든 노출될 필드 수 자체가 줄어듭니다.` },
] as const;

const CHIP: Record<Status, { text: string; color: string; strike?: boolean }> = {
  in: { text: "context에 들어감", color: "#2563eb" },
  found: { text: "정규식으로 찾기 쉬움", color: "#16a34a" },
  miss: { text: "규칙을 피할 수 있음", color: "#dc2626" },
  depends: { text: "탐지 성능에 달림", color: "#d97706" },
  need: { text: "요청에 필요", color: "#2563eb" },
  out: { text: "context에 안 들어감", color: "#64748b", strike: true },
};

function statusOf(detect: Status, active: number): Status {
  if (active === 0) return detect === "need" ? "need" : "in";
  if (active === 1) return detect;
  return detect === "need" ? "need" : "out";
}

export default function PiiMinimizationViz() {
  return (
    <SceneShell
      eyebrow="탐지 vs 최소화"
      title="탐지는 놓칠 수 있지만, 넣지 않은 필드는 노출될 일이 없습니다"
      description="줄 하나가 고객 레코드의 필드 하나입니다. 이름·주소·결제수단·order_id·status는 본문의 예이고, 이메일·전화 필드를 같은 레코드에 넣은 것은 설명용 가정입니다."
      ariaLabel="전체 레코드, PII 탐지, data minimization에서 model context에 들어가는 필드 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{active === 1 ? "PII detection이 검사하는 필드" : "주문 상태 질문 → model context"}</span>
            <span className="font-mono">
              {active === 1 ? "검사 " : ""}{active === 2 ? NEEDED : FIELDS.length} / {FIELDS.length}
            </span>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {FIELDS.map((field) => {
              const status = statusOf(field.detect, active);
              const chip = CHIP[status];
              return (
                <li key={field.name} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 text-xs sm:text-sm">
                  <span className={`min-w-0 break-keep ${chip.strike ? "text-muted-foreground line-through" : "font-medium"}`}>{field.name}</span>
                  <span className="whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold sm:text-xs" style={{ color: chip.color, borderColor: chip.color }}>
                    {chip.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    />
  );
}
