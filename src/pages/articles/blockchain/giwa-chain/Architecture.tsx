import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">노드 아키텍처 &amp; 합의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">OP Stack 노드 구성</h3>

        <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
          <svg viewBox="0 0 480 300" className="w-full h-auto" style={{ maxWidth: 640 }}>
            <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">GIWA 노드 아키텍처 (Docker Compose)</text>

            <defs>
              <marker id="gv-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
              </marker>
            </defs>

            {/* L1 (이더리움) */}
            <ModuleBox x={175} y={30} w={130} h={40}
              label="Ethereum L1"
              sub="DA · finality"
              color="#6366f1" />

            {/* op-node (CL) */}
            <ModuleBox x={30} y={110} w={150} h={60}
              label="op-node (CL)"
              sub="L1 → L2 block 파생"
              color="#8b5cf6" />

            {/* Execution Client (geth/reth) */}
            <ModuleBox x={300} y={110} w={150} h={60}
              label="geth / reth (EL)"
              sub="EVM 실행 · state DB"
              color="#10b981" />

            {/* Beacon Node */}
            <DataBox x={30} y={200} w={150} h={35}
              label="op-batcher"
              sub="L2 batches → L1"
              color="#f59e0b" />

            <DataBox x={300} y={200} w={150} h={35}
              label="op-proposer"
              sub="state root → L1"
              color="#f59e0b" />

            {/* RPC */}
            <ActionBox x={175} y={240} w={130} h={40}
              label="JSON-RPC"
              sub="사용자 · dApps"
              color="#3b82f6" />

            {/* 화살표 */}
            {/* L1 ↔ op-node */}
            <line x1={175} y1={60} x2={100} y2={110} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gv-arr)" />
            <text x={115} y={90} fontSize={7} fill="var(--muted-foreground)">L1 read</text>

            {/* op-node ↔ EL (Engine API) */}
            <line x1={180} y1={140} x2={300} y2={140} stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#gv-arr)" />
            <text x={240} y={135} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Engine API</text>

            {/* EL → op-batcher */}
            <line x1={375} y1={170} x2={375} y2={200} stroke="var(--border)" strokeWidth={0.5} />
            {/* op-batcher → L1 */}
            <line x1={180} y1={200} x2={240} y2={70} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#gv-arr)" />
            <text x={210} y={135} fontSize={6} fill="#f59e0b" transform="rotate(-60 210 135)">batch post</text>

            {/* op-proposer → L1 */}
            <line x1={375} y1={200} x2={305} y2={70} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#gv-arr)" />

            {/* EL → RPC */}
            <line x1={320} y1={170} x2={270} y2={240} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#gv-arr)" />

            <text x={240} y={295} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">
              CL derives blocks · EL executes · batcher posts · proposer anchors
            </text>
          </svg>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">op-node — Consensus Layer 역할</h3>
        <p>
          <code>op-node</code>는 OP Stack의 <strong>"두뇌"</strong>:
        </p>
        <p>
          <strong>1. L1 Monitoring</strong><br />
          이더리움 L1의 batch inbox contract 감시<br />
          sequencer가 올린 batch 데이터 수집
        </p>
        <p>
          <strong>2. Block Derivation</strong><br />
          L1 calldata → L2 블록 파생 규칙 적용<br />
          결정론적 규칙 — 누구나 같은 L2 state 계산 가능
        </p>
        <p>
          <strong>3. Engine API 호출</strong><br />
          파생된 블록을 Execution Client(geth/reth)에 주입<br />
          <code>engine_forkchoiceUpdatedV2</code>, <code>engine_newPayloadV2</code>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sequencer 동작 (중앙화된 부분)</h3>
        <p>
          <strong>Sequencer = 트랜잭션 순서 결정자</strong><br />
          현재 OP Stack의 중앙화 지점 — 향후 decentralized sequencing 로드맵<br />
          역할:
        </p>
        <p>
          - 사용자 트랜잭션 수신<br />
          - 순서 결정 &amp; pre-confirmation 발행<br />
          - L2 블록 생성 (L1에 올리기 전)<br />
          - "soft finality" 제공 (L1 게시 전 상태)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Finality 계층</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 3단계 finality

1. Sequencer Confirmation (~2초):
   Sequencer가 블록 생성 & 서명
   User UI: "Transaction confirmed"
   주의: Sequencer 거짓말 가능 (reorg 위험)

2. L1 Data Availability (~2분):
   Batch가 L1에 게시됨
   이제 누구나 L2 state 재구성 가능
   Sequencer censorship 방지됨

3. L1 Finality (~12분):
   L1 블록이 finalized (Ethereum 2 epochs)
   완전한 최종성
   withdrawal 시 여전히 7일 challenge`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">GIWA 운영 고려사항</h3>
        <p>
          <strong>L1 RPC 의존성</strong>: <code>OP_NODE_L1_ETH_RPC</code> 필수<br />
          Alchemy, Infura, QuickNode 또는 자체 이더리움 노드<br />
          L1 요청량 많음 — 유료 플랜 권장
        </p>
        <p>
          <strong>L1 Beacon 의존성</strong>: <code>OP_NODE_L1_BEACON</code><br />
          EIP-4844 blob data 접근 필요<br />
          Lighthouse, Prysm, Teku 등 CL 연결
        </p>
        <p>
          <strong>디스크 성장</strong>:<br />
          Archive 노드: 일일 2-5GB 증가<br />
          NVMe SSD 필수 (HDD는 I/O 병목)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: OP Stack의 모듈성</p>
          <p>
            GIWA 같은 신규 L2는 <strong>OP Stack 모듈 조합</strong>으로 빠른 구축 가능:
          </p>
          <p className="mt-2">
            - op-geth / op-reth (EL)<br />
            - op-node (CL)<br />
            - op-batcher (L1 배치)<br />
            - op-proposer (상태 앵커)<br />
            - op-challenger (fraud proof, 향후)
          </p>
          <p className="mt-2">
            각 모듈은 독립 업그레이드 가능 — Flashblocks, 새 sync 모드 등<br />
            <strong>Superchain 이점</strong>: 여러 OP Stack 체인이 공통 개선 공유<br />
            ex) Fault Proof System 출시 → 모든 OP Stack 체인 동시 적용
          </p>
        </div>

      </div>
    </section>
  );
}
