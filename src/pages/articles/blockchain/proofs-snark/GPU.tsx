import { codeRefs } from './codeRefs';
import GPUViz from './viz/GPUViz';
import type { CodeRef } from '@/components/code/types';

export default function GPU({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="gpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">bellperson GPU 가속</h2>
      <div className="not-prose mb-8">
        <GPUViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 메모리 병목</strong> — G1/G2 점을 GPU VRAM에 올려야 함
          <br />
          32GiB 섹터 증명 시 수 GB VRAM 필요
          <br />
          GPU 메모리 부족 시 분할 전송
        </p>
      </div>
    </section>
  );
}
