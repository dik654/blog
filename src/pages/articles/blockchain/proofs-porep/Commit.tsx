import { codeRefs } from './codeRefs';
import CommitViz from './viz/CommitViz';
import type { CodeRef } from '@/components/code/types';

export default function Commit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">C1/C2: Groth16 증명 생성</h2>
      <div className="not-prose mb-8">
        <CommitViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} GPU MSM 가속</strong> — C2 병목은 Multi-Scalar Multiplication
          <br />
          bellperson CUDA/OpenCL로 CPU 대비 10~50배 속도 향상
          <br />
          SupraSeal은 프리페치 + 윈도우 NAF로 추가 최적화
        </p>
      </div>
    </section>
  );
}
