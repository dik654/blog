import ContextViz from './viz/ContextViz';
import ValidatorClientViz from './viz/ValidatorClientViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증자 클라이언트 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 검증자 클라이언트의 슬롯 틱 루프, 역할 분배,<br />
          슬래싱 보호 메커니즘을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><ValidatorClientViz /></div>
    </section>
  );
}
