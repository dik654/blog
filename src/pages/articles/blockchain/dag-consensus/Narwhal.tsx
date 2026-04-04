import NarwhalVertexViz from './viz/NarwhalVertexViz';
import NarwhalWorkerViz from './viz/NarwhalWorkerViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Narwhal({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  return (
    <section id="narwhal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal: DAG 기반 멤풀</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          모든 검증자가 동시에 데이터를 제안하는 구조화된 DAG 멤풀
        </p>
      </div>
      <div className="not-prose mb-8"><NarwhalVertexViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Primary-Worker 아키텍처</h3>
        <p className="leading-7">
          메타데이터(DAG)와 데이터 전파를 분리 — Worker 추가로 처리량 수평 확장
        </p>
      </div>
      <div className="not-prose"><NarwhalWorkerViz /></div>
    </section>
  );
}
