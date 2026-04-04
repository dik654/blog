import type { CodeRef } from '@/components/code/types';
import ClientInitViz from './viz/ClientInitViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function ClientInit({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="client-init" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>ClientBuilder::build()</code>가 Helios Client를 생성하는 과정을 추적한다.
          설정값 검증 → ConsensusSpec 생성 → 체크포인트 결정 → 모듈 초기화까지의 전체 흐름.
        </p>
      </div>

      <div className="not-prose my-8">
        <ClientInitViz />
      </div>
    </section>
  );
}
