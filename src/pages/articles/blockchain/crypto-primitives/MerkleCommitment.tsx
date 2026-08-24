import ExplainedFormula from "@/components/ui/explained-formula";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function MerkleCommitment() {
  return (
    <section id="merkle-commitment" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Merkle commitment: 전체를 보내지 않고 한 위치를 연다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Merkle tree는 leaf의 순서와 값을 root 하나에 계산적으로 고정합니다. Prover가 특정 leaf와 root까지의 sibling hash만 보내면 verifier는 경로를 다시 계산할 수 있습니다. 여기서 root는 <em>어떤 데이터셋의 commitment</em>일 뿐, 그 데이터셋이 최신·정당·합의된 상태인지까지 말하지 않습니다. Trusted root를 어디서 얻는지는 별도 프로토콜 책임입니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="merkle-path" />
      <ExplainedFormula
        question="Depth d의 binary Merkle proof는 root를 어떻게 복원할까요?"
        idea="Leaf index의 i번째 bit가 현재 hash를 왼쪽에 놓을지 오른쪽에 놓을지 정합니다. 각 level에서 sibling과 순서 있게 hash해 trusted root와 비교합니다."
        formula={String.raw`h_0=H(0x00\Vert k\Vert v),\qquad h_{i+1}=\begin{cases}H(0x01\Vert h_i\Vert s_i)&b_i=0\\H(0x01\Vert s_i\Vert h_i)&b_i=1\end{cases}`}
        annotatedFormula={String.raw`h_0=H(0x00\Vert k\Vert v),\qquad h_{i+1}=\begin{cases}H(0x01\Vert \underbrace{h_i}_{\text{running hash 계산}}\Vert \underbrace{s_i}_{\text{sibling 계산}})&\underbrace{b_i}_{\text{path bit 계산}}=0\\H(0x01\Vert s_i\Vert h_i)&b_i=1\end{cases}`}
        operations={[
          { expression: String.raw`h_i`, annotation: ["running hash이(가) 식의 결과에 기여하는 방식을","계산합니다.","Leaf index의 i번째 bit가 현재 hash를 왼쪽에","놓을지 오른쪽에 놓을지 정합니다."] },
          { expression: String.raw`s_i`, annotation: ["sibling이(가) 식의 결과에 기여하는 방식을 계산합니다.","Leaf index의 i번째 bit가 현재 hash를 왼쪽에","놓을지 오른쪽에 놓을지 정합니다."] },
          { expression: String.raw`b_i`, annotation: ["path bit이(가) 식의 결과에 기여하는 방식을","계산합니다.","Leaf index의 i번째 bit가 현재 hash를 왼쪽에","놓을지 오른쪽에 놓을지 정합니다."] },
        ]}
        terms={[
          { symbol: "h_i", name: "running hash", description: "Leaf에서 i level 올라온 subtree root입니다." },
          { symbol: "s_i", name: "sibling", description: "Proof가 제공하는 같은 level의 이웃 subtree root입니다." },
          { symbol: "b_i", name: "path bit", description: "현재 node의 왼쪽·오른쪽 위치를 결정하는 index bit입니다." },
          { symbol: "0x00,0x01", name: "domain tags", description: "Leaf와 internal node encoding을 구분합니다." },
        ]}
        assumptions={["Hash의 collision resistance와 canonical encoding을 전제로 합니다.", "Verifier가 기대하는 depth·key bit order·root provenance를 알고 있습니다."]}
        interpretation="256-depth sparse tree에서 sibling payload만 세면 256×32=8,192 bytes입니다. 하지만 default subtree를 압축하는 proof format을 쓰면 wire size는 달라지므로 depth만으로 실제 packet size를 단정하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Commitment의 binding과 hiding은 별도 성질입니다</h3>
        <p>
          Merkle root는 일반적으로 binding을 목표로 하지만, 작은 값 공간의 leaf는 root나 proof에서 dictionary attack을 받을 수 있어 자동으로 hiding하지 않습니다. Hash commitment <code>H(tag∥value∥randomness)</code>는 충분하고 예측 불가능한 randomness가 있을 때 hiding을 보완합니다. Pedersen commitment <code>C=vG+rH</code>는 서로의 이산로그를 모르는 독립 generator와 uniform r을 전제로 perfect hiding·computational binding을 제공하며, 같은 r 재사용이나 알려진 generator 관계는 보장을 무너뜨립니다.
        </p>
        <h3>Sparse tree에서 부재를 증명하는 조건</h3>
        <p>
          Key 공간 전체를 고정 depth로 해석하고 빈 leaf의 값과 level별 default hash를 specification에 고정하면, 해당 key의 path가 default leaf로 끝난다는 사실을 non-membership으로 읽을 수 있습니다. 반대로 leaf key를 hash하는 방식·collision 처리·압축 규칙이 모호하면 “값이 없다”가 아니라 다른 key와 겹친 경로를 보여 줄 수 있으므로 membership과 같은 수준으로 encoding을 검증해야 합니다.
        </p>
      </div>
    </section>
  );
}
