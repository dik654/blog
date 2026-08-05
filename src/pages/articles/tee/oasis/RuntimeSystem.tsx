import RuntimeSystemViz from './viz/RuntimeSystemViz';
import BundleStructViz from './viz/BundleStructViz';
import SgxProvisionViz from './viz/SgxProvisionViz';
import IpcProtocolViz from './viz/IpcProtocolViz';
import ExecutorBatchViz from './viz/ExecutorBatchViz';
import OrcBundleViz from './viz/OrcBundleViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RuntimeSystem({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="runtime-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">런타임 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Bundle Manager</strong>가 .orc 번들을 다운로드·검증<br />
          <strong>Runtime Loader</strong>가 SGX 엔클레이브 또는 네이티브 프로세스로 런타임 로딩<br />
          <strong>Runtime Host</strong>가 실행 환경 관리, <strong>컴퓨트 워커</strong>가 트랜잭션 처리<br />
          <strong>IPC</strong>로 Host ↔ Runtime 통신 — CBOR 직렬화 + Unix socket
        </p>
      </div>

      <RuntimeSystemViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Runtime Host — TEE 프로세스 관리</h3>
      </div>
      <div className="not-prose mb-4"><SgxProvisionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">IPC 프로토콜 — Host ↔ Runtime</h3>
      </div>
      <div className="not-prose mb-4"><IpcProtocolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('dispatcher', codeRefs['dispatcher'])} />
            <span className="text-[10px] text-muted-foreground self-center">dispatcher.rs · 런타임 디스패처</span>
            <CodeViewButton onClick={() => onCodeRef('executor-worker', codeRefs['executor-worker'])} />
            <span className="text-[10px] text-muted-foreground self-center">worker.go · Executor</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">Executor 워커 — 트랜잭션 배치 처리</h3>
      </div>
      <div className="not-prose mb-4"><ExecutorBatchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">런타임 번들 구조</h3>
      </div>
      <BundleStructViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

      </div>
      <div className="not-prose mb-4"><OrcBundleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Runtime 격리의 이중 레이어</p>
          <p>
            <strong>Layer 1: Process isolation</strong><br />
            - Runtime = 별도 OS 프로세스<br />
            - Host 크래시해도 Runtime 독립 운영<br />
            - Sandbox(seccomp/namespace)로 시스템콜 제한
          </p>
          <p className="mt-2">
            <strong>Layer 2: TEE isolation (SGX)</strong><br />
            - Runtime 프로세스가 엔클레이브 진입<br />
            - 모든 민감 로직은 엔클레이브 안에서만<br />
            - Host OS, 루트 사용자도 엔클레이브 내부 관측 불가
          </p>
          <p className="mt-2">
            <strong>왜 이중인가</strong>:<br />
            - Sandbox만: 커널 버그 시 탈출 가능<br />
            - TEE만: 성능·호환성 이슈 (엔클레이브 외 라이브러리 필요)<br />
            - 이중: 일상적 방어 + 극단 공격 대응
          </p>
        </div>

      </div>
    </section>
  );
}
