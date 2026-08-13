import VizFrame from "@/components/viz/VizFrame";

const cases = [
  ["Unauthorized", "Token audience·scope·resource ACL", "Effect 없음 + audit"],
  ["Invalid request", "JSON-RPC·header·schema", "Protocol error"],
  ["Domain failure", "업무 규칙·외부 API", "complete + isError"],
  ["Response lost", "Operation id·effect receipt", "중복 없이 기존 결과"],
  ["Legacy peer", "Revision·capability matrix", "격리된 fallback 또는 거부"],
] as const;

export default function ImplementationDetailViz() {
  return (
    <VizFrame
      eyebrow="Acceptance matrix"
      title="Happy path가 아니라 실패 뒤 남는 상태로 production readiness를 판단합니다"
      description="검사 항목마다 입력 신호, 차단 위치와 외부 effect가 남았는지를 함께 기록합니다."
      note="Tool이 한 번 호출됐다는 log보다 operation id와 effect receipt가 retry·incident 분석에 더 중요합니다."
    >
      <div className="divide-y divide-border/70">
        {cases.map(([failure, check, expected]) => (
          <section key={failure} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[8rem_1fr_1fr] sm:items-baseline">
            <h4 className="text-sm font-bold">{failure}</h4>
            <p className="text-xs leading-5 text-muted-foreground">{check}</p>
            <p className="text-xs font-semibold leading-5 text-primary">{expected}</p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
