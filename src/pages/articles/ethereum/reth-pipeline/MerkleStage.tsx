import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import MerkleDetailViz from "./viz/MerkleDetailViz";
import { MERKLE_STEPS } from "./MerkleStageData";

export default function MerkleStage({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [step, setStep] = useState(0);
  return (
    <section id="merkle-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        MerkleStage: 실행 결과를 header commitment와 연결하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Execution이 만든 계정·storage 변화는 아직 로컬 계산 결과다. 이를
          Ethereum state trie에 반영해 얻은 root가 header의{" "}
          <code>state_root</code>와 같아야 같은 상태 전이를 재현했다고 판단할 수
          있다.
        </p>
        <h3>문제</h3>
        <p>
          매 범위마다 모든 계정과 storage를 처음부터 훑는 것은 불필요하다.
          반대로 변경 목록만 해시하고 기존 trie 문맥을 무시하면 branch node와
          공통 prefix를 올바르게 재구성할 수 없다.
        </p>
        <h3>아이디어</h3>
        <p>
          Execution history에서 바뀐 hashed key의 prefix set을 만들고, 해당
          경로는 다시 계산하되 영향받지 않은 subtree의 기존 node·hash는
          재사용한다. 최적화가 결과를 바꾸지 않는지 최종 root comparison이
          검증한다.
        </p>
        <h3>구현 흐름</h3>
        <ol>
          <li>
            checkpoint 범위의 account·storage changes에서 hashed key와 prefix를
            수집한다.
          </li>
          <li>변경 계정의 storage trie를 갱신해 새 storage root를 만든다.</li>
          <li>
            새 account value를 account trie에 반영하고 영향받은 ancestor path를
            다시 해시한다.
          </li>
          <li>
            계산한 root를 target header와 대조한 뒤 trie artifacts와
            checkpoint를 함께 진행시킨다.
          </li>
        </ol>
        <p>
          계정별 storage 계산처럼 독립 구간은 병렬화할 수 있지만 실제 가속은
          변경 집합의 분포, shared ancestors, I/O와 worker overhead에 좌우된다.
          고정 배율은 알고리즘의 보장 사항이 아니다.
        </p>
        <div className="my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950/30">
          <p className="font-semibold">검증 실패의 의미</p>
          <p className="mt-2">
            root mismatch는 특정 피어 탓으로 단정할 수 없다. body 입력, fork
            configuration, EVM execution, trie update 또는 저장된 base state 중
            어느 경계가 어긋났는지 추적한 뒤 안전한 checkpoint로 unwind해야
            한다.
          </p>
        </div>
      </div>
      <div className="not-prose mb-6">
        <MerkleDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">검증 흐름</h3>
      <div className="not-prose mb-6 space-y-2">
        {MERKLE_STEPS.map((item, index) => (
          <motion.button
            key={item.title}
            type="button"
            onClick={() => setStep(index)}
            animate={{ opacity: step === index ? 1 : 0.6 }}
            className="block w-full cursor-pointer rounded-xl border p-4 text-left"
          >
            <p className="text-sm font-semibold">
              <span className="mr-2 text-pink-500">{index + 1}</span>
              {item.title}
            </p>
            <AnimatePresence>
              {step === index && (
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
          onClick={() => onCodeRef("merkle-stage", codeRefs["merkle-stage"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
