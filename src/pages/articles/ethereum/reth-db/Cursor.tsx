import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CodeViewButton from "@/components/code/CodeViewButton";
import CursorDetailViz from "./viz/CursorDetailViz";
import CursorWalkViz from "./viz/CursorWalkViz";
import { CURSOR_OPS } from "./CursorData";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Cursor({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="cursor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Cursor와 transaction이 보장하는 조회 경계
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Cursor는 정렬된 key space에서 위치를 잡고 연속 항목을 순회하는
          API입니다. 특히 Storage V1의 MDBX tables에서는 <code>seek</code>,{" "}
          <code>next</code>, DupSort와 read/write transaction을 직접 반영합니다.
          다만 이 동작을 모든 Storage V2 query의 physical 구현으로 일반화하면 안
          됩니다.
        </p>
        <p className="leading-7">
          중요한 공통 규칙은 조회가 일관된 transaction 또는 immutable segment
          경계 안에서 이뤄지고, iterator 수명이 그 경계를 넘지 않는다는
          점입니다. provider는 RocksDB index나 static file을 사용할 때도 같은
          domain-level ordering과 availability를 제공하지만 내부 자료구조까지
          B+tree cursor일 필요는 없습니다.{" "}
          <CodeViewButton
            onClick={() => onCodeRef("db-cursor", codeRefs["db-cursor"])}
          />
        </p>
      </div>

      <div className="not-prose mb-8">
        <CursorWalkViz />
      </div>

      <h3 className="text-lg font-semibold mb-3">주요 연산과 precondition</h3>
      <div className="not-prose space-y-2 mb-8">
        {CURSOR_OPS.map((item, index) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-xl border border-border/60"
          >
            <button
              type="button"
              onClick={() => setActive(index)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${active === index ? "bg-sky-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {index + 1}
              </span>
              <code className="text-sm font-semibold">{item.title}</code>
            </button>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3"
                >
                  <p className="text-sm leading-6 text-foreground/75">
                    {item.desc}
                  </p>
                  <p className="mt-1 text-xs text-foreground/50">
                    사용 문맥: {item.useCase}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="not-prose">
        <CursorDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
