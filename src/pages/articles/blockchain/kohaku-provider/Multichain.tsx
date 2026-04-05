import type { CodeRef } from '@/components/code/types';
import MultichainViz from './viz/MultichainViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Multichain({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="multichain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티체인 지원</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>MultiChainProvider</code>는 <code>HashMap&lt;ChainId, KohakuProvider&gt;</code> 구조다.
          <br />
          각 체인마다 독립된 Helios + ORAM + Dandelion 인스턴스를 생성한다.
        </p>
        <p className="leading-7">
          Ethereum, Optimism, Base 등 각 체인의 쿼리 패턴이 격리된다.
          <br />
          한 체인의 활동으로 다른 체인의 사용자를 프로파일링할 수 없다.
        </p>
        <p className="leading-7">
          <code>add_chain(chain_id, rpc, checkpoint)</code>로 새 체인을 추가한다.
          <br />
          체인별 checkpoint는 부트스트랩 시 사용된다. 각 체인의 Sync Committee가 독립 검증된다.
        </p>
      </div>
      <div className="not-prose"><MultichainViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">MultiChain Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Multi-chain Kohaku

pub struct MultiChainProvider {
    chains: HashMap<ChainId, Box<KohakuProvider>>,
    default_chain: ChainId,
}

impl MultiChainProvider {
    pub fn new() -> Self {
        Self {
            chains: HashMap::new(),
            default_chain: 1,  // Ethereum mainnet
        }
    }

    pub fn add_chain(
        &mut self,
        chain_id: ChainId,
        rpc_url: String,
        checkpoint: Hash,
    ) {
        let provider = KohakuProvider::new(
            rpc_url,
            checkpoint,
            chain_config_for(chain_id),
        );
        self.chains.insert(chain_id, Box::new(provider));
    }

    pub fn provider_for(&self, chain_id: ChainId) -> Option<&KohakuProvider> {
        self.chains.get(&chain_id)
    }
}

// Chain-specific configurations
fn chain_config_for(chain_id: ChainId) -> ChainConfig {
    match chain_id {
        1 => MAINNET_CONFIG,
        10 => OPTIMISM_CONFIG,
        8453 => BASE_CONFIG,
        42161 => ARBITRUM_CONFIG,
        137 => POLYGON_CONFIG,
        _ => GENERIC_CONFIG,
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Chain Isolation의 중요성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 체인 간 정보 누출 방지

// 문제: 한 체인에서 수집된 정보가 다른 체인 사용자 프로파일링에 사용
// 예시
// - 사용자가 L1에서 Alice.eth 조회
// - 같은 RPC가 Optimism에서 Alice의 주소 관찰
// - → L1 + L2 활동 연결 (deanonymization)

// Kohaku 해결책
// 1) Per-chain isolated providers
//    - Ethereum: ORAM + Dandelion 인스턴스 A
//    - Optimism: ORAM + Dandelion 인스턴스 B
//    - Cross-instance 정보 공유 없음

// 2) Different RPC endpoints per chain
//    - L1: Infura endpoint
//    - L2: Optimism RPC
//    - L3: Base RPC
//    - 각각 독립된 observer

// 3) Query timing jitter
//    - 체인 간 query 동시 발생 방지
//    - Random delays 추가
//    - Timing correlation 방어

// Cross-chain 위협
// - 같은 wallet이 여러 체인 사용
// - Bridge transactions (L1 ↔ L2)
// - Cross-chain messages

// 완화 불가능한 것
// - On-chain activity (public)
// - Bridge deposits/withdrawals
// - 동일 주소 재사용`}</pre>

      </div>
    </section>
  );
}
