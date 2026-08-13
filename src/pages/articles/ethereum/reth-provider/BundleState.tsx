import { useState } from "react";
import { CodeViewButton } from "@/components/code";
import BundleStateViz from "./viz/BundleStateViz";
import { BUNDLE_ROLES } from "./BundleStateData";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function BundleState({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="bundle-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        BundleState는 실행 결과를 보존하는 overlay
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          한 transaction의 변경을 즉시 영속 저장하면 다음 transaction이 같은
          account를 읽을 때마다 storage transaction 경계를 오가고, block 단위
          revert 정보를 만들기도 어렵습니다. BundleState는 revm transitions를
          memory overlay로 누적해 이후 실행이 최신 in-memory 값을 보고,
          persistence와 unwind가 같은 변경 집합을 소비하게 합니다.
        </p>
        <p className="leading-7">
          이 구조를 특정 block 수·고정 메모리 크기·MDBX append 최적화와 묶어
          설명하지 않습니다. flush threshold와 memory footprint는 workload와
          configuration에 따라 달라지고, Storage V2에서는 physical persistence
          route도 V1과 다릅니다. 불변인 것은 original/present state, changed
          storage, code와 revert provenance를 잃지 않는다는 점입니다.{" "}
          <CodeViewButton
            onClick={() => onCodeRef("bundle-state", codeRefs["bundle-state"])}
          />
        </p>
      </div>

      <div className="not-prose mb-8">
        <BundleStateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <h3 className="text-lg font-semibold mb-3">Overlay가 보존하는 정보</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
        {BUNDLE_ROLES.map((item, index) => (
          <button
            type="button"
            key={item.name}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-4 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.name}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/60">
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="not-prose rounded-xl border border-border/60 p-4 text-sm leading-6 text-foreground/75">
        읽을 때는 overlay entry가 base provider보다 우선합니다. commit할 때는
        변경·revert를 backend가 요구하는 ordered batches로 변환하고, reorg 때는
        block boundary를 역순으로 적용합니다. 이 세 경로가 같은 manifest를
        소비해야 중복 상태가 갈라지지 않습니다.
      </div>
    </section>
  );
}
