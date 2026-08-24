import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function RegistrySlashings({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="registry-slashings" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Registry queue와 slashing은 membership과 accountability를 다른 clock으로 갱신한다</h2>
      <div className="not-prose mb-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("process-registry", codeRefs["process-registry"])} /><span className="text-xs text-muted-foreground">Prysm registry/slashing seam</span></div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Registry update는 activation eligibility, activation epoch와 low-balance ejection을 처리합니다. Electra의 pending deposits·partial withdrawals·consolidations는 finality와 churn budget을 확인하는 queue로 들어가므로, request가 block에 포함됐다는 사실과 validator balance/lifecycle에 적용됐다는 사실은 다릅니다.</p>
        <p>Slashing은 proposer·attester의 객관적 충돌 evidence가 block processing에서 확인될 때 시작되지만, 즉시 penalty와 correlated penalty·withdrawability는 여러 epoch에 걸쳐 적용됩니다. Evidence 수신, slashed flag, exit, penalty와 withdrawal을 한 이벤트로 합치지 않습니다.</p>
      </div>
      <ExplainedFormula
        question="왜 여러 validator가 함께 slash될수록 correlation penalty가 커질까요?"
        idea={<>최근 slashing window의 총 slashed balance를 전체 active balance에 대한 비율로 만들고, fork가 정한 multiplier와 상한을 적용한 뒤 각 validator effective balance에 비례시킵니다.</>}
        formula={String.raw`p_i \approx E_i\min\!\left(1,\frac{mS}{A}\right)`}
        annotatedFormula={String.raw`\underbrace{p_i}_{\text{correlation penalty 계산}} \approx \underbrace{E_i}_{\text{effective balance 계산}}\min\!\left(1,\frac{mS}{\underbrace{A}_{\text{total active balance 계산}}}\right)`}
        operations={[
          { expression: String.raw`p_i`, annotation: ["correlation penalty이(가) 식의 결과에","기여하는 방식을 계산합니다.","최근 slashing window의 총 slashed","balance를 전체 active balance에 대한 비율로"] },
          { expression: String.raw`E_i`, annotation: ["effective balance이(가) 식의 결과에 기여하는","방식을 계산합니다.","최근 slashing window의 총 slashed","balance를 전체 active balance에 대한 비율로"] },
          { expression: String.raw`A`, annotation: ["total active balance이(가) 식의 결과에","기여하는 방식을 계산합니다.","최근 slashing window의 총 slashed","balance를 전체 active balance에 대한 비율로"] },
        ]}
        terms={[
          { symbol: "p_i", name: "correlation penalty", description: "Validator i에 귀속되는 근사 penalty이며 단위는 Gwei입니다." },
          { symbol: "E_i", name: "effective balance", description: "Validator i의 fork 규격상 유효 stake이며 Gwei입니다." },
          { symbol: "S", name: "recent slashed balance", description: "규격의 slashing vector/window에 누적된 effective balance 합입니다." },
          { symbol: "A", name: "total active balance", description: "같은 state snapshot의 활성 effective balance 총합입니다." },
          { symbol: "m", name: "fork multiplier", description: "Fork가 정한 proportional-slashing multiplier입니다." },
        ]}
        assumptions={["실제 executable spec은 effective-balance increment와 integer division·penalty timing을 사용합니다.", "Slashing evidence validity와 immediate penalty는 이 근사식 밖의 별도 단계입니다."]}
        interpretation="E=32, S/A=1%, m=3인 toy example은 약 0.96 stake-unit이지만 S/A=40%면 min 상한으로 E 전체를 넘지 않습니다. 시장 가격 손실이나 모든 slashing의 최종 손실을 이 식 하나로 예측할 수는 없습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Queue는 finality와 churn으로 처리 속도를 제한합니다</h3>
        <p>Electra pending deposit은 legacy bridge deposit 선행 처리, queue position finalization, epoch당 개수와 activation/exit churn budget을 확인합니다. 작은 예로 budget이 64 balance-unit이고 queue 앞 요청이 40·32라면 첫 요청 뒤 24만 남아 두 번째를 이번 epoch에 모두 적용할 수 없습니다. 단순 FIFO pop이 아니라 fork rule에 따라 postpone·carry-over가 생깁니다.</p>
        <h3>Release gate는 balance 합계만 보지 않습니다</h3>
        <p>Fork 전·activation epoch·후 fixture에서 participation flags, checkpoints, per-validator reward/penalty, inactivity score, registry epochs, pending queue order, slashing vector와 post-state root를 base/candidate로 비교합니다. 1/3 미만·정확히 threshold·초과 participation, correlated slash, churn exhaustion, reorg와 epoch-boundary crash/restart를 포함하고 parity 뒤에 CPU·allocation·epoch-processing p99를 봅니다.</p>
      </div>
      <div id="paper-prysm-epoch-source" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">공식 구현 읽기 · Prysm epoch processing</p><p className="mt-2 text-sm font-semibold">OffchainLabs/prysm source repository</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Consensus spec의 ordered epoch transition이 선택한 Prysm release의 precompute·state mutation·error path로 구현되는 위치를 확인합니다. 특정 cache 또는 benchmark를 protocol guarantee로 일반화하지 않습니다.</p><a href="https://github.com/OffchainLabs/prysm" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">Prysm 공식 source 보기</a></div>
    </section>
  );
}
