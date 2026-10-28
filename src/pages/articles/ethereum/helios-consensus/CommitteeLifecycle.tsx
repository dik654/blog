import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function CommitteeLifecycle({ title, onCodeRef }: Props) {
  return (
    <section id="committee-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>T0</code>는 current <code>K0</code>와 next <code>K1</code>을 함께 보관합니다. Signature slot 8,193은 period 1이므로
          <code>u-8193</code>의 서명은 <code>K0</code>가 아니라 <code>K1</code>로 검증합니다.
        </p>
        <p>
          Update의 next committee <code>K2</code>는 attested state의 Merkle branch에 묶여야 합니다. Signature가 맞아도 branch가 틀리면
          <code>K2</code>를 다음 key set으로 쓸 수 없습니다.
        </p>
      </div>
      <ExplainedFormula
        question="어떤 sync committee가 signature slot을 담당하는지 어떻게 계산할까요?"
        idea="Slot을 epoch으로, epoch을 committee period로 두 번 정수 나눗셈합니다. Mainnet preset에서는 두 상수의 곱이 8,192 slots입니다."
        formula={String.raw`period(s)=\left\lfloor\frac{\lfloor s/S_{epoch}\rfloor}{E_{period}}\right\rfloor=\left\lfloor\frac{s}{8192}\right\rfloor`}
        annotatedFormula={String.raw`period(s)=\biggl\lfloor\frac{\underbrace{\lfloor s/S_{epoch}\rfloor}_{\text{epoch 번호}}}{\underbrace{E_{period}}_{\text{period당 epoch}}}\biggr\rfloor=\underbrace{\left\lfloor\frac{s}{8192}\right\rfloor}_{\text{mainnet 한 번 나눗셈}}`}
        operations={[
          { expression: String.raw`\lfloor s/S_{epoch}\rfloor`, annotation: ["signature slot을 32 slots/epoch로 묶음","slot 8,192 → epoch 256"] },
          { expression: String.raw`\left\lfloor\frac{s}{8192}\right\rfloor`, annotation: ["두 floor는 32×256=8,192 한 번과 같음","8,191 → period 0, 8,192 → period 1","8,192 서명을 period 0으로 검증 금지"] },
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
        <h3>Period 경계에서는 두 committee를 함께 바꿉니다</h3>
        <p>
          <code>u-8193</code>의 finalized slot 8,192는 <code>T0</code>의 period 0에서 period 1로 넘어갑니다. 적용 함수는 기존 next
          <code>K1</code>을 current로 옮기고, branch로 검증한 <code>K2</code>를 새 next로 넣습니다. 참여 최댓값도 같은 경계에서 넘기고 현재 값을 0으로 초기화합니다.
        </p>
        <p>
          검증된 next committee 없이 period를 넘었다면 새 signature를 확인할 key set이 없습니다. 이때 임의 endpoint의 committee를 받아 계속하면
          신뢰 사슬이 끊깁니다. 기존 finalized state에서 연결되는 update를 다시 요청하거나, 새 checkpoint를 별도로 승인해 부트스트랩해야 합니다.
        </p>
      </div>
      <div className="not-prose mt-5">
        <CodeViewButton label="실제 committee 교체 코드 보기" onClick={() => onCodeRef("hl-apply-update", codeRefs["hl-apply-update"])} />
      </div>
    </section>
  );
}
