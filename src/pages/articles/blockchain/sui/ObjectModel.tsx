import ObjectModelViz from './viz/ObjectModelViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ObjectModel({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="object-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">객체 소유권 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sui 핵심 혁신 — 모든 온체인 데이터를 독립 객체로 관리<br />
          소유 객체 간 TX는 상호 독립 → 합의 없이 병렬 처리
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sui-object-types', codeRefs['sui-object-types'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              object.rs — Owner enum
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('sui-fast-path', codeRefs['sui-fast-path'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              authority.rs — Fast Path
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <ObjectModelViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
