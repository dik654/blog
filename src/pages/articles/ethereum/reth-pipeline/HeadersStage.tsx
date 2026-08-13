import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import HeadersDetailViz from "./viz/HeadersDetailViz";
import { HEADER_STEPS } from "./HeadersStageData";

export default function HeadersStage({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [step, setStep] = useState(0);
  return (
    <section id="headers-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        HeadersStage: canonical 후보의 골격 세우기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Header는 parent hash, block number와 body·receipt·state commitments를
          담는다. fork가 추가되면 조건부 field도 늘어날 수 있으므로 크기를 고정
          상수로 취급하지 않는다.
        </p>
        <h3>문제</h3>
        <p>
          피어가 보낸 연속 header처럼 보여도 parent 연결, timestamp, gas와
          fork-specific rules를 통과하기 전에는 downstream 입력으로 사용할 수
          없다. 다운로드 전략과 validation rules도 별개 책임이다.
        </p>
        <h3>아이디어와 구현</h3>
        <ol>
          <li>
            현재 checkpoint와 target에서 요청 범위를 정하고 peer downloader에
            전달한다.
          </li>
          <li>
            응답을 요청과 연결하고 번호·parent hash가 이어지는지 확인한다.
          </li>
          <li>ChainSpec으로 해당 시점에 활성화된 header rules를 검증한다.</li>
          <li>
            검증된 canonical mapping과 header를 provider를 통해 저장하고 안전한
            checkpoint를 반환한다.
          </li>
        </ol>
        <p>
          요청량, 동시성, timeout과 commit threshold는 운영 설정과 구현 버전에
          따라 바뀔 수 있다. peer penalty도 오류 종류와 downloader policy의
          책임이므로 모든 validation failure를 즉시 ban으로 단정하지 않는다.
        </p>
        <div className="not-prose my-4 grid gap-3 sm:grid-cols-2">
          {[
            ["연결 규칙", "number, parent hash와 canonical ancestry"],
            ["fork 규칙", "timestamp, gas, base fee와 활성 conditional fields"],
            [
              "commitments",
              "transactions, receipts, state, withdrawals 등 downstream 검증 기준",
            ],
            [
              "영속 경계",
              "provider write와 checkpoint가 재시작 가능한 동일 진행 위치를 표현",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border/60 p-4">
              <p className="text-sm font-semibold text-indigo-500">{title}</p>
              <p className="mt-2 text-sm text-foreground/65">{body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="not-prose mb-6">
        <HeadersDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">실행 흐름</h3>
      <div className="not-prose mb-6 space-y-2">
        {HEADER_STEPS.map((item, index) => (
          <motion.button
            key={item.title}
            type="button"
            onClick={() => setStep(index)}
            animate={{ opacity: step === index ? 1 : 0.6 }}
            className="block w-full cursor-pointer rounded-xl border p-4 text-left"
          >
            <p className="text-sm font-semibold">
              <span className="mr-2 text-indigo-500">{index + 1}</span>
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
          onClick={() => onCodeRef("headers-stage", codeRefs["headers-stage"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
