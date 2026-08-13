import ContextViz from "./viz/ContextViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        EC의 head와 F3의 finality를 분리해서 본다
      </h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Expected Consensus는 tipset을 계속 생산하고 가장 무거운 chain을
        선택한다. F3는 그 chain의 prefix에 power-weighted certificate를 더해,
        애플리케이션이 “현재 head”와 “되돌리지 않을 finality”를 별도로 판단하게
        한다.
      </p>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          왜 별도 finality protocol인가
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EC가 제공하는 것</h4>
            <p className="text-sm text-muted-foreground">
              storage power 기반 leader election과 tipset weight로 활발하게 새
              head를 만든다. 짧은 reorg 가능성은 남는다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">소비자가 필요한 것</h4>
            <p className="text-sm text-muted-foreground">
              bridge·exchange·FVM application은 임의의 “N confirmations”보다
              검증 가능한 finality boundary가 필요하다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">F3가 더하는 것</h4>
            <p className="text-sm text-muted-foreground">
              quality-adjusted power의 2/3를 넘는 결정과 certificate chain으로
              EC prefix를 빠르게 finalize한다.
            </p>
          </div>
        </div>

        <p className="leading-7">
          F3의 이점은 고정된 “몇 분” 숫자보다{" "}
          <strong>
            finality certificate를 검증하고 이후 chain 선택이 그 경계 아래로
            돌아가지 않게 하는 것
          </strong>
          에 있다. 실제 latency는 network 상태, participant power, manifest
          parameter에 따라 달라진다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">현재 배포 상태</h3>
        <p className="leading-7">
          F3는 실험 계획이 아니라 Filecoin mainnet에서 활성화된 protocol이다.
          mainnet activation은 2025년 4월 29일에 이뤄졌으며,
          node·indexer·bridge는 latest certificate와 EC head를 함께 관찰해야
          한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          protocol과 rollout 상태는{" "}
          <a
            href="https://github.com/filecoin-project/go-f3"
            target="_blank"
            rel="noreferrer"
          >
            go-f3 공식 저장소
          </a>
          를 기준으로 확인한다. 번들 code는 이해용 snapshot이며 현재 API 전체를
          대체하지 않는다.
        </p>
      </div>
    </section>
  );
}
