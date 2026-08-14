import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import RPCFlowViz from "./viz/RPCFlowViz";
import { RPC_LAYERS } from "./OverviewData";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(RPC_LAYERS[0].id);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        RPC: transport와 protocol contract 분리하기
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Reth는 user-facing JSON-RPC namespaces와 consensus client용
          authenticated Engine API를 제공합니다. 둘 다 JSON-RPC envelope를
          사용하지만 caller, exposure와 protocol semantics는 다릅니다.
        </p>
        <h3>문제</h3>
        <p>
          Method implementation에 HTTP/WS, authentication, CORS, request size와
          timeout을 섞으면 transport를 추가하거나 policy를 바꿀 때 비즈니스
          로직까지 수정해야 합니다. 반대로 모든 endpoint를 같은 public boundary로
          열면 Engine API가 노출될 수 있습니다.
        </p>
        <h3>아이디어</h3>
        <p>
          Transport listener와 middleware가 connection policy를 담당하고, typed
          RPC module이 method·params·result contract를 정의합니다. Handler는
          provider, txpool, EVM과 payload service를 호출하며 protocol error로
          결과를 변환합니다.
        </p>
        <p>
          Reth의 일반 HTTP/WS RPC는 명시적으로 활성화해야 하며 address, port와
          namespaces를 설정할 수 있습니다. Engine API는 기본적으로 localhost:8551을
          사용하지만 <code>--authrpc.addr</code>와 <code>--authrpc.port</code>로
          바꿀 수 있으므로 고정 포트로 표현하지 않습니다.
        </p>
        <p>
          고정 예시는 한 사용자가 <code>eth_getBalance(Alice, latest)</code>를
          호출하고 동시에 consensus client가 <code>engine_newPayloadV4</code>를
          보내는 상황입니다. 전자는 public namespace policy와 pinned provider
          view를 거치지만, 후자는 별도 listener에서 JWT·method version을 먼저
          검사합니다. 같은 JSON 모양이라는 이유로 auth·rate budget·error
          semantics를 공유하면 안 됩니다.
        </p>
      </div>
      <ContentBoundary article="reth-rpc" />
      <div className="not-prose mb-8">
        <RPCFlowViz />
      </div>
      <div id="paper-execution-api-spec" className="mt-8 scroll-mt-24">
        <CitationBlock citeKey={1} source="Ethereum Execution APIs @ 742d45db" href="https://github.com/ethereum/execution-apis/tree/742d45db810b31265c8d3c075af324953330d1ed">
          <p>Public JSON-RPC와 versioned Engine methods의 parameter·result·error contract는 이 execution-apis snapshot에 귀속합니다. 노드별 exposure·quota policy까지 protocol 표준으로 확대하지 않습니다.</p>
        </CitationBlock>
      </div>
      <div id="paper-reth-rpc-source" className="scroll-mt-24">
        <CitationBlock citeKey={2} type="code" source="Reth RPC source snapshot @ 4cf0face" href="https://github.com/paradigmxyz/reth/tree/4cf0facecda7b4d474c739acef1c0fc2c69a122c/crates/rpc">
          <p>Module wiring·middleware·provider integration은 이 SHA의 구현 사실입니다. Candidate는 request/error/view/auth failure parity 뒤에만 성능을 비교합니다.</p>
        </CitationBlock>
      </div>
      <h3 className="mb-3 text-lg font-semibold">Layer별 책임</h3>
      <div className="not-prose mb-6 space-y-2">
        {RPC_LAYERS.map((item) => {
          const open = active === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              animate={{ opacity: open ? 1 : 0.6 }}
              className="block w-full cursor-pointer rounded-xl border p-4 text-left"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.label}
                <span className="ml-2 text-xs font-normal text-foreground/45">
                  {item.role}
                </span>
              </p>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 space-y-1 text-sm leading-6 text-foreground/70"
                  >
                    <p>{item.details}</p>
                    <p className="text-foreground/55">{item.why}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
