import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import ContextViz from "./viz/ContextViz";
import EngineAPIFlowViz from "./viz/EngineAPIFlowViz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Engine API는 합의 결과와 EVM 실행 결과를 맞추는 상태 있는 경계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
            어떤 beacon block을 head·safe·finalized로 볼지는 Prysm이 결정합니다. 다만 transaction을 EVM으로 실행하는 일은 Prysm의 몫이
            아닙니다. 반대로 execution client는 payload의 state root와 receipts root를 계산할 수 있지만 canonical chain을 고르는
            validator vote에는 관여하지 않습니다. Engine API는 이 두 판단을 합치지 않은 채 검증·chain pointer 갱신·다음 payload 생성을 순서대로
            조정합니다.
          </p>
        <p>이 글은 JSON-RPC 메서드 이름을 외우는 대신 <strong>수신 payload 검증 → fork-choice 적용 → build handle 발급 → payload 회수</strong>를 block hash 하나로 추적합니다. 먼저 <Link to="/blockchain/prysm">Prysm 전체 지도</Link>의 consensus/execution owner 경계를 짧게 재사용하고, 이 글에서는 method version·status·latestValidHash·payloadId·JWT가 만드는 Engine 전용 계약만 정의합니다.</p>
      </div>
      <ContentBoundary article="prysm-engine-api" />
      <ContextViz />
      <EngineAPIFlowViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>메서드는 API 전체가 아니라 각각 독립적으로 versioning됩니다</h3>
        <p><code>engine_newPayloadVn</code>, <code>engine_forkchoiceUpdatedVn</code>, <code>engine_getPayloadVn</code>의 <code>n</code>은 같은 숫자로 함께 올라가는 제품 버전이 아닙니다. Parameter·response·behavior·structure field 중 하나가 바뀌면 해당 메서드나 구조의 suffix가 올라가므로, client는 활성 execution fork와 <code>engine_exchangeCapabilities</code> 결과를 함께 보아 지원 조합을 선택해야 합니다.</p>
        <p>예를 들어 Prague 계열 <code>newPayloadV4</code>는 execution payload 외에 expected blob versioned hashes, parent beacon block root, execution requests를 받습니다. V3 호출의 성공 경험을 V4 입력 검증으로 확대할 수 없고, 지원하지 않는 fork는 typed error로 중단해야 합니다.</p>
        <h3>전송 성공과 protocol 성공을 분리합니다</h3>
        <p>HTTP 200 또는 JSON-RPC result는 요청을 처리했다는 transport evidence일 뿐 payload가 canonical·valid하다는 뜻이 아닙니다. Payload status, <code>latestValidHash</code>, fork-choice pointer, <code>payloadId</code>와 request method/version을 한 receipt로 남겨야 timeout·sync·invalid branch·restart를 서로 다른 복구 경로로 보낼 수 있습니다.</p>
        <h3>JWT는 caller authentication이지 암호화나 합의 증명이 아닙니다</h3>
        <p>Engine endpoint는 기본 8551 포트의 별도 authenticated interface이며, CL과 EL은 256-bit secret으로 HS256 JWT를 사용합니다. 필수 <code>iat</code>는 EL 현재 시각에서 보통 ±60초 범위를 권고하므로, 시계가 75초 어긋난 노드는 올바른 secret을 가지고도 거절될 수 있습니다. JWT는 network sniffing이나 replay를 막도록 설계된 암호화 채널이 아니므로 host·network isolation과 secret file permission이 별도로 필요합니다.</p>
      </div>
      <div id="paper-engine-api-spec" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · Engine API</p>
        <p className="mt-2 text-sm font-semibold">Ethereum Execution APIs — Engine namespace</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            문제는 CL과 EL의 독립 구현이 method version, message ordering, payload status, build lifecycle을 모두 같은 wire
            contract로 해석하는 것입니다. 규격은 protocol behavior를 정의하지만 Prysm 내부 package나 특정 EL의 latency·storage까지 정해주지는
            않습니다. 이 글은 2026-08-14 main commit 742d45d를 기준으로 읽었습니다. 배포할 때는 사용한 commit을 다시 고정하는 것이 전제입니다.
          </p>
        <a href="https://github.com/ethereum/execution-apis/tree/main/src/engine" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Engine API 공식 규격 보기</a>
      </div>
      <div id="paper-engine-authentication" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 읽기 · authentication</p>
        <p className="mt-2 text-sm font-semibold">Engine API Authentication</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            정의하는 것은 256-bit shared secret, HS256, 필수 iat입니다. 공격 범위도 여기서 함께 정합니다. Caller가 인증됐다는 사실을 payload
            validity·confidentiality·replay protection으로 일반화하는 것은 규격이 보장하지 않는 범위입니다.
          </p>
        <a href="https://github.com/ethereum/execution-apis/blob/main/src/engine/authentication.md" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Authentication 규격 보기</a>
      </div>
    </section>
  );
}
