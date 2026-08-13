import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import TrieCalculationViz from "./viz/TrieCalculationViz";
import { TRIE_CHALLENGES } from "./OverviewData";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        State trie: 변경 경로를 commitment로 접기
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Ethereum account state는 address hash를 key로 하는 account trie에
          들어간다. contract account는 자신의 storage trie root를 account
          value에 포함하므로 storage 변경은 account trie를 거쳐 하나의{" "}
          <code>state_root</code>로 전파된다.
        </p>
        <h3>문제</h3>
        <p>
          새 block은 전체 state가 아니라 변경 집합을 만든다. 매번 모든 leaf를
          다시 읽는 것은 불필요하지만, 바뀐 leaf만 따로 해시해서는 Patricia
          path, branch와 기존 siblings를 반영한 정확한 root를 얻을 수 없다.
        </p>
        <h3>아이디어</h3>
        <p>
          변경된 hashed keys의 prefix를 추적한다. affected path는 새 값으로
          재구성하고 unrelated subtree의 기존 trie node·hash는 재사용한다. 이
          최적화는 저장 형식이나 특정 client 비교가 아니라 Merkle commitment의
          locality를 이용한다.
        </p>
        <h3>구현 구성</h3>
        <div className="not-prose my-4 grid gap-3 md:grid-cols-3">
          {[
            [
              "Hashed state",
              "address와 storage key를 trie key space로 바꾸고 삭제·wipe를 포함한 새 값을 표현한다.",
            ],
            [
              "Prefix sets",
              "어느 subtree가 영향받았는지 나타내 walker의 탐색 범위를 제한한다.",
            ],
            [
              "Trie walker / builder",
              "기존 artifacts와 새 leaves를 nibble order로 합쳐 affected ancestors를 root까지 다시 해시한다.",
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
          Leaf, extension, branch의 정확한 encoding과 inline/hash 선택은
          Ethereum trie 규칙을 따라야 한다. “변경 노드 몇 개” 같은 고정 수치는
          key prefix 공유 정도와 기존 node shape에 따라 달라진다.
        </p>
      </div>
      <h3 className="mb-3 text-lg font-semibold">설계 경계</h3>
      <div className="not-prose mb-8 space-y-2">
        {TRIE_CHALLENGES.map((item, index) => (
          <motion.button
            key={item.title}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.6 }}
            className="block w-full cursor-pointer rounded-xl border p-4 text-left"
          >
            <p className="text-sm font-semibold" style={{ color: item.color }}>
              {item.title}
            </p>
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
      <div className="not-prose mt-6">
        <TrieCalculationViz />
      </div>
    </section>
  );
}
