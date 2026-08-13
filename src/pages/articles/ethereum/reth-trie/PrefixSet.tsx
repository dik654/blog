import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import PrefixSetDetailViz from "./viz/PrefixSetDetailViz";
import { PREFIX_OPERATIONS } from "./PrefixSetData";

export default function PrefixSet({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="prefix-set" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PrefixSet: 변경 key를 subtree 범위로 바꾸기
      </h2>
      <div className="not-prose mb-8">
        <PrefixSetDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Ethereum trie path는 hashed key를 nibble 단위로 따라간다. 하나의
          leaf가 바뀌면 그 key의 prefix와 root까지의 ancestors가 영향을 받는다.
        </p>
        <h3>문제</h3>
        <p>
          정확한 key membership만으로는 walker가 “이 branch 아래에 변경 key가
          하나라도 있는가?”를 빠르게 묻기 어렵다. account와 storage key space도
          섞으면 어느 storage trie를 갱신해야 하는지 잃는다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          변경 hashed keys를 정렬 가능한 nibble sequence로 수집한다. walker는
          현재 prefix 이상의 첫 key를 찾아 그 key가 prefix로 시작하는지
          검사한다. account prefixes와 account별 storage prefixes는 별도로
          유지하고, 실행 범위를 합칠 때 중복 key를 제거한다.
        </p>
        <div className="not-prose my-4 grid gap-3 sm:grid-cols-2">
          {[
            [
              "Exact key",
              "실제로 생성·수정·삭제된 hashed account 또는 slot key",
            ],
            [
              "Prefix query",
              "현재 trie branch 아래에 changed key가 존재하는지 묻는 range query",
            ],
            [
              "Freeze/read phase",
              "수집이 끝난 뒤 immutable ordered representation으로 반복 query",
            ],
            [
              "Scope separation",
              "account set과 account별 storage sets를 분리해 2-tier trie 경계를 보존",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border/60 p-4">
              <p className="text-sm font-semibold text-indigo-500">{title}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                {body}
              </p>
            </div>
          ))}
        </div>
        <p>
          구체 container와 메모리 최적화는 버전에 따라 바뀔 수 있다. 유지해야 할
          계약은{" "}
          <strong>
            ordered prefix query, deduplication, account/storage scope
          </strong>
          다.
        </p>
      </div>
      <h3 className="mb-3 text-lg font-semibold">핵심 연산</h3>
      <div className="not-prose mb-6 space-y-2">
        {PREFIX_OPERATIONS.map((item, index) => (
          <motion.button
            key={item.name}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.6 }}
            className="block w-full cursor-pointer rounded-xl border p-4 text-left"
          >
            <code
              className="text-sm font-semibold"
              style={{ color: item.color }}
            >
              {item.name}
            </code>
            <span className="ml-2 text-xs text-foreground/45">
              {item.phase}
            </span>
            <AnimatePresence>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm leading-6 text-foreground/70"
                >
                  {item.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("prefix-set", codeRefs["prefix-set"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
