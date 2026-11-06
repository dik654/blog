import SceneShell from "./SceneShell";

/**
 * 본문 대응: #monitoring-layers — production 우산 아래 네 층. p95 latency 증가라는 같은 증상을
 * system 층과 input 층이 서로 다른 신호로 확인하고, output 신호는 drift 판정으로 넘어간다.
 * 수치는 본문에 없으므로 그리지 않는다.
 */
const LAYERS = [
  { key: "model", name: "Model", signal: "output의 품질·분포" },
  { key: "system", name: "System", signal: "GPU utilization · queue depth" },
  { key: "input", name: "Input", signal: "prompt 길이 분포" },
  { key: "output", name: "Output", signal: "completion 길이·형식·거부율" },
] as const;

const SCENES = [
  { label: "우산 층에는 증상만 보입니다", summary: "p95 latency 증가", lit: "", note: "이 층만 보면 latency 증가가 GPU 부족 때문인지 prompt가 길어진 탓인지 구분하지 못합니다." },
  { label: "System 층에서 확인합니다", summary: "GPU utilization · queue depth", lit: "system", note: "System monitoring은 infra 쪽 신호인 GPU utilization(연산 중인 시간 비율)과 queue depth(대기 요청 수)를 봅니다." },
  { label: "Input 층에서 확인합니다", summary: "prompt 길이 분포", lit: "input", note: "Input monitoring은 prompt 길이 분포가 길어졌는지를 봅니다. 둘 다 같은 증상을 만들 수 있지만 고치는 방법은 다릅니다." },
  { label: "Output 신호는 drift 판정으로 갑니다", summary: "모델이 그대로여도 답이 달라짐", lit: "output", note: "Completion 분포가 바뀌면 모델 자체는 그대로여도 사용자가 받는 답이 달라집니다. 이 신호는 다음 절 drift 판정의 입력이 됩니다." },
] as const;

export default function MonitoringLayersViz() {
  return (
    <SceneShell
      eyebrow="같은 증상, 다른 층"
      title="p95 latency가 늘었을 때 어느 층을 열어 보느냐가 달라집니다"
      description="p95 latency는 요청을 빠른 순으로 세웠을 때 95% 지점의 지연입니다. 진한 칸이 지금 확인하는 층입니다."
      ariaLabel="production monitoring 아래 model, system, input, output 층 중 p95 latency 증상을 확인하는 층"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className={`rounded-lg border p-3 ${scene.lit === "" ? "border-primary" : "border-border"}`}>
            <p className="text-xs font-bold">Production monitoring</p>
            <p className="mt-1 text-xs text-muted-foreground">요청 성공률 · p50/p95 latency · 초당 요청 수</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LAYERS.map((layer) => {
                const lit = scene.lit === layer.key;
                return (
                  <div key={layer.key} className={`min-w-0 rounded-lg border bg-background p-2 ${lit ? "border-primary" : "border-border/60"}`}>
                    <p className={`text-xs font-bold ${lit ? "text-primary" : "text-muted-foreground"}`}>
                      {layer.name}
                      {lit ? " · 확인 중" : ""}
                    </p>
                    <p className={`mt-1 break-keep text-xs leading-5 ${lit ? "text-foreground" : "text-muted-foreground/70"}`}>{layer.signal}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
