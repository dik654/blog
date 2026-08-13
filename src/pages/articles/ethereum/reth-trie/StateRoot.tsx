import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { OVERLAY_STEPS, STATE_ROOT_FIELDS } from "./StateRootData";

export default function StateRoot({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="state-root" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        StateRoot: base trie와 post-state overlay 합치기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Execution 결과는 account와 storage의 post-state changes다. Root
          계산기는 canonical base state의 trie artifacts와 이 overlay를 같은 key
          order에서 결합해야 한다.
        </p>
        <h3>문제</h3>
        <p>
          계정 삭제, storage wipe, slot update는 서로 다른 의미를 갖는다. 또한
          base node를 재사용할 수 있는 경계와 overlay가 덮어쓰는 경계를 혼동하면
          오래된 child hash가 새 root에 섞일 수 있다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          주소·slot을 hashed key로 정규화하고 account prefix와 계정별 storage
          prefix를 분리한다. walker는 prefix가 닿는 경로에서 새 leaves와 base
          nodes를 merge하며, 닿지 않는 subtree는 저장된 node/hash를 그대로
          builder에 넘긴다.
        </p>
        <div className="not-prose my-4 grid gap-3 sm:grid-cols-2">
          {STATE_ROOT_FIELDS.map((field) => (
            <div
              key={field.name}
              className="rounded-xl border border-border/60 p-4"
            >
              <code className="text-xs font-semibold text-indigo-500">
                {field.name}
              </code>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                {field.desc}
              </p>
            </div>
          ))}
        </div>
        <p>
          내부 type과 field 이름은 Reth 버전에 따라 달라질 수 있다. 글의
          안정적인 경계는{" "}
          <strong>
            base view, hashed overlay, changed prefixes, root output
          </strong>{" "}
          네 가지다.
        </p>
      </div>
      <h3 className="mb-3 text-lg font-semibold">Overlay 흐름</h3>
      <div className="not-prose mb-6 space-y-2">
        {OVERLAY_STEPS.map((item, index) => (
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
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950/30">
          <p className="font-semibold">결과 검증</p>
          <p className="mt-2">
            계산 비용은 changed keys, prefix 공유, cache와 storage layout에 따라
            달라진다. 속도 추정 대신 header state_root 일치와 재현 가능한
            checkpoint를 완료 조건으로 삼는다.
          </p>
        </div>
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("state-root", codeRefs["state-root"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
