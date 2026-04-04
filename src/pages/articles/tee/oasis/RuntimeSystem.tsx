import RuntimeSystemViz from './viz/RuntimeSystemViz';
import BundleStructViz from './viz/BundleStructViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RuntimeSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="runtime-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">런타임 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bundle Manager</strong>가 .orc 번들을 다운로드/검증합니다.<br />
          <strong>Runtime Loader</strong>가 SGX 엔클레이브 또는 네이티브 프로세스로
          런타임을 로딩합니다.<br />
          Runtime Host가 실행 환경을 관리하고, 컴퓨트 워커가 트랜잭션을 처리합니다.
        </p>
      </div>

      <RuntimeSystemViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('dispatcher', codeRefs['dispatcher'])} />
            <span className="text-[10px] text-muted-foreground self-center">dispatcher.rs · 런타임 디스패처</span>
            <CodeViewButton onClick={() => onCodeRef('executor-worker', codeRefs['executor-worker'])} />
            <span className="text-[10px] text-muted-foreground self-center">worker.go · Executor</span>
          </div>
        )}

        <h3>런타임 번들 구조</h3>
      </div>
      <BundleStructViz />
    </section>
  );
}
