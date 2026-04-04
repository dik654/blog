import PipelineViz from './viz/PipelineViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Pipeline({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TPU 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TPU — 검증자의 TX 처리 핵심 엔진<br />
          GPU 서명 검증 + 멀티스레드 Banking + Turbine 전파, 4단계 파이프라인
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-tpu-pipeline', codeRefs['sol-tpu-pipeline'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              tpu.rs — TPU::new
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <PipelineViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
