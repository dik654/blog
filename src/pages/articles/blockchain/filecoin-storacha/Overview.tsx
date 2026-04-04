import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Saturn에서 Storacha로의 전환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Saturn은 Filecoin의 탈중앙 CDN이었으나 저장 증명이 없었음.<br />
          Storacha는 Saturn + web3.storage를 통합하고 PDP 온체인 증명을 추가
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}
