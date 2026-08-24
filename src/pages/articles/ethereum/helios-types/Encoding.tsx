import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import HeliosContractViz from "../helios-contract-viz";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function Encoding({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          SSZ는 object를 canonical bytes로 읽는 규칙과 <code>hash_tree_root</code>를 만드는 규칙을 함께 제공합니다. 그러나 signature가
          어떤 역할과 chain에서 유효한지는 SSZ root만으로 정해지지 않습니다. Ethereum은 4-byte domain type, active fork version,
          genesis validators root를 결합해 서명 문맥을 분리합니다.
        </p>
      </div>
      <HeliosContractViz mode="signing-context" />
      <ExplainedFormula
        question="같은 header root의 서명을 다른 duty·fork·network에서 재사용하지 못하게 하려면 무엇을 hash하는가?"
        idea="먼저 fork와 network를 묶은 ForkData root를 만들고, 앞 28 bytes를 역할을 나타내는 domain type과 연결합니다. 마지막으로 message root와 domain을 SigningData로 묶습니다."
        formula={String.raw`\begin{aligned} D &= T_{\text{domain}}\;\|\;\operatorname{root}(V_{\text{fork}},G)_{0:28} \\ R_{\text{sign}} &= \operatorname{root}(R_{\text{object}},D) \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned} D &= \underbrace{T_{\text{domain}}\;\|\;\operatorname{root}(V_{\text{fork}},G)_{0:28}}_{\text{Domain type 계산}} \\ R_{\text{sign}} &= \underbrace{\operatorname{root}(R_{\text{object}},D)}_{\text{Object root 계산}} \end{aligned}`}
        operations={[
          { expression: String.raw`T_{\text{domain}}\;\|\;\operatorname{root}(V_{\text{fork}},G)_{0:28}`, annotation: ["Domain type이(가) 식의 결과에 기여하는 방식을","계산합니다.","먼저 fork와 network를 묶은 ForkData","root를 만들고, 앞 28 bytes를 역할을 나타내는"] },
          { expression: String.raw`\operatorname{root}(R_{\text{object}},D)`, annotation: ["Object root이(가) 식의 결과에 기여하는 방식을","계산합니다.","먼저 fork와 network를 묶은 ForkData","root를 만들고, 앞 28 bytes를 역할을 나타내는"] },
        ]}
        terms={[
          { symbol: "T_{\\text{domain}}", name: "Domain type", description: "Sync committee·beacon proposer처럼 서명 역할을 구분하는 4-byte 값입니다." },
          { symbol: "V_{\\text{fork}}", name: "Fork version", description: "Signature epoch에 활성인 consensus fork의 4-byte version입니다." },
          { symbol: "G", name: "Genesis validators root", description: "서명이 속한 consensus network를 구분합니다." },
          { symbol: "R_{\\text{object}}", name: "Object root", description: "서명할 message의 SSZ hash-tree-root입니다." },
          { symbol: "R_{\\text{sign}}", name: "Signing root", description: "BLS verification에 들어가는 최종 32-byte message입니다." },
        ]}
        assumptions={[
          "Signature slot에서 올바른 fork version을 선택합니다.",
          "Domain type과 genesis root는 target network의 pinned spec에서 가져옵니다.",
        ]}
        interpretation="Object bytes가 같아도 domain type·fork version·genesis root 가운데 하나가 바뀌면 signing root가 달라집니다. 반대로 domain 계산만 맞아도 participant set·quorum·Merkle branch 검증은 별도로 필요합니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          고정 예시 slot 8,192를 mainnet preset의 32 slots/epoch, 256 epochs/period로 읽으면 epoch 256, sync committee period 1입니다. 이 계산은
          어떤 committee를 사용할지 고르지만 그 committee가 trusted state에 포함됐다는 증명까지 대신하지는 않습니다.
        </p>
      </div>
    </section>
  );
}
