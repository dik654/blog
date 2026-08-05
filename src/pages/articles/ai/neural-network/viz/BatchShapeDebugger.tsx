import { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import Math from '@/components/ui/math';

const modes = {
  sample: {
    label: '샘플 하나',
    input: 'x\\in\\mathbb{R}^{2}',
    fragile: 'W_{[3\\times2]}x_{[2]}=z_{[3]}',
    safe: 'x_{[2]}W^\\top_{[2\\times3]}=z_{[3]}',
    verdict: '두 식 모두 계산됩니다.',
    explanation: '벡터 하나만 시험하면 저장된 W를 왼쪽에서 곱한 코드가 정상처럼 보입니다. 이 성공만으로 batch 축을 보존한다고 결론 내릴 수 없습니다.',
    fails: false,
  },
  batch: {
    label: 'Batch B개',
    input: 'X\\in\\mathbb{R}^{B\\times2}',
    fragile: 'W_{[3\\times2]}X_{[B\\times2]}\\quad\\text{계산 불가}',
    safe: 'X_{[B\\times2]}W^\\top_{[2\\times3]}=Z_{[B\\times3]}',
    verdict: '취약 코드는 안쪽 차원 B와 2가 맞지 않습니다.',
    explanation: '샘플 축 B는 출력까지 그대로 남아야 합니다. 입력의 마지막 차원 2만 가중치의 in_features 2와 만나고, out_features 3이 새 마지막 차원이 되어야 합니다.',
    fails: true,
  },
} as const;

export default function BatchShapeDebugger() {
  const [mode, setMode] = useState<keyof typeof modes>('sample');
  const active = modes[mode];

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border bg-background" data-batch-shape-debugger data-formula-pair>
      <figcaption className="grid gap-1 border-b border-border px-4 py-3 sm:px-5">
        <span className="text-xs font-bold text-rose-700 dark:text-rose-300">SHAPE DEBUGGER · 저장 방향과 계산 방향</span>
        <span className="text-sm font-semibold">샘플 하나의 성공을 batch-safe 구현으로 착각하지 않는다</span>
      </figcaption>

      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="샘플과 batch 비교">
        {(Object.keys(modes) as Array<keyof typeof modes>).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => setMode(key)}
            className={`min-h-11 border-b-2 px-3 text-sm font-semibold transition-colors ${
              mode === key ? 'border-foreground bg-background text-foreground' : 'border-transparent text-muted-foreground hover:bg-background/70'
            }`}
          >
            {modes[key].label}
          </button>
        ))}
      </div>

      <div className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-semibold text-muted-foreground">현재 입력</p>
        <Math display className="my-2 text-sm sm:text-base">{active.input}</Math>
        <p className="text-sm font-semibold text-foreground">{active.verdict}</p>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2">
        <div className="min-w-0 bg-rose-500/[0.035] p-4 sm:p-5" data-shape-case="fragile">
          <div className="flex items-center gap-2">
            {active.fails ? <X className="h-4 w-4 text-rose-600" aria-hidden /> : <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />}
            <h3 className="text-sm font-bold">샘플 전용으로 굳어진 코드</h3>
          </div>
          <Math display className="my-4 text-sm sm:text-base">{active.fragile}</Math>
          <p className="text-xs leading-relaxed text-muted-foreground">
            저장된 <code className="text-xs">W[out, in]</code>를 입력 왼쪽에 두면 벡터에서는 통과해도 batch의 선두 축을 보존하지 못합니다.
          </p>
        </div>

        <div className="min-w-0 bg-emerald-500/[0.035] p-4 sm:p-5" data-shape-case="safe">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-700" aria-hidden />
            <h3 className="text-sm font-bold">Batch-safe 계산 계약</h3>
          </div>
          <Math display className="my-4 text-sm sm:text-base">{active.safe}</Math>
          <p className="text-xs leading-relaxed text-muted-foreground">
            PyTorch <code className="text-xs">Linear</code>은 이 전치를 내부에서 처리해 <Math>{String.raw`xW^\top+b`}</Math>를 계산합니다.
          </p>
        </div>
      </div>

      <p data-formula-note className="px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5">{active.explanation}</p>
    </figure>
  );
}
