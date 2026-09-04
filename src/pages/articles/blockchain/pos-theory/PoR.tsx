import ExplainedFormula from "@/components/ui/explained-formula";
import PoRFlowViz from "./viz/PoRFlowViz";

export default function PoR() {
  return (
    <section id="por" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        PoR은 sample audit를 extractor의 전체 복구 보장에 연결한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Client는 file을 recovery-friendly encoding으로 바꾸고 block authenticator를 만든 뒤 prover에 맡깁니다. Verifier는
          fresh random challenge를 보내 일부 encoded blocks에 대한 compact response를 검사합니다. PoR의 핵심은 단순 possession
          test가 아니라 acceptance probability가 충분한 prover와 반복 상호작용하는 extractor가 원 file을 복구할 수 있다는 security
          definition입니다.
        </p>
      </div>
      <PoRFlowViz />
      <ExplainedFormula
        question="File block의 20%가 사라졌을 때 k개를 균등 독립 표본으로 뽑아 한 개 이상 탐지할 확률은?"
        idea="모든 sample이 남아 있는 80%에서 나올 확률을 먼저 구한 뒤 1에서 뺍니다. 실제 PoR theorem은 sampling뿐 아니라 encoding·authenticator·extractor 조건을 더합니다."
        formula={String.raw`P(\mathrm{detect})=1-(1-\rho)^k`}
        annotatedFormula={String.raw`P(\mathrm{detect})=\underbrace{1-(1-\rho)^k}_{\text{detection probability 계산}}`}
        operations={[
          { expression: String.raw`1-(1-\rho)^k`, annotation: ["detection probability이(가) 식의 결과에","기여하는 방식을 계산합니다.","모든 sample이 남아 있는 80%에서 나올 확률을 먼저","구한 뒤 1에서 뺍니다."] },
        ]}
        terms={[
          { symbol: String.raw`\rho`, name: "missing fraction", description: "Challenge population에서 prover가 올바르게 답할 수 없는 block 비율입니다." },
          { symbol: "k", name: "samples", description: "한 audit에서 독립·균등 근사로 뽑는 block 수입니다." },
          { symbol: String.raw`P(\mathrm{detect})`, name: "detection probability", description: "적어도 한 missing block을 sample할 확률입니다." },
        ]}
        assumptions={["Sampling with replacement 또는 큰 population의 독립 근사입니다.", "Challenge가 예측 불가능하고 missing 위치와 독립적이라고 가정합니다."]}
        interpretation="ρ=0.2,k=5이면 1−0.8⁵≈0.672입니다. PASS 한 번은 약 32.8% 확률로 손실을 놓칠 수 있으므로 repeated audit와 extractor threshold를 함께 봅니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Possession·integrity·retrievability는 같은 강도가 아닙니다</h3>
        <p>
          Authenticated sample response는 challenged data의 possession evidence입니다. Full retrievability를
          말하려면 error rate bound, error-correcting encoding, challenge distribution, extractor query budget과
          failure probability가 theorem에 포함돼야 합니다. Client가 metadata나 key를 잃으면 prover가 data를
          보유해도 검증·복구가 실패할 수 있습니다.
        </p>
      </div>
      <div id="paper-por-theory" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · PoR 정본</p>
        <p className="mt-2 text-sm font-semibold">Proofs of Retrievability: Theory and Implementation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 file 전체 전송보다 작은 audit로 full recovery 가능성을 보이는 것입니다. Byzantine prover error-rate bound와 extractor framework, implementation을 제시합니다. 임의 update workload·무제한 손실·network retrieval latency까지 보장하는 것은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://eprint.iacr.org/2008/175.pdf" target="_blank" rel="noreferrer">PoR 논문 보기</a>
      </div>
    </section>
  );
}
