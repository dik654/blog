import DistributedViz from './viz/DistributedViz';
import DistributedStepViz from './viz/DistributedStepViz';

export default function DistributedCompute({ title }: { title?: string }) {
  return (
    <section id="distributed" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '분산 컴퓨팅 (클러스터 & 롤업)'}</h2>
      <div className="not-prose mb-8">
        <DistributedViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">분산 컴퓨팅 모델</h3>
        <p>
          <strong>Cluster</strong>: TEE 워커의 논리 그룹 — 같은 키 공유, 같은 컨트랙트 실행<br />
          <strong>Offchain Rollup</strong>: TEE 실행 결과를 on-chain commit — 가스 절감<br />
          <strong>SideVM</strong>: 비동기 장기 실행 컨테이너 — 이벤트 구독, 스트리밍<br />
          <strong>Phat Bricks</strong>: 재사용 가능한 컴포넌트 라이브러리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Cluster 아키텍처</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Cluster 구조
//
// ┌──────────────────────────────────────┐
// │  Cluster (e.g., 0x0001)              │
// │                                       │
// │  Workers (N개, 모두 같은 MRENCLAVE)  │
// │  ┌────────┐ ┌────────┐ ┌────────┐    │
// │  │Worker1 │ │Worker2 │ │Worker3 │    │
// │  │ pRuntime│ pRuntime│ pRuntime│     │
// │  └────────┘ └────────┘ └────────┘    │
// │                                       │
// │  Cluster Key (shared)                │
// │  - MPC로 생성                         │
// │  - 각 워커가 partial 보관             │
// │  - 3-of-N threshold 복원              │
// │                                       │
// │  Deployed Phat Contracts              │
// │  - Contract instances                 │
// │  - Same state on all workers          │
// └──────────────────────────────────────┘

// Cluster 생성
// - 거버넌스 또는 admin 생성
// - 초기 worker 집합 지정
// - Gatekeeper가 master key 생성 & 배포

// Worker join flow
// 1) Worker가 cluster join 요청
// 2) Existing workers가 worker attestation 검증
// 3) Master key fragment 전송 (RA-TLS)
// 4) Worker가 full cluster key 복원
// 5) 기존 contract state 동기화

// 각 cluster 독립 security boundary
// - Cluster A의 key는 Cluster B worker가 못 얻음
// - MRENCLAVE 변경 시 새 cluster 생성 필요`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Offchain Rollup</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Offchain Rollup 패턴
// Phat Contract에서 대량 계산 → 결과만 on-chain

// 시나리오: NFT metadata 대량 업데이트
// Naive: 각 NFT마다 on-chain tx (비용 N x gas)
// Rollup: 한 번에 묶어 제출 (비용 ~1x gas)

// 구현 (Phat Contract 측)
#[ink(message)]
pub fn batch_update_metadata(&self) -> Result<()> {
    // 1) 대상 NFT 리스트 (off-chain query)
    let nfts = fetch_nfts_needing_update().await?;

    // 2) 각 NFT 메타데이터 계산
    let updates: Vec<(u64, String)> = nfts.into_iter()
        .map(|nft| (nft.id, compute_metadata(&nft)))
        .collect();

    // 3) Merkle tree 생성
    let root = merkle_tree(&updates);

    // 4) 서명 (TEE identity key)
    let signature = self.sign(&root);

    // 5) On-chain contract에 commit (EVM or Substrate)
    let tx = create_eth_tx(CONTRACT_ADDR, "commitBatch",
                           &[root, updates.len(), signature]);

    // 6) 서명된 tx를 target chain에 제출
    send_raw_transaction(target_chain, tx).await?;
    Ok(())
}

// Target chain contract (Solidity)
contract PhatRollup {
    address public attestor;  // TEE worker pubkey

    function commitBatch(bytes32 root, uint count, bytes sig) external {
        require(verify(attestor, root, sig), "invalid attestor");
        currentRoot = root;
        emit BatchCommitted(root, count);
    }

    function proveUpdate(uint id, string metadata, bytes32[] proof) external {
        // Merkle proof 검증
        bytes32 leaf = keccak256(abi.encode(id, metadata));
        require(verifyProof(leaf, proof, currentRoot), "invalid proof");
        metadata[id] = metadata;
    }
}

// 이점
// - 1 tx로 수천~수만 업데이트 commit
// - Gas 비용 90%+ 절감
// - TEE signature로 신뢰 (TEE가 정직한 집계 보장)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">SideVM — 장기 실행 컨테이너</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SideVM: Phat Contract의 비동기 확장
// - 이벤트 구독 (블록체인 emit, webhook)
// - 지속적 API polling
// - WebSocket 연결 유지

// Phat Contract에서 SideVM 실행
#[ink(message)]
pub fn start_price_monitor(&self) -> Result<()> {
    let wasm_bytes = include_bytes!("../sidevm.wasm");
    pink::sidevm::start(wasm_bytes)?;
    Ok(())
}

// SideVM 코드 (별도 WASM)
#[sidevm::main]
async fn main() {
    let mut ws = connect_ws("wss://stream.binance.com/ws/btcusdt@trade").await?;

    loop {
        let msg = ws.next_message().await?;
        let trade: Trade = serde_json::from_slice(&msg)?;

        // 임계값 체크
        if trade.price > 50000.0 {
            // Phat Contract에 알림
            sidevm::notify_contract(
                my_contract_id,
                "on_price_alert",
                trade.price.to_be_bytes()
            ).await?;
        }
    }
}

// 특성
// - Contract 호출과 독립 실행
// - 재시작 가능 (state persistent)
// - 리소스 제약 (CPU/memory quota)
// - 같은 cluster 워커들이 복제 실행

// 사용 사례
// - Price oracle (CEX feed)
// - Event indexer
// - AI agent 대화 컨텍스트
// - WebSocket bridge`}</pre>

      </div>
      <div className="not-prose mt-6">
        <DistributedStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Phat Bricks — 재사용 컴포넌트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Phala의 built-in 라이브러리

// HTTP Oracle Brick
use phat_bricks::http_oracle::HttpOracle;

let oracle = HttpOracle::new("https://api.example.com");
oracle.set_header("Authorization", "Bearer xxx");
let response: PriceData = oracle.get_json("/prices/BTC").await?;

// EVM Transactor Brick
use phat_bricks::evm_transactor::EvmTransactor;

let transactor = EvmTransactor::new(
    &rpc_url,
    self.signing_key(),
);
let tx_hash = transactor.send_tx(&contract_addr, &calldata, value).await?;

// Lego Registry Brick
use phat_bricks::lego::Lego;

let lego = Lego::new();
lego.register("oracle", oracle_action);
lego.register("condition", condition_check);
lego.register("transactor", transactor_send);

// 조합
lego.execute_pipeline(&[
    "oracle->condition->transactor"
]).await?;

// 이점
// - 반복 코드 제거
// - 검증된 보안 패턴
// - 공유 라이브러리 (cluster 내 재사용)
// - Pre-audited 컴포넌트`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Phala의 Web3 AI 비전</p>
          <p>
            <strong>AI Agent Infrastructure</strong>:<br />
            - 2024 Phala 방향 전환: AI agent 플랫폼<br />
            - LLM inference를 TEE 안에서<br />
            - 개인 프롬프트·응답 기밀성<br />
            - Agent state persistence
          </p>
          <p className="mt-2">
            <strong>주요 통합</strong>:<br />
            - Fleek: Edge compute + Phala TEE<br />
            - Eliza AI framework: Phat Contract 지원<br />
            - Redpill: LLM gateway (Phala 기반)
          </p>
          <p className="mt-2">
            <strong>경쟁 분야</strong>:<br />
            - Ritual (Coinbase): 탈중앙 AI<br />
            - Bittensor: ML 모델 네트워크<br />
            - Phala 차별점: TEE privacy + Polkadot 생태계
          </p>
        </div>

      </div>
    </section>
  );
}
