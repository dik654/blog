import ContextViz from './viz/ContextViz';
import StateStructureViz from './viz/StateStructureViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BeaconState 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 BeaconState의 필드 구성, Copy-on-Write 메커니즘,<br />
          FieldTrie 해시 캐싱의 내부를 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><StateStructureViz /></div>
    </section>
  );
}
