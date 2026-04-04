import TurbineViz from './viz/TurbineViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Turbine({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="turbine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Turbine 블록 전파</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Turbine — BitTorrent 영감 블록 전파 프로토콜<br />
          블록 → shred 분할 → 트리 구조 전파. 각 노드 대역폭 부담 최소화
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-turbine-shred', codeRefs['sol-turbine-shred'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              shred.rs — entries_to_shreds
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <TurbineViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
