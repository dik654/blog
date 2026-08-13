import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import CalcBaseFeeDetailViz from "./viz/CalcBaseFeeDetailViz";
import { ARITHMETIC_RULES, CALC_STEPS } from "./CalcBaseFeeData";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function CalcBaseFee({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <section id="calc-base-fee" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        calc_next_block_base_fee의 consensus rounding
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          계산은 parent gas limit을 elasticity로 나눈 target에서 시작합니다.
          사용량이 target과 같으면 유지하고, 초과·미달 편차에 parent base fee를
          곱한 뒤 target과 change denominator로 순서대로 나눕니다. increase
          branch만 integer truncation으로 변화가 사라지지 않도록 최소 1 wei를
          보장합니다.
        </p>
        <p className="leading-7">
          구현 언어나 heap allocation을 비교하는 것은 consensus 설명이 아닙니다.
          Reth에서 중요한 점은 중간 곱을 충분히 넓은 타입으로 수행하고,
          overflow·narrowing과 subtraction semantics를 명시하며, EIP에 정의된
          연산 순서를 payload building과 validation에서 공유하는 것입니다.
        </p>
      </div>

      <div className="not-prose mb-8">
        <CalcBaseFeeDetailViz />
      </div>

      <h3 className="text-lg font-semibold mb-3">세 계산 분기</h3>
      <div className="not-prose space-y-2 mb-8">
        {CALC_STEPS.map((item, index) => (
          <div
            key={item.condition}
            className="overflow-hidden rounded-xl border border-border/60"
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              className="w-full cursor-pointer px-4 py-3 text-left"
            >
              <code
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.condition}
              </code>
              <p className="mt-1 text-xs text-foreground/50">{item.formula}</p>
            </button>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3 text-sm leading-6 text-foreground/70"
                >
                  {item.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">구현 확인점</h3>
      <div className="not-prose space-y-2 mb-8">
        {ARITHMETIC_RULES.map((item, index) => (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-border/60"
          >
            <button
              type="button"
              onClick={() => setFaq(faq === index ? null : index)}
              className="w-full cursor-pointer px-4 py-3 text-left text-sm font-semibold"
            >
              {item.question}
            </button>
            <AnimatePresence initial={false}>
              {faq === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3 text-sm leading-6 text-foreground/70"
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("calc-base-fee", codeRefs["calc-base-fee"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled calculation snapshot
        </span>
      </div>
    </section>
  );
}
