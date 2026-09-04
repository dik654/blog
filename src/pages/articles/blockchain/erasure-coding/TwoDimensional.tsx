import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import TwoDErasureViz from "./viz/TwoDErasureViz";

export default function TwoDimensional() {
  return (
    <section id="two-dimensional" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        2D extension은 행과 열에 복원 경로를 만들지만, sampling 하나로
        availability가 자동 증명되지는 않습니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          고전적인 2D construction은 k×k source square의 각 행을 2k까지 확장한
          뒤, 각 열도 2k까지 확장해 2k×2k square를 만듭니다. k=4라면 source
          16개가 총 64개가 되어 code rate는 1/4이고 추가 저장량은 원본의
          3배입니다. 이 구조는 행과 열의 교차 제약을 이용해 missing cell을 반복
          복구하고 잘못된 encoding을 좁은 row·column proof로 지적하기 쉽게
          합니다.
        </p>
      </div>
      <TwoDErasureViz />

      <ExplainedFormula
        question="전체 cell의 β가 숨겨졌을 때 s번 sample로 한 번 이상 숨김을 만날 확률은 얼마일까요?"
        idea="각 sample이 공개된 cell만 고를 확률은 1-β입니다. 독립적으로 s번 모두 놓칠 확률을 구한 뒤 1에서 뺍니다."
        formula={String.raw`P_{detect}=1-(1-\beta)^s`}
        annotatedFormula={String.raw`P_{detect}=\underbrace{1-(1-\beta)^s}_{\text{Detection probability 계산}}`}
        operations={[
          { expression: String.raw`1-(1-\beta)^s`, annotation: ["Detection probability이(가) 식의 결과에","기여하는 방식을 계산합니다.","각 sample이 공개된 cell만 고를 확률은 1-β입니다."] },
        ]}
        terms={[
          {
            symbol: String.raw`\beta`,
            name: "Withheld fraction",
            description:
              "균일 sample 공간에서 응답받을 수 없는 cell의 비율입니다.",
          },
          {
            symbol: "s",
            name: "Sample count",
            description: "독립적으로 요청한 sample 수입니다.",
          },
          {
            symbol: "P_{detect}",
            name: "Detection probability",
            description:
              "적어도 한 번 unavailable cell을 만나는 단순 모델의 확률입니다.",
          },
        ]}
        assumptions={[
          "Sample index가 adversary에게 미리 알려지지 않고 균일·독립적으로 선택됩니다.",
          "각 요청의 응답·timeout을 정직하게 관측하며 eclipse나 correlated peer failure를 별도 모델링합니다.",
          "Commitment opening이 cell authenticity를 확인하고 encoding correctness·reconstruction threshold는 protocol별로 별도 보장합니다.",
        ]}
        interpretation="β=1/2, s=10이면 Pdetect=1-0.5^10≈99.902%입니다. 이 숫자는 ‘항상 99.9% 안전’이 아니라 숨긴 비율·독립 sampling·network 전제가 모두 성립하는 toy bound입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>DAS는 세 질문을 따로 답해야 합니다</h3>
        <ol>
          <li>
            <strong>Authenticity:</strong> 받은 cell이 block commitment의 해당
            위치와 일치합니까?
          </li>
          <li>
            <strong>Encoding correctness:</strong> producer가 처음부터 복원
            불가능한 잘못된 codeword를 commitment하지 않았습니까?
          </li>
          <li>
            <strong>Availability:</strong> 충분한 수의 서로 다른 participant가
            reconstruction threshold를 넘길 cell을 실제로 얻을 수 있습니까?
          </li>
        </ol>
        <p>
          Merkle/KZG proof 성공은 첫 질문에 주로 답하며 나머지 두 질문을 대신하지 않습니다. Sampling index를 producer가 예측하거나 여러 요청이 같은 악성
          peer에 묶이면 독립성 전제가 무너지므로 peer diversity·custody·timeout·reconstruction attempt와 receipt가 필요합니다.
        </p>
        <h3>Celestia의 2D 방식과 Ethereum PeerDAS를 구분합니다</h3>
        <p>
          2D Reed–Solomon square는 Al-Bassam·Sonnino·Buterin의
          fraud/data-availability proof 계열과 Celestia 설계에서 중요한
          construction입니다. 반면 EIP-7594 PeerDAS는 EIP-4844 blob의 각 row를{" "}
          <strong>1차원 erasure-code extension</strong>하고, 여러 row의 같은
          index를 column으로 묶어 custody·sampling합니다. 두 시스템 모두 “일부만
          내려받아 availability를 확인한다”는 목표를 공유하지만 matrix
          구성·commitment·sample unit·reconstruction threshold는 같다고 가정하면
          안 됩니다.
        </p>
      </div>

      <div id="paper-fraud-data-availability" className="scroll-mt-24">
        <CitationBlock
          source="Fraud and Data Availability Proofs · Al-Bassam, Sonnino, Buterin"
          href="https://arxiv.org/abs/1809.09044"
          citeKey={2}
          type="paper"
        >
          문제: block 전체를 받지 않는 light client가 dishonest producer의 data
          withholding과 invalid encoding을 구분해야 합니다. 기여: 2D
          erasure-coded Merkle tree, sampling과 fraud proof를 결합한 설계를
          제시합니다. 전제: commitment·sampling·honest rebroadcast와 protocol
          threshold가 필요합니다. 근거 범위: 논문의 2D DAS construction과 보안
          논리입니다. 비주장: 모든 DA protocol이나 현재 Ethereum 구현이 같은 2D
          layout을 사용한다는 뜻이 아닙니다.
        </CitationBlock>
      </div>
      <div id="paper-eip7594-peerdas" className="scroll-mt-24">
        <CitationBlock
          source="EIP-7594 · PeerDAS"
          href="https://eips.ethereum.org/EIPS/eip-7594"
          citeKey={3}
        >
          문제: 모든 node가 모든 blob을 내려받지 않고 Ethereum DA throughput을
          키워야 합니다. 기여: blob row의 1D extension, cell KZG proof, column
          custody·gossip·peer sampling과 reconstruction 규칙을 정의합니다. 전제:
          EIP-4844와 target consensus-spec parameters를 고정합니다. 근거 범위:
          PeerDAS protocol입니다. 비주장: Celestia식 2D RS square나 단일
          client의 독립 sample 식만으로 전체 network 보안을 설명하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
