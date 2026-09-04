import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import PrysmDataApiViz from "../prysm-data-api-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Beacon API는 URL 목록이 아니라 transport와 consensus effect 사이의 계약이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">Validator가 proposer duty를 받아 unsigned block을 요청하고 서명해 제출하는 동안, 같은 beacon node는 dashboard의 head 조회와 SSE event도 처리합니다. 이 호출들은 모두 HTTP 또는 gRPC를 통과하지만 권한·deadline·consistency·side effect가 같지 않습니다. 이 글은 한 duty를 <strong>wire decode → snapshot 해석 → service 실행 → local sign → publish → reconciliation</strong> 순서로 추적합니다.</p>
        <p><Link to="/blockchain/prysm-validator-client">Validator client 글</Link>이 key와 slashing protection을, <Link to="/blockchain/prysm-block-proposal">block proposal 글</Link>이 block assembly를 소유합니다. 여기서는 REST/gRPC adapter, JSON/SSZ schema, state identifier, endpoint exposure와 timeout·stream gap 복구만 소유합니다.</p>
      </div>
      <ContentBoundary article="prysm-beacon-api" />
      <PrysmDataApiViz mode="beacon-api" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Transport adapter와 consensus service를 분리합니다</h3>
        <p>REST adapter는 method·path·headers·query·body를 typed request로 바꾸고 HTTP status·JSON/SSZ response를 만듭니다. gRPC adapter는 protobuf message와 gRPC status를 다룹니다. 두 adapter는 공통 service를 호출할 수 있지만 core handler 공유만으로 schema·error·authorization parity가 자동으로 생기지는 않습니다.</p>
        <p>따라서 receipt에는 API/spec version, endpoint, transport, request digest, resolved state/dependent root, deadline, status와 response/effect digest가 필요합니다. HTTP 2xx는 transport가 response를 만들었다는 뜻이지 block inclusion·canonical head·finality를 증명하지 않습니다.</p>
        <h3>Endpoint version은 API 전체 세대가 아닙니다</h3>
        <p>
            Beacon API endpoint는 개별적으로 versioning됩니다. 모든 v2 endpoint가 v1보다 “최신 전체 API”라고 볼 수 없고 field가 추가되는 일부
            compatible change는 endpoint version 증가 없이 일어날 수 있습니다. Client는 사용한 OpenAPI commit과 endpoint schema를
            고정하고 unknown field 처리도 테스트해야 합니다.
          </p>
      </div>
      <div id="paper-beacon-api-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum Beacon APIs — OpenAPI specification" href="https://ethereum.github.io/beacon-APIs/" citeKey={1}>
          독립 beacon/validator client가 endpoint·schema·media type·status를 같은 wire contract로 해석하는 근거입니다. Endpoint별 version과 JSON/SSZ negotiation을 정의하지만 Prysm gRPC package, 배포 authorization, latency나 duty inclusion까지 보장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-rpc-source" className="scroll-mt-24">
        <CitationBlock source="OffchainLabs/prysm — beacon-chain/rpc" href="https://github.com/OffchainLabs/prysm/tree/develop/beacon-chain/rpc" citeKey={2} type="code">
          Prysm process 안에서 gRPC/REST service와 handler가 연결되는 실제 seam입니다. Source claim은 사용한 release/SHA·build flags·enabled API에만 귀속하며 moving develop의 port·method·interceptor를 고정 제품 동작으로 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
