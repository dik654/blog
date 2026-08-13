import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComponentsViz from "./viz/ComponentsViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { TRAIT_DETAILS } from "./ComponentsData";

export default function Components({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeComponents trait</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>왜 trait인가?</strong> 노드의 4개 핵심 기능을 각각 독립된
          trait으로 정의합니다. 각 역할은 associated type으로 연결되므로 chain implementation은 필요한 component만 바꾸면서도 나머지 Reth 기본 구현을 그대로 재사용할 수 있습니다. 이것이 “교체 가능한 component”를 type system으로 표현하는 핵심입니다.{" "}
          <CodeViewButton onClick={() => open("node-components")} />
        </p>
        <p>
          L2를 구현할 때 이 경계의 장점이 드러납니다. 예를 들어 op-reth는 <code>Evm</code> component를 <code>OpEvmConfig</code>로 바꿔 deposit transaction과 Optimism-specific environment를 처리하면서, 호환되는 pool·network component는 기본 구현을 재사용할 수 있습니다.{" "}
          <CodeViewButton onClick={() => open("components-struct")} />
        </p>

        {/* ── ConfigureEvm trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ConfigureEvm trait — EVM 환경 구성
        </h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2">
              <code>ConfigureEvm</code> trait — 3개 핵심 메서드
            </p>
            <div className="space-y-2">
              {[
                {
                  method:
                    "fill_block_env(&self, block_env, header, after_merge)",
                  desc: "BlockEnv 설정 (block-level context)",
                },
                {
                  method: "fill_tx_env(&self, tx_env, tx, sender)",
                  desc: "TxEnv 설정 (tx-level context)",
                },
                {
                  method: "evm<DB: Database>(&self, db) -> Evm",
                  desc: "revm Evm 인스턴스 생성",
                },
              ].map((m) => (
                <div
                  key={m.method}
                  className="rounded border border-border/40 px-3 py-2"
                >
                  <code className="text-xs">{m.method}</code>
                  <p className="text-xs text-foreground/60 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1">
                <code>EthEvmConfig</code>
              </p>
              <p className="text-xs text-foreground/70">
                <code>chain_spec: Arc&lt;ChainSpec&gt;</code>
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                표준 이더리움 EVM 환경
              </p>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1">
                <code>OpEvmConfig</code>
              </p>
              <p className="text-xs text-foreground/70">
                <code>chain_spec: Arc&lt;OpChainSpec&gt;</code>,{" "}
                <code>l1_block_info: Arc&lt;L1BlockInfo&gt;</code>
              </p>
              <p className="text-xs text-foreground/50 mt-1">
                OP 확장: deposit TX가 아닌 경우 <code>TxEnv::optimism</code>에
                L1 fee 메타데이터 (<code>fee_overhead</code>,{" "}
                <code>fee_scalar</code>, <code>base_fee</code>) 주입
              </p>
            </div>
          </div>
        </div>
        <p>
          <code>ConfigureEvm</code> trait이{" "}
          <strong>EVM 실행 환경을 추상화</strong>합니다. 각 chain은 자체 <code>fill_tx_env</code> 구현으로 transaction environment에 chain-specific context를 넣습니다. Optimism 구현은 L1 fee 계산에 필요한 정보를 Optimism transaction environment로 전달하고 revm의 해당 handler가 이를 사용합니다.
        </p>

        {/* ── Consensus trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Consensus trait — 블록 검증 규칙
        </h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2">
              <code>Consensus</code> trait — 4단계 검증
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  method: "validate_header",
                  desc: "단일 헤더 검증 (부모 없이)",
                },
                {
                  method: "validate_header_against_parent",
                  desc: "헤더 + 부모 비교",
                },
                {
                  method: "validate_block",
                  desc: "블록 전체 (헤더 + 바디 정합)",
                },
                {
                  method: "validate_block_post_execution",
                  desc: "gas_used, receipts_root 등",
                },
              ].map((m) => (
                <div
                  key={m.method}
                  className="rounded border border-border/40 px-3 py-2"
                >
                  <code className="text-[11px] font-bold">{m.method}</code>
                  <p className="text-[11px] text-foreground/60 mt-0.5">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1">
                <code>EthBeaconConsensus</code>
              </p>
              <p className="text-xs text-foreground/50 mb-1">메인넷 PoS</p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>
                  PoW 필드 검증 (<code>difficulty=0</code>)
                </li>
                <li>
                  <code>gas_limit</code> 변동 제한 (1/1024)
                </li>
                <li>base_fee 계산 검증 (EIP-1559)</li>
                <li>
                  <code>extra_data</code> 32 bytes 제한
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1">
                <code>OpConsensus</code>
              </p>
              <p className="text-xs text-foreground/50 mb-1">
                Optimism (시퀀서)
              </p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>시퀀서 서명 검증</li>
                <li>deposit TX 우선 처리 확인</li>
                <li>L1 attributes TX 존재 확인</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-1">
                <code>AutoSealConsensus</code>
              </p>
              <p className="text-xs text-foreground/50 mb-1">테스트넷</p>
              <p className="text-xs text-foreground/70">자동 블록 생성</p>
            </div>
          </div>
        </div>
        <p>
          <code>Consensus</code> trait이{" "}
          <strong>chain별 block 검증 규칙을 캡슐화</strong>합니다. Mainnet과 rollup은 서로 다른 header·receipt·post-execution rule을 구현하지만 node builder는 공통 <code>validate_*</code> interface를 통해 이를 호출합니다.
        </p>

        {/* ── Pool trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          TransactionPool & Network — 나머지 컴포넌트
        </h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2">
                <code>TransactionPool</code>
              </p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>
                  <code>type Transaction: PoolTransaction</code>
                </li>
                <li>
                  <code>add_transaction(origin, tx) → TxHash</code>
                </li>
                <li>
                  <code>best_transactions() → Iterator</code>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2">
                <code>NetworkHandle</code>
              </p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>
                  <code>peer_count() → usize</code>
                </li>
                <li>
                  <code>connect_peer(addr)</code>
                </li>
                <li>
                  <code>broadcast_transaction(tx)</code>
                </li>
                <li>
                  <code>broadcast_block(block)</code>
                </li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-2">의존 관계</p>
            <div className="flex flex-col items-center gap-1 text-sm">
              <span className="font-mono text-xs px-3 py-1 rounded bg-muted">
                <code>NodeTypes</code> — 체인 정의 (mainnet / OP)
              </span>
              <span className="text-foreground/40">↓</span>
              <span className="font-mono text-xs px-3 py-1 rounded bg-muted">
                <code>NodeComponents</code> — Pool + Evm + Consensus + Network
              </span>
              <span className="text-foreground/40">↓</span>
              <span className="font-mono text-xs px-3 py-1 rounded bg-muted">
                <code>NodeBuilder</code> — 조립 + 실행
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-3">
              각 trait 독립적: Pool 교체 시 Evm/Consensus/Network 영향 없음.
              테스트 시 <code>MockNetwork</code>, <code>NoopPool</code> 사용
              가능.
            </p>
          </div>
        </div>
        <p>
          네 component trait은 독립적인 extension point를 제공하지만 실제 조합은 associated type constraint를 만족해야 합니다. 필요한 역할만 custom implementation으로 바꾸고 호환되는 기본 component를 재사용할 수 있다는 점이 Reth를 execution client이면서 node-building library로 사용할 수 있게 합니다.
        </p>
      </div>

      {/* Interactive trait detail cards */}
      <h3 className="text-lg font-semibold mb-3">4개 핵심 trait</h3>
      <div className="not-prose space-y-2 mb-6">
        {TRAIT_DETAILS.map((t) => (
          <motion.div
            key={t.id}
            onClick={() => setExpanded(expanded === t.id ? null : t.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === t.id ? t.color : "var(--color-border)",
              background: expanded === t.id ? `${t.color}08` : undefined,
            }}
            animate={{ opacity: expanded === t.id ? 1 : 0.7 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: t.color }}
              />
              <span className="font-mono font-bold text-sm">{t.assocType}</span>
              <span className="text-xs text-muted-foreground">: {t.bound}</span>
            </div>
            <AnimatePresence>
              {expanded === t.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{t.role}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">기본값:</span>{" "}
                      {t.defaultImpl}
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
