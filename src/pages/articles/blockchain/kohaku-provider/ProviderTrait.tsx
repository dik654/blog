import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ProviderTraitViz from './viz/ProviderTraitViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProviderTrait({ onCodeRef }: Props) {
  return (
    <section id="provider-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Provider trait 조합 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Provider</code> trait은 3개 async 메서드로 추상화된다.
          <br />
          <code>get_balance</code>, <code>get_nonce</code>, <code>call</code> — 구현체만 교체하면 된다.
        </p>
        <p className="leading-7">
          <code>KohakuProvider</code>는 <code>HeliosClient</code> + <code>ORAMProxy</code> + <code>DandelionRouter</code>를 조합한다.
          <br />
          테스트 시 MockProvider를 주입하면 네트워크 없이 단위 테스트가 가능하다.
        </p>
      </div>
      <div className="not-prose">
        <ProviderTraitViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('kh-provider', codeRefs['kh-provider'])} />
          <span className="text-[10px] text-muted-foreground">provider.rs</span>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Provider Trait 추상화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Provider trait: 모든 Ethereum 통신의 단일 추상화

#[async_trait]
pub trait Provider: Send + Sync {
    // 기본 query
    async fn get_balance(&self, addr: Address, block: BlockId) -> Result<U256>;
    async fn get_nonce(&self, addr: Address, block: BlockId) -> Result<u64>;
    async fn get_code(&self, addr: Address, block: BlockId) -> Result<Bytes>;

    // Call execution
    async fn call(&self, tx: TxRequest, block: BlockId) -> Result<Bytes>;
    async fn estimate_gas(&self, tx: TxRequest) -> Result<U256>;

    // Transaction
    async fn send_raw_transaction(&self, raw: Bytes) -> Result<TxHash>;
    async fn get_transaction(&self, hash: TxHash) -> Result<Option<Tx>>;
    async fn get_transaction_receipt(&self, hash: TxHash) -> Result<Option<Receipt>>;

    // Block data
    async fn get_block(&self, id: BlockId) -> Result<Option<Block>>;
    async fn get_block_number(&self) -> Result<u64>;
}

// Composition 패턴
pub struct KohakuProvider {
    helios: HeliosClient,        // Trust-minimized verification
    oram: ORAMProxy,             // Query privacy
    dandelion: DandelionRouter,  // TX privacy
    fallback: Box<dyn Provider>, // backup (일반 Infura)
}

impl Provider for KohakuProvider {
    async fn get_balance(&self, addr: Address, block: BlockId) -> Result<U256> {
        // ORAM으로 query 익명화
        let response = self.oram.query(QueryType::Balance, addr, block).await?;

        // Helios로 merkle proof 검증
        self.helios.verify_balance(addr, block, &response)?;

        Ok(response.balance)
    }

    async fn send_raw_transaction(&self, raw: Bytes) -> Result<TxHash> {
        // Dandelion++로 익명 전파
        self.dandelion.submit(raw).await
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Mock Provider (testing)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 테스트용 MockProvider
pub struct MockProvider {
    balances: Arc<RwLock<HashMap<Address, U256>>>,
    txs: Arc<RwLock<Vec<Bytes>>>,
}

impl Provider for MockProvider {
    async fn get_balance(&self, addr: Address, _: BlockId) -> Result<U256> {
        Ok(self.balances.read().get(&addr).copied().unwrap_or_default())
    }

    async fn send_raw_transaction(&self, raw: Bytes) -> Result<TxHash> {
        let hash = keccak256(&raw);
        self.txs.write().push(raw);
        Ok(hash.into())
    }
}

// 단위 테스트
#[tokio::test]
async fn test_wallet_balance() {
    let mock = MockProvider::new();
    mock.set_balance(addr, U256::from(1000));

    let wallet = Wallet::new(Box::new(mock));
    let balance = wallet.balance_of(addr).await.unwrap();
    assert_eq!(balance, U256::from(1000));
}

// Advantages
// ✓ 네트워크 무관 테스트
// ✓ 빠른 CI/CD
// ✓ Determinism (reproducible)
// ✓ 에러 시뮬레이션 쉬움`}</pre>

      </div>
    </section>
  );
}
