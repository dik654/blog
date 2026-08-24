import ExplainedFormula from "@/components/ui/explained-formula";
import PoRepFlowViz from "./viz/PoRepFlowViz";

export default function PoRep() {
  return (
    <section id="porep" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoRep은 data와 replica identity를 묶은 encoding을 증명한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          같은 raw data 한 벌로 replica 여러 개의 보상을 받는 deduplication attack을 줄이려면 claimed
          replica마다 다른 committed representation을 요구해야 합니다. Filecoin sealing은 exact sector data,
          provider·sector·protocol randomness에서 replica identity를 만들고 construction-specific encoding을
          수행한 뒤 data commitment와 replica commitment의 관계를 succinct proof로 검증합니다.
        </p>
      </div>
      <PoRepFlowViz />
      <ExplainedFormula
        question="같은 data D라도 replica identity가 다르면 무엇이 달라져야 할까?"
        idea="Replica-specific encoding은 D와 identifier를 함께 입력으로 받아 encoded replica R과 commitment를 만듭니다. Security는 단순 함수 표기보다 해당 construction의 encoding·space·sequentiality assumptions에 있습니다."
        formula={String.raw`\begin{aligned}
          R_i&=E(D,i)\\
          C_D&=C(D)\\
          C_{R_i}&=C(R_i)
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          R_i&=\underbrace{E(D,i)}_{\text{encoded replica 계산}}\\
          C_D&=\underbrace{C(D)}_{\text{sector data 계산}}\\
          C_{R_i}&=\underbrace{C(R_i)}_{\text{encoded replica 계산}}
        \end{aligned}`}
        operations={[
          { expression: String.raw`E(D,i)`, annotation: ["encoded replica이(가) 식의 결과에 기여하는","방식을 계산합니다.","Replica-specific encoding은 D와","identifier를 함께 입력으로 받아 encoded"] },
          { expression: String.raw`C(D)`, annotation: ["sector data이(가) 식의 결과에 기여하는 방식을","계산합니다.","Replica-specific encoding은 D와","identifier를 함께 입력으로 받아 encoded"] },
          { expression: String.raw`C(R_i)`, annotation: ["encoded replica이(가) 식의 결과에 기여하는","방식을 계산합니다.","Replica-specific encoding은 D와","identifier를 함께 입력으로 받아 encoded"] },
        ]}
        terms={[
          { symbol: "D", name: "sector data", description: "Padding·piece layout까지 확정된 source sector bytes입니다." },
          { symbol: String.raw`\mathrm{replica\_id}_i`, name: "replica identity", description: "Provider·sector·ticket 등 protocol inputs에 귀속되는 context입니다." },
          { symbol: String.raw`R_i`, name: "encoded replica", description: "Identity i에 맞게 encoding된 stored representation입니다." },
          { symbol: String.raw`C_D,C_{R_i}`, name: "commitments", description: "Data와 encoded replica를 proof statement에 묶는 commitments입니다." },
        ]}
        assumptions={["Encode·Commit·proof statement는 선택한 PoRep construction과 network version에 고정합니다.", "Physical-device independence나 geographic diversity를 commitment 하나로 직접 관측한다고 가정하지 않습니다."]}
        interpretation="replica_id₁≠replica_id₂이면 같은 D에서도 R₁과 R₂의 commitment가 달라져야 합니다. Verifier는 proof가 C_D·C_R·public inputs를 같은 instance로 묶는지 확인합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>구현 수치를 이론 정의와 분리합니다</h3>
        <p>
          Sealing phase 수, graph layer 수, sector size, proof system, proof bytes, 시간과 hardware는 network
          upgrade·proof parameter·implementation에 따라 달라집니다. 따라서 고정 “몇 시간·몇 byte”를 PoRep의
          정의로 쓰지 않고, network version·proving parameter digest·hardware·peak memory·wall time을 run
          receipt에 기록합니다.
        </p>
      </div>
      <div id="paper-filecoin-porep" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · PoRep와 PoSt</p>
        <p className="mt-2 text-sm font-semibold">Filecoin: A Decentralized Storage Network</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 decentralized storage market에서 claimed storage를 공개 검증하는 것입니다. Proof-of-Replication과 Proof-of-Spacetime, market·power accounting의 초기 설계를 제시합니다. 현재 production proof constants·actors·penalties의 최종 규격으로 읽으면 안 됩니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://filecoin.io/filecoin.pdf" target="_blank" rel="noreferrer">Filecoin paper 보기</a>
      </div>
    </section>
  );
}
