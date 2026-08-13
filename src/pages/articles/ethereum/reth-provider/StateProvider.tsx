import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CodeViewButton } from "@/components/code";
import StateProviderViz from "./viz/StateProviderViz";
import { codeRefs } from "./codeRefs";
import { IMPLEMENTORS, TRAIT_METHODS } from "./StateProviderData";
import type { CodeRef } from "@/components/code/types";

export default function StateProvider({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="state-provider" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        StateProvider는 state view의 계약
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          StateProvider의 핵심은 메서드 수가 세 개라는 점이 아니라 모든 조회가
          같은 시점의 state view를 본다는 점입니다. account를 latest에서 읽고
          storage를 다른 transaction snapshot에서 읽으면 조합된 결과가 실제 어느
          block에도 존재하지 않을 수 있습니다.
        </p>
        <p className="leading-7">
          Provider factory는 latest, historical 또는 in-memory overlay 문맥을
          고정하고 그 수명 안에서 필요한 capability를 제공합니다. revm adapter는
          이 contract를 실행 엔진의 database interface로 변환하며 physical
          MDBX·RocksDB·static-file 경로를 알 필요가 없습니다.{" "}
          <CodeViewButton
            onClick={() =>
              onCodeRef("provider-trait", codeRefs["provider-trait"])
            }
          />
        </p>
      </div>

      <div className="not-prose mb-8">
        <StateProviderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <h3 className="text-lg font-semibold mb-3">조회 capability</h3>
      <div className="not-prose space-y-2 mb-8">
        {TRAIT_METHODS.map((method, index) => (
          <div
            key={method.name}
            className="overflow-hidden rounded-xl border border-border/60"
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              className="flex w-full cursor-pointer flex-wrap items-center gap-2 px-4 py-3 text-left"
            >
              <code className="text-sm font-semibold text-indigo-400">
                {method.name}
              </code>
              <span className="text-xs text-foreground/45">
                → {method.returns}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3 text-sm leading-6 text-foreground/70"
                >
                  {method.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">같은 trait, 다른 시점</h3>
      <div className="not-prose grid grid-cols-2 gap-2 mb-8">
        {IMPLEMENTORS.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-border/60 p-3"
          >
            <p className="text-sm font-semibold" style={{ color: item.color }}>
              {item.name}
            </p>
            <p className="mt-1 text-xs text-foreground/55">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
