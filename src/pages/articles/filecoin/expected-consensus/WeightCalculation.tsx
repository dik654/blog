import WeightDetailViz from './viz/WeightDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function WeightCalculation({ onCodeRef }: Props) {
  return (
    <section id="weight" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 가중치 계산</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Filecoin 포크 선택의 핵심 — 가장 무거운 체인이 정규 체인<br />
        가중치 = 부모 w + log₂(P)×2⁸ + WinCount 보너스
      </p>
      <div className="not-prose mb-8">
        <WeightDetailViz onOpenCode={onCodeRef} />
      </div>
    </section>
  );
}
