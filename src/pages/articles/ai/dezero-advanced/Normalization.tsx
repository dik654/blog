import NormViz from './viz/NormViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Normalization({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="normalization" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">LayerNorm 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          LayerNorm: 마지막 축(feature)에서 mean, var 계산 → 정규화
          <br />
          <code>y = gamma * (x - mean) / sqrt(var + eps) + beta</code>
          <br />
          각 샘플 내에서 독립 정규화 — 배치 크기에 의존하지 않아 Transformer 표준
        </p>
        <p className="leading-7">
          gamma(스케일)=1, beta(시프트)=0으로 초기화 — 처음에는 항등 변환
          <br />
          학습이 진행되면 레이어가 필요한 스케일/시프트를 자동 습득
          <br />
          역전파: <code>gx</code>, <code>ggamma</code>, <code>gbeta</code> 세 기울기를 동시 계산
        </p>
      </div>
      <div className="not-prose mb-8">
        <NormViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          <code>x_hat</code>과 <code>std_inv</code>를 <code>RefCell</code>에 캐시하는 이유
          <br />
          backward에서 이 값들이 필요하지만 forward 시점에만 계산 가능
          <br />
          PyTorch는 ctx.save_for_backward()를 사용하지만 dezero_rs는 Function 구조체의 필드로 직접 저장
        </p>
      </div>
    </section>
  );
}
