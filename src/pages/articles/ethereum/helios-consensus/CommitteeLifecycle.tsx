import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function CommitteeLifecycle({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="committee-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Store는 current와 next committee를 함께 보관해 period 경계 전에 다음 public keys를 검증해 둡니다. Update의 next committee는
          attested/finalized state의 Merkle branch에 묶여야 하며 단지 signature가 valid하다는 이유로 교체하지 않습니다. 경계에서는 검증된
          next를 current로 옮기고 새 next를 채울 수 있는 update를 기다립니다.
        </p>
      </div>
      <ExplainedFormula
        question="어떤 sync committee가 signature slot을 담당하는지 어떻게 계산할까요?"
        idea="Slot을 epoch으로, epoch을 committee period로 두 번 정수 나눗셈합니다. Mainnet preset에서는 두 상수의 곱이 8,192 slots입니다."
        formula={String.raw`period(s)=\left\lfloor\frac{\lfloor s/S_{epoch}\rfloor}{E_{period}}\right\rfloor=\left\lfloor\frac{s}{8192}\right\rfloor`}
        annotatedFormula={String.raw`period(s)=\underbrace{\left\lfloor\frac{\lfloor s/S_{epoch}\rfloor}{E_{period}}\right\rfloor=\left\lfloor\frac{s}{8192}\right\rfloor}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\left\lfloor\frac{\lfloor s/S_{epoch}\rfloor}{E_{period}}\right\rfloor=\left\lfloor\frac{s}{8192}\right\rfloor`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Slot을 epoch으로, epoch을 committee","period로 두 번 정수 나눗셈합니다."] },
        ]}
        terms={[
          { symbol: "s", name: "Signature slot", description: "Aggregate signature가 생성된 beacon slot" },
          { symbol: "S_{epoch}", name: "Epoch당 slot", description: "Mainnet preset 예시 32 slots/epoch" },
          { symbol: "E_{period}", name: "Period당 epoch", description: "Mainnet preset 예시 256 epochs/period" },
          { symbol: "8192", name: "Period당 slot", description: "32×256 slots; 12초/slot이면 약 27.3시간" },
          { symbol: "period(s)", name: "Committee period index", description: "해당 signature를 검증할 current/next committee 선택 기준" },
        ]}
        assumptions={[
          "S_epoch와 E_period는 활성 network preset에서 읽고 예시 32·256을 다른 network에 고정하지 않습니다.",
          "Committee period는 weak-subjectivity period와 다르며 finality 자체의 시간 보장도 아닙니다.",
          "Spec의 signature-slot/attested-slot 관계와 fork transition validation을 함께 적용합니다.",
        ]}
        interpretation="Slot 8,191은 period 0, slot 8,192는 period 1입니다. 따라서 8,192에서 나온 signature를 period 0 committee로 검증하면 안 됩니다. 약 27.3시간은 교체 주기일 뿐 checkpoint 안전 기간이 아닙니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>경계 실패와 재부트스트랩</h3>
        <p>
          Next committee를 검증하지 못한 채 period가 넘어가면 새 signature를 확인할 trusted key set이 없습니다. 이때 임의 endpoint의 next
          committee를 받아 계속하는 대신, 보유한 trusted finalized state에서 연결 가능한 update range를 다시 요청하거나 새 checkpoint를
          별도 승인해 재부트스트랩합니다. Old current·new next를 섞은 store는 폐기하고 generation 단위로 적용합니다.
        </p>
      </div>
    </section>
  );
}
