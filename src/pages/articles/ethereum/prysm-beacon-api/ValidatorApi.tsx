import type { CodeRef } from "@/components/code/types";

export default function ValidatorApi(_props: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validator-api" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Duty API는 조회→서명→publish effect를 하나의 deadline 있는 lifecycle로 묶는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
            Epoch의 proposer duty를 받았다는 사실만으로 서명할 수 있는 것은 아닙니다. Response의 dependent root와 validator index·slot을
            scheduler에 넣고 deadline 전에 unsigned object를 받은 뒤 local slashing protection이 같은 duty/signing root를
            허용할 때만 key를 사용합니다.
          </p>
        <h3>Proposer 하나를 끝까지 추적합니다</h3>
        <ol>
          <li>Epoch와 validator 집합으로 duty를 조회하고 dependent root와 response digest를 저장합니다.</li>
          <li>Reorg로 dependent root가 달라지면 아직 실행하지 않은 schedule을 갱신하고 stale work를 취소합니다.</li>
          <li>Assigned slot의 unsigned block을 받아 fork domain·signing root·deadline을 고정합니다.</li>
          <li>Local slashing DB가 request digest를 atomic intent로 승인한 뒤 BLS signature를 만듭니다.</li>
          <li>Signed block을 publish하고 transport result, object root와 이후 inclusion evidence를 따로 기록합니다.</li>
        </ol>
        <p>Publish가 timeout났는데 node가 이미 object를 받았을 수 있습니다. 이때 다른 block을 다시 서명하지 않고 같은 stable duty ID와 signing root의 intent를 확인합니다. Same-root retry 또는 pool/block query로 결과를 reconcile하며 deadline을 넘겼거나 effect가 불명확하면 typed unknown으로 멈춥니다. 2xx는 inclusion이나 finality를 보장하지 않습니다.</p>
        <h3>SSE는 알림 채널이지 durable event log가 아닙니다</h3>
        <p><code>/eth/v1/events</code>의 head·finalized checkpoint·chain reorg event는 polling을 줄이지만 disconnect 중 event 보존이나 exactly-once delivery를 보장하지 않습니다. Connection generation, 마지막 head/finalized identity와 event digest를 기록하고 A 이후 끊겨 B에서 재연결되면 canonical head·finality API를 다시 조회해 A→B gap, reorg와 duplicate를 조정합니다.</p>
        <h3>Release matrix는 의미 parity를 먼저 검사합니다</h3>
        <p>
            Base/candidate의 OpenAPI commit·Prysm SHA·fork·state/duty fixture·authorization policy를 고정합니다. REST
            JSON/SSZ와 gRPC의 resolved root·typed value·status를 비교하고 unsupported media, head reorg, stale duty,
            unauthorized effect, timeout-after-publish, SSE disconnect와 restart를 주입합니다. Effect count·signing
            intent·response root·reconciliation outcome이 같아야 p50·p95를 비교할 수 있습니다.
          </p>
        <p>Rollback bundle에는 이전 binary·config·API schema, signer/slashing DB compatibility와 관찰 receipt가 들어갑니다. Happy-path Swagger 호출이나 한 번의 성공 proposal은 schema·authority·effect recovery를 입증하지 않습니다.</p>
      </div>
    </section>
  );
}
