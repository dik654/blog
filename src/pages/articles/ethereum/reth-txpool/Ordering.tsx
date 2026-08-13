import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import OrderingDetailViz from "./viz/OrderingDetailViz";
import { ORDERING_IMPLS } from "./OrderingData";

export default function Ordering({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [expanded, setExpanded] = useState(ORDERING_IMPLS[0].name);
  return (
    <section id="ordering" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Ordering: eligible sender heads 사이의 선택
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Pool에 실행 가능한 transaction이 여러 개 있으면 builder는 block
          resource 안에서 후보를 선택해야 합니다. Dynamic-fee transaction의
          proposer 수익은 현재 base fee를 반영한 effective tip으로 계산됩니다.
        </p>
        <h3>문제</h3>
        <p>
          전역 priority만 보고 높은 transaction을 꺼내면 같은 sender의 낮은
          nonce를 건너뛸 수 있습니다. 또한 높은 tip이라도 실행 실패, gas limit, blob
          gas, duplicate inclusion 같은 builder constraints 때문에 제외될 수
          있습니다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          Ordering은 각 sender의 현재 eligible head에 priority를 부여합니다.
          Iterator가 head를 내보낸 뒤 그 transaction이 포함 가능한 경우에만 같은
          sender의 다음 nonce가 새 후보가 됩니다. Builder는 후보를 실행하고 block
          constraints에 따라 accept·skip·descendant pruning을 수행합니다.
        </p>
        <p>
          Ordering trait은 priority policy를 교체할 수 있게 하지만 arbitrary
          bundle semantics를 자동 제공하지 않습니다. Bundle atomicity, private
          orderflow와 simulation은 별도 builder policy와 데이터 모델의 책임입니다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <OrderingDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">Priority policies</h3>
      <div className="not-prose mb-6 space-y-2">
        {ORDERING_IMPLS.map((item) => {
          const open = expanded === item.name;
          return (
            <div key={item.name} className="overflow-hidden rounded-xl border">
              <button
                type="button"
                onClick={() => setExpanded(open ? "" : item.name)}
                className="w-full cursor-pointer p-4 text-left"
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: item.color }}
                >
                  {item.name}
                  <span className="ml-2 font-mono text-xs font-normal text-foreground/45">
                    {item.key}
                  </span>
                </p>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t px-4 py-3 text-sm leading-6 text-foreground/70"
                  >
                    {item.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("ordering", codeRefs["ordering"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
