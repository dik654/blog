import { useState } from "react";
import ContextViz from "./viz/ContextViz";
import ProviderLayerViz from "./viz/ProviderLayerViz";
import { PROVIDER_CONTEXTS } from "./OverviewData";
import { RETH_STORAGE_ROUTES } from "@/content/reth-storage";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const context = PROVIDER_CONTEXTS[active];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Provider는 저장소가 아니라 조회 문맥을 추상화한다
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          EVM, RPC와 pipeline은 모두 chain data를 읽지만 필요한 시점과
          consistency가 다릅니다. provider layer는 “BundleState → MDBX →
          StaticFiles”라는 고정 fallback chain이 아니라,
          latest·pending·historical 시점과 account·storage·block data
          capability를 조합하는 경계입니다.
        </p>
        <p className="leading-7">
          이 분리가 있어야 Storage V1의 MDBX tables와 Storage V2의
          RocksDB/static-file routing을 caller 수정 없이 바꿀 수 있습니다.
          provider는 initialized database의 storage settings와 pruning
          availability를 읽고, physical source의 결과를 domain type과 명시적인
          unavailable 상태로 돌려줍니다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 gap-2 sm:grid-cols-4 mb-4">
        {PROVIDER_CONTEXTS.map((item, index) => (
          <button
            type="button"
            key={item.title}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-3 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-xs font-bold" style={{ color: item.color }}>
              {item.title}
            </p>
          </button>
        ))}
      </div>
      <div className="not-prose mb-8 rounded-xl border border-border/60 p-4 text-sm leading-6 text-foreground/75">
        {context.desc}
      </div>

      <h3 className="text-lg font-semibold mb-3">
        Provider가 숨기는 V1/V2 route
      </h3>
      <div className="not-prose mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {RETH_STORAGE_ROUTES.map((route) => (
          <div
            key={route.data}
            className="rounded-xl border border-border/60 p-3"
          >
            <p className="text-sm font-semibold">{route.data}</p>
            <p className="mt-1 text-xs text-foreground/55">
              V1: {route.v1} · V2: {route.v2}
            </p>
          </div>
        ))}
      </div>

      <div className="not-prose">
        <ProviderLayerViz />
      </div>
    </section>
  );
}
