import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import ValidationDetailViz from "./viz/ValidationDetailViz";
import { VALIDATION_STEPS } from "./ValidationData";

export default function Validation({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Validation: reject와 대기 가능 상태를 구분하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Pool 입구에서는 transaction envelope를 해석하고 sender를 복구한 뒤
          현재 chain state와 비교해야 한다. legacy, access-list, dynamic-fee,
          blob 등 type마다 필수 fields와 fork availability가 다르다.
        </p>
        <h3>문제</h3>
        <p>
          signature 오류처럼 영구 invalid한 입력과, 미래 nonce·현재 base fee처럼
          head가 바뀌면 실행 가능해질 조건은 결과가 다르다. 검사를 단순
          boolean으로 만들면 보관·propagation·peer policy를 정확히 결정할 수
          없다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          먼저 decode/type/fork와 크기·fee field 같은 stateless checks를
          수행하고 signature에서 sender를 복구한다. 그다음 provider의 일관된
          account view로 nonce와 balance를 확인하고 blob transaction은 versioned
          hashes·sidecar availability와 blob-specific policy를 적용한다.
        </p>
        <p>
          검사 순서는 cheap-before-expensive 원칙을 따를 수 있지만 정확한 호출
          순서와 비용은 구현 버전에 따라 달라진다. 핵심은 expensive work 전에
          명백한 invalid input을 제거하고, 결과 reason을 pool classification과
          연결하는 것이다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <ValidationDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">검증 축</h3>
      <div className="not-prose mb-6 space-y-2">
        {VALIDATION_STEPS.map((item, index) => (
          <motion.button
            key={item.check}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.6 }}
            className="block w-full cursor-pointer rounded-xl border p-4 text-left"
          >
            <p className="text-sm font-semibold" style={{ color: item.color }}>
              {item.check}
              <span className="ml-2 font-mono text-xs font-normal text-foreground/45">
                {item.failReason}
              </span>
            </p>
            <AnimatePresence>
              {active === index && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm leading-6 text-foreground/70"
                >
                  {item.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("validation", codeRefs["validation"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
