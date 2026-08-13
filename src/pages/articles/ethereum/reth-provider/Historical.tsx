import { useState } from "react";
import { CodeViewButton } from "@/components/code";
import HistoricalViz from "./viz/HistoricalViz";
import { HISTORY_STEPS } from "./HistoricalData";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Historical({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="historical" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Historical provider는 history가 있을 때만 복원한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          과거 block의 <code>eth_call</code>이나 balance 조회는 target 시점의
          account와 storage가 필요합니다. Reth는 history index로 해당 key가 바뀐
          위치를 찾고 changeset의 이전 값을 사용해 historical view를 구성할 수
          있습니다. 하지만 이것이 모든 node mode에서 genesis까지 자동 제공된다는
          뜻은 아닙니다.
        </p>
        <p className="leading-7">
          Storage V1에서는 history indices와 changesets가 MDBX tables에 있고,
          Storage V2에서는 indices가 RocksDB, account·storage changesets가
          static files로 routing됩니다. pruning이 필요한 range를 제거했다면
          provider는 임의의 현재 값으로 fallback하지 않고 historical data
          unavailable을 반환해야 합니다.{" "}
          <CodeViewButton
            onClick={() =>
              onCodeRef("changeset-tables", codeRefs["changeset-tables"])
            }
          />
        </p>
      </div>

      <div className="not-prose mb-8">
        <HistoricalViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <h3 className="text-lg font-semibold mb-3">복원 전 확인 순서</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
        {HISTORY_STEPS.map((item, index) => (
          <button
            type="button"
            key={item.title}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-4 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {index + 1}. {item.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="not-prose rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-foreground/75">
        조회 비용은 “현재에서 target까지 모든 block 수”로만 결정되지 않습니다.
        account·slot의 실제 변경 횟수, index organization, segment locality와
        cache 상태에 좌우됩니다. 따라서 고정 밀리초·배수 대신 관련 changeset
        수와 I/O를 관측해야 합니다.
      </div>
    </section>
  );
}
