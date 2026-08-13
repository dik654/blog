import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CodeViewButton from "@/components/code/CodeViewButton";
import StaticFilesViz from "./viz/StaticFilesViz";
import { STATIC_FILE_STEPS } from "./StaticFilesData";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function StaticFiles({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="static-files" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Static files는 “오래된 블록 폴더”가 아니라 layout 구성요소
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Immutable하고 순서가 안정된 데이터는 mutable key-value table과 다른
          형식으로 저장할 수 있습니다. Reth의 static-file provider는 segment
          boundary, index와 codec을 관리해 provider query에 연결합니다. 어떤
          segment가 존재하는지는 version, node mode와 pruning 설정에 따라
          달라지므로 headers·transactions·receipts 세 종류만 영구 고정된다고
          가정하지 않습니다.
        </p>
        <p className="leading-7">
          Storage V2에서는 account·storage changesets도 static files로
          routing됩니다. 이는 “finalized 이전 데이터를 MDBX에서 옮긴다”는 단일
          archive story보다 넓은 역할입니다. 반대로 static file에 있다는
          사실만으로 모든 record가 인덱스 없이 같은 시간에 조회된다는 뜻도
          아닙니다. segment selection, index lookup, page I/O와 decode 비용이
          각각 존재합니다.{" "}
          <CodeViewButton
            onClick={() =>
              onCodeRef("db-static-file", codeRefs["db-static-file"])
            }
          />
        </p>
      </div>

      <div className="not-prose mb-8">
        <StaticFilesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <h3 className="text-lg font-semibold mb-3">읽기와 보존 흐름</h3>
      <div className="not-prose space-y-2 mb-8">
        {STATIC_FILE_STEPS.map((item, index) => (
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
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${active === index ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-semibold">{item.title}</span>
            </button>
            <AnimatePresence initial={false}>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-border/40 px-4 py-3 text-sm leading-6 text-foreground/70"
                >
                  {item.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="not-prose rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-foreground/75">
        Storage layout과 pruning은 독립적입니다. V2를 사용해도 historical RPC
        data를 모두 보존하는 것은 아니며, archive·full·minimal mode와 custom
        pruning이 실제 availability를 결정합니다.
      </div>
    </section>
  );
}
