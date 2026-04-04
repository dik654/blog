import BullsharkWaveViz from './viz/BullsharkWaveViz';
import BullsharkDetailViz from './viz/BullsharkDetailViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Bullshark({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  return (
    <section id="bullshark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bullshark: DAG 순서 결정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Narwhal DAG 위에서 전체 순서를 결정하는 합의 프로토콜 — 이더리움 LMD-GHOST와 유사
        </p>
      </div>
      <div className="not-prose mb-8"><BullsharkDetailViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Wave 파이프라인</h3>
        <p className="leading-7">
          4라운드 단위 Wave — 앵커 커밋 시 인과적 히스토리 전체가 순서 확정
        </p>
      </div>
      <div className="not-prose"><BullsharkWaveViz /></div>
    </section>
  );
}
