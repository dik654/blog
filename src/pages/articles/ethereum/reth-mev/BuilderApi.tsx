import { useState } from "react";
import BuilderDetailViz from "./viz/BuilderDetailViz";
import { BUILD_PATHS } from "./BuilderApiData";
import type { CodeRef } from "@/components/code/types";

export default function BuilderApi({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <section id="builder-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Local payload와 external builder는 병렬이지만 다른 주체다
      </h2>
      <div className="not-prose mb-8">
        <BuilderDetailViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth의 payload builder는 Engine API lifecycle 안에서 local candidate를
          만듭니다. relay의 <code>getHeader</code>를 호출하거나 최고 bid를
          고르는 <code>MevPayloadBuilder</code>가 Reth core에 내장된 것으로
          설명하면 proposer-side MEV-Boost 책임을 execution client로 잘못 옮기게
          됩니다.
        </p>
        <p className="leading-7">
          rbuilder 같은 external builder는 Reth provider, EVM과 chain types를
          library로 재사용해 별도 block-building service를 만들 수 있습니다. 이
          경우에도 orderflow ingestion, bundle simulation, block optimization과
          bid submission은 downstream application의 정책이며 Reth node의 local
          payload job과 동일한 코드 경로가 아닙니다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">구성요소별 소유권</h3>
      <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 mb-8">
        {BUILD_PATHS.map((item, index) => (
          <button
            type="button"
            key={item.title}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-xl border p-4 text-left ${active === index ? "bg-muted/50" : "border-border"}`}
            style={{ borderColor: active === index ? item.color : undefined }}
          >
            <p className="text-sm font-bold" style={{ color: item.color }}>
              {item.title}
            </p>
            <p className="mt-1 text-xs text-foreground/45">
              소유: {item.owner}
            </p>
            <p className="mt-2 text-xs leading-5 text-foreground/65">
              {item.desc}
            </p>
          </button>
        ))}
      </div>

      <div className="not-prose rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-6 text-foreground/75">
        Liveness는 “외부 builder 실패 시 Reth 내부 wrapper가 항상 성공한다”는
        단일 보장으로 환원되지 않습니다. local payload readiness, proposer-side
        deadlines, relay delivery와 CL proposal timing을 함께 운영·관측해야
        합니다.
      </div>
    </section>
  );
}
