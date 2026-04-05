import PhatContractViz from './viz/PhatContractViz';
import PhatContractStepViz from './viz/PhatContractStepViz';

export default function PhatContract({ title }: { title?: string }) {
  return (
    <section id="phat-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Phat Contract (Pink Runtime)'}</h2>
      <div className="not-prose mb-8">
        <PhatContractViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Phat Contract — TEE 스마트 컨트랙트</h3>
        <p>
          <strong>Phat Contract</strong>: Phala Network의 TEE 내부 실행 스마트 컨트랙트<br />
          <strong>Pink Runtime</strong>: Substrate <code>pallet-contracts</code> 확장 — TEE 특화 기능 추가<br />
          <strong>언어</strong>: Ink! (Rust 기반 DSL) → WASM으로 컴파일<br />
          <strong>차별점</strong>: HTTP 요청, 외부 API, 오프체인 계산이 컨트랙트 안에서 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Phat Contract 개발 예시</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Ink! Phat Contract (Rust)
// 예: 외부 가격 오라클

#[ink::contract]
mod price_oracle {
    use ink::prelude::string::String;
    use pink_extension as pink;

    #[ink(storage)]
    pub struct PriceOracle {
        admin: AccountId,
        api_key: String,  // 암호화 저장
    }

    impl PriceOracle {
        #[ink(constructor)]
        pub fn new(api_key: String) -> Self {
            Self {
                admin: Self::env().caller(),
                api_key,
            }
        }

        #[ink(message)]
        pub fn get_btc_price(&self) -> Result<u128, Error> {
            // 1) HTTP 요청 (TEE 안에서만 가능!)
            let response = pink::http_get(
                &format!(
                    "https://api.coingecko.com/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_api_key={}",
                    self.api_key
                )
            )?;

            // 2) JSON 파싱
            let data: Value = serde_json::from_slice(&response.body)?;
            let price = data["bitcoin"]["usd"].as_f64()?;

            // 3) 반환 (on-chain 기록)
            Ok((price * 1e8) as u128)
        }

        #[ink(message)]
        pub fn sign_message(&self, msg: Vec<u8>) -> Vec<u8> {
            // TEE 내부 랜덤 키로 서명
            pink::signing::sign(pink::SigType::Sr25519, &self.signing_key(), &msg)
        }
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pink Runtime 확장 기능</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">확장 기능</th>
                <th className="border border-border px-3 py-2 text-left">API</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">HTTP Request</td>
                <td className="border border-border px-3 py-2"><code>pink::http_get/post</code></td>
                <td className="border border-border px-3 py-2">Oracle, API 호출</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Random</td>
                <td className="border border-border px-3 py-2"><code>pink::ext().getrandom</code></td>
                <td className="border border-border px-3 py-2">VRF, 추첨</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Signing</td>
                <td className="border border-border px-3 py-2"><code>pink::signing::sign</code></td>
                <td className="border border-border px-3 py-2">외부 체인 tx 서명</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Cache</td>
                <td className="border border-border px-3 py-2"><code>pink::cache::*</code></td>
                <td className="border border-border px-3 py-2">off-chain 상태 캐시</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">IPFS</td>
                <td className="border border-border px-3 py-2"><code>pink::ipfs::*</code></td>
                <td className="border border-border px-3 py-2">대용량 데이터 저장</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Sidevm</td>
                <td className="border border-border px-3 py-2"><code>pink::sidevm::*</code></td>
                <td className="border border-border px-3 py-2">장기 실행 프로세스</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">배포 & 호출</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 1) 개발 & 빌드
cargo contract new price_oracle
cd price_oracle
cargo contract build --release
# → price_oracle.contract 파일 생성

// 2) Phala 테스트넷 배포
npx @phala/phat-contract-cli deploy \\
    --artifact ./target/ink/price_oracle.contract \\
    --network testnet \\
    --suri "your seed phrase" \\
    --cluster 0x0000...0001

# 출력:
# Contract address: 0xabc123...
# Cluster: 0x0000...0001
# Deployer: 5F3s...

// 3) 호출 (JS/TS)
import { OnChainRegistry, PinkContractPromise } from '@phala/sdk';

const api = await ApiPromise.create({ provider: wsProvider });
const phatRegistry = await OnChainRegistry.create(api);

const contract = new PinkContractPromise(
    api, phatRegistry,
    abi, contractAddress, clusterId
);

// Query (read-only, free)
const { output } = await contract.query.getBtcPrice(signer.address, {});
console.log('BTC Price:', output.toHuman());

// Tx (state change, gas cost)
await contract.tx.updateApiKey({}, 'new-api-key').signAndSend(signer);`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">보안 모델</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Phat Contract의 4계층 보안

// Layer 1: SGX Hardware
// - 메모리 암호화 (MEE)
// - Enclave 격리
// - Attestation

// Layer 2: pRuntime
// - Rust 메모리 안전성
// - Minimal TCB
// - Signed binary (MRENCLAVE 고정)

// Layer 3: Contract WASM sandbox
// - 리소스 제약 (gas, memory)
// - Deterministic execution
// - No arbitrary file/network access (via pink only)

// Layer 4: Contract code
// - ink! 타입 안전성
// - Access control (admin, roles)
// - Input validation

// 공격 시나리오 대응
// - 악성 Contract 배포: pallet 감사 (cluster admin 검토)
// - TEE 탈출: 4계층이 순차 방어
// - Side channel: constant-time crypto (contract 작성자 책임)
// - 악성 Worker: 다수 cluster 검증 (consensus)

// Gas 계산
// - CPU, memory, storage 사용량
// - HTTP 요청 비용 (pink 확장)
// - 외부 API 응답 크기`}</pre>

      </div>
      <div className="not-prose mt-6">
        <PhatContractStepViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Phat Contract vs EVM 스마트 컨트랙트</p>
          <p>
            <strong>Ethereum 스마트 컨트랙트</strong>:<br />
            - 결정적 on-chain 실행<br />
            - 외부 API 호출 불가 (oracle 필요)<br />
            - 모든 state 공개<br />
            - Gas 예측 가능
          </p>
          <p className="mt-2">
            <strong>Phat Contract</strong>:<br />
            ✓ HTTP 요청 직접 호출<br />
            ✓ 외부 API key 기밀 보관<br />
            ✓ Off-chain 결과 서명 후 on-chain 제출<br />
            ✗ 가격 변동성 큼 (TEE + network)
          </p>
          <p className="mt-2">
            <strong>유스케이스</strong>:<br />
            - Chainlink 대안 (decentralized oracle)<br />
            - AI agent 실행 플랫폼<br />
            - Private RWA tokenization<br />
            - Cross-chain bridge (서명 생성)
          </p>
        </div>

      </div>
    </section>
  );
}
