import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";

export default function DutyAssignment({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="duty-assignment" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Duty loop는 protocol slot을 local deadline과 취소 가능한 작업으로 바꾼다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Beacon node는 epoch마다 validator index별 proposer·attester·aggregator 같은 duty를 제공합니다. Validator client는
          이를 cache하되 chain reorg, dependent root 변화와 epoch transition에서 stale duty인지 확인합니다. 한 slot에 여러
          validator와 역할이 겹칠 수 있으므로 worker를 병렬로 실행할 수 있지만 각 작업은 같은 slot clock과 shutdown context를
          공유해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Slot 안의 특정 protocol action을 언제 시작하고 언제 포기해야 할까요?"
        idea="Genesis time에서 slot 길이만큼 이동해 slot 시작을 계산하고, 규격이 정한 phase fraction을 더해 action deadline을 만듭니다. Network·clock 여유를 빼 실제 local cutoff를 둡니다."
        formula={String.raw`\begin{aligned}t_{action}&=t_{genesis}+sT_{slot}+\alpha T_{slot}\\t_{cutoff}&=t_{action}-\delta\end{aligned}`}
        terms={[
          { symbol: "s", name: "슬롯 번호", description: "genesis부터 센 slot index(slot 단위)" },
          { symbol: "T_{slot}", name: "슬롯 길이", description: "해당 network configuration의 slot duration(초)" },
          { symbol: "\\alpha", name: "작업 시점 비율", description: "proposal·attestation·aggregation action이 놓인 slot 내 비율" },
          { symbol: "\\delta", name: "안전 여유", description: "서명·전송·clock skew를 위한 local safety budget(초)" },
        ]}
        assumptions={[
          "System clock이 protocol이 허용하는 오차 안에 있고 genesis/network configuration이 정확합니다.",
          "Action phase는 active fork의 validator specification에서 읽으며 고정 상수로 일반화하지 않습니다.",
          "Deadline을 지났다고 conflicting object로 재시도해서는 안 되며 missed duty와 slashable duty를 구분합니다.",
        ]}
        interpretation="설명용으로 slot이 12초이고 α=1/3이면 action 시각은 slot 시작 4초 뒤입니다. δ=0.5초라면 local pipeline은 3.5초까지 signing input을 확정해야 합니다. 이 숫자는 예시이며 current config를 코드에 하드코딩하지 않습니다."
      />

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("validator-loop", codeRefs["validator-loop"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 validator loop 확인</span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Duty receipt가 있어야 “왜 놓쳤는지”를 구분할 수 있습니다</h3>
        <p>
          Receipt에는 epoch, dependent root, validator index/pubkey, role, committee/index, slot, beacon-node endpoint와 응답
          revision을 남깁니다. 실행 단계에는 head/root를 받은 시각, signing root 확정 시각, slashing check와 signer
          latency, submit 결과를 이어 붙입니다. 그래야 duty가 없었던 것과 API 지연, stale head, signer timeout, broadcast 실패를
          서로 다른 원인으로 분류할 수 있습니다.
        </p>

        <h3>Reorg와 deadline이 만나는 반례</h3>
        <p>
          Attestation 준비 중 head가 바뀌었다고 이미 승인된 signing root를 무조건 새 root로 교체하면 double vote나
          surround condition을 만들 수 있습니다. 반대로 너무 일찍 root를 고정하면 stale head에 vote할 수 있습니다. Client는
          validator spec의 observation timing에 맞춰 head를 선택하고, slashing history가 허용하는 동일 duty identity 안에서만
          서명하며 deadline 이후에는 안전하게 missed duty로 종료합니다.
        </p>
      </div>
    </section>
  );
}
