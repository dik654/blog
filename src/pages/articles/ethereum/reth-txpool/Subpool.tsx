import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import SubpoolDetailViz from "./viz/SubpoolDetailViz";
import { STATE_CHANGES, SUBPOOLS } from "./SubpoolData";

export default function Subpool({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [expanded, setExpanded] = useState(SUBPOOLS[0].name);
  return (
    <section id="subpool" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Subpools: 실행 가능성이 바뀌는 상태 머신
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          Accepted transaction도 즉시 block candidate가 되는 것은 아닙니다.
          sender의 canonical nonce부터 끊김 없이 이어져야 하고, 각 transaction의
          fee cap이 현재 base fee를 감당해야 합니다.
        </p>
        <h3>문제</h3>
        <p>
          새 head는 nonce·balance·base fee를 바꾸고 mined transaction을
          제거합니다. Reorg는 반대로 이전 block의 transaction을 다시 pool에 넣을
          수 있습니다. 한 transaction의 변화가 같은 sender의 descendants까지
          이동시킬 수 있습니다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          Pending, BaseFee, Queued 같은 logical states로 실행 가능성의 이유를
          보존합니다. Canonical state change 때 affected senders를 다시 평가하고,
          replacement·eviction도 sender chain을 깨뜨린 뒤 descendants를
          재분류하도록 처리합니다.
        </p>
        <p>
          Blob transaction의 signed envelope, versioned hashes와 sidecar data는
          서로 연관되지만 동일한 byte size가 아닙니다. Pool은 transaction type별
          보존·propagation·replacement 및 memory limits를 별도 정책으로 다룹니다.
        </p>
        <p>
          Alice 예시에서 canonical nonce가 7이면 T7은 Pending이고 T8은 T7에
          의존합니다. T7을 포함한 block이 canonical이 되면 account nonce가 8로
          올라가 T7은 제거되고 T8을 다시 평가합니다. 이후 reorg가 발생해 nonce가
          7로 돌아오면 old block의 T7을 무조건 복사하지 않고 새 canonical
          balance·base fee·fork rules로 다시 검증합니다. 이 재검증이 없다면 이미
          다른 branch에서 무효가 된 transaction이 builder에 노출될 수 있습니다.
        </p>
      </div>
      <div className="not-prose mb-6">
        <SubpoolDetailViz />
      </div>
      <h3 className="mb-3 text-lg font-semibold">Logical states</h3>
      <div className="not-prose mb-6 space-y-2">
        {SUBPOOLS.map((item) => {
          const open = expanded === item.name;
          return (
            <div key={item.name} className="overflow-hidden rounded-xl border">
              <button
                type="button"
                onClick={() => setExpanded(open ? "" : item.name)}
                className="w-full cursor-pointer p-4 text-left"
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: item.color }}
                >
                  {item.name}
                  <span className="ml-2 text-xs font-normal text-foreground/45">
                    {item.condition}
                  </span>
                </p>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t px-4 py-3 text-sm leading-6 text-foreground/70"
                  >
                    {item.detail}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="not-prose mb-6 grid gap-3 sm:grid-cols-2">
        {STATE_CHANGES.map((item) => (
          <div
            key={item.event}
            className="rounded-xl border border-border/60 p-4"
          >
            <p className="text-sm font-semibold">{item.event}</p>
            <p className="mt-2 text-sm leading-6 text-foreground/65">
              {item.action}
            </p>
          </div>
        ))}
      </div>
      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() => onCodeRef("subpool", codeRefs["subpool"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          bundled source snapshot
        </span>
      </div>
    </section>
  );
}
