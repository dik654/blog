import {
  EUREKA_NEGATIVE_COUNT,
  EUREKA_SOURCE_LINKS,
} from "@/content/sionic-eureka";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Distillation() {
  return (
    <section id="distillation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Teacher vector가 아니라 후보별 scalar를 저장한다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          각 query에 positive와 negative {EUREKA_NEGATIVE_COUNT}개가 준비되면 두
          teacher로 후보별 relevance score를 미리 계산한다. 학습 파일에는
          teacher embedding 전체가 아니라{" "}
          <strong>query당 {EUREKA_NEGATIVE_COUNT + 1}개 scalar</strong>를
          저장한다. student 학습 중 teacher forward와 teacher VRAM이 사라지고,
          동일 후보의 label을 재현할 수 있다.
        </p>
        <ExplainedFormula
          question="Teacher가 후보들 사이에 매긴 상대적 relevance를 student에게 어떻게 전달하는가?"
          idea={
            <p>
              Query마다 positive와 15개 negative를 하나의 목록으로 묶고, teacher와
              student 점수를 같은 temperature의 확률분포로 바꾼 뒤 두 분포의
              차이를 줄입니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
\mathcal D(q)&=\{p,n_1,\ldots,n_{15}\}\\
P_i^T&=\frac{e^{t_i/\tau}}{\sum_j e^{t_j/\tau}},\qquad
P_i^S=\frac{e^{s_i/\tau}}{\sum_j e^{s_j/\tau}}\\
\mathcal L(q)&=D_{\mathrm{KL}}(P^T\Vert P^S)
\end{aligned}`}
          terms={[
            { symbol: "\\mathcal D(q)", name: "query-local candidate set", description: "한 query의 positive와 저장된 negative 15개입니다." },
            { symbol: "t_i, s_i", name: "teacher·student score", description: "같은 candidate i에 대해 두 모델이 계산한 scalar relevance score입니다." },
            { symbol: "\\tau", name: "temperature", description: "후보 확률분포가 상위 점수에 얼마나 집중되는지 조절하는 양수입니다." },
            { symbol: "P^T,P^S", name: "listwise distributions", description: "동일 candidate support 위의 teacher target과 student prediction입니다." },
            { symbol: "D_{\\mathrm{KL}}", name: "KL divergence", description: "Teacher 분포를 기준으로 student 분포가 다른 정도를 재는 방향성 있는 차이입니다." },
          ]}
          assumptions={[
            "Teacher와 student는 정확히 같은 candidate 목록과 순서를 사용합니다.",
            "Teacher별 score scale과 두 teacher의 결합 규칙을 먼저 고정합니다.",
            "In-batch negative를 더하면 teacher target의 support도 같은 방식으로 확장해야 합니다.",
          ]}
          interpretation="낮은 temperature는 teacher가 높게 둔 후보의 차이를 더 강조합니다. KL은 embedding 좌표 자체가 아니라 현재 후보 목록 안의 상대 점수 분포를 전달합니다."
        />
        <p className="leading-7">
          student score는 cosine similarity이고, loss는 query별 후보군 안에서
          teacher와 student의 분포를 맞춘다. 이 실험에서는 in-batch negative를
          loss에 더하지 않아 저장한 teacher 후보와 student 후보의 support를
          일치시켰다. temperature가 작을수록 상위 후보의 차이가 더 강조된다.
        </p>
        <p className="rounded-xl border-l-4 border-amber-400 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>미공개 구현:</strong> “두 teacher 결합”은 프로젝트 설계지만,
          현재 초안에는 teacher별 calibration과 결합식이 없다.
          평균·max·mixture를 임의로 가정하지 않으며, 공개 시 score schema와 함께
          명시해야 한다.
        </p>
        <a id="distillation-source"
          href={EUREKA_SOURCE_LINKS.distillation.href}
          target="_blank"
          rel="noreferrer"
        >
          {EUREKA_SOURCE_LINKS.distillation.label}
        </a>
      </div>
    </section>
  );
}
