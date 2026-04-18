import { codeRefs } from './codeRefs';
import CallPathViz from './viz/CallPathViz';
import type { CodeRef } from '@/components/code/types';

export default function ABCIClient({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="abci-client" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI 클라이언트 — 호출 경로</h2>
      <div className="not-prose mb-6"><CallPathViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 3가지 ABCI 클라이언트 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">3가지 Client 구현체</h3>
        <p className="text-xs text-muted-foreground mb-3">cometbft/abci/client/ — <code>Client</code> interface: <code>FlushAsync</code>, <code>InfoAsync</code>, <code>CheckTxAsync</code>, <code>FinalizeBlockAsync</code>, <code>CommitAsync</code> 등</p>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">1. localClient (가장 흔함)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>같은 프로세스 내 함수 호출</li>
              <li><code className="text-xs">sync.Mutex</code> 기반 직렬화</li>
              <li>latency: ~μs</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              주 필드: <code className="text-xs">mtx</code>, <code className="text-xs">Application</code>, <code className="text-xs">callback</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">2. socketClient (TCP)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>앱이 별도 프로세스 (socket)</li>
              <li>이중 서명 방지 (remote signer)</li>
              <li>latency: ~ms</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              주 필드: <code className="text-xs">net.Conn</code>, <code className="text-xs">addr</code>, <code className="text-xs">reqSent *list.List</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">3. grpcClient (gRPC)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>HTTP/2 + protobuf</li>
              <li>Multi-language (JS, Python 등)</li>
              <li>latency: ~ms</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              주 필드: <code className="text-xs">ABCIApplicationClient</code>, <code className="text-xs">*grpc.ClientConn</code>
            </p>
          </div>
        </div>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-semibold mb-2">선택 기준 & 동기화 방식</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium mb-1">Cosmos SDK chain</p>
              <p>localClient — Mutex 직렬화</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium mb-1">Separate app/consensus</p>
              <p>socketClient — request queue + callback</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium mb-1">non-Go 앱</p>
              <p>grpcClient — gRPC internal 동기화</p>
            </div>
          </div>
        </div>

        <p className="leading-7">
          ABCI 클라이언트 <strong>3가지 구현</strong>: local/socket/grpc.<br />
          Cosmos SDK chain은 localClient (~μs latency).<br />
          다른 언어 앱은 grpcClient, remote signer는 socketClient.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 로컬 클라이언트가 가장 빠른 이유</strong> — Cosmos SDK는 CometBFT와 같은 프로세스에서 실행.<br />
          localClient는 Mutex 보호 직접 함수 호출 — gRPC 오버헤드(직렬화, 네트워크) 없음.
        </p>
      </div>
    </section>
  );
}
