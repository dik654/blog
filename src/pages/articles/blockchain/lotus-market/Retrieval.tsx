import RetrievalViz from "./viz/RetrievalViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function Retrieval({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="retrieval" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-3">
        Retrieval은 별도의 delivery contract다
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        legacy retrieval-market snapshot은 query와 payment-channel voucher를 하나로 묶었다. 지금 retrieval은 다르다.
        IPNI/content routing과 HTTP·libp2p transport, cache/unseal 상태, provider별 payment policy를 독립적으로 조합할 수
        있다.
      </p>
      <div className="not-prose mb-8">
        <RetrievalViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Discover</h3>
            <p className="text-sm text-muted-foreground">
              payload/piece CID를 가진 provider와 supported retrieval protocol을
              찾는다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">Negotiate</h3>
            <p className="text-sm text-muted-foreground">
              확인 대상은 availability와 unseal 필요 여부, byte range, price, authorization이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold text-sm mb-2">
              Transfer &amp; verify
            </h3>
            <p className="text-sm text-muted-foreground">
              선택한 transport로 bytes를 받고 CID/segment commitment를 검증한 뒤
              결제 정책에 맞게 정산한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          payment channel은 가능한 결제 방식 중 하나이지 모든 retrieval의 필수 단계가 아니다. IPNI도 단일 중앙 indexer는 아니다. provider
          advertisement를 조회하는 indexing network/API 경계에 가깝다.
        </p>
      </div>
    </section>
  );
}
