import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function PayloadRetrieval({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="payload-retrieval" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">getPayload은 payloadId가 가리키는 build 결과를 fork별 envelope로 회수한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><code>payloadId</code>는 block hash도 영구 database key도 아닙니다. 같은 EL process가 시작한 특정 build를 찾는 opaque handle이며, unknown·expired·restart 뒤 사라진 ID에는 <code>-38001 Unknown payload</code>가 올 수 있습니다. 따라서 proposer는 slot·head·attributes digest·method version·payloadId와 deadline을 한 build receipt로 묶어야 합니다.</p>
      </div>
      <div className="not-prose my-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("engine-get-payload", codeRefs["engine-get-payload"])} /><span className="text-xs text-muted-foreground">Prysm payload retrieval 경계</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Method version은 반환 envelope까지 바꿉니다</h3>
        <p>초기 version은 execution payload를 중심으로 했지만 이후 version은 withdrawals, block value, blob bundle, builder override hint와 execution requests 같은 fork별 정보를 추가했습니다. 그러므로 generic struct로 모르는 field를 조용히 버리기보다 active fork가 요구하는 response shape와 commitment를 모두 검증합니다.</p>
        <h3>Local build와 외부 builder path는 같은 신뢰 경계가 아닙니다</h3>
        <p>Local EL의 payload를 회수하는 path는 Engine build lifecycle 안에 있습니다. MEV-Boost 같은 외부 builder path는 bid·signed blinded block·unblinding·relay availability라는 별도 dependency가 있으므로 value만 비교해 같은 결과로 취급할 수 없습니다. Slot deadline 전에 full payload를 얻지 못하면 이미 서명한 header 때문에 무조건 local payload로 교체할 수 없는 경우도 있습니다.</p>
        <h3>Release gate는 method별 상태 전이를 재현합니다</h3>
        <p>Base와 candidate에 같은 execution-api commit, fork schedule, CL/EL version, payload tree와 clock/JWT fixture를 줍니다. Unsupported version, malformed V4 requests, wrong JWT·75초 clock skew, newPayload의 VALID/INVALID/SYNCING, inconsistent safe pointer, unknown payloadId, EL restart와 timeout을 주입한 뒤 status·latestValidHash·pointer·payloadId·payload envelope parity를 hard gate로 확인합니다. 그 뒤에만 p50/p99 latency와 missed proposal을 비교하며 실패하면 binary·config·secret·DB snapshot을 함께 rollback합니다.</p>
      </div>
      <div id="paper-prysm-engine-source" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 구현 읽기 · Prysm</p>
        <p className="mt-2 text-sm font-semibold">OffchainLabs/prysm Engine integration</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">규격의 method/status가 선택한 Prysm release에서 호출·timeout·optimistic state로 연결되는 위치를 확인합니다. Moving master의 함수 이름이나 한 benchmark를 모든 release의 고정 behavior로 일반화하지 않습니다.</p>
        <a href="https://github.com/OffchainLabs/prysm" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Prysm 공식 source 보기</a>
      </div>
    </section>
  );
}
