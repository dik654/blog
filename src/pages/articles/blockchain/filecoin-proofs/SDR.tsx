import SDRLayerGenViz from './viz/SDRLayerGenViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function SDR({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="sdr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'SDR & 봉인 파이프라인'}</h2>
      <div className="not-prose mb-8">
        <SDRLayerGenViz onOpenCode={onCodeRef
          ? (key) => onCodeRef(key, codeRefs[key]) : undefined} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SDR(Stacked DRG)</strong> — 11층 방향성 랜덤 그래프
          <br />
          노드당 14개 부모(DRG 6 + Expander 8)의 순차 SHA256 해싱
          <br />
          병렬화 불가 → 물리적 저장 공간 사용을 강제
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('seal-pc1', codeRefs['seal-pc1'])} />
            <span className="text-[10px] text-muted-foreground self-center">PC1 구현</span>
            <CodeViewButton onClick={() => onCodeRef('stacked-graph', codeRefs['stacked-graph'])} />
            <span className="text-[10px] text-muted-foreground self-center">graph.rs</span>
          </div>
        )}
      </div>
    </section>
  );
}
