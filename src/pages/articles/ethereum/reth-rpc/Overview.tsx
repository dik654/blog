import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import RPCFlowViz from "./viz/RPCFlowViz";
import { RPC_LAYERS } from "./OverviewData";

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
          authenticated Engine API를 제공한다. 둘 다 JSON-RPC envelope를 사용할
          수 있지만 caller, exposure와 protocol semantics가 다르다.
        </p>
        <h3>문제</h3>
        <p>
          Method implementation에 HTTP/WS, authentication, CORS, request size와
          timeout을 섞으면 transport를 추가하거나 policy를 바꿀 때 비즈니스
          로직까지 수정해야 한다. 반대로 모든 endpoint를 같은 public boundary로
          열면 Engine API가 노출될 수 있다.
        </p>
        <h3>아이디어</h3>
        <p>
          Transport listener와 middleware가 connection policy를 담당하고, typed
          RPC module이 method·params·result contract를 정의한다. Handler는
          provider, txpool, EVM과 payload service를 호출하며 protocol error로
          결과를 변환한다.
        </p>
        <p>
          Reth의 일반 HTTP/WS RPC는 명시적으로 활성화해야 하며 address, port와
          namespaces를 설정할 수 있다. Engine API는 기본적으로 localhost:8551을
          사용하지만 <code>--authrpc.addr</code>와 <code>--authrpc.port</code>로
          바꿀 수 있으므로 고정 포트로 표현하지 않는다.
        </p>
      </div>
      <div className="not-prose mb-8">
        <RPCFlowViz />
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
