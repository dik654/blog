import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function UpdateTrace({
  title,
  onCodeRef: _onCodeRef,
}: Props & { title: string }) {
  return (
    <section id="update-trace" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div
        id="validate-update"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>
          검증은 time → period → branch → signature 순으로 범위를 좁힙니다
        </h3>
        <p>
          먼저 participation bit가 하나 이상이고 header의 execution payload
          branch가 fork schema에 맞는지 봅니다. 이어서{" "}
          <code>
            finalized slot ≤ attested slot &lt; signature slot ≤ current slot
          </code>
          인지, signature period가 store의 current 또는 허용된 next period인지,
          update가 store보다 새롭거나 필요한 next committee를 제공하는지
          확인합니다.
        </p>
        <p>
          Finalized header나 next committee가 있다면 각각의 SSZ Merkle branch를
          attested header의 state root에 연결합니다. 마지막으로 선택한
          current/next committee에서 set bit의 public key를 aggregate하고,
          signature slot의 fork version·genesis root로 만든 domain에서 BLS
          signature를 검증합니다. 서명만 맞아도 branch나 period가 틀리면 update
          전체를 거부합니다.
        </p>
      </div>

      <div id="slot-comparison" className="scroll-mt-24">
        <ExplainedFormula
          question="한 slot이 어느 sync-committee period에 속하는지 어떻게 계산할까요?"
          idea={
            <>
              Slot을 epoch 크기로 먼저 묶고, 다시 period당 epoch 수로 묶습니다.
              두 번의 정수 나눗셈은 하나의 곱으로 나눈 floor와 같습니다.
            </>
          }
          formula={
            "P(s)=\\left\\lfloor\\frac{s}{S_{\\rm epoch}E_{\\rm period}}\\right\\rfloor"
          }
          annotatedFormula={String.raw`P(s)=\underbrace{\left\lfloor\frac{s}{S_{\rm epoch}E_{\rm period}}\right\rfloor}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\left\lfloor\frac{s}{S_{\rm epoch}E_{\rm period}}\right\rfloor`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Slot을 epoch 크기로 먼저 묶고, 다시 period당","epoch 수로 묶습니다."] },
          ]}
          terms={[
            {
              symbol: "s",
              name: "Slot",
              description: "분류할 beacon slot number입니다.",
            },
            {
              symbol: "S_{\\rm epoch}",
              name: "Slots per epoch",
              description: "선택한 network preset의 epoch당 slot 수입니다.",
            },
            {
              symbol: "E_{\\rm period}",
              name: "Epochs per sync period",
              description: "Sync committee 하나가 담당하는 epoch 수입니다.",
            },
            {
              symbol: "P(s)",
              name: "Sync period",
              description: "Slot s를 서명할 committee generation index입니다.",
            },
          ]}
          assumptions={[
            "Slot과 preset parameter는 같은 network configuration에서 가져옵니다.",
            "Mainnet 예시는 32 slots/epoch와 256 epochs/period를 사용합니다.",
            "Period 일치는 committee membership 조건일 뿐 update freshness나 signature validity를 대신하지 않습니다.",
          ]}
          interpretation="Mainnet에서는 period가 8,192 slots마다 바뀝니다. slot 8,191은 period 0, slot 8,192는 period 1이므로 경계에서 old committee를 무조건 재사용하면 안 됩니다."
        />
      </div>

      <div
        id="apply-update"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>검증 성공과 Store pointer 갱신은 같은 사건이 아닙니다</h3>
        <p>
          유효한 update는 먼저 <code>best_valid_update</code> 후보가 될 수
          있습니다. 참여가 store의 safety threshold를 넘고 attested slot이 더
          높으면 optimistic header를 104에서 105로 옮길 수 있습니다. 반면
          finalized header를 100에서 102로 옮기려면 350/512처럼 2/3
          supermajority와 새 finality 또는 필요한 committee 정보가 있어야
          합니다. 어느 pointer도 slot이 낮아지는 방향으로 갱신하지 않습니다.
        </p>
        <h3>Committee handoff는 finalized evidence에 묶습니다</h3>
        <p>
          Store에 next committee가 없고 같은 period의 finalized update가
          committee branch를 제공하면 next를 채웁니다. Finalized slot이 다음
          period로 넘어가면 기존 next를 current로 승격하고 새 next를 저장합니다.
          단순히 wall clock이 period 경계를 지났다는 이유로 committee를
          회전시키지 않으므로, 검열이나 네트워크 단절이 곧 잘못된 key set
          선택으로 이어지지 않습니다.
        </p>
      </div>
    </section>
  );
}
