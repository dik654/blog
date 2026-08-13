import ContextViz from "./viz/ContextViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Storacha는 upload와 delegation을 UCAN 기반 service로 분리한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Storacha는 Web3.Storage가 이어진 현재 서비스다. 애플리케이션은
          content-addressed data를 업로드하고 HTTP 또는 IPFS로 빠르게 읽으면서,
          별도의 Filecoin storage path를 통해 장기 보존 사본을 확보한다. 과거
          Saturn CDN을 합친 서비스나 PDP 상품으로 설명하면 현재 architecture와
          맞지 않는다.
        </p>
      </div>
      <div className="not-prose">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          하나의 upload, 서로 다른 보존 시간축
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Content addressing</h4>
            <p className="text-sm text-muted-foreground">
              파일 위치가 아니라 CID로 내용을 식별해 gateway와 IPFS client가
              같은 bytes를 검증한다.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Hot availability</h4>
            <p className="text-sm text-muted-foreground">
              Storacha network가 업로드한 content를 즉시 읽을 수 있게 유지하고
              HTTP/IPFS retrieval을 제공한다.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Filecoin backing</h4>
            <p className="text-sm text-muted-foreground">
              aggregated data가 Filecoin storage deal로 넘어가 장기 사본을
              만들고 PoDSI record로 포함 관계를 추적한다.
            </p>
          </div>
        </div>
        <p className="leading-7">
          핵심은 “특정 CDN을 대체한다”가 아니라{" "}
          <strong>
            검증 가능한 content identity, 빠른 retrieval, 장기 Filecoin 보존
          </strong>
          을 한 developer workflow로 연결하는 데 있다. 가격·quota·지원 API는
          운영 정책이므로 문서의 고정 상수로 복제하지 않는다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          최신 service boundary는{" "}
          <a
            href="https://docs.storacha.network/"
            target="_blank"
            rel="noreferrer"
          >
            Storacha 공식 문서
          </a>
          와
          <a
            href="https://docs.storacha.network/concepts/filecoin-storage"
            target="_blank"
            rel="noreferrer"
          >
            Filecoin storage 설명
          </a>
          을 기준으로 확인한다.
        </p>
      </div>
    </section>
  );
}
