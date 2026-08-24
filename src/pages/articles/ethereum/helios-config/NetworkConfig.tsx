import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function NetworkConfig({ title, onCodeRef }: Props) {
  return (
    <section id="network-config" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Pinned Helios snapshot의 <code>Network</code>는 Mainnet·Sepolia·Holesky·Hoodi 네 profile을 제공합니다. 각 profile은 chain ID,
          genesis time/root, consensus fork epoch/version, execution fork timestamp, default checkpoint·consensus endpoint와 checkpoint age policy를
          한 묶음으로 만듭니다. 목록과 숫자는 source snapshot의 값이지 영구 protocol 상수가 아닙니다.
        </p>
        <p>
          Consensus RPC는 light-client update와 head를 가져오고, execution RPC는 block·receipt·proof 재료를 제공합니다. 둘 다 availability와
          equivocation 관측이 필요합니다. 특히 checkpoint source는 light-client가 처음 chain을 선택하는 trust anchor이므로 “나중에 BLS를
          검증하니 아무 URL이나 괜찮다”고 볼 수 없습니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          label="Network enum · mainnet()"
          onClick={() => onCodeRef("helios-network", codeRefsReal["helios-network"])}
        />
      </div>
      <HeliosContractViz mode="network-bundle" />
      <ExplainedFormula
        question="Slot 8,192가 어느 epoch와 sync committee period에 속하는가?"
        idea="Network preset의 slots per epoch와 epochs per period를 차례로 나눕니다. 두 floor division은 시간 단위가 아니라 정수 index 변환입니다."
        formula={String.raw`e=\left\lfloor\frac{s}{32}\right\rfloor=256,\qquad p=\left\lfloor\frac{e}{256}\right\rfloor=1`}
        annotatedFormula={String.raw`e=\underbrace{\left\lfloor\frac{s}{32}\right\rfloor=256,\qquad p=\left\lfloor\frac{e}{256}\right\rfloor=1}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\left\lfloor\frac{s}{32}\right\rfloor=256,\qquad p=\left\lfloor\frac{e}{256}\right\rfloor=1`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Network preset의 slots per epoch와","epochs per period를 차례로 나눕니다."] },
        ]}
        terms={[
          { symbol: "s", name: "Slot", description: "검증할 update/header의 consensus slot입니다." },
          { symbol: "e", name: "Epoch", description: "32 slots를 묶은 epoch index입니다." },
          { symbol: "p", name: "Committee period", description: "256 epochs를 묶은 sync committee period index입니다." },
        ]}
        assumptions={[
          "이 예시는 slots_per_epoch=32, epochs_per_period=256인 preset을 사용합니다.",
          "실제 실행은 active fork와 target network의 pinned ConsensusSpec을 확인합니다.",
        ]}
        interpretation="Slot 8,192는 epoch 256과 period 1에 속하므로 period 0의 current committee를 그대로 쓰면 안 됩니다. 다만 period 계산은 committee branch와 signature validity를 대신하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Endpoint를 probe할 때 값 하나만 비교하지 않습니다</h3>
        <p>
          Consensus 쪽은 genesis root·fork·finalized/optimistic slot과 light-client endpoint capability를, execution 쪽은 chain ID·verified block hash와
          필요한 <code>eth_getProof</code> capability를 확인합니다. Timeout, wrong chain, stale head, unsupported method는 서로 다른 outcome으로
          남깁니다. Fallback은 availability route일 뿐 trust level을 자동으로 높이지 않습니다.
        </p>
      </div>
    </section>
  );
}
