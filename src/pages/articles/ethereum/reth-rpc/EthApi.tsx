import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { ETH_METHODS } from "./EthApiData";

export default function EthApi({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(ETH_METHODS[0].id);
  return (
    <section id="eth-api" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Eth API: block context와 availability를 먼저 고정하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          <code>eth_*</code> namespace에는 state 조회, EVM simulation,
          transaction submission과 range search가 함께 있다. 같은 JSON-RPC
          형태라도 필요한 backend와 비용 특성이 다르다.
        </p>
        <h3>문제</h3>
        <p>
          <code>latest</code>, 명시적 block number/hash, safe/finalized 같은
          selector는 서로 다른 state view를 가리킨다. Pruning 때문에 요청한
          historical state·receipts가 없을 수도 있고, pending view는 canonical
          state와 txpool overlay를 함께 요구할 수 있다.
        </p>
        <h3>아이디어와 구현</h3>
        <ol>
          <li>
            Params와 block selector를 decode하고 canonicality requirement를
            해석한다.
          </li>
          <li>
            Provider가 해당 block의 state·receipt availability를 확인해 일관된
            view를 고정한다.
          </li>
          <li>
            조회, EVM simulation, txpool submission 또는 indexed scan을 method별
            service에 위임한다.
          </li>
          <li>
            Missing/pruned state, revert, invalid transaction과 resource limit을
            구분한 RPC error/result를 반환한다.
          </li>
        </ol>
        <p>
          <code>eth_getLogs</code>는 bloom과 history indices로 후보를 줄일 수
          있지만 skip 비율은 filter와 데이터에 따라 달라진다.{" "}
          <code>eth_estimateGas</code>도 반복 simulation 전략을 사용할 수 있으나
          고정 호출 횟수·시간을 보장하지 않는다. Request/result limits는 node
          설정과 제공자 policy다.
        </p>
      </div>
      <h3 className="mb-3 text-lg font-semibold">대표 method와 backend 경계</h3>
      <div className="not-prose mb-6 space-y-2">
        {ETH_METHODS.map((item) => {
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
                {item.name}
                <span className="ml-2 text-xs font-normal text-foreground/45">
                  {item.category}
                </span>
              </p>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm leading-6 text-foreground/70"
                  >
                    <p>{item.desc}</p>
                    <p className="text-foreground/55">{item.flow}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("rpc-eth-api", codeRefs["rpc-eth-api"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
