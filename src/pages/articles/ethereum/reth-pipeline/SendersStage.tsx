import { useState } from "react";
import { motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import SendersDetailViz from "./viz/SendersDetailViz";
import { SENDER_FACTS } from "./SendersStageData";

export default function SendersStage({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="senders-stage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SendersStage: 서명에서 실행 입력 만들기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Ethereum transaction은 네트워크에 <code>from</code> 주소를 실어 보내지
          않는다. 발신자는 transaction type에 맞는 signing payload와 ECDSA
          signature에서 복구한다.
        </p>
        <h3>문제</h3>
        <p>
          과거 범위에는 많은 독립 signature recovery가 있지만 결과가
          transaction과 어긋나면 실행 의미가 바뀐다. legacy와 typed
          transaction의 signing hash, chain id, signature 유효성 규칙도 동일하게
          취급할 수 없다.
        </p>
        <h3>아이디어</h3>
        <p>
          선행 Bodies checkpoint가 확정한 transaction 범위를 읽고 각 서명을
          독립적으로 복구한다. 계산은 안전한 단위로 나눠 병렬 처리할 수 있지만
          수집 결과는 원래 transaction numbering과 다시 결합한다.
        </p>
        <h3>구현과 경계</h3>
        <div className="not-prose my-4 grid gap-3 md:grid-cols-2">
          {[
            [
              "1. 범위",
              "Bodies가 저장·검증한 canonical transaction 범위 안에서만 작업한다.",
            ],
            [
              "2. signing payload",
              "transaction envelope와 chain rules에 맞는 hash를 구성하고 signature canonicality를 확인한다.",
            ],
            [
              "3. recovery",
              "서로 독립인 transaction을 worker에 분배하되 실패를 해당 입력과 연결해 보고한다.",
            ],
            [
              "4. 저장",
              "sender mapping과 checkpoint를 provider를 통해 기록한다. 물리 backend는 Storage mode가 결정한다.",
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-border/60 p-4">
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-foreground/65">
                {body}
              </p>
            </div>
          ))}
        </div>
        <p>
          병렬화 효과는 batch 구성, CPU, signature 분포와 구현 버전에 따라
          달라진다. 따라서 특정 처리 시간이나 선형 배율 대신{" "}
          <strong>독립 계산과 순서 보존</strong>을 설계 불변조건으로 본다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <SendersDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">확인할 불변조건</h3>
      <div className="not-prose mb-6 grid gap-3 sm:grid-cols-2">
        {SENDER_FACTS.map((fact, index) => (
          <motion.button
            key={fact.label}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.65 }}
            className="cursor-pointer rounded-xl border p-4 text-left"
            style={{
              borderColor:
                active === index ? "#10b98180" : "var(--color-border)",
            }}
          >
            <p className="text-xs text-foreground/50">{fact.label}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {fact.value}
            </p>
            {active === index && (
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                {fact.desc}
              </p>
            )}
          </motion.button>
        ))}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("senders-stage", codeRefs["senders-stage"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
