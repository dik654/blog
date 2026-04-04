import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PDP vs PoRep: 왜 다른 증명이 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          PoRep은 데이터를 봉인해야 하므로 원본을 즉시 읽을 수 없음.<br />
          PDP는 원본 데이터를 그대로 저장하고 존재를 증명 — 핫스토리지에 적합
        </p>
      </div>
      <div className="not-prose"><ContextViz onOpenCode={open} /></div>
    </section>
  );
}
