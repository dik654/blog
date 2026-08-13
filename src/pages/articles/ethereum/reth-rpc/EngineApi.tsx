import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import EngineDetailViz from "./viz/EngineDetailViz";
import { ENGINE_METHODS } from "./EngineApiData";

export default function EngineApi({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(ENGINE_METHODS[0].id);
  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Engine API: consensus 선택과 execution 검증의 경계
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Consensus client는 fork choice와 beacon block proposal을 담당하고,
          execution client는 execution payload를 만들고 검증한다. Engine API가
          두 client 사이의 versioned protocol이다.
        </p>
        <h3>문제</h3>
        <p>
          Head 갱신, payload build 시작, 외부 payload 검증과 local payload
          조회는 서로 다른 lifecycle을 가진다. 네트워크 fork마다 payload
          fields가 늘어나므로 unversioned method 하나로 설명할 수도 없다.
        </p>
        <h3>아이디어와 구현</h3>
        <ol>
          <li>
            <code>forkchoiceUpdated</code>가 head·safe·finalized references를
            전달하고, attributes가 있으면 local build job을 시작한다.
          </li>
          <li>
            <code>getPayload</code>가 payload id에 연결된 local build 결과와
            fork version에 맞는 부가 fields를 반환한다.
          </li>
          <li>
            <code>newPayload</code>가 gossip/proposal 경로에서 받은 execution
            payload를 검증하고 payload status를 반환한다.
          </li>
          <li>
            CL은 status와 fork choice를 사용해 다음 protocol action을 결정한다.
            EL이 consensus fork choice를 대신하지 않는다.
          </li>
        </ol>
        <p>
          Prague는 V4 payload methods에 execution requests를 추가했다. 향후
          fork도 versioned method와 fields를 확장하므로 글은 V1/V2/V3/V4 목록을
          여러 곳에 복제하지 않고 “fork에 맞는 version 선택”을 불변 규칙으로
          둔다.
        </p>
        <p>
          Authenticated endpoint는 기본적으로 localhost:8551이지만
          address·port는 설정 가능하다. JWT는 256-bit shared secret과 HS256을
          사용하는 caller authentication이며, 암호화 채널 자체를 제공하거나 공개
          노출을 안전하게 만들어 주는 장치는 아니다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <EngineDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">핵심 method families</h3>
      <div className="not-prose mb-6 space-y-2">
        {ENGINE_METHODS.map((item) => {
          const open = active === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              animate={{ opacity: open ? 1 : 0.6 }}
              className="block w-full cursor-pointer rounded-xl border p-4 text-left"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.name}
                <span className="ml-2 text-xs font-normal text-foreground/45">
                  {item.direction} · {item.role}
                </span>
              </p>
              <AnimatePresence>
                {open && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm leading-6 text-foreground/70"
                  >
                    {item.details}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("rpc-engine-api", codeRefs["rpc-engine-api"])
          }
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
