import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const STATUS = [
  ["VALID", "payload와 필요한 ancestor 검증이 완료됨", "latestValidHash는 payload block hash"],
  ["INVALID", "실행 규칙 위반 또는 invalid ancestor", "가장 최신의 fully valid ancestor 또는 null/zero 규칙"],
  ["SYNCING", "검증에 필요한 data가 없음", "valid로 간주하지 않고 optimistic 상태로 추적"],
  ["ACCEPTED", "비정규 branch를 아직 완전 검증하지 않음", "newPayload의 일부 version 문맥에서만 사용"],
] as const;

export default function NewPayload({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="new-payload" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">newPayload는 payload를 제출하고 판정 evidence를 돌려받는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Beacon block의 execution payload를 받은 Prysm은 활성 fork에 맞는 <code>engine_newPayloadVn</code>을 선택합니다. Request에는 payload뿐 아니라 fork가 요구하는 blob hash·parent beacon block root·execution requests가 함께 들어가며, EL은 block hash와 execution result가 이 문맥과 일치하는지 확인합니다.</p>
      </div>
      <div className="not-prose my-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("engine-new-payload", codeRefs["engine-new-payload"])} /><span className="text-xs text-muted-foreground">선택한 Prysm snapshot의 Engine 호출 경계</span></div>
      <div className="not-prose my-7 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead><tr className="border-b border-border"><th className="p-3">status</th><th className="p-3">현재 말할 수 있는 것</th><th className="p-3">복구에 필요한 필드</th></tr></thead>
          <tbody>{STATUS.map(([s, meaning, recovery]) => <tr key={s} className="border-b border-border/70"><td className="p-3 font-mono font-semibold text-primary">{s}</td><td className="p-3">{meaning}</td><td className="p-3 text-muted-foreground">{recovery}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>latestValidHash는 rollback 지점이지 에러 메시지의 부록이 아닙니다</h3>
        <p>A–B–C branch에서 C가 INVALID이고 B가 fully validated라면 <code>latestValidHash=B</code>는 invalid suffix를 C부터 잘라낼 수 있는 기준입니다. EL이 유효 ancestor를 아직 판정할 수 없다면 null일 수 있으므로, null을 genesis나 parent hash로 임의 치환하면 안 됩니다. <code>validationError</code>는 진단용 문자열이고 machine decision은 versioned status와 hash 규칙을 따릅니다.</p>
        <h3>SYNCING을 자동 retry 가능한 VALID로 바꾸지 않습니다</h3>
        <p>
            SYNCING은 필요한 ancestor/state가 아직 없다는 뜻입니다. 같은 payload identity의 validity는 확정 전까지 optimistic marker로
            남습니다. 이후 VALID면 marker를 해제하고 INVALID면 latest valid ancestor 이후의 descendant와 관련 head를 조정합니다.
            Transport timeout도 status가 아니므로 요청 ID·method version·deadline을 남긴 뒤 progression에 필요할 때만 idempotent
            validation을 다시 요청합니다.
          </p>
        <h3>Version별 입력의 길이와 순서가 validation 일부입니다</h3>
        <p>Prague <code>newPayloadV4</code>의 <code>executionRequests</code>는 request type 오름차순이어야 하고 empty data·duplicate type·null array는 invalid params입니다. <code>expectedBlobVersionedHashes</code>와 commitment, parent beacon block root도 block hash 검증 문맥에 들어가므로 transaction execution만 성공했다고 V4 payload가 valid한 것은 아닙니다.</p>
      </div>
    </section>
  );
}
