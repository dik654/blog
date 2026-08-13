import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

export default function RestGateway({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="rest-gateway" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">REST compatibility는 path 변환이 아니라 schema·media·snapshot parity다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Gateway는 HTTP path·query·body를 typed request로 바꿔 공통 service를 호출할 수 있습니다. 그러나 generated mapping만으로 표준 Beacon API의 JSON field, SSZ bytes, fork header, endpoint version과 HTTP error semantics가 자동으로 일치하지는 않습니다.</p>
        <h3>Content-Type과 Accept는 서로 다른 질문입니다</h3>
        <ul>
          <li><code>Content-Type</code>은 caller가 보낸 body 형식입니다. Endpoint가 그 형식을 받을 수 없으면 415로 구분합니다.</li>
          <li><code>Accept</code>는 caller가 원하는 response 형식입니다. 만들 수 없으면 406이고, 없으면 JSON을 기본으로 해석합니다.</li>
          <li>SSZ는 지원한다고 명시된 endpoint에서만 선택하며 response <code>Content-Type</code>과 fork/schema metadata를 함께 확인합니다.</li>
        </ul>
        <p>모든 v2 endpoint가 v1보다 한 세대 새 API라는 뜻도 아닙니다. Endpoint는 독립적으로 versioning되므로 client는 path 이름이 아니라 사용한 OpenAPI schema와 response field를 기준으로 decode해야 합니다.</p>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton onClick={() => onCodeRef("get-block-v2", codeRefs["get-block-v2"])} />
          <CodeViewButton onClick={() => onCodeRef("get-state-v2", codeRefs["get-state-v2"])} />
        </div>
        <h3>State identifier는 한 snapshot으로 resolve합니다</h3>
        <p><code>head</code> 요청을 처리하는 사이 chain이 A에서 B로 reorg될 수 있습니다. Handler가 body는 A에서, optimistic/finalized metadata는 B에서 읽으면 각 field는 valid해도 response 전체가 존재한 적 없는 혼합 snapshot이 됩니다. Resolve한 block/state root, slot, fork/version, dependent root와 execution-optimistic/finalized flag를 한 read view에서 만들고 receipt로 남겨야 합니다.</p>
        <p>HTTP 200, slot 일치 또는 SSZ decode 성공은 canonical·finalized evidence가 아닙니다. Client가 강한 consistency를 요구하면 symbolic <code>head</code> 대신 returned root를 후속 요청에 pin하거나 response 사이 root 변화를 명시적으로 처리합니다.</p>
        <h3>세 transport를 같은 의미로 비교합니다</h3>
        <p>REST JSON, 지원 endpoint의 REST SSZ와 gRPC에 같은 resolved root를 넣고 공통 typed value·SSZ hash-tree-root·fork metadata·optimistic/finalized flag를 비교합니다. Malformed JSON/SSZ, unknown field, unsupported media와 missing state가 각 transport의 typed status로 일관되게 매핑된 뒤에만 serialization latency를 비교합니다.</p>
      </div>
    </section>
  );
}
