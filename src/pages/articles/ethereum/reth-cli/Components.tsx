import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentsViz from './viz/ComponentsViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TRAIT_DETAILS } from './ComponentsData';

export default function Components({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeComponents trait</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 trait인가?</strong>{' '}
          노드의 4개 핵심 기능을 각각 독립된 trait으로 정의한다.<br />
          associated type으로 선언되므로, 하나를 교체해도 나머지에 영향을 주지 않는다.<br />
          이것이 Reth가 "교체 가능한 컴포넌트"를 실현하는 핵심 메커니즘이다.{' '}
          <CodeViewButton onClick={() => open('node-components')} />
        </p>
        <p className="leading-7">
          L2 커스터마이징 시 이 구조의 장점이 드러난다.<br />
          op-reth는 <code>Evm</code> trait만 <code>OpEvmConfig</code>로 교체하여 L1 deposit 트랜잭션과 L1Block 프리컴파일을 처리한다.<br />
          Pool, Consensus, Network는 메인넷 기본 impl을 그대로 쓴다.{' '}
          <CodeViewButton onClick={() => open('components-struct')} />
        </p>

        {/* ── ConfigureEvm trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ConfigureEvm trait — EVM 환경 구성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait ConfigureEvm: Send + Sync + Clone {
    type DefaultExternalContext<'a>;

    /// BlockEnv 설정 (block-level context)
    fn fill_block_env(
        &self,
        block_env: &mut BlockEnv,
        header: &Header,
        after_merge: bool,
    );

    /// TxEnv 설정 (tx-level context)
    fn fill_tx_env(
        &self,
        tx_env: &mut TxEnv,
        tx: &TransactionSigned,
        sender: Address,
    );

    /// revm Evm 인스턴스 생성
    fn evm<DB: Database>(&self, db: DB) -> Evm<'_, Self::DefaultExternalContext<'_>, DB>;
}

// 이더리움 구현체:
pub struct EthEvmConfig {
    chain_spec: Arc<ChainSpec>,
}

// OP 구현체:
pub struct OpEvmConfig {
    chain_spec: Arc<OpChainSpec>,
    // L1 block info 주입용
    l1_block_info: Arc<L1BlockInfo>,
}

impl ConfigureEvm for OpEvmConfig {
    fn fill_tx_env(&self, tx_env: &mut TxEnv, tx: &TxSigned, sender: Address) {
        // 기본 이더리움 설정
        fill_eth_tx_env(tx_env, tx, sender);

        // OP 확장: L1 fee 계산용 메타데이터
        if !tx.is_deposit() {
            tx_env.optimism = Some(OptimismFields {
                l1_fee_overhead: self.l1_block_info.fee_overhead,
                l1_fee_scalar: self.l1_block_info.fee_scalar,
                l1_base_fee: self.l1_block_info.base_fee,
            });
        }
    }
}`}
        </pre>
        <p className="leading-7">
          <code>ConfigureEvm</code> trait이 <strong>EVM 실행 환경을 추상화</strong>.<br />
          각 체인이 자체 <code>fill_tx_env</code> 구현 → EVM에 체인 특화 컨텍스트 주입.<br />
          OP는 L1 fee 정보를 <code>TxEnv::optimism</code>에 추가 → revm이 L1 비용 계산에 사용.
        </p>

        {/* ── Consensus trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Consensus trait — 블록 검증 규칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`pub trait Consensus: Debug + Send + Sync {
    /// 헤더 검증 (부모 없이, 단일 헤더)
    fn validate_header(&self, header: &SealedHeader) -> Result<(), ConsensusError>;

    /// 헤더와 부모 비교 검증
    fn validate_header_against_parent(
        &self,
        header: &SealedHeader,
        parent: &SealedHeader,
    ) -> Result<(), ConsensusError>;

    /// 블록 전체 검증 (헤더 + 바디 정합성)
    fn validate_block(&self, block: &SealedBlock) -> Result<(), ConsensusError>;

    /// Post-execution 검증 (gas_used, receipts_root 등)
    fn validate_block_post_execution(
        &self,
        block: &SealedBlock,
        receipts: &[Receipt],
        gas_used: u64,
    ) -> Result<(), ConsensusError>;
}

// 구현체:
// - EthBeaconConsensus: 이더리움 메인넷 (PoS)
// - OpConsensus: Optimism (단일 시퀀서, 단순 검증)
// - AutoSealConsensus: 테스트넷 (자동 블록 생성)

// EthBeaconConsensus 특징:
// - PoW 필드 검증 (mix_hash, nonce, difficulty=0)
// - gas_limit 변동 제한 (1/1024)
// - base_fee 계산 검증 (EIP-1559)
// - extra_data 크기 제한 (32 bytes)

// OpConsensus 특징:
// - 시퀀서 서명 검증
// - deposit TX 우선 처리 확인
// - L1 attributes TX 존재 확인`}
        </pre>
        <p className="leading-7">
          <code>Consensus</code> trait이 <strong>체인별 검증 규칙 캡슐화</strong>.<br />
          메인넷은 PoS 규칙, OP는 시퀀서 기반 규칙, 테스트넷은 자동 생성.<br />
          같은 <code>validate_*</code> API로 모든 체인 검증 통합.
        </p>

        {/* ── Pool trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TransactionPool & Network — 나머지 컴포넌트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TransactionPool: TX 풀 관리 (이미 reth-txpool 아티클에서 상세)
pub trait TransactionPool: Send + Sync {
    type Transaction: PoolTransaction;
    async fn add_transaction(&self, origin: TxOrigin, tx: Self::Transaction) -> Result<TxHash>;
    fn best_transactions(&self) -> Box<dyn Iterator<Item = Arc<Self::Transaction>>>;
    // ...
}

// NetworkHandle: P2P 네트워크 제어
pub trait NetworkHandle: Send + Sync + Clone {
    fn peer_count(&self) -> usize;
    fn connect_peer(&self, addr: NodeRecord);
    fn broadcast_transaction(&self, tx: TransactionSigned);
    fn broadcast_block(&self, block: Arc<Block>);
    // ...
}

// 4개 trait의 의존 관계:
// NodeTypes: 체인 정의 (mainnet / OP)
//     ↓
// NodeComponents:
//   - Pool (TX 관리)
//   - Evm (실행 환경)
//   - Consensus (검증 규칙)
//   - Network (P2P 통신)
//     ↓
// NodeBuilder (조립 + 실행)

// 각 trait은 독립적:
// - Pool을 교체해도 Evm/Consensus/Network 영향 없음
// - L2 구현 시 Evm만 교체, 나머지 재사용
// - 테스트 시 MockNetwork, NoopPool 사용`}
        </pre>
        <p className="leading-7">
          4개 trait이 <strong>독립적으로 교체 가능</strong>.<br />
          특정 trait만 커스텀 구현 → 나머지 Reth 기본 재사용.<br />
          이 모듈성이 Reth의 "EL 클라이언트 라이브러리" 포지셔닝 지원.
        </p>
      </div>

      {/* Interactive trait detail cards */}
      <h3 className="text-lg font-semibold mb-3">4개 핵심 trait</h3>
      <div className="not-prose space-y-2 mb-6">
        {TRAIT_DETAILS.map(t => (
          <motion.div key={t.id}
            onClick={() => setExpanded(expanded === t.id ? null : t.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === t.id ? t.color : 'var(--color-border)',
              background: expanded === t.id ? `${t.color}08` : undefined,
            }}
            animate={{ opacity: expanded === t.id ? 1 : 0.7 }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              <span className="font-mono font-bold text-sm">{t.assocType}</span>
              <span className="text-xs text-muted-foreground">: {t.bound}</span>
            </div>
            <AnimatePresence>
              {expanded === t.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{t.role}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">기본값:</span> {t.defaultImpl}
                    </p>
                    <p className="text-amber-600 dark:text-amber-400">
                      커스텀 예시: {t.customExample}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <ComponentsViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
