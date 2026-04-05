import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import NodeBuilderViz from './viz/NodeBuilderViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { DESIGN_CHOICES } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(c => c.id === selected);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CLI 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 modular builder 패턴인가?</strong>{' '}
          Geth는 모놀리식 구조다. EVM, 멤풀, 합의, 네트워크가 하나의 바이너리에 하드코딩되어 있다.<br />
          새 L2를 지원하려면 전체를 포크해야 하고, 업스트림 변경을 병합하는 비용이 크다.
        </p>
        <p className="leading-7">
          Reth는 이 문제를 <strong>NodeBuilder 패턴</strong>으로 해결한다.<br />
          4개 핵심 컴포넌트(Pool, Evm, Consensus, Network)를 Rust trait으로 추상화하고, 빌더가 제네릭으로 주입받는다.<br />
          기본 메인넷 구현체가 제공되지만, L2나 커스텀 체인에서 필요한 trait만 교체할 수 있다.{' '}
          <CodeViewButton onClick={() => open('builder-node')} />
        </p>
        <p className="leading-7">
          op-reth가 대표적 사례다. OP Stack L2 노드를 구현할 때 Evm과 PayloadBuilder만 교체하고, 나머지는 Reth 기본값을 그대로 재사용한다.<br />
          Geth 포크 대비 유지보수 범위가 극적으로 줄어든다.{' '}
          <CodeViewButton onClick={() => open('cli-main')} />
        </p>

        {/* ── CLI 진입점 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CLI 진입점 — clap 기반 서브커맨드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// reth 바이너리의 main 함수
#[tokio::main]
async fn main() -> Result<()> {
    // 1. Clap으로 CLI 파싱
    let cli = Cli::parse();

    // 2. 서브커맨드 디스패치
    match cli.command {
        Commands::Node(args) => node_command(args).await,
        Commands::Init(args) => init_command(args).await,
        Commands::Db(args) => db_command(args).await,
        Commands::Stage(args) => stage_command(args).await,
        Commands::P2p(args) => p2p_command(args).await,
        Commands::Recover(args) => recover_command(args).await,
        Commands::Debug(args) => debug_command(args).await,
    }
}

// 주요 서브커맨드:
// - reth node: 노드 실행
// - reth init: genesis 초기화
// - reth db: DB 조회/디버깅
// - reth stage: 특정 Stage 수동 실행
// - reth p2p: 네트워크 디버깅
// - reth recover: 크래시 복구
// - reth debug: 내부 상태 검사

// Clap의 장점:
// - 자동 --help 생성
// - 타입 안전 인자 파싱
// - 환경변수 / 설정파일 결합
// - bash/zsh completion 생성`}
        </pre>
        <p className="leading-7">
          <strong>Clap</strong>이 Rust CLI의 표준 — 선언적 인자 정의로 자동 파싱.<br />
          7개 서브커맨드로 노드 운영 전 기능 제공 — 실행부터 복구/디버깅까지.<br />
          <code>--help</code>, completion 자동 생성 → 사용자 경험 향상.
        </p>

        {/* ── Builder 패턴 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">NodeBuilder 패턴 — 제네릭 컴포넌트 조립</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// NodeBuilder의 type state 패턴
pub struct NodeBuilder<State = InitialState> {
    config: NodeConfig,
    state: State,
}

// 단계별 state transitions:
// InitialState → WithTypes → WithComponents → Ready

impl NodeBuilder<InitialState> {
    pub fn new(config: NodeConfig) -> Self { ... }

    pub fn with_types<Types: NodeTypes>(self) -> NodeBuilder<WithTypes<Types>> {
        // 체인 타입 고정 (EthereumNode, OptimismNode 등)
    }
}

impl<Types: NodeTypes> NodeBuilder<WithTypes<Types>> {
    pub fn with_components<C: NodeComponents>(self, components: C)
        -> NodeBuilder<WithComponents<Types, C>> {
        // 컴포넌트 주입 (Pool, Evm, Consensus, Network)
    }
}

impl<Types, Components> NodeBuilder<WithComponents<Types, Components>> {
    pub async fn launch(self) -> NodeHandle { ... }
}

// 사용 예:
let handle = NodeBuilder::new(config)
    .with_types::<EthereumNode>()           // 메인넷 타입
    .with_components(EthComponents::default()) // 기본 컴포넌트
    .launch()                                // 실행
    .await?;

// 컴파일 타임 검증:
// - with_types() 전에 with_components() 호출 불가
// - launch() 전에 모든 필수 단계 완료 강제

// type state 패턴의 장점:
// 1. 잘못된 초기화 순서 → 컴파일 에러
// 2. 필수 필드 누락 → 컴파일 에러
// 3. IDE 자동완성으로 다음 단계 안내`}
        </pre>
        <p className="leading-7">
          <strong>Type state 패턴</strong>으로 빌더의 상태를 타입 시스템에 인코딩.<br />
          잘못된 호출 순서를 컴파일 타임에 차단 → runtime panic 없음.<br />
          IDE가 다음 단계 메서드를 자동 완성 → 사용자 가이던스 제공.
        </p>

        {/* ── L2 확장 예시 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">L2 확장 — op-reth 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// op-reth: Optimism L2 노드
// Reth를 라이브러리로 사용

use reth::cli::Cli;
use reth_optimism::{OpNode, OpEvm, OpPayloadBuilder};

#[tokio::main]
async fn main() -> Result<()> {
    // Reth의 CLI 재사용
    Cli::<OpNetworkArgs>::parse().run(|builder, args| async move {
        let handle = builder
            .with_types::<OpNode>()  // OP Stack 노드 타입
            .with_components(
                OpNode::components_builder()
                    .payload_builder(OpPayloadBuilder::new(args))
            )
            .with_add_ons(OpAddOns::default())
            .launch()
            .await?;
        handle.wait_for_node_exit().await
    }).await
}

// 교체된 것:
// 1. NodeTypes: EthereumNode → OpNode
//    (OP 헤더 타입, OP fork config 등)
// 2. ExecutionStrategy: EthStrategy → OpStrategy
//    (deposit TX 처리, L1 attributes)
// 3. PayloadBuilder: EthPayloadBuilder → OpPayloadBuilder
//    (L1 block info 주입)

// 재사용한 것:
// - Pipeline/Stages (전부)
// - Provider/DB (전부)
// - Network (eth/68 그대로)
// - RPC (eth namespace 그대로 + op namespace 추가)
// - txpool (validation만 커스터마이즈)

// 결과:
// - op-reth 코드량: ~10K LOC
// - Reth 전체 재사용: ~300K LOC
// - 재사용률 ~97%`}
        </pre>
        <p className="leading-7">
          op-reth가 <strong>Reth 재사용의 증명</strong>.<br />
          OP 고유 로직(deposit, L1 attributes) 10K LOC만 작성 → 나머지 Reth 재사용.<br />
          Geth 포크(50K+ LOC 수정 필요) 대비 유지보수 비용 극단적 감소.
        </p>
      </div>

      {/* Interactive design choice cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(c => (
          <button key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === c.id ? c.color : 'var(--color-border)',
              background: selected === c.id ? `${c.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{c.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed mb-3">
              Geth와 비교: {sel.why}
            </p>
            {sel.codeRefKeys && (
              <div className="flex flex-wrap gap-2">
                {sel.codeRefKeys.map(k => (
                  <CodeViewButton key={k} onClick={() => open(k)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6">
        <NodeBuilderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
