import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DeepfakeFrequencyViz } from "../deepfake-detection/viz/ModernDeepfakeViz";

export default function DeepfakeFrequencyEvidenceArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          주파수 pattern은 deepfake의 보편 원인이 아니라 generator·codec 조건에
          붙은 evidence 후보입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            FFT는 image를 공간 좌표 대신 주파수 성분으로 정확히 표현합니다.
            하지만 spectrum에서 보이는 반복 pattern을 왜 생성됐는지 해석하는
            것은 별도 문제입니다. Upsampling artifact가 한 generator에서 잘
            보여도 JPEG, resize, blur와 새 generator가 pattern을 바꿀 수
            있습니다. 따라서 raw in-domain score가 아니라 corruption cell에서
            보존되는지 확인합니다.
          </p>
        </div>
        <TermBreakdown
          title="Spectrum feature를 evidence로 읽는 용어"
          items={[
            {
              term: "Spectrum",
              description:
                "Image의 spatial variation을 frequency별 complex coefficient로 나타낸 표현입니다.",
            },
            {
              term: "Magnitude pattern",
              description:
                "Coefficient 크기에서 관찰한 energy distribution입니다.",
              boundary: "조작 원인의 직접 증명은 아닙니다.",
            },
            {
              term: "Corruption cell",
              description: "Generator×codec×resize×blur 조합 하나입니다.",
            },
            {
              term: "Detector branch",
              description:
                "RGB 또는 frequency input으로 독립 score를 내는 경로입니다.",
            },
          ]}
        />
        <DeepfakeFrequencyViz />
        <ContentBoundary article="deepfake-frequency-evidence" />
      </section>

      <section id="spectrum" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          정확한 Fourier 변환과 forensic claim을 분리합니다
        </h2>
        <TermBreakdown
          title="계산과 해석 사이 네 단계"
          items={[
            {
              term: "Transform",
              description:
                "같은 image와 normalization이면 같은 Fourier coefficients를 계산합니다.",
            },
            {
              term: "Observation",
              description: "특정 frequency band의 energy 차이를 측정합니다.",
            },
            {
              term: "Hypothesis",
              description:
                "Generator upsampling 또는 processing pipeline이 차이를 만들었다고 제안합니다.",
            },
            {
              term: "Intervention",
              description:
                "Codec·resize를 바꿔 pattern과 detector error가 함께 변하는지 확인합니다.",
            },
          ]}
        />
      </section>

      <section id="corruption" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Raw·JPEG·resize·blur를 같은 source의 paired corruption matrix로
          비교합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            RGB와 frequency branch에 같은 source split, crop과 frame budget을
            사용합니다. 각 source에서 corruption만 바꾼 paired examples를 만들면
            source identity 차이를 generator artifact 차이로 오인하는 일을 줄일
            수 있습니다. Frequency branch가 codec source를 분류하는지 보려면
            generator와 codec을 교차한 cell이 필요합니다.
          </p>
        </div>
      </section>

      <section id="joint-error" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          두 branch의 정확도보다 같은 sample에서 함께 틀리는 비율을 먼저 봅니다
        </h2>
        <ExplainedFormula
          question="RGB와 frequency branch가 서로 보완하는지 같은 held-out samples에서 어떻게 측정하나요?"
          idea={
            <p>
              각 branch가 틀린 sample에 1을 표시합니다. 두 indicators를 곱하면
              둘 다 틀린 sample만 1로 남고, 이를 평균하면 joint error rate가
              됩니다.
            </p>
          }
          formula={String.raw`Q_{\rm joint}=n^{-1}\sum_i e_i^{\rm rgb}e_i^{\rm freq}`}
          annotatedFormula={String.raw`\begin{aligned}r_i&=\underbrace{\mathbf 1[\hat y_i^{\rm rgb}\ne y_i]}_{\text{RGB branch error를 0·1로 표시}}\\f_i&=\underbrace{\mathbf 1[\hat y_i^{\rm freq}\ne y_i]}_{\text{frequency error를 0·1로 표시}}\\j_i&=\underbrace{r_i f_i}_{\text{둘 다 1일 때만 joint error}}\\N_j&=\underbrace{\sum_{i=1}^{n}j_i}_{\text{동시 실패 sample 수}}\\Q_{\rm joint}&=\underbrace{N_j/n}_{\text{같은 held-out sample 수로 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf 1[\hat y_i\ne y_i]`,
              annotation: [
                "각 branch prediction을 label과 비교해",
                "sample별 error indicator 생성",
              ],
            },
            {
              expression: String.raw`r_i f_i`,
              annotation: ["두 0·1 indicators를 곱해", "동시 실패만 1로 남김"],
            },
            {
              expression: String.raw`\sum_i j_i/n`,
              annotation: [
                "동시 failures를 세고 전체 sample로 나눠",
                "joint error rate 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`r_i`,
              name: "RGB error",
              description: "RGB branch가 sample i를 틀리면 1입니다.",
            },
            {
              symbol: String.raw`f_i`,
              name: "Frequency error",
              description: "같은 sample에서 frequency branch가 틀리면 1입니다.",
            },
            {
              symbol: String.raw`Q_{\rm joint}`,
              name: "Joint error rate",
              description: "두 branch가 동시에 실패한 비율입니다.",
            },
          ]}
          assumptions={[
            "두 predictions는 같은 untouched 또는 out-of-fold samples에서 얻습니다.",
            "Threshold·label·aggregation을 branch 사이에서 맞춥니다.",
            "Joint error가 작아도 fused model의 calibration·latency를 별도 측정합니다.",
          ]}
          interpretation="100 OOD clips에서 RGB errors 20, frequency errors 25, joint errors 18이면 RGB-only 2, frequency-only 7, error union 27입니다. 단독 score와 달리 complementarity가 작다는 사실이 보입니다."
        />
        <div
          id="paper-fourier-discrepancy"
          className="not-prose mt-8 scroll-mt-24"
        >
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Chandrasegaran et al. — Fourier discrepancy 재검토"
            href="https://openaccess.thecvf.com/content/CVPR2021/html/Chandrasegaran_A_Closer_Look_at_Fourier_Spectrum_Discrepancies_for_CNN-Generated_Images_CVPR_2021_paper.html"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> High-frequency discrepancy가 보편적이고
                robust한 synthetic-image 신호인지 재검토합니다.
              </p>
              <p>
                <strong>기여.</strong> Spectrum-decay claim의 조건과 detection
                robustness 한계를 실험합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 generator families·spectral
                measures·post-processing을 전제로 합니다.
              </p>
              <p>
                <strong>근거 범위.</strong> 해당 Fourier observations와 비교
                실험입니다.
              </p>
              <p>
                <strong>일반화 금지.</strong> 모든 frequency feature가
                무가치하거나 모든 future generator에 같은 반례가 성립한다는 뜻은
                아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
