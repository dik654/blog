import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import BodiesDetailViz from "./viz/BodiesDetailViz";
import { BODY_VERIFY_ITEMS } from "./BodiesStageData";

export default function BodiesStage({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [expanded, setExpanded] = useState(BODY_VERIFY_ITEMS[0].label);
  return (
    <section id="bodies-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BodiesStage: header commitment를 실제 데이터로 검증하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Header는 transaction 목록 자체가 아니라 그 목록의 root를 담는다. block
          body는 transactions와 fork에 따라 ommers·withdrawals 같은 구성요소를
          제공하며, blob data는 transaction body와 별도의 sidecar 수명주기를
          가진다.
        </p>
        <h3>문제</h3>
        <p>
          피어 응답은 canonical header와 정확히 매칭되어야 한다. body shape와
          검증 항목은 fork에 따라 달라지므로 현재 mainnet 형태를 모든 역사
          구간에 적용해서도 안 된다.
        </p>
        <h3>아이디어와 구현</h3>
        <ol>
          <li>
            Headers checkpoint가 확정한 header 범위에서 필요한 body를 요청한다.
          </li>
          <li>
            응답을 header와 매칭하고 transaction trie root를 다시 계산한다.
          </li>
          <li>
            ommers hash, withdrawals root와 그 밖의 fork-aware body rules를
            검증한다.
          </li>
          <li>
            canonical ordering을 보존하는 logical transaction numbering과 body
            index를 provider에 기록한다.
          </li>
        </ol>
        <p>
          Merge 이후 canonical execution block의 ommers 목록은 비어 있어야
          하지만 역사 범위에는 PoW-era ommers가 존재한다. body 크기와
          transaction 수도 가변이므로 평균값을 구조적 사실처럼 사용하지 않는다.
        </p>
        <div className="my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950/30">
          <p className="font-semibold">신뢰 경계</p>
          <p className="mt-2">
            Header commitment는 body 무결성을 검사하는 기준이지 header 자체가
            자동으로 신뢰된다는 뜻은 아니다. canonical selection과 header
            validation이 먼저 성립해야 한다.
          </p>
        </div>
      </div>
      <div className="not-prose mb-6">
        <BodiesDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">무결성 검증 항목</h3>
      <div className="not-prose mb-6 space-y-2">
        {BODY_VERIFY_ITEMS.map((item) => {
          const open = item.label === expanded;
          return (
            <div key={item.label} className="overflow-hidden rounded-xl border">
              <button
                type="button"
                onClick={() => setExpanded(open ? "" : item.label)}
                className="flex w-full cursor-pointer items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-foreground/40">{open ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t px-4 py-3 text-sm leading-6 text-foreground/70"
                  >
                    {item.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("bodies-stage", codeRefs["bodies-stage"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
