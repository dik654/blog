import { codeRefs } from "./codeRefs";
import CallPathViz from "./viz/CallPathViz";
import type { CodeRef } from "@/components/code/types";

export default function ABCIClient({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="abci-client" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI 클라이언트 — 호출 경로</h2>
      <div className="not-prose mb-6">
        <CallPathViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── 3가지 ABCI 클라이언트 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">3가지 Client 구현체</h3>
        <p className="text-xs text-muted-foreground mb-3">
          cometbft/abci/client/ — <code>Client</code> interface:{" "}
          <code>FlushAsync</code>, <code>InfoAsync</code>,{" "}
          <code>CheckTxAsync</code>, <code>FinalizeBlockAsync</code>,{" "}
          <code>CommitAsync</code> 등
        </p>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              1. localClient
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>같은 프로세스 내 함수 호출</li>
              <li>
                <code className="text-xs">sync.Mutex</code> 기반 직렬화
              </li>
              <li>네트워크 직렬화는 없지만 app 실행 시간은 별도</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              주 필드: <code className="text-xs">mtx</code>,{" "}
              <code className="text-xs">Application</code>,{" "}
              <code className="text-xs">callback</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              2. socketClient (TCP)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>앱이 별도 프로세스 (socket)</li>
              <li>합의 프로세스와 app 프로세스 분리</li>
              <li>request queue·reconnect·timeout 비용 추가</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              주 필드: <code className="text-xs">net.Conn</code>,{" "}
              <code className="text-xs">addr</code>,{" "}
              <code className="text-xs">reqSent *list.List</code>
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              3. grpcClient (gRPC)
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>HTTP/2 + protobuf</li>
              <li>Multi-language (JS, Python 등)</li>
              <li>gRPC transport와 직렬화 비용 추가</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-muted">
              주 필드: <code className="text-xs">ABCIApplicationClient</code>,{" "}
              <code className="text-xs">*grpc.ClientConn</code>
            </p>
          </div>
        </div>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-xs font-semibold mb-2">선택 기준 & 동기화 방식</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium mb-1">동일 프로세스 app</p>
              <p>localClient — Mutex 보호 직접 호출</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium mb-1">Separate app/consensus</p>
              <p>socketClient — request queue + callback</p>
            </div>
            <div className="rounded bg-muted/50 p-2">
              <p className="font-medium mb-1">gRPC 스택을 구현한 app</p>
              <p>grpcClient — protobuf/gRPC 호출</p>
            </div>
          </div>
        </div>

        <p className="leading-7">
          ABCI client는 local, socket, gRPC처럼 서로 다른 process 경계를 지원할
          수 있다.
          선택은 동일 프로세스에서 app을 호출할지, socket/gRPC로 프로세스 경계를
          넘을지에 달렸으며,
          ABCI transport는 remote signer와 다른 책임이며, 이중 서명 방지 장치로
          설명하면 안 된다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 로컬 호출의 범위</strong> — localClient는 transport
          직렬화와 소켓 I/O를 피하지만 Mutex 대기와 애플리케이션 로직 실행
          시간은 그대로 남는다. 따라서
          실제 latency는 호출 종류·애플리케이션 작업·배포 환경으로 측정해야
          한다.
        </p>
      </div>
    </section>
  );
}
