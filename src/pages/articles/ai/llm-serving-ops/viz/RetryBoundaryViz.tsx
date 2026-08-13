import VizFrame from "@/components/viz/VizFrame";

const states = [
  [
    "실행 전 실패",
    "연결 실패 · 명시적 rate limit",
    "남은 deadline 안에서 retry 가능",
  ],
  [
    "실행 여부 불명",
    "timeout · connection reset",
    "provider 상태와 idempotency 확인",
  ],
  [
    "부분 결과 전달",
    "stream 일부 · tool side effect",
    "같은 요청의 자동 retry 금지",
  ],
] as const;

export default function RetryBoundaryViz() {
  return (
    <VizFrame
      eyebrow="Retry boundary"
      title="재시도 가능 여부는 오류 코드보다 외부 효과가 시작됐는지로 나눕니다"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {states.map(([title, signal, action], index) => (
          <div key={title} className="min-w-0 border-l border-border/80 pl-4">
            <p className="font-mono text-xs text-primary">STATE {index + 1}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {signal}
            </p>
            <p className="mt-3 text-xs font-semibold leading-5 text-foreground">
              {action}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
