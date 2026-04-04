import DropEmbedViz from './viz/DropEmbedViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function DropoutEmbedding({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="dropout-embedding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Dropout & Embedding</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Dropout: 학습 시 확률 p로 뉴런 비활성화 → 모델이 특정 뉴런에 의존하지 않도록
          <br />
          Inverted Dropout: 활성 뉴런에 <code>1/(1-p)</code>를 곱해 기댓값을 보정
          <br />
          추론 시에는 <code>TRAINING=false</code> → <code>x.clone()</code>만 반환 (연산 0)
        </p>
        <p className="leading-7">
          Embedding: 정수 ID → 밀집 벡터 변환. <code>W[idx]</code> 행 복사가 전부
          <br />
          one-hot matmul <code>O(V*d)</code> 대신 인덱싱 <code>O(n*d)</code>로 효율적
          <br />
          역전파는 scatter-add: <code>gW[idx] += gy</code> — 같은 단어면 기울기 합산
        </p>
      </div>
      <div className="not-prose mb-8">
        <DropEmbedViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Dropout의 mask는 forward에서 생성되어 backward에서 재사용 — <code>RefCell</code> 패턴
          <br />
          Embedding의 <code>idx_data</code>는 forward 시 캡처하여 backward에서 scatter 위치 결정
          <br />
          두 구현 모두 "forward에서 만든 정보를 backward에서 사용" 패턴이 동일
        </p>
      </div>
    </section>
  );
}
