import SceneShell from "./SceneShell";

/**
 * 본문 대응: #token-latency-breakdown — 같은 요청을 model 시계와 application 시계가 다르게 잰다.
 * 본문에 구간별 수치가 없으므로 칸 길이는 같게 두고 크기를 뜻하지 않는다고 밝힌다. 칸 순서는 가정.
 * TTFT가 queue·prefill을 포함하고, queue time을 TTFT와 따로 더하면 이중 집계라는 점은 본문.
 */
const SEGMENTS = ["gateway routing", "queue 대기", "prefill 계산", "decode 계산", "network 전송"] as const;

const SCENES = [
  { label: "Model 시계", summary: "GPU forward 계산만", model: true, app: false, ttft: false, queue: false, note: "Model latency breakdown은 GPU forward 계산만 잽니다. prefill은 입력을 처리하는 계산, decode는 이어서 token을 만들어 가는 계산입니다." },
  { label: "Application 시계", summary: "사용자 체감 전체", model: false, app: true, ttft: false, queue: false, note: "Application latency breakdown은 여기에 gateway routing, queue 대기, network 전송까지 더합니다." },
  { label: "두 시계를 나란히", summary: "같은 요청, 다른 숫자", model: true, app: true, ttft: false, queue: false, note: "같은 요청을 재도 두 시계는 다른 숫자를 보여 줍니다. 앞뒤로 튀어나온 칸이 그 차이입니다." },
  { label: "Queue는 TTFT 안에 있습니다", summary: "따로 더하면 이중 집계", model: false, app: true, ttft: true, queue: true, note: "TTFT는 queue와 prefill을 포함해 첫 token까지 걸린 시간입니다. 그래서 queue time을 TTFT에 또 더하면 같은 대기를 두 번 세게 됩니다." },
] as const;

function Row({ label, start, span, on }: { label: string; start: number; span: number; on: boolean }) {
  return (
    <div>
      <p className={`text-xs font-bold ${on ? "text-primary" : "text-muted-foreground/60"}`}>{label}</p>
      <div className="mt-1 grid grid-cols-5 gap-1">
        <div
          style={{ gridColumn: `${start} / span ${span}` }}
          className={`h-3 rounded-sm border ${on ? "border-primary bg-primary/40" : "border-dashed border-border bg-transparent"}`}
        />
      </div>
    </div>
  );
}

export default function TwoClocksViz() {
  return (
    <SceneShell
      eyebrow="누구의 시계로 재는가"
      title="같은 요청을 두 시계가 서로 다른 범위로 잽니다"
      description="칸 하나가 요청이 지나는 구간입니다. 칸 길이는 시간의 크기를 뜻하지 않고, 칸 순서는 설명용(가정)입니다."
      ariaLabel="요청의 다섯 구간 중 model 시계와 application 시계가 재는 범위"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-1">
              {SEGMENTS.map((segment, index) => {
                const inModel = index === 2 || index === 3;
                const lit = (scene.model && inModel) || scene.app || (scene.queue && index === 1);
                const queueHit = scene.queue && index === 1;
                return (
                  <div
                    key={segment}
                    className={`flex min-h-14 min-w-0 items-center justify-center break-keep rounded border px-0.5 text-center text-[11px] leading-4 ${
                      queueHit ? "border-primary bg-primary/15 font-bold text-foreground" : lit ? "border-border bg-background text-foreground" : "border-border/40 text-muted-foreground/50"
                    }`}
                  >
                    {segment}
                  </div>
                );
              })}
            </div>
            <Row label="Model 시계" start={3} span={2} on={scene.model} />
            <Row label="Application 시계" start={1} span={5} on={scene.app} />
            <div>
              <p className={`text-xs font-bold ${scene.ttft ? "text-primary" : "text-muted-foreground/40"}`}>TTFT · 첫 token까지</p>
              <div className="mt-1 grid grid-cols-5 gap-1">
                <div style={{ gridColumn: "1 / span 3" }} className={`h-3 rounded-sm border ${scene.ttft ? "border-primary bg-primary/40" : "border-dashed border-border/50"}`} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
