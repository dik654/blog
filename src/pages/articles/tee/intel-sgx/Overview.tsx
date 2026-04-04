import ContextViz from './viz/ContextViz';
import SGXArchViz from './viz/SGXArchViz';
import RepoStructViz from './viz/RepoStructViz';
import CoreConceptsViz from './viz/CoreConceptsViz';
import EPCMemoryViz from './viz/EPCMemoryViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose mb-8">
        <SGXArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Intel SGX(Software Guard Extensions)는 CPU 하드웨어 수준에서{' '}
          <strong>Enclave</strong>(격리된 실행 환경)를 제공합니다.<br />
          Enclave 메모리는 암호화된 EPC(Enclave Page Cache)에 저장됩니다.<br />
          OS, 하이퍼바이저, BIOS도 내용을 읽을 수 없습니다.
        </p>

        <h3>소프트웨어 스택</h3>
      </div>
      <div className="not-prose mb-6">
        <RepoStructViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>핵심 개념</h3>
      </div>
      <div className="not-prose mb-6">
        <CoreConceptsViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>EPC 메모리 모델</h3>
      </div>
      <div className="not-prose mb-6">
        <EPCMemoryViz />
      </div>
    </section>
  );
}
