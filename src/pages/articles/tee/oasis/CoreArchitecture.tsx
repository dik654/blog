import CoreArchitectureViz from './viz/CoreArchitectureViz';
import NodeTypesViz from './viz/NodeTypesViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function CoreArchitecture({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="core-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Core 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Oasis Core</strong> (go/ 디렉토리): 합의·런타임·네트워킹을 포함하는 Go 구현체<br />
          ABCI 인터페이스로 CometBFT와 통합 — Oasis 전용 로직은 <code>abciMux</code>가 중재<br />
          런타임은 별도 프로세스로 실행 — TEE 프로세스 격리 + IPC 통신
        </p>
      </div>

      <CoreArchitectureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">ABCI 멀티플렉서 — 합의 진입점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/consensus/tendermint/abci/mux.go

// abciMux: 여러 ABCI Application을 하나로 합치는 멀티플렉서
// 각 Oasis 모듈(Staking, Registry, Roothash 등)이 Application 구현
// CometBFT는 단일 ABCI만 인식 → mux가 fanout

type abciMux struct {
    // 등록된 ABCI Applications
    apps    []Application
    appsByName map[string]Application
    appsByTxTag map[byte]Application

    // CometBFT 상태 (DeliverTx·BeginBlock·EndBlock 추적)
    state   *ApplicationState

    // Debug & metrics
    logger  *logging.Logger
}

// CheckTx: 트랜잭션 mempool 진입 전 유효성 검사
func (mux *abciMux) CheckTx(req types.RequestCheckTx) types.ResponseCheckTx {
    // 트랜잭션 tag로 담당 Application 선택
    tag := req.Tx[0]
    app := mux.appsByTxTag[tag]

    // 해당 app에 위임
    return app.CheckTx(req)
}

// DeliverTx: 블록에 포함된 tx 실제 실행
func (mux *abciMux) DeliverTx(req types.RequestDeliverTx) types.ResponseDeliverTx {
    ctx := newContext(mux.state)
    tag := req.Tx[0]
    app := mux.appsByTxTag[tag]
    return app.ExecuteTx(ctx, req.Tx[1:])
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">등록되는 ABCI Applications</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Application</th>
                <th className="border border-border px-3 py-2 text-left">책임</th>
                <th className="border border-border px-3 py-2 text-left">Tx prefix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>Staking</code></td>
                <td className="border border-border px-3 py-2">위임·슬래싱·보상 분배</td>
                <td className="border border-border px-3 py-2">0x05</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Registry</code></td>
                <td className="border border-border px-3 py-2">노드·엔티티·런타임 등록</td>
                <td className="border border-border px-3 py-2">0x01</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Roothash</code></td>
                <td className="border border-border px-3 py-2">런타임 상태 루트 커밋</td>
                <td className="border border-border px-3 py-2">0x02</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Scheduler</code></td>
                <td className="border border-border px-3 py-2">컴퓨트·스토리지 위원회 선출</td>
                <td className="border border-border px-3 py-2">0x03</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>KeyManager</code></td>
                <td className="border border-border px-3 py-2">키 매니저 등록·정책</td>
                <td className="border border-border px-3 py-2">0x04</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Governance</code></td>
                <td className="border border-border px-3 py-2">프로토콜 업그레이드 투표</td>
                <td className="border border-border px-3 py-2">0x06</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Beacon</code></td>
                <td className="border border-border px-3 py-2">VRF 기반 무작위성 비콘</td>
                <td className="border border-border px-3 py-2">0x00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('abci-mux', codeRefs['abci-mux'])} />
            <span className="text-[10px] text-muted-foreground self-center">ABCI 멀티플렉서</span>
            <CodeViewButton onClick={() => onCodeRef('abci-mux-inner', codeRefs['abci-mux-inner'])} />
            <span className="text-[10px] text-muted-foreground self-center">abciMux 내부</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">노드 유형 — 역할 기반 구성</h3>
      </div>
      <NodeTypesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mt-4">{`// 노드 유형별 활성 서비스

// 1) Validator Node (합의 전용)
//    ✓ CometBFT consensus
//    ✓ P2P (Tendermint mempool/blockchain)
//    ✗ Runtime host
//    → 검증인 스테이킹 필수

// 2) Compute Node (ParaTime 실행)
//    ✓ CometBFT consensus (non-validator)
//    ✓ Runtime host (TEE process)
//    ✓ Storage access (local MKVS)
//    ✓ P2P (consensus + runtime)
//    → TEE 하드웨어 필수 (SGX/TDX)

// 3) Storage Node
//    ✓ CometBFT consensus (full)
//    ✓ MKVS storage (Merkle Key-Value Store)
//    ✓ IAVL sync
//    → 디스크 I/O 집중

// 4) Client Node (RPC/Gateway)
//    ✓ CometBFT consensus (light client 가능)
//    ✗ Runtime host
//    ✗ Storage (read-only)
//    → 웹3 dApp 진입점`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Common Infrastructure</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 모든 노드가 공유하는 기반

// 1) Identity
//    - Node 서명 키(Ed25519)
//    - P2P peer ID
//    - TLS 인증서

// 2) P2P (libp2p)
//    - Gossipsub: Tx·Commitment 전파
//    - Kademlia DHT: Peer discovery
//    - Yamux: 멀티플렉싱

// 3) IPC (Internal Process Comm)
//    - Runtime process ↔ Host 통신
//    - Unix socket + length-prefixed CBOR
//    - 암호화 불필요 (로컬)

// 4) Metrics
//    - Prometheus exporter
//    - Health endpoint`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 모듈을 ABCI Application으로 분리했나</p>
          <p>
            <strong>대안 1 — 단일 거대 앱</strong>: 모든 로직을 하나의 ABCI Application에 집약<br />
            <strong>대안 2 — Oasis처럼 분리</strong>: Staking/Registry/Roothash 등 독립 모듈
          </p>
          <p className="mt-2">
            <strong>분리 장점</strong>:<br />
            ✓ 테스트 용이 — 각 모듈 독립 테스트<br />
            ✓ 업그레이드 단위 — 거버넌스로 모듈별 교체<br />
            ✓ 코드 소유권 — 팀별 분담
          </p>
          <p className="mt-2">
            <strong>비용</strong>:<br />
            ✗ 상태 접근 오버헤드 — 모듈 간 storage 호출<br />
            ✗ 트랜잭션 라우팅 복잡도<br />
            ✗ Cosmos SDK와 다른 자체 패턴 (학습 곡선)
          </p>
        </div>

      </div>
    </section>
  );
}
