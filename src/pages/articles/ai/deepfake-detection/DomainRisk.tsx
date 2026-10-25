import ExplainedFormula from "@/components/ui/explained-formula";
import DomainRiskViz from "./viz/DomainRiskViz";

export default function DomainRisk() {
  return (
    <section id="domain-risk" data-teach-level="5" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">전체 평균과 가장 취약한 조건을 함께 봅니다</h2>
      <DomainRiskViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          알려진 생성기의 원본 품질 자료가 많으면 전체 평균은 좋아 보일 수 있습니다.
          반면 처음 보는 생성기를 social codec으로 다시 압축한 작은 조건에서 detector가
          거의 실패해도 그 값은 큰 집단에 묻힙니다. 따라서 generator·codec·resolution·capture
          condition을 평가 전에 domain으로 선언하고 같은 loss를 조건별로 계산합니다.
        </p>
        <p>
          다음 계산은 독립 원본 group이 60·30·10개이고 평균 loss가 0.10·0.30·0.80인
          설명용 사례입니다. 전체 평균 0.23은 모든 원본을 한 번에 본 값이고,
          worst-domain 0.80은 선언한 조건 중 가장 취약한 값을 보존합니다. 어느 쪽도 표본
          수와 신뢰구간 없이 단독으로 배포 기준이 되지는 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="자료가 적은 취약 domain이 전체 평균에 묻히지 않게 어떤 두 값을 계산할까?"
        idea={<>먼저 domain 안의 loss를 독립 원본 수로 평균합니다. 전체 평균은 support로 가중하고, worst-domain risk는 domain 평균 가운데 최댓값을 고릅니다.</>}
        formula={String.raw`R_d=\frac1{n_d}\sum_{i\in d}\ell_i,\quad R_{\rm all}=\frac{\sum_dn_dR_d}{\sum_dn_d},\quad R_{\rm worst}=\max_dR_d`}
        annotatedFormula={String.raw`\begin{aligned}
R_d&=\underbrace{\frac1{n_d}\sum_{i\in d}\ell_i}_{\text{domain d의 독립 원본 평균 loss}},\\
R_{\rm all}&=\underbrace{\frac{60(0.10)+30(0.30)+10(0.80)}{100}}_{\text{모든 원본의 가중 평균}}=0.23,\\
R_{\rm worst}&=\underbrace{\max(0.10,0.30,0.80)}_{\text{선언한 domain 중 가장 큰 평균}}=0.80.
\end{aligned}`}
        operations={[
          { expression: String.raw`R_d`, annotation: ["known/raw 60개: loss 합 6÷60=0.10", "known/JPEG 30개: loss 합 9÷30=0.30", "unseen/social 10개: loss 합 8÷10=0.80"] },
          { expression: String.raw`R_{\rm all}`, annotation: ["세 domain의 loss 합 6+9+8=23", "독립 원본 수 60+30+10=100", "23÷100=0.23"] },
          { expression: String.raw`R_{\rm worst}`, annotation: ["세 domain 평균 0.10·0.30·0.80을 같은 방향으로 비교", "최댓값 0.80을 취약 조건으로 보존", "미래 domain의 상한으로 해석하지 않음"] },
        ]}
        terms={[
          { symbol: "d", name: "평가 조건", description: "평가 전에 선언한 generator·codec·resolution·capture condition의 조합입니다." },
          { symbol: "n_d", name: "독립 원본 수", description: "Domain d에 속한 파일 수가 아니라 source-independent group 수입니다." },
          { symbol: "ℓᵢ", name: "원본 묶음 loss", description: "같은 집계 규칙으로 원본 묶음 i에 계산한 오차입니다." },
          { symbol: "Rworst", name: "가장 큰 조건별 평균", description: "미리 선언한 domain 평균 가운데 가장 큰 값입니다." },
        ]}
        assumptions={[
          "모든 domain에서 label·score·aggregation·loss의 의미가 같습니다.",
          "Domain별 독립 원본 수와 불확실성을 함께 보고합니다.",
          "Domain은 결과를 확인하기 전에 선언하며, 사후 탐색 결과는 별도 분석으로 표시합니다.",
        ]}
        interpretation="전체 평균 0.23만 보면 큰 known domain이 결과를 지배합니다. Worst-domain 0.80을 함께 보면 unseen/social 조건이 취약하다는 사실을 잃지 않습니다. 다만 이 값은 현재 표에 있는 조건만 요약합니다."
      />
    </section>
  );
}
