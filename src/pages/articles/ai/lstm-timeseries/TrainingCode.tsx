import CodePanel from '@/components/ui/code-panel';

const CODE = `import torch
import torch.nn as nn

class LSTMForecaster(nn.Module):
    def __init__(self, input_dim=1, hidden=64, n_layers=2, dropout=0.2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_dim, hidden, n_layers,
            batch_first=True, dropout=dropout
        )
        self.fc = nn.Linear(hidden, 1)

    def forward(self, x):          # x: (batch, seq_len, features)
        out, (h_n, c_n) = self.lstm(x)
        return self.fc(out[:, -1])  # 마지막 시점의 hidden state

# 학습 루프
model = LSTMForecaster()
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for epoch in range(100):
    pred = model(X_train)          # (batch, 1)
    loss = criterion(pred, y_train)
    optimizer.zero_grad()
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()`;

const ANNOTATIONS = [
  { lines: [8, 12] as [number, number], color: 'sky' as const, note: 'LSTM 레이어 정의' },
  { lines: [15, 16] as [number, number], color: 'emerald' as const, note: '마지막 hidden → 예측' },
  { lines: [25, 26] as [number, number], color: 'amber' as const, note: 'Gradient Clipping' },
];

export default function TrainingCode() {
  return (
    <div className="not-prose mt-6">
      <CodePanel title="PyTorch LSTM 시계열 예측 구현" code={CODE} annotations={ANNOTATIONS} />
    </div>
  );
}
