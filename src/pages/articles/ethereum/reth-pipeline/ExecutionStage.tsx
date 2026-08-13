import { useState } from "react";
import { motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ExecutionDetailViz from "./viz/ExecutionDetailViz";
import { EXECUTION_INVARIANTS } from "./ExecutionStageData";

export default function ExecutionStage({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="execution-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ExecutionStage: canonical block을 상태 전이로 바꾸기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          헤더·바디·sender가 준비되어도 블록의 유효성은 아직 완성되지 않는다.
          이전 state 위에서 transaction을 순서대로 실행해 receipts, requests와
          다음 state를 만들어야 한다.
        </p>
        <h3>문제</h3>
        <p>
          한 블록 안의 transaction은 앞선 transaction이 만든
          nonce·balance·storage를 읽을 수 있으므로 임의로 병렬 실행할 수 없다.
          timestamp, base fee, withdrawals와 활성 opcode도 fork에 따라 달라진다.
        </p>
        <h3>아이디어</h3>
        <p>
          provider가 고정한 state view 위에 in-memory overlay를 두고 canonical
          순서대로 실행한다. 블록 사이의 변경은 overlay에 이어 붙이고, 제한에
          도달하면 결과와 checkpoint를 원자적으로 영속화한다.
        </p>
        <h3>구현 흐름</h3>
        <ol>
          <li>
            선행 Stage checkpoint 안에서 header, body, recovered sender를
            결합한다.
          </li>
          <li>
            ChainSpec으로 해당 block의 fork-aware EVM environment를 만든다.
          </li>
          <li>
            transaction을 block order대로 실행하고 receipts, logs, requests와
            state changes를 수집한다.
          </li>
          <li>
            gas used, receipts root 등 해당 경계에서 확인할 commitments를
            검증한다.
          </li>
          <li>
            provider를 통해 결과와 checkpoint를 기록하고, 실패하면 부분 결과를
            canonical state로 노출하지 않는다.
          </li>
        </ol>
        <p>
          BundleState는 overlay의 개념을 설명하는 데 유용하지만 내부 field나
          commit 크기를 영구 불변 API로 보면 안 된다. Storage V1/V2의 physical
          route도 provider 아래에서 달라진다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <ExecutionDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">실행 불변조건</h3>
      <div className="not-prose mb-6 grid gap-3 sm:grid-cols-2">
        {EXECUTION_INVARIANTS.map((item, index) => (
          <motion.button
            key={item.aspect}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.65 }}
            className="cursor-pointer rounded-xl border p-4 text-left"
          >
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {item.aspect}
            </p>
            {active === index && (
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                {item.detail}
              </p>
            )}
          </motion.button>
        ))}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("execution-stage", codeRefs["execution-stage"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
