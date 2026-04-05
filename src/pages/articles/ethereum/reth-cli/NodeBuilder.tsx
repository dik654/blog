import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BuilderDetailViz from './viz/BuilderDetailViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { STATES } from './NodeBuilderData';

export default function NodeBuilder({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="node-builder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeBuilder 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 typestate 패턴인가?</strong>{' '}
          일반 빌더 패턴은 잘못된 순서로 메서드를 호출해도 런타임에야 발견된다.<br />
          Reth는 각 빌드 단계를 별도 struct로 정의하여, 순서 위반을 <strong>컴파일 타임에 차단</strong>한다.{' '}
          <CodeViewButton onClick={() => open('builder-node')} />
        </p>
        <p className="leading-7">
          <code>with_types()</code> 전에 <code>launch()</code>를 호출하면?<br />
          컴파일 에러가 발생한다. <code>NodeBuilder</code> struct에는 <code>launch()</code> 메서드가 존재하지 않기 때문이다.<br />
          오직 <code>NodeBuilderWithComponents</code>에서만 호출할 수 있다.{' '}
          <CodeViewButton onClick={() => open('builder-states')} />
        </p>

        {/* ── typestate 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Typestate 패턴 구현 — 단계별 struct</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 상태를 별도 struct으로 표현
pub struct NodeBuilder {
    config: NodeConfig,
    database: Option<Database>,
}

pub struct NodeBuilderWithTypes<Types: NodeTypes> {
    config: NodeConfig,
    database: Database,
    types: PhantomData<Types>,
}

pub struct NodeBuilderWithComponents<Types: NodeTypes, Components> {
    config: NodeConfig,
    database: Database,
    types: PhantomData<Types>,
    components: Components,
}

// 상태 전이 메서드는 각 struct에만 정의:
impl NodeBuilder {
    pub fn new(config: NodeConfig) -> Self { ... }

    pub fn with_database(mut self, db: Database) -> Self { ... }

    pub fn with_types<T: NodeTypes>(self) -> NodeBuilderWithTypes<T> {
        NodeBuilderWithTypes { ... }
    }
    // launch() 메서드는 여기 없음
}

impl<T: NodeTypes> NodeBuilderWithTypes<T> {
    pub fn with_components<C>(self, components: C)
        -> NodeBuilderWithComponents<T, C> { ... }
    // launch() 메서드는 여기 없음
}

impl<T: NodeTypes, C> NodeBuilderWithComponents<T, C> {
    pub async fn launch(self) -> NodeHandle { ... }
    // 오직 여기서만 launch() 호출 가능
}

// 잘못된 사용:
let builder = NodeBuilder::new(config);
builder.launch().await;  // ❌ compile error: no method 'launch'`}
        </pre>
        <p className="leading-7">
          각 단계가 <strong>별도 struct 타입</strong>이므로 메서드 존재 자체가 단계별로 제한.<br />
          builder state를 enum flag로 확인하는 런타임 패턴보다 안전.<br />
          <code>PhantomData</code>로 제네릭 타입 추적 — zero-cost.
        </p>

        {/* ── NodeComponents trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">NodeComponents trait — 4개 핵심 컴포넌트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// NodeComponents: 노드 동작에 필요한 모든 컴포넌트 집합
pub trait NodeComponents<N: NodeTypes> {
    type Pool: TransactionPool;
    type Evm: ConfigureEvm;
    type Consensus: Consensus;
    type Network: NetworkHandle;
    type PayloadBuilder: PayloadBuilder;

    fn pool(&self) -> &Self::Pool;
    fn evm_config(&self) -> &Self::Evm;
    fn consensus(&self) -> &Self::Consensus;
    fn network(&self) -> &Self::Network;
    fn payload_builder(&self) -> &Self::PayloadBuilder;
}

// 이더리움 메인넷 구현체
pub struct EthComponents {
    pool: EthTransactionPool,
    evm_config: EthEvmConfig,
    consensus: EthBeaconConsensus,
    network: NetworkHandle,
    payload_builder: EthereumPayloadBuilder,
}

// OP Stack 구현체
pub struct OpComponents {
    pool: OpTransactionPool,  // deposit TX 거부
    evm_config: OpEvmConfig,  // L1 attributes 추가
    consensus: OpConsensus,
    network: NetworkHandle,   // 동일
    payload_builder: OpPayloadBuilder,
}

// 컴포넌트 조합 자유:
// builder.with_components(EthComponents::default())    // 메인넷
// builder.with_components(OpComponents::default())     // OP Stack
// builder.with_components(CustomComponents { ... })    // 커스텀
// builder.with_components(                            // 부분 교체
//     EthComponents::default().with_pool(my_pool)
// )`}
        </pre>
        <p className="leading-7">
          <code>NodeComponents</code>가 <strong>노드 구성의 전체 청사진</strong>.<br />
          5개 연관 타입으로 Pool, Evm, Consensus, Network, PayloadBuilder 정의.<br />
          기본 구현 + 부분 교체 패턴으로 세밀한 커스터마이징.
        </p>

        {/* ── launch() 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">launch() — 노드 시작 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`impl<T: NodeTypes, C: NodeComponents<T>> NodeBuilderWithComponents<T, C> {
    pub async fn launch(self) -> Result<NodeHandle> {
        // 1. DB 열기 (이미 준비됨)
        let db = self.database;

        // 2. Provider 생성
        let provider = ProviderFactory::new(db, self.chain_spec.clone());

        // 3. 컴포넌트 초기화 순서:
        //    - Network 시작 (백그라운드)
        //    - TxPool 생성
        //    - Consensus 검증자 구성
        //    - PayloadBuilder 배치

        let network = spawn_network(&self.components.network, &provider).await?;
        let pool = create_pool(&self.components.pool, provider.clone()).await?;
        let consensus = Arc::new(self.components.consensus);

        // 4. Pipeline 구성 (Full Sync용)
        let pipeline = default_pipeline(provider.clone(), &consensus, &network);

        // 5. BlockchainTree (live sync용)
        let tree = BlockchainTree::new(
            provider.clone(),
            consensus.clone(),
            self.components.evm_config,
        );

        // 6. RPC 서버 시작
        let rpc = start_rpc_server(
            provider.clone(),
            pool.clone(),
            network.clone(),
            &self.config,
        ).await?;

        // 7. Engine API 서버 시작 (CL 연결)
        let engine = start_engine_api(
            tree.clone(),
            pool.clone(),
            self.components.payload_builder,
            &self.config,
        ).await?;

        // 8. NodeHandle 반환 (graceful shutdown 지원)
        Ok(NodeHandle { pipeline, tree, rpc, engine, network })
    }
}

// launch() 반환 후:
// - 노드가 백그라운드에서 완전 동작
// - handle.wait_for_node_exit()로 종료 신호 대기`}
        </pre>
        <p className="leading-7">
          <code>launch()</code>가 <strong>모든 컴포넌트를 올바른 순서로 시작</strong>.<br />
          Network → Pool → Pipeline → BlockchainTree → RPC → Engine 순서.<br />
          의존성 그래프를 그대로 반영 → 초기화 순서 오류 불가능.
        </p>
      </div>

      {/* Interactive typestate cards */}
      <h3 className="text-lg font-semibold mb-3">3단계 상태 전이</h3>
      <div className="not-prose space-y-2 mb-6">
        {STATES.map((s, i) => (
          <motion.div key={s.name}
            onClick={() => setStep(i)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: i === step ? s.color : 'var(--color-border)',
              background: i === step ? `${s.color}08` : undefined,
            }}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === step ? 'text-white' : 'bg-muted text-muted-foreground'}`}
                style={{ background: i === step ? s.color : undefined }}>{i + 1}</span>
              <span className="font-mono font-bold text-sm">{s.name}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">{s.generic}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-2 ml-10 space-y-1 text-sm">
                    <p className="text-foreground/80">{s.desc}</p>
                    <p className="text-emerald-600 dark:text-emerald-400">{s.available}</p>
                    <CodeViewButton onClick={() => open(s.codeKey)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <BuilderDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
