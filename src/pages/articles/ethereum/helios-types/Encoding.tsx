import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Encoding({ onCodeRef }: Props) {
  return (
    <section id="fork-shape" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Fork는 객체 모양과 증명 길이를 함께 바꿉니다</h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Mainnet Electra는 epoch 364,032에서 시작합니다. Mainnet preset은
          epoch당 32 slots, sync committee period당 256 epochs를 사용합니다.
          따라서 경계의 첫 slot은 11,649,024이고 period는 정확히 1,422입니다.
          이 계산으로 U1422를 Electra 규칙으로 읽어야 한다는 문맥을 고정합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Electra 활성 epoch는 어느 slot과 sync committee period에 속할까요?"
        idea="Epoch에 slots/epoch를 곱해 첫 slot을 구하고, epoch를 epochs/period로 나눠 period를 구합니다."
        formula={String.raw`slot_E=364032\times32=11649024,\qquad period_E=\left\lfloor\frac{364032}{256}\right\rfloor=1422`}
        annotatedFormula={String.raw`slot_E=\underbrace{364032}_{\text{Electra epoch}}\times\underbrace{32}_{\text{slots/epoch}}=11649024,\qquad period_E=\left\lfloor\frac{364032}{256}\right\rfloor=1422`}
        operations={[
          {
            expression: String.raw`364032\times32=11649024`,
            annotation: [
              "Electra가 시작하는 epoch에 epoch당 slot 수를 곱합니다",
              "결과는 경계에 있는 첫 slot입니다",
            ],
          },
          {
            expression: String.raw`364032/256=1422`,
            annotation: [
              "Sync committee 하나가 256 epochs를 담당합니다",
              "나머지가 0이므로 이 epoch가 period 1,422의 시작입니다",
            ],
          },
        ]}
        terms={[
          { symbol: "364032", name: "Electra 활성 epoch", description: "Consensus-specs v1.6.1 mainnet config의 ELECTRA_FORK_EPOCH입니다." },
          { symbol: "32", name: "Slots per epoch", description: "Mainnet phase0 preset의 SLOTS_PER_EPOCH입니다." },
          { symbol: "256", name: "Epochs per period", description: "Mainnet Altair preset의 EPOCHS_PER_SYNC_COMMITTEE_PERIOD입니다." },
          { symbol: "1422", name: "Sync committee period", description: "U1422의 signature와 committee 선택에 쓰는 period입니다." },
        ]}
        assumptions={[
          "Ethereum consensus-specs v1.6.1 mainnet preset와 config를 사용합니다.",
          "U1422는 계산을 따라가기 위한 예시 객체이며 실제 네트워크 응답을 측정한 값이 아닙니다.",
        ]}
        interpretation="Slot 11,649,024는 Electra 경계의 첫 slot입니다. 따라서 같은 이름의 Update라도 Base의 5·6 branch가 아니라 Electra의 6·7 branch 모양으로 읽고 검증해야 합니다."
      />

      <div className="mt-8 grid gap-px bg-border p-px sm:grid-cols-3">
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">Next committee</p>
          <p className="mt-2 font-mono text-lg font-bold">Base 5 → Electra 6</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">BeaconState tree 깊이 변화</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">Finality</p>
          <p className="mt-2 font-mono text-lg font-bold">Base 6 → Electra 7</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Finalized checkpoint 증명 깊이</p>
        </div>
        <div className="bg-background p-4">
          <p className="text-xs font-bold text-muted-foreground">Execution payload</p>
          <p className="mt-2 font-mono text-lg font-bold">Electra 4</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Beacon block body 아래의 header 증명</p>
        </div>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          <code>LightClientHeader</code>도 fork에 따라 모양이 다릅니다. Bellatrix
          variant는 beacon header만 가지고, Capella·Deneb·Electra variant는
          execution payload header와 4개짜리 execution branch를 함께 가집니다.
          Beacon header의 <code>state_root</code>는 BeaconState root이고,
          execution header의 <code>state_root</code>가 account proof의 기준입니다.
          이름이 같아도 서로 다른 tree의 root입니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="Fork별 Header와 branch 길이 보기"
          onClick={() => onCodeRef("helios-fork-types", codeRefsReal["helios-fork-types"])}
        />
      </div>
    </section>
  );
}
