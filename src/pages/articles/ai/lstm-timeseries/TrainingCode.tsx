const steps = [
  {
    index: '01',
    title: 'Data contract',
    code: 'X [B,T,F] → y [B,H,target]',
    description: 'Origin 이전 입력만 window에 넣고, target은 origin 뒤 H step으로 고정한다.',
  },
  {
    index: '02',
    title: 'State ownership',
    code: 'independent: zeros() | stream: carry.detach()',
    description: '독립 window는 sample마다 reset한다. 같은 entity의 연속 chunk에서만 state 값을 이어 받고 graph를 detach하며 entity·episode 경계에서 reset한다.',
  },
  {
    index: '03',
    title: 'Recurrent encoder',
    code: 'out, (hT, cT) = lstm(X)',
    description: 'PyTorch batch_first 설정, feature availability와 hidden·cell shape를 명시한다. 마지막 valid timestep을 쓰며 padding tail을 final state로 오해하지 않는다.',
  },
  {
    index: '04',
    title: 'Forecast head',
    code: 'direct [B,H] | recursive y_hat → next input',
    description: 'Point·quantile과 direct·recursive 출력을 구분한다. Recursive decoder는 train의 정답 입력과 serving의 자기 예측 입력을 별도 rollout으로 평가한다.',
  },
  {
    index: '05',
    title: 'Fold evaluation',
    code: 'fit transform+model(t≤origin) → predict(H)',
    description: 'Scaler·imputer까지 fold train에만 fit한다. Horizon별 recursive error, gradient norm과 baseline 대비 오차를 여러 rolling origin에 기록한다.',
  },
] as const;

export default function TrainingCode() {
  return (
    <div data-lstm-training-flow className="not-prose my-8">
      <h3 className="mb-3 text-sm font-semibold">PyTorch 구현에서 보존할 다섯 계약</h3>
      <div className="divide-y divide-border border-y border-border">
        {steps.map((step) => (
          <article
            key={step.index}
            className="grid min-w-0 gap-2 py-4 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-4"
          >
            <span className="font-mono text-xs font-bold text-muted-foreground">{step.index}</span>
            <div>
              <h4 className="text-sm font-bold">{step.title}</h4>
              <code className="mt-2 block break-words font-mono text-xs text-muted-foreground">{step.code}</code>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
