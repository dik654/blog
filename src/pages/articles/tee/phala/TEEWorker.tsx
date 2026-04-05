import TEEWorkerViz from './viz/TEEWorkerViz';
import TEEWorkerStepViz from './viz/TEEWorkerStepViz';

export default function TEEWorker({ title }: { title?: string }) {
  return (
    <section id="tee-worker" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'TEE Worker (pRuntime & Phactory)'}</h2>
      <div className="not-prose mb-8">
        <TEEWorkerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">TEE Worker 구조</h3>
        <p>
          <strong>pRuntime</strong>: Intel SGX Enclave 내부 Rust 런타임<br />
          <strong>Phactory</strong>: pRuntime 안의 핵심 비즈니스 로직 엔진<br />
          <strong>Attestation</strong>: DCAP 기반 원격 증명으로 워커 무결성 보장<br />
          <strong>4계층 보안</strong>: HW → Enclave → Runtime → Contract
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">pRuntime 내부 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// pRuntime 주요 컴포넌트 (Rust)
// https://github.com/Phala-Network/phala-blockchain

pub struct PRuntime {
    // Identity keys
    identity_key: Ed25519Keypair,   // 워커 식별
    ecdh_key: X25519Keypair,         // 키 교환용

    // Attestation
    attestation_provider: AttestationProvider,  // SGX DCAP

    // Contract execution
    contract_groups: HashMap<ContractId, ContractGroup>,
    chain_store: ChainStore,        // Substrate chain 상태

    // Communication
    light_client: LightClient,      // Relay chain light client
    gatekeeper_client: GatekeeperClient,

    // Scheduler
    egress_queue: Mutex<VecDeque<Message>>,
    event_dispatcher: EventDispatcher,
}

// 주요 인터페이스 (gRPC)
service PhactoryAPI {
    rpc GetInfo() returns (PhactoryInfo);
    rpc SyncHeader(HeadersToSync) returns (SyncResult);
    rpc DispatchBlocks(Blocks) returns (DispatchResult);
    rpc ContractQuery(ContractQuery) returns (ContractQueryResponse);
    rpc GetEgressMessages() returns (EgressMessages);
    rpc SignEndpointInfo(EndpointInfo) returns (SignedEndpointInfo);
}

// gRPC는 enclave 외부 (plain-text host proxy)
// 민감 데이터는 encrypted payload로 전달`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 등록 & Attestation</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 워커가 네트워크에 참여하는 흐름

// Step 1: pRuntime 초기화 (enclave 시작)
pruntime_init() {
    // 1) Identity key 생성 (Ed25519)
    identity_key = generate_keypair();

    // 2) ECDH key 생성 (X25519)
    ecdh_key = generate_keypair();

    // 3) Genesis state 로드
    load_genesis_from_chain();
}

// Step 2: Remote Attestation 요청
request_attestation() {
    // User data: identity_key.public || ecdh_key.public
    let user_data = concat(
        identity_key.public(),
        ecdh_key.public()
    );

    // SGX Quote 생성 (DCAP)
    let quote = sgx_get_quote(user_data);

    // Return quote + certs
    return (quote, pck_cert_chain);
}

// Step 3: On-chain 등록
// register_worker extrinsic 제출
submit_tx(register_worker {
    worker_pubkey: identity_key.public(),
    attestation: quote,
    operator: owner_account,
    deposit: WORKER_DEPOSIT,  // 1000 PHA stake
});

// Step 4: 체인이 검증
// - Quote 서명 확인 (PCK chain)
// - MRENCLAVE가 승인된 pRuntime인지
// - TCB version 최신인지
// - 통과 시 worker 등록

// Step 5: 네트워크 가입
// - Gatekeeper가 합류 승인
// - Cluster 배정
// - Phat Contract 실행 대기`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Contract 실행 모델</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Phat Contract 실행 흐름

// 1) 사용자가 tx 제출 (암호화 없음, on-chain)
tx = ContractCall {
    contract_id: "0xabc...",
    method: "fetch_api_data",
    params: ...,
};
submit_to_chain(tx);

// 2) pRuntime이 chain sync 중 tx 수신
async fn dispatch_contract_call(tx) {
    let contract = self.contracts.get(tx.contract_id)?;

    // 3) Encrypted input envelope (client → worker)
    if tx.has_envelope() {
        let plain_input = decrypt(tx.envelope, self.ecdh_key)?;
        tx.input = plain_input;
    }

    // 4) Contract 실행 (WASM)
    let result = contract.execute(tx.method, tx.input)?;

    // 5) Egress 메시지 준비
    // - On-chain commit
    // - 외부 API 결과 (서명 필요)
    // - Inter-contract call

    self.egress_queue.push(Egress {
        from: tx.contract_id,
        result: result,
        signature: self.sign_with_identity(result),
    });
}

// 6) Gatekeeper가 egress 수집 & on-chain 제출
// - 서명 검증
// - State root 업데이트
// - PHA 보상 지급`}</pre>

      </div>
      <div className="not-prose mt-6">
        <TEEWorkerStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 하드웨어 요구사항</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Phala Worker 스펙

// Hardware
// - CPU: Intel SGX2 지원 CPU (3rd gen Xeon+)
//   * Ice Lake SP: Platinum 8300/Gold 6300
//   * Sapphire Rapids 이후 모든 Xeon
//   * Ryzen PRO 일부 (amd-sev 대안)
// - RAM: 16GB+ (EPC 요구량)
// - Storage: 500GB+ NVMe
// - Network: 100Mbps+

// Software
// - OS: Ubuntu 20.04+ (recommended)
// - Kernel: 5.11+ (DCAP support)
// - Intel SGX PSW 2.17+
// - Docker (containerized deployment)

// 배포
docker run -d --name phala-worker \\
    --device /dev/sgx_enclave \\
    --device /dev/sgx_provision \\
    -v /opt/phala/data:/data \\
    -e NODE_RPC_WS=wss://api.phala.network \\
    phala/pruntime:latest

// 모니터링
// - worker health endpoint
// - attestation expiry 경고
// - Stake/reward 추적

// 스테이킹
// - 최소 1000 PHA
// - 2주 unbonding
// - SLA 미달 시 slashing
// - Delegator도 스테이킹 가능 (18% commission)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Worker 경제적 인센티브</p>
          <p>
            <strong>Reward 구조</strong>:<br />
            - Contract 실행 fee (gas)<br />
            - 네트워크 공유 리워드 (inflation)<br />
            - Delegation commission
          </p>
          <p className="mt-2">
            <strong>Slashing 조건</strong>:<br />
            ✗ Uptime 90% 미만<br />
            ✗ Attestation 만료 무시<br />
            ✗ Double-signing (incorrect egress)<br />
            ✗ Cluster 규칙 위반
          </p>
          <p className="mt-2">
            <strong>현실적 수익성</strong>:<br />
            - 초기 투자: SGX 서버 $5,000+<br />
            - 월 전기·네트워크: $50~100<br />
            - ROI 기간: 시장 가격 의존<br />
            - 2024 기준: 15~25% APR<br />
            - 클라우드 렌탈도 가능 (OVH, Hetzner)
          </p>
        </div>

      </div>
    </section>
  );
}
