import VizFrame from "@/components/viz/VizFrame";

const loop = [
  ["Discover", "요청·workspace·project 지침", "Host input · model reads"],
  ["Propose", "다음 action과 예상 결과", "Model"],
  ["Authorize", "tool·argument·scope 판정", "Host policy"],
  ["Execute", "허용된 read·write·command", "Host runtime"],
  ["Observe", "stdout·diff·error·effect receipt", "Host → model"],
  ["Verify / finish", "test·완료 조건 또는 다음 loop", "Model + verifier"],
] as const;

export default function AgentLoopViz() {
  return (
    <VizFrame
      eyebrow="Coding-agent loop"
      title="Model이 action을 제안하고 Host가 권한과 실행을 맡은 뒤, 검증 결과가 다음 판단으로 돌아옵니다"
      description="추론과 실제 side effect를 분리하면 실패가 model 판단인지 permission·runtime·test 문제인지 추적할 수 있습니다."
      note="Verify가 완료를 판정하지 못하면 observation을 갱신해 Propose로 돌아갑니다. 반복에는 step·time·cost 상한을 둡니다."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loop.map(([stage, artifact, owner], index) => (
          <li key={stage} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-2 text-sm font-bold">{stage}</h4>
            <p className="mt-3 min-w-0 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {artifact}
            </p>
            <p className="mt-3 min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              Owner · {owner}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
