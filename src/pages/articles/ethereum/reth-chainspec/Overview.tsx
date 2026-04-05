import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ChainSpecViz from './viz/ChainSpecViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CHAINSPEC_FIELDS } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = CHAINSPEC_FIELDS.find(f => f.id === selected);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainSpec 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 ChainSpec이 필요한가?</strong>{' '}
          이더리움 노드는 "어떤 체인을 실행할 것인가"를 알아야 한다.<br />
          하드포크 활성화 조건, 제네시스 상태, 합의 매개변수가 모두 여기에 정의된다.<br />
          이 정보가 틀리면 피어와 합의가 불가능하다.{' '}
          <CodeViewButton onClick={() => open('chainspec-struct')} />
        </p>
        <p className="leading-7">
          Geth는 <code>ChainConfig</code> struct에 하드포크별 <code>*big.Int</code> 필드를 추가한다.<br />
          새 하드포크마다 필드를 추가하고, nil 체크 로직을 갱신해야 한다.<br />
          Reth는 <code>BTreeMap&lt;Hardfork, ForkCondition&gt;</code>으로 관리하여 enum variant 하나만 추가하면 새 하드포크를 지원한다.{' '}
          <CodeViewButton onClick={() => open('fork-condition')} />
        </p>
        <p className="leading-7">
          <code>EthChainSpec</code> trait은 모든 체인 설정의 공통 인터페이스다.<br />
          메인넷, 테스트넷, L2 커스텀 체인이 모두 이 trait을 구현한다.<br />
          NodeBuilder가 제네릭으로 받으므로 어떤 체인이든 동일한 빌드 파이프라인을 사용한다.{' '}
          <CodeViewButton onClick={() => open('eth-chainspec-trait')} />
        </p>

        {/* ── ChainSpec 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainSpec 구조체 — 9개 핵심 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub struct ChainSpec<H = Header> {
    pub chain: Chain,                              // mainnet, sepolia, holesky 등 (chain_id 포함)
    pub genesis_header: SealedHeader<H>,           // 제네시스 블록 헤더 (해시 포함, immutable)
    pub genesis: Genesis,                          // genesis.json 파싱 결과 (alloc, extraData 등)
    pub paris_block_and_final_difficulty:          // The Merge(PoW→PoS) 전환 정보
        Option<(u64, U256)>,                       //   (블록 번호, 최종 누적 난이도)
    pub hardforks: ChainHardforks,                 // BTreeMap<Hardfork, ForkCondition>
    pub deposit_contract: Option<DepositContract>, // CL(beacon chain) deposit 컨트랙트
    pub base_fee_params: BaseFeeParamsKind,        // EIP-1559 base_fee 파라미터
    pub blob_params: BlobScheduleBlobParams,       // EIP-4844 blob 파라미터
    pub prune_delete_limit: usize,                 // 프루닝 배치 크기 (기본 1_750_000)
}

// H = Header 기본값 — 이더리움 표준 헤더
// 커스텀 체인(L2 OP Stack 등)은 H를 자체 헤더 타입으로 교체 가능`}
        </pre>
        <p className="leading-7">
          <code>chain</code> 필드의 <code>Chain</code> 타입이 <code>chain_id</code>를 감싼다.<br />
          메인넷=1, Sepolia=11155111, Holesky=17000 — EIP-155 서명 검증에 사용된다.<br />
          <code>paris_block_and_final_difficulty</code>는 PoS 전환의 정체성 — 블록 15,537,394에서 최종 누적 난이도 ~58.75 × 10<sup>21</sup>로 PoW 종료.
        </p>

        {/* ── ForkCondition ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ForkCondition — 3가지 활성화 조건</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub enum ForkCondition {
    Block(BlockNumber),            // Frontier~Istanbul: 블록 번호로 활성
    TTD {                          // The Merge: 누적 난이도로 활성
        total_difficulty: U256,    //   이 값 이상이면 PoS 전환
        fork_block: Option<BlockNumber>, // 사후 확인된 실제 블록
    },
    Timestamp(u64),                // Shanghai~: Unix 타임스탬프로 활성
    Never,                         // 비활성화 (L2 체인이 특정 포크 skip)
}

// 하드포크별 활성화 방식 변천:
// - Frontier(0) ~ Istanbul(9_069_000):    Block
// - Muir Glacier(9_200_000) ~ GrayGlacier: Block
// - Paris(The Merge):                     TTD → Block (사후)
// - Shanghai(1681338455):                 Timestamp ← 여기부터
// - Cancun(1710338135):                   Timestamp
// - Prague(예정):                         Timestamp`}
        </pre>
        <p className="leading-7">
          Shanghai 이후 Timestamp 활성화로 전환된 이유: PoS 환경에서 블록 생성 속도가 정확히 12초로 고정되므로, 타임스탬프가 블록 번호보다 예측 가능.<br />
          L2/테스트넷은 네트워크마다 블록 생성 시점이 다르므로 Timestamp가 더 이식성 있음.<br />
          <code>Never</code>는 L2가 특정 하드포크를 건너뛸 때 사용 — OP Stack은 일부 EIP를 의도적으로 skip.
        </p>

        {/* ── EthChainSpec trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EthChainSpec trait — 다형성 인터페이스</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait EthChainSpec: Send + Sync + Unpin + Debug {
    type Header: BlockHeader;

    fn chain(&self) -> Chain;
    fn chain_id(&self) -> u64 { self.chain().id() }
    fn base_fee_params_at_timestamp(&self, ts: u64) -> BaseFeeParams;
    fn genesis_hash(&self) -> B256;
    fn genesis_header(&self) -> &Self::Header;
    fn genesis(&self) -> &Genesis;
    fn bootnodes(&self) -> Option<Vec<NodeRecord>>;
}

// NodeBuilder는 EthChainSpec 제네릭으로 동작
pub fn build_node<C: EthChainSpec>(chain_spec: Arc<C>) -> Node {
    // 이 함수는 메인넷이든 OP Mainnet이든 Base든 동일하게 호출됨
    // chain_spec이 제공하는 값만 다름
    Node::new(chain_spec)
}`}
        </pre>
        <p className="leading-7">
          <code>type Header: BlockHeader</code> — 연관 타입(associated type)으로 헤더 타입을 파라미터화.<br />
          이더리움 메인넷은 <code>Header</code>(20 필드), Optimism은 <code>OpHeader</code>(extra fields) 사용.<br />
          NodeBuilder가 이 trait을 제네릭으로 받으므로, 체인별 분기 코드 없이 단일 빌드 파이프라인 공유.
        </p>

        {/* ── MAINNET 초기화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">MAINNET 정적 초기화 — LazyLock 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub static MAINNET: LazyLock<Arc<ChainSpec>> = LazyLock::new(|| {
    let genesis = serde_json::from_str(
        include_str!("../res/genesis/mainnet.json")  // 컴파일 타임 임베딩
    ).expect("Can't deserialize Mainnet genesis json");

    let hardforks = EthereumHardfork::mainnet().into();

    ChainSpec {
        chain: Chain::mainnet(),
        genesis_header: SealedHeader::new(
            make_genesis_header(&genesis, &hardforks),
            MAINNET_GENESIS_HASH,  // 0xd4e5...b3 (상수로 하드코딩)
        ),
        genesis,
        paris_block_and_final_difficulty: Some((
            15_537_394,             // The Merge 활성 블록
            U256::from(58_750_003_716_598_352_816_469u128),
        )),
        hardforks,
        deposit_contract: Some(MAINNET_DEPOSIT_CONTRACT),
        base_fee_params: BaseFeeParamsKind::Constant(BaseFeeParams::ethereum()),
        ..Default::default()
    }.into()
});`}
        </pre>
        <p className="leading-7">
          <code>LazyLock</code>은 첫 접근 시 1회만 초기화되는 정적 값 — Rust 1.80 안정화.<br />
          <code>include_str!()</code>는 컴파일 타임에 JSON 파일을 바이너리에 임베딩 — 런타임 파일 I/O 없음.<br />
          <code>Arc&lt;ChainSpec&gt;</code>으로 래핑 — 여러 컴포넌트(NetworkManager, Executor, RPC)가 동일 인스턴스를 공유.
        </p>
      </div>

      {/* Interactive ChainSpec field cards */}
      <h3 className="text-lg font-semibold mb-3">ChainSpec 핵심 필드</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {CHAINSPEC_FIELDS.map(f => (
          <button key={f.id}
            onClick={() => setSelected(selected === f.id ? null : f.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === f.id ? f.color : 'var(--color-border)',
              background: selected === f.id ? `${f.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-xs" style={{ color: f.color }}>{f.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{f.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-xs font-mono text-muted-foreground mb-2">{sel.type}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6">
        <ChainSpecViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: BTreeMap vs 필드 확장</p>
          <p className="mt-2">
            Geth의 ChainConfig는 매 하드포크마다 필드를 추가한다:<br />
            <code>BerlinBlock *big.Int, LondonBlock *big.Int, ShanghaiTime *uint64, ...</code><br />
            30여 개 필드가 나열되고, nil 체크가 곳곳에 분산되어 있다.
          </p>
          <p className="mt-2">
            Reth는 <code>BTreeMap&lt;Hardfork, ForkCondition&gt;</code>으로 통합:<br />
            1. <strong>새 포크 추가 = enum variant 1개</strong> — 구조체 변경 없음<br />
            2. <strong>정렬된 순회 보장</strong> — BTreeMap이 Hardfork 순서대로 iterate<br />
            3. <strong>ForkFilter 계산 간결</strong> — BTreeMap 순회만으로 EIP-2124 fork ID 생성<br />
            4. <strong>타입 안전</strong> — 활성화 조건 mismatch를 컴파일러가 잡음
          </p>
          <p className="mt-2">
            결론: 데이터 구조 선택이 코드 유지보수성을 결정.<br />
            "필드 추가" 스타일은 단기적으로 쉽지만, 장기적으로 분기 로직이 코드베이스에 퍼진다.
          </p>
        </div>
      </div>
    </section>
  );
}
