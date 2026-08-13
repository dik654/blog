import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PARALLEL_STRATEGY, PARALLEL_BENEFIT } from "./ParallelData";

export default function Parallel() {
  const [active, setActive] = useState(0);
  return (
    <section id="parallel" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Parallel trie: 독립 storage roots만 분리하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          각 contract의 storage trie는 별도의 root를 갖는다. 여러 account의
          storage changes가 준비되면 개별 storage root 계산 사이에는 직접적인
          state dependency가 없다.
        </p>
        <h3>문제</h3>
        <p>
          독립 계산이라고 해서 무조건 병렬화가 이득인 것은 아니다. 작은 작업은
          scheduling 비용이 더 클 수 있고, workers가 같은 storage/cache/I/O
          자원을 경쟁할 수도 있다. 마지막 account trie merge에는 공통
          ancestors가 존재한다.
        </p>
        <h3>아이디어와 구현</h3>
        <ol>
          <li>changed storage accounts를 독립 work items로 만든다.</li>
          <li>
            각 item이 같은 canonical base view에서 자신의 prefix set과 overlay로
            storage root를 계산한다.
          </li>
          <li>
            성공 결과를 account key와 다시 결합한다. 실패는 해당 batch 전체의
            root 계산을 중단시킨다.
          </li>
          <li>
            새 storage roots를 account values에 넣고 account trie를 결정적인 key
            order로 merge한다.
          </li>
        </ol>
        <p>
          worker 수, 병렬 threshold와 reader 구현은 버전·backend·하드웨어에 따라
          달라질 수 있다. 따라서 코어 수에 비례한다거나 고정 배율로 빨라진다는
          주장은 계약에 포함하지 않는다.
        </p>
      </div>
      <h3 className="mb-3 text-lg font-semibold">병렬화 경계</h3>
      <div className="not-prose mb-6 space-y-2">
        {PARALLEL_STRATEGY.map((item, index) => (
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
      <div className="not-prose grid gap-3 md:grid-cols-3">
        {Object.entries(PARALLEL_BENEFIT).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-border/60 p-4">
            <p className="text-xs font-semibold uppercase text-indigo-500">
              {key}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground/65">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
