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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/abci/client/
type Client interface {
    service.Service
    SetResponseCallback(Callback)
    Error() error

    // 각 ABCI 메서드의 client side wrapper
    FlushAsync() *ReqRes
    EchoAsync(msg string) *ReqRes
    InfoAsync(RequestInfo) *ReqRes
    CheckTxAsync(RequestCheckTx) *ReqRes
    FinalizeBlockAsync(RequestFinalizeBlock) *ReqRes
    CommitAsync() *ReqRes
    // ... sync 버전도 있음
}

// 3가지 구현체:

// 1. localClient (가장 흔함)
//    - 같은 프로세스 내 함수 호출
//    - Mutex 기반 serialization
//    - latency: ~μs
type localClient struct {
    mtx         sync.Mutex
    types.Application
    callback    Callback
}

// 2. socketClient (TCP socket)
//    - app이 별도 프로세스 (socket address)
//    - 이중 서명 방지 (remote signer)
//    - latency: ~ms (network + serialization)
type socketClient struct {
    service.BaseService
    conn        net.Conn  // TCP connection
    addr        string
    mustConnect bool
    reqSent     *list.List
    resCb       Callback
}

// 3. grpcClient (gRPC)
//    - HTTP/2 + protobuf
//    - Multi-language support
//    - latency: ~ms
type grpcClient struct {
    service.BaseService
    client types.ABCIApplicationClient
    conn   *grpc.ClientConn
}

// 선택 기준:
// - Cosmos SDK chain: localClient (같은 프로세스)
// - Separate app/consensus: socketClient
// - non-Go app (JavaScript, Python 등): grpcClient

// 구현 주의사항:
// - localClient는 Mutex로 직렬화 (비동기 동시성 방지)
// - socketClient는 request queue + callback
// - grpcClient는 gRPC internal 동기화`}
        </pre>
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
