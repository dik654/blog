import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BuilderDetailViz from "./viz/BuilderDetailViz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import { STATES } from "./NodeBuilderData";

export default function NodeBuilder({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [step, setStep] = useState(0);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="node-builder" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeBuilder 패턴</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>왜 typestate 패턴인가?</strong> 일반 빌더 패턴은 잘못된 순서로
          method를 호출해도 runtime에야 잘못을 발견할 수 있습니다. Reth는 각 build 단계를 별도 struct type으로 정의하여 순서 위반을{" "}
          <strong>compile time에 차단</strong>합니다.{" "}
          <CodeViewButton onClick={() => open("builder-node")} />
        </p>
        <p>
          예를 들어 <code>with_types()</code>로 node type을 정하기 전에 <code>launch()</code>를 호출하면 compile error가 발생합니다. 초기 <code>NodeBuilder</code>에는 그 method가 없고 필요한 component가 모두 연결된 <code>NodeBuilderWithComponents</code> 단계에서만 사용할 수 있기 때문입니다.{" "}
          <CodeViewButton onClick={() => open("builder-states")} />
        </p>

        {/* ── typestate 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Typestate 패턴 구현 — 단계별 struct
        </h3>
        <div className="not-prose my-4">
          <div className="space-y-2 mb-3">
            {[
              {
                name: "NodeBuilder",
                fields: ["config: NodeConfig", "database: Option<Database>"],
                methods: [
                  "new(config)",
                  "with_database(db)",
                  "with_types::<T>()",
                ],
                note: "launch() 없음",
              },
              {
                name: "NodeBuilderWithTypes<T>",
                fields: [
                  "config: NodeConfig",
                  "database: Database",
                  "types: PhantomData<T>",
                ],
                methods: ["with_components(c)"],
                note: "launch() 없음",
              },
              {
                name: "NodeBuilderWithComponents<T, C>",
                fields: [
                  "config: NodeConfig",
                  "database: Database",
                  "types: PhantomData<T>",
                  "components: C",
                ],
                methods: ["launch() → NodeHandle"],
                note: "오직 여기서만 launch() 가능",
              },
            ].map((s) => (
              <div
                key={s.name}
                className="rounded-lg border border-border/60 p-4"
              >
                <p className="font-mono font-bold text-sm mb-2">
                  <code>{s.name}</code>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground/50 mb-1">
                      필드
                    </p>
                    <ul className="text-xs space-y-0.5 text-foreground/70">
                      {s.fields.map((f) => (
                        <li key={f}>
                          <code>{f}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground/50 mb-1">
                      메서드
                    </p>
                    <ul className="text-xs space-y-0.5 text-foreground/70">
                      {s.methods.map((m) => (
                        <li key={m}>
                          <code>{m}</code>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {s.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-3">
            <p className="text-sm text-foreground/80">
              <code>NodeBuilder::new(config).launch()</code> → 컴파일 에러:{" "}
              <code>no method 'launch'</code>
            </p>
          </div>
        </div>
        <p>
          각 단계가 별도 struct type이므로 사용할 수 있는 method 자체가 현재 상태에 따라 달라집니다. Enum flag를 runtime에 검사하는 방식보다 잘못된 state를 표현하기 어렵고, <code>PhantomData</code>와 generic type parameter로 추적하는 정보는 runtime field나 branch를 추가하지 않습니다.
        </p>

        {/* ── NodeComponents trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          NodeComponents trait — 4개 핵심 컴포넌트
        </h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4 mb-3">
            <p className="font-semibold text-sm mb-2">
              <code>NodeComponents&lt;N: NodeTypes&gt;</code> — 5개 연관 타입
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: "Pool", bound: "TransactionPool" },
                { type: "Evm", bound: "ConfigureEvm" },
                { type: "Consensus", bound: "Consensus" },
                { type: "Network", bound: "NetworkHandle" },
                { type: "PayloadBuilder", bound: "PayloadBuilder" },
              ].map((t) => (
                <div
                  key={t.type}
                  className="rounded border border-border/40 px-3 py-2 text-center"
                >
                  <p className="font-mono text-xs font-bold">{t.type}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    <code>{t.bound}</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2">
                이더리움 메인넷 — <code>EthComponents</code>
              </p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>
                  <code>EthTransactionPool</code>
                </li>
                <li>
                  <code>EthEvmConfig</code>
                </li>
                <li>
                  <code>EthBeaconConsensus</code>
                </li>
                <li>
                  <code>NetworkHandle</code>
                </li>
                <li>
                  <code>EthereumPayloadBuilder</code>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm mb-2">
                OP Stack — <code>OpComponents</code>
              </p>
              <ul className="text-xs space-y-0.5 text-foreground/70">
                <li>
                  <code>OpTransactionPool</code> — deposit TX 거부
                </li>
                <li>
                  <code>OpEvmConfig</code> — L1 attributes 추가
                </li>
                <li>
                  <code>OpConsensus</code>
                </li>
                <li>
                  <code>NetworkHandle</code> — 동일
                </li>
                <li>
                  <code>OpPayloadBuilder</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <code>NodeComponents</code>는 pool, EVM, consensus, network와 payload builder를 associated type으로 묶은 node 구성의 청사진입니다. 기본 조합에서 필요한 component만 교체할 수 있으므로 custom chain이 전체 launch stack을 복제하지 않고도 세밀하게 확장할 수 있습니다.
        </p>

        {/* ── launch() 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          launch() — 노드 시작 흐름
        </h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm mb-3">
              <code>launch()</code> — 8단계 초기화 순서
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: "1", label: "DB 열기", detail: "self.database" },
                {
                  step: "2",
                  label: "Provider 생성",
                  detail: "ProviderFactory::new(db, chain_spec)",
                },
                {
                  step: "3",
                  label: "Network",
                  detail: "spawn_network() — 백그라운드",
                },
                { step: "4", label: "TxPool", detail: "create_pool(provider)" },
                {
                  step: "5",
                  label: "Pipeline",
                  detail: "Full Sync용 파이프라인 구성",
                },
                {
                  step: "6",
                  label: "BlockchainTree",
                  detail: "Live sync용 (provider + consensus + evm)",
                },
                {
                  step: "7",
                  label: "RPC 서버",
                  detail: "provider + pool + network 조합",
                },
                {
                  step: "8",
                  label: "Engine API",
                  detail: "CL 연결 (tree + pool + payload_builder)",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded border border-border/40 px-3 py-2"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {s.step}
                    </span>
                    <span className="text-xs font-semibold">{s.label}</span>
                  </div>
                  <p className="text-[11px] text-foreground/50">{s.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/60 mt-3">
              반환값 <code>NodeHandle</code> — 노드가 백그라운드에서 동작,{" "}
              <code>wait_for_node_exit()</code>로 종료 대기
            </p>
          </div>
        </div>
        <p>
          <code>launch()</code>가{" "}
          <strong>component dependency를 따라 service를 시작</strong>합니다. 구체적인 startup sequence는 Reth version과 launcher implementation에 따라 달라질 수 있지만, typestate를 통과한 builder만 launch할 수 있으므로 필요한 type과 component가 빠진 구성을 compile time에 막습니다.
        </p>
      </div>

      {/* Interactive typestate cards */}
      <h3 className="text-lg font-semibold mb-3">3단계 상태 전이</h3>
      <div className="not-prose space-y-2 mb-6">
        {STATES.map((s, i) => (
          <motion.div
            key={s.name}
            onClick={() => setStep(i)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: i === step ? s.color : "var(--color-border)",
              background: i === step ? `${s.color}08` : undefined,
            }}
            animate={{ opacity: i === step ? 1 : 0.6 }}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i === step ? "text-white" : "bg-muted text-muted-foreground"}`}
                style={{ background: i === step ? s.color : undefined }}
              >
                {i + 1}
              </span>
              <span className="font-mono font-bold text-sm">{s.name}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {s.generic}
              </span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 ml-10 space-y-1 text-sm">
                    <p className="text-foreground/80">{s.desc}</p>
                    <p className="text-emerald-600 dark:text-emerald-400">
                      {s.available}
                    </p>
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
