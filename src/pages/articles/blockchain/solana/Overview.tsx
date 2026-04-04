import SolanaArchViz from './viz/SolanaArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Solana 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Solana — <strong>Proof of History(PoH)</strong> 기반 고성능 L1 블록체인<br />
          Rust로 구현, 단일 글로벌 상태 위에서 병렬 TX 실행 지원
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-tpu-pipeline', codeRefs['sol-tpu-pipeline'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              tpu.rs — 전체 파이프라인
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <SolanaArchViz />
      </div>
    </section>
  );
}
