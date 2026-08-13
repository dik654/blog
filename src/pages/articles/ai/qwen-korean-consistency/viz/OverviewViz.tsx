import VizFrame from "@/components/viz/VizFrame";

const leakageTypes = [
  ["문자 leakage", "한국어 문장 안에 원치 않는 CJK 문자가 섞임", "문자 위치·token 후보를 기록"],
  ["Segment switch", "구·문장·문단 단위로 출력 언어가 전환됨", "전환 전후 context를 함께 보존"],
  ["Reasoning switch", "노출된 reasoning 구간의 언어가 목표와 달라짐", "답변과 reasoning을 분리 측정"],
  ["정상 예외", "인용·고유명사·코드·원문 표기는 유지해야 함", "오류율에서 빼되 별도 label로 남김"],
] as const;

export default function OverviewViz() {
  return (
    <VizFrame
      eyebrow="Leakage diagnosis"
      title="원치 않는 문자를 발견하면 문자 leakage, segment switch, reasoning switch와 정상 예외를 먼저 구분합니다"
      description="같은 CJK 문자라도 발생 단위와 문맥이 다르면 원인과 개입 지점이 달라집니다. 표면 문자열 하나로 모두 같은 오류라고 세지 않습니다."
      note="분류 결과에는 prompt·model·sampling·출력 구간·문자 offset을 함께 저장합니다. 이 evidence가 있어야 prompt, runtime, weight, post-training 개입을 같은 사례로 비교할 수 있습니다."
    >
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {leakageTypes.map(([type, observation, receipt], index) => (
          <section key={type} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex min-w-0 items-baseline justify-between gap-4">
              <h4 className="min-w-0 text-sm font-bold [overflow-wrap:anywhere]">{type}</h4>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-3 min-w-0 text-xs leading-5 text-foreground [overflow-wrap:anywhere]">
              {observation}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              Evidence · {receipt}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
