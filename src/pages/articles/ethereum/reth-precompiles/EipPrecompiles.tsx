import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { EIP_ITEMS, REGISTRY_DESIGN } from "./EipPrecompilesData";
import type { CodeRef } from "@/components/code/types";

export default function EipPrecompiles({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <section id="eip-precompiles" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Istanbul에서 Pectra까지 확장되는 연산 집합
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Precompile 확장은 주소를 하나 더 등록하는 작업으로 끝나지 않습니다. 새
          EIP는 input ABI, gas function, validation order, output과 error
          semantics를 함께 추가합니다. Reth의 실행 경로는 이 묶음을 활성 fork에
          맞춰 선택해야 합니다.
        </p>
        <p className="leading-7">
          Prague execution rules는 2025년 5월 Pectra mainnet activation 때
          적용됐습니다. 따라서 EIP-2537의 BLS12-381 연산을 “향후 예정”으로
          분리하지 않고 BLAKE2 F, KZG point evaluation과 같은 versioned registry
          흐름 안에서 다룹니다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">포크가 추가한 기능</h3>
      <div className="not-prose space-y-2 mb-8">
        {EIP_ITEMS.map((item, index) => (
          <button
            type="button"
            key={item.eip}
            onClick={() => setActive(index)}
            className={`block w-full cursor-pointer rounded-xl border p-4 text-left transition-colors ${active === index ? "border-indigo-500/50 bg-indigo-500/5" : "border-border"}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded px-2 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.eip}
              </span>
              <span className="text-sm font-semibold">{item.name}</span>
              <span className="ml-auto text-xs text-foreground/50">
                {item.fork} · {item.gas}
              </span>
            </div>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-xs text-foreground/55">
                    역할: {item.purpose}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-foreground/80">
                    {item.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">
        확장 가능한 registry의 기준
      </h3>
      <div className="not-prose space-y-2 mb-6">
        {REGISTRY_DESIGN.map((item, index) => (
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
          onClick={() =>
            onCodeRef("precompile-enum", codeRefs["precompile-enum"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled registry snapshot
        </span>
        <CodeViewButton
          onClick={() =>
            onCodeRef("cancun-registry", codeRefs["cancun-registry"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          Cancun delta snapshot
        </span>
      </div>
    </section>
  );
}
