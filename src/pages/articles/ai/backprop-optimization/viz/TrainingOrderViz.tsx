import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — dropout, backward, clipping, optimizer의 개입 순서와 .grad 누적.
 * −4/3은 입력 2·둘째 선택지 칸의 gradient이고, 이번 사례에는 dropout과 clipping이 없다.
 * 누적 장면은 step 없이 같은 자료로 새 forward와 backward를 한 번 더 한 가정이다: −4/3 + (−4/3) = −8/3.
 */
const STAGES = ["forward", "backward", "clipping", "optimizer.step()"];

const STATES = [
  { stage: 0, grad: "비어 있음 (가정)", param: "그대로" },
  { stage: 1, grad: "−4/3", param: "그대로" },
  { stage: 2, grad: "규칙대로 조절될 수 있음", param: "그대로" },
  { stage: 3, grad: "그대로 있음", param: "새 값으로 바뀜" },
  { stage: 1, grad: "−4/3 + (−4/3) = −8/3", param: "그대로" },
];

const SCENES = [
  { label: "forward · dropout 자리", summary: "dropout을 쓰면 값과 기록이 바뀌는 곳", note: "계산에 dropout을 사용한다면 여기서 값을 지우는 경로와 그 기록이 바뀝니다. 이번 사례에는 dropout이 없습니다." },
  { label: "backward", summary: ".grad에 쌓임", note: "loss.backward()는 gradient를 .grad에 누적합니다. 가중치는 아직 그대로입니다. 이번 사례의 한 칸을 보면 −4/3입니다." },
  { label: "clipping 자리", summary: "gradient만 조절", note: "gradient clipping은 backward가 만든 gradient를 optimizer에 넘기기 전에 크기 등을 조절합니다. 얼마나 줄지는 규칙에 따르므로 숫자를 적지 않았습니다." },
  { label: "optimizer.step()", summary: "여기서 parameter가 바뀜", note: "실제 parameter를 바꾸는 곳입니다. AdamW라면 gradient와 별도 상태, 별도의 감쇠 규칙으로 갱신합니다. 이동 크기는 이 글에서 정하지 않습니다." },
  { label: "비우지 않고 또 backward", summary: ".grad −8/3 (가정)", note: "(가정) step 없이 같은 자료로 forward부터 새로 해 backward를 다시 부르면 이전 값 위에 더해져 −8/3이 됩니다. 의도한 자료 누적이 아니라면 이전 gradient를 비워야 합니다." },
];

export default function TrainingOrderViz() {
  return (
    <SceneShell
      eyebrow="개입 순서"
      title="gradient를 계산하는 곳과 parameter가 바뀌는 곳은 다릅니다"
      description="번호가 한 번의 학습 단계 순서이고 칠한 칸이 지금 일어나는 동작입니다. 아래 두 줄은 입력 2·둘째 선택지 칸 하나의 .grad와 가중치입니다."
      ariaLabel="forward, backward, clipping, optimizer step의 순서와 grad, parameter 상태"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STAGES.map((stage, index) => (
                <li key={stage} className={`min-w-0 whitespace-nowrap rounded-md border px-1 py-2.5 text-center font-mono text-[11px] sm:text-xs ${index === state.stage ? "font-bold" : "text-muted-foreground"}`} style={{ borderColor: index === state.stage ? "#dc2626" : "#94a3b8", backgroundColor: index === state.stage ? "#dc262618" : "transparent" }}>
                  <span className="block text-[11px] text-muted-foreground">{index + 1}</span>
                  {stage}
                </li>
              ))}
            </ol>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-border/60 pb-1.5">
                <dt className="text-muted-foreground">.grad</dt>
                <dd className="font-mono font-bold">{state.grad}</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-border/60 pb-1.5">
                <dt className="text-muted-foreground">가중치</dt>
                <dd className="font-mono font-bold">{state.param}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
