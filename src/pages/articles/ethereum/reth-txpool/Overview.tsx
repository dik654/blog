import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import TxPoolViz from "./viz/TxPoolViz";
import { DESIGN_CHOICES } from "./OverviewData";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [selected, setSelected] = useState(DESIGN_CHOICES[0].id);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Txpool: 아직 실행되지 않은 의존성 그래프
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Transaction pool은 block 포함 전의 signed transactions를 보관한다.
          같은 sender의 transaction은 nonce 순서에 묶이고 fee eligibility는 다음
          block의 base fee에 따라 바뀐다.
        </p>
        <h3>문제</h3>
        <p>
          현재 실행 가능한 transaction만 남기면 nonce gap이나 일시적인 fee
          부족을 복구할 수 없다. 반대로 모든 입력을 보관하면 invalid signature,
          잔액 부족, replacement spam과 blob sidecar resource가 pool을 고갈시킬
          수 있다.
        </p>
        <h3>아이디어</h3>
        <p>
          validation 결과와 sender state로 transaction의 조건을 표현하고, 실행
          가능성에 따라 logical subpool로 분류한다. canonical head가 바뀌면
          nonce, balance, base fee와 mined/reorged transactions를 반영해 다시
          분류한다.
        </p>
        <h3>구현 경계</h3>
        <ul>
          <li>
            Validator는 transaction type·fork·state를 기준으로 reject와 accepted
            classification inputs를 만든다.
          </li>
          <li>
            Pool은 sender/nonce dependency, replacement와 configurable resource
            limits를 유지한다.
          </li>
          <li>
            Ordering은 <em>eligible candidates</em> 사이의 우선순위를 정하며
            nonce dependency를 무시하지 못한다.
          </li>
          <li>
            Payload builder는 iterator 결과를 실행하며 gas, blob gas와 block
            validity에 맞지 않는 후보를 건너뛴다.
          </li>
        </ul>
      </div>
      <div className="not-prose mb-8">
        <TxPoolViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">변화에 강한 설계 포인트</h3>
      <div className="not-prose mb-6 space-y-2">
        {DESIGN_CHOICES.map((item) => {
          const open = selected === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setSelected(item.id)}
              animate={{ opacity: open ? 1 : 0.6 }}
              className="block w-full cursor-pointer rounded-xl border p-4 text-left"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.title}
              </p>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 space-y-1 text-sm leading-6 text-foreground/70"
                  >
                    <p>
                      <strong>문제:</strong> {item.problem}
                    </p>
                    <p>
                      <strong>처리:</strong> {item.solution}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          서브풀 이름, 기본 개수·메모리 한도와 replacement bump는 설정과
          transaction type에 따라 달라질 수 있다. 글은 숫자를 복제하지 않고{" "}
          <strong>
            validation → dependency classification → repricing/reorg → builder
            consumption
          </strong>{" "}
          흐름을 기준으로 확장한다.
        </p>
      </div>
    </section>
  );
}
