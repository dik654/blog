import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const OPS = [
  ["slashings", "서로 모순되는 signed evidence", "signature·domain·validator 상태·중복"],
  ["attestations", "head/source/target vote와 participation", "committee·bits·timeliness·BLS aggregate"],
  ["deposits / requests", "validator balance·credential 변화", "proof 또는 execution-request commitment·queue"],
  ["exits / consolidations", "validator lifecycle 변경 요청", "credential·epoch·churn·pending queue"],
] as const;

export default function Operations({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="operations" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Operations는 각기 다른 권한과 상한을 가진 순서 있는 list다</h2>
      <div className="not-prose mb-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("process-operations", codeRefs["process-operations"])} /><span className="text-xs text-muted-foreground">Prysm operation dispatch 경계</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
            Block body의 operation은 같은 타입의 command가 아닙니다. Proposer/attester slashing은 객관적 충돌 evidence를,
            attestation은 committee vote를, deposit·withdrawal·consolidation request는 validator lifecycle 변경을
            표현합니다. 각 list에는 fork별 SSZ limit이 있어 decode 전에 크기를 제한합니다. Handler는 list 순서대로 현재 candidate state를
            소비합니다.
          </p>
      </div>
      <div className="not-prose my-7 overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left text-sm"><thead><tr className="border-b border-border"><th className="p-3">family</th><th className="p-3">무엇을 주장하나</th><th className="p-3">별도로 검증할 것</th></tr></thead><tbody>{OPS.map(([name, claim, checks]) => <tr key={name} className="border-b border-border/70"><td className="p-3 font-mono text-primary">{name}</td><td className="p-3">{claim}</td><td className="p-3 text-muted-foreground">{checks}</td></tr>)}</tbody></table></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>작은 예로 order dependency를 확인합니다</h3>
        <p>같은 block 안에서 validator 7의 slashing evidence와 exit가 함께 들어왔다고 합시다. 앞 handler가 validator status와 withdrawable epoch를 바꾸면 뒤 handler가 읽는 precondition도 바뀝니다. List를 병렬로 적용하거나 종류를 임의로 재정렬하면 최종 balance·registry가 달라질 수 있으므로 검증은 병렬화하더라도 mutation commit은 spec order와 동일해야 합니다.</p>
        <h3>상한은 성능 힌트가 아니라 consensus validity입니다</h3>
        <p>예를 들어 Electra의 attestation representation과 최대 개수는 이전 fork와 다릅니다. 한도를 넘는 list, 중복 validator index, 잘못된 committee bits나 future-fork request를 조용히 truncate해서는 안 됩니다. Fork schema와 request type을 receipt에 남기고 unsupported input은 fail closed합니다.</p>
      </div>
    </section>
  );
}
