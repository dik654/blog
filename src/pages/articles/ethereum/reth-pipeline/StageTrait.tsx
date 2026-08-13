import { useState } from "react";
import { motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import StageTraitViz from "./viz/StageTraitViz";
import { STAGE_METHODS } from "./StageTraitData";

export default function StageTrait({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  return (
    <section id="stage-trait" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Stage 계약: 진행과 되감기를 대칭으로 만들기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경과 문제</h3>
        <p>
          Headers, Bodies, Execution은 서로 다른 작업이지만 Pipeline은 각 구현의
          내부 버퍼·다운로더·storage table을 알아서는 안 된다. 동시에 crash
          recovery와 reorg는 모든 Stage에서 같은 의미를 가져야 한다.
        </p>
        <h3>아이디어</h3>
        <p>
          <code>Stage</code>는 identity, forward execution, unwind를 공통
          계약으로 노출한다. 실행 입력은 목표와 현재 checkpoint를, 출력은 실제로
          완료한 progress와 추가 호출 필요 여부를 표현한다.
        </p>
        <h3>구현 불변조건</h3>
        <ul>
          <li>Stage는 선행 dependency가 확정한 범위를 넘어 진행하지 않는다.</li>
          <li>
            <code>done=false</code>는 실패가 아니라 bounded work 뒤에 다시
            호출해 달라는 진행 상태다.
          </li>
          <li>
            checkpoint는 처리 시도 위치가 아니라 재시작해도 안전한 영속 경계를
            뜻한다.
          </li>
          <li>
            unwind는 dependency 역순으로 실행하며 Stage가 만든 산출물과
            progress를 같은 지점으로 되돌린다.
          </li>
        </ul>
        <p>
          checkpoint의 physical 저장 위치는 provider와 Storage mode의 책임이다.
          Stage 계약을 MDBX table 하나와 동일시하면 Storage V2 같은 layout
          변화가 실행 모델 설명까지 오염시킨다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <StageTraitViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">공통 메서드</h3>
      <div className="not-prose mb-6 space-y-2">
        {STAGE_METHODS.map((item, index) => (
          <motion.button
            key={item.method}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.6 }}
            className="block w-full cursor-pointer rounded-xl border p-4 text-left"
          >
            <p className="font-mono text-sm font-semibold text-indigo-500">
              {item.method}{" "}
              <span className="font-sans font-normal text-foreground/60">
                · {item.desc}
              </span>
            </p>
            {active === index && (
              <p className="mt-2 text-sm leading-6 text-foreground/70">
                {item.detail}
              </p>
            )}
          </motion.button>
        ))}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("stage-trait", codeRefs["stage-trait"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
