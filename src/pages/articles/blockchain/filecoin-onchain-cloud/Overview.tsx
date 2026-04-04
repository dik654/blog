import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">플랫폼 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Filecoin Onchain Cloud — PDP + 측정 가능 리트리벌 + 온체인 정산을 통합한 플랫폼.<br />
          "AWS S3의 탈중앙 버전"을 목표 — 검증 가능하고 검열 불가
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>
    </section>
  );
}
