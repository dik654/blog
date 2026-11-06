import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: why-tail 절 — 에이전트 기록과 MLPerf DeepSeek-R1 Server의 입력·출력 모양 비교.
 * 입력 몫 = 입력 ÷ (입력 + 출력): 131/132 = 99.2%, 100/101 = 99.0%, 448/449 = 99.8%, 800/4,680 = 17.1%.
 */
const ROWS = [
  { name: "Codex 공개 기록", ratio: "약 131 대 1", input: 131 / 132 },
  { name: "Manus 공개 기록", ratio: "약 100 대 1", input: 100 / 101 },
  { name: "한 사람의 Claude Code 기록", ratio: "448 대 1", input: 448 / 449 },
  { name: "MLPerf DeepSeek-R1 Server", ratio: "평균 800 대 3,880", input: 800 / 4680 },
] as const;

export default function RequestShapeViz() {
  return (
    <VizFrame
      eyebrow="요청의 모양"
      title="에이전트 요청과 긴 추론 답은 입력과 출력의 몫이 거의 반대입니다"
      description="막대 하나가 입력과 출력 토큰을 합친 전체입니다. MLPerf DeepSeek-R1 Server는 서버 벤치마크로 널리 쓰이는 MLPerf의 긴 추론 답 시나리오입니다. 비율만 같은 길이로 맞춰 그렸으므로 요청의 절대 크기는 비교하지 않습니다."
      note="Claude Code 기록은 문맥 1M 모델을 쓴 한 사용자의 표본이라 일반화할 수 없고, 입력이 압도적이라는 방향만 확인해 줍니다."
    >
      <div className="space-y-4">
        {ROWS.map((row) => (
          <div key={row.name} className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
              <span className="font-semibold">{row.name}</span>
              <span className="font-mono text-muted-foreground">입력 대 출력 {row.ratio}</span>
            </div>
            <div className="mt-1 flex h-5 w-full overflow-hidden rounded-sm border border-border">
              <div style={{ width: `${row.input * 100}%`, backgroundColor: "#94a3b8" }} />
              <div style={{ width: `${(1 - row.input) * 100}%`, backgroundColor: "#2563eb" }} />
            </div>
            <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
              <span>입력 {(row.input * 100).toFixed(1)}%</span>
              <span className="text-primary">출력 {((1 - row.input) * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
