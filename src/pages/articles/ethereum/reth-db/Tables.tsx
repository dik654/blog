import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CodeViewButton from "@/components/code/CodeViewButton";
import TablesViz from "./viz/TablesViz";
import { codeRefs } from "./codeRefs";
import { SCHEMA_RULES, TABLE_GROUPS } from "./TablesData";
import type { CodeRef } from "@/components/code/types";

export default function Tables({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [group, setGroup] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);

  return (
    <section id="tables" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Typed schema와 physical routing을 분리하기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth의 typed table은 key와 value codec을 compile time에 묶어 잘못된
          조합을 줄입니다. 하지만 이것을 “모든 데이터는 MDBX의 named database에
          있다”는 뜻으로 확장하면 Storage V2와 충돌합니다. schema는 caller가
          원하는 domain value를 설명하고, storage settings가 그 값을 어느
          backend에서 읽을지 정합니다.
        </p>
        <p className="leading-7">
          따라서 새 개념을 추가할 때는 table 목록을 여러 글에 복사하지 않습니다.
          먼저 provider capability와 retention을 정의하고, V1 MDBX table 또는 V2
          RocksDB/static-file route를 storage manifest에 연결합니다. 아래 코드
          보기는 legacy schema를 이해하기 위한 bundled snapshot이며 현재 전체
          layout의 고정 목록은 아닙니다.{" "}
          <CodeViewButton
            onClick={() => onCodeRef("db-tables", codeRefs["db-tables"])}
          />
        </p>
      </div>

      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        {TABLE_GROUPS.map((item, index) => (
          <button
            type="button"
            key={item.title}
            onClick={() => setGroup(index)}
            className={`cursor-pointer rounded-xl border p-4 text-left ${group === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: group === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.title}
            </p>
          </button>
        ))}
      </div>
      <div className="not-prose mb-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {TABLE_GROUPS[group].items.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-border/60 p-3"
          >
            <p className="font-mono text-xs font-semibold">{item.name}</p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">스키마 확장 규칙</h3>
      <div className="not-prose space-y-2 mb-8">
        {SCHEMA_RULES.map((item, index) => (
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

      <div className="not-prose">
        <TablesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
