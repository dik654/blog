import ContextViz from "./viz/ContextViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        Dealmaking service와 온체인 market state를 분리한다
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Lotus에 내장됐던 markets subsystem은 2023년 EOL됐고 2024년 코드에서 제거됐다. 지금 provider dealmaking은 Boost 같은 별도 서비스가
        맡는다. Lotus는 chain과 message, actor state 경계를 제공한다.
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Negotiation</h3>
            <p className="text-sm text-muted-foreground">
              provider policy와 transfer protocol, pricing, piece preparation은 off-chain service 책임이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">On-chain contract</h3>
            <p className="text-sm text-muted-foreground">
              deal proposal과 allocation/claim, activation·expiry처럼 consensus-visible한 사실은 market actor
              message와 state가 기록한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Storage proof</h3>
            <p className="text-sm text-muted-foreground">
              sealing/proving pipeline은 deal data를 sector에 넣고 replica와 PoSt를 증명하는 일을 맡는다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          “storage market”과 “retrieval market”을 하나의 고정 제품 흐름으로 묶지 않는다. retrieval은 HTTP나 libp2p, IPFS 경로와 별도 결제
          정책을 쓸 수 있다. on-chain storage deal이 있다고 특정 retrieval protocol이 자동 보장되는 것도 아니다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          번들된 <code>provider.go</code>는 삭제된 Lotus markets 구현의 역사적
          snapshot이다. 현재 운영 경계는{" "}
          <a
            href="https://lotus.filecoin.io/kb/manage-storage-deals-legacy/"
            target="_blank"
            rel="noreferrer"
          >
            Lotus legacy markets 안내
          </a>
          를 기준으로 본다.
        </p>
      </div>
    </section>
  );
}
