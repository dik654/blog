export default function TrainingCode() {
  return (
    <div className="not-prose mt-6">
      <h4 className="text-sm font-semibold text-foreground mb-2">PyTorch LSTM 시계열 예측 구현 흐름</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
        {[
          {
            step: '1. 모델 정의',
            code: 'nn.LSTM(input, hidden, n_layers)',
            desc: 'input_dim=1(단변량), hidden=64, 2층 LSTM + Dropout 0.2. 마지막 시점의 hidden state를 FC 레이어로 예측값 출력',
            color: 'text-sky-500',
          },
          {
            step: '2. 순전파',
            code: 'out[:, -1] → fc → pred',
            desc: 'LSTM이 시퀀스 전체를 처리한 뒤, 마지막 시점(-1)의 hidden state만 사용하여 다음 값 예측',
            color: 'text-emerald-500',
          },
          {
            step: '3. 학습 루프',
            code: 'MSELoss + Adam + clip_grad',
            desc: 'MSE 손실 + Adam 옵티마이저(lr=1e-3). clip_grad_norm_(1.0)으로 기울기 폭발 방지 — LSTM 학습의 필수 기법',
            color: 'text-amber-500',
          },
        ].map((p) => (
          <div key={p.step} className="rounded-lg border border-border bg-card px-3 py-2">
            <span className={`font-bold text-xs ${p.color}`}>{p.step}</span>
            <div className="font-mono text-[11px] text-muted-foreground/70 mt-1">{p.code}</div>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
