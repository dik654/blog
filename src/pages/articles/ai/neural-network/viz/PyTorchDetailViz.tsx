import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'PyTorch 활성화 함수 사용 예', body: 'Module 형태: nn.ReLU(), nn.Sigmoid(), nn.Tanh(), nn.GELU(), nn.SiLU()\n함수 형태: F.relu(x), F.sigmoid(x), F.gelu(x)\n\nTypical 3-layer MLP:\nclass MLP(nn.Module):\n  fc1 = nn.Linear(784, 256)\n  fc2 = nn.Linear(256, 128)\n  fc3 = nn.Linear(128, 10)\n\n  forward(x):\n    x = F.relu(fc1(x))  # hidden activation\n    x = F.relu(fc2(x))  # hidden activation\n    x = fc3(x)          # output: raw logits\n    return x             # softmax는 loss function이 적용\n\nCustom activation (Swish): return x * torch.sigmoid(x)\nSiLU = Swish(β=1)로 PyTorch 기본 내장' },
];
const visuals = [
  { title: 'PyTorch 활성화 함수', color: '#10b981', rows: [
    { label: 'nn.ReLU()', value: 'max(0, x) — 가장 기본' },
    { label: 'nn.GELU()', value: 'Transformer 표준 (GPT, BERT)' },
    { label: 'nn.SiLU()', value: 'Swish(β=1) — smooth ReLU' },
    { label: 'Hidden', value: 'F.relu(fc(x)) — 비선형 추가' },
    { label: 'Output', value: 'raw logits — softmax는 loss에서' },
  ]},
];
export default function PyTorchDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
