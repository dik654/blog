import VizFrame from "@/components/viz/VizFrame";

const fields = [
  ["Request _meta", "Protocol version · client capability · client info", "매 요청"],
  ["server/discover", "지원 version · capability · serverInfo · cache hint", "선택 조회"],
  ["Explicit handle", "Cursor · job · basket처럼 이어지는 application state", "필요할 때"],
  ["Authorization", "Caller·scope·resource ACL·expiry 재검사", "매 호출"],
] as const;

export default function ArchitectureDetailViz() {
  return (
    <VizFrame
      eyebrow="Stateless core"
      title="숨은 session 대신 해석 정보와 상태 참조를 message에 드러냅니다"
      description="Stateless는 state 금지가 아니라 protocol connection에 묵시적으로 기대지 않는다는 뜻입니다."
    >
      <div className="divide-y divide-border/70">
        {fields.map(([label, body, cadence]) => (
          <section key={label} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr_5rem] sm:items-baseline">
            <h4 className="text-sm font-bold">{label}</h4>
            <p className="text-xs leading-5 text-muted-foreground">{body}</p>
            <p className="text-xs font-semibold text-primary sm:text-right">{cadence}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
