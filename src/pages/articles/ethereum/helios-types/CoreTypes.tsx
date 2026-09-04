import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function CoreTypes({ title, onCodeRef }: Props) {
  return (
    <section id="core-types" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          네 구조체는 같은 종류의 “데이터 상자”가 아닙니다. <code>BeaconBlockHeader</code>는 commitment, <code>SyncAggregate</code>는
          누가 어느 header root에 서명했는지 나타내는 증거, <code>Update</code>는 검증 후보 메시지, <code>LightClientStore</code>는 검증을
          통과한 결과를 누적하는 local state입니다.
        </p>
      </div>
      <div className="not-prose my-4">
        <CodeViewButton
          label="LightClientStore · SyncAggregate · Update"
          onClick={() => onCodeRef("helios-core-types", codeRefsReal["helios-core-types"])}
        />
      </div>
      <HeliosContractViz mode="light-client-types" />

      <ExplainedFormula
        question="고정 크기인 BeaconBlockHeader와 SyncAggregate는 SSZ payload에서 각각 몇 byte인가?"
        idea="Fixed-size scalar와 byte vector의 크기를 더합니다. 이 계산은 container field payload만 세며 framing·allocation·Rust struct padding은 포함하지 않습니다."
        formula={String.raw`\begin{aligned} B_{\text{header}} &= 8+8+3\cdot32=112\ \text{bytes} \\ B_{\text{aggregate}} &= 512/8+96=160\ \text{bytes} \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned} B_{\text{header}} &= \underbrace{8+8+3\cdot32=112\ \text{bytes}}_{\text{B256 크기 계산}} \\ B_{\text{aggregate}} &= \underbrace{512/8+96=160\ \text{bytes}}_{\text{기준량당 비율}} \end{aligned}`}
        operations={[
          { expression: String.raw`8+8+3\cdot32=112\ \text{bytes}`, annotation: ["B256 크기이(가) 식의 결과에 기여하는 방식을 계산합니다.","Fixed-size scalar와 byte vector의","크기를 더합니다."] },
          { expression: String.raw`512/8+96=160\ \text{bytes}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Fixed-size scalar와 byte vector의","크기를 더합니다."] },
        ]}
        terms={[
          { symbol: "8", name: "u64 크기", description: "slot과 proposer_index가 각각 차지하는 SSZ fixed payload입니다." },
          { symbol: "32", name: "B256 크기", description: "parent_root·state_root·body_root 각각의 byte 수입니다." },
          { symbol: "512/8", name: "참여 bit vector", description: "512 positions를 byte로 pack하면 64 bytes입니다." },
          { symbol: "96", name: "BLS signature", description: "현재 consensus type의 compressed signature byte 수입니다." },
        ]}
        assumptions={[
          "고정한 Helios source의 BeaconBlockHeader와 mainnet SyncCommitteeSize=512를 사용합니다.",
          "Fork별 LightClientHeader execution field와 Merkle branch는 이 두 합계에 포함하지 않습니다.",
        ]}
        interpretation="작은 header payload와 별개로 Update는 committee·branches·fork별 execution header를 포함합니다. 이 숫자를 LightClientStore 전체 memory나 network response 크기로 일반화하면 안 됩니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Update를 Store에 적용할 때 확인할 것</h3>
        <p>
          먼저 signature slot이 어떤 sync committee period에 속하는지 계산하고 participant bits로 고른 public keys로 signing
          root를 검증합니다. finalized header 후보는 finality branch가 있을 때만 만들 수 있고 다음 period의 committee는 next
          committee branch가 있을 때만 저장할 수 있습니다. 충분한 참여 조건과 더 나은 slot을 만족하면 optimistic header가 전진합니다. 전진했다고
          finalized header와 같은 뜻이 되지는 않습니다.
        </p>
        <p>
          따라서 update를 decode했다는 이유로 store를 수정하면 안 됩니다. validation은 pre-store snapshot을 읽고 typed outcome을 만든 뒤
          apply 단계가 pre/post store identity와 채택한 field를 한 receipt에 남겨야 합니다. 실패한 update가 committee나 header를
          부분적으로 바꿔놓는 일은 없습니다.
        </p>
      </div>
    </section>
  );
}
