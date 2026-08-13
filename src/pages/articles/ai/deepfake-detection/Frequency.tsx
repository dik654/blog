import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import FrequencyViz from "./viz/FrequencyViz";

export default function Frequency() {
  return (
    <section id="frequency" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">주파수 특징은 generator와 codec에 조건부인 보조 신호입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FFT는 spatial image를 주파수 성분으로 바꾸고 magnitude spectrum에서
          반복적인 upsampling pattern이나 비정상 에너지 분포를 관찰하게 합니다.
          변환의 수학적 원리와 spectrum 읽기는
          <Link to="/ai/fft">FFT 정본</Link>에서 설명하며, 여기서는 detector feature로
          쓸 때의 가정에 집중합니다.
        </p>
        <p>
          초기 GAN의 checkerboard artifact처럼 특정 generator family에서 잘
          보이는 신호가 있어도 JPEG, resize, blur와 새로운 generation method가
          spectrum을 바꿀 수 있습니다. 따라서 frequency-only detector의 높은
          in-domain 점수를 general deepfake signal로 해석하지 않습니다.
        </p>
      </div>
      <ExplainedFormula
        question="주파수 branch가 RGB branch에 새 정보를 주는지 정확도 두 개만으로 판단할 수 있을까?"
        idea={<>두 detector가 같은 sample에서 함께 틀리는 비율을 계산합니다. Frequency model이 단독으로 좋아도 RGB와 늘 같은 sample에서 틀리면 ensemble이 보완할 여지가 작습니다.</>}
        formula={String.raw`Q_{\mathrm{joint}}=\frac1n\sum_{i=1}^{n}I(e_i^{\mathrm{rgb}}=1\ \land\ e_i^{\mathrm{freq}}=1)`}
        terms={[
          { symbol: "eᵢrgb", name: "RGB error indicator", description: "RGB branch가 sample i를 틀리면 1, 맞히면 0입니다." },
          { symbol: "eᵢfreq", name: "frequency error indicator", description: "동일 sample i에서 frequency branch가 틀리면 1인 값입니다." },
          { symbol: "Qjoint", name: "joint error rate", description: "두 branch가 동시에 실패한 sample 비율입니다." },
        ]}
        assumptions={["두 prediction은 같은 held-out source·identity sample에서 out-of-fold 또는 untouched test 방식으로 얻습니다.", "Threshold·label·video aggregation 정의를 동일하게 맞춥니다.", "Joint error가 작아도 latency·calibration·slice 성능을 포함한 실제 ensemble gain을 별도로 확인합니다."]}
        interpretation="Frequency branch의 단독 AUC보다 codec·resize별 joint error와 실제 fused prediction의 paired gain이 더 직접적인 추가 가치의 근거입니다."
      />
      <div className="not-prose my-8"><FrequencyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>공간 신호와 같은 corruption matrix에서 비교합니다</h3>
        <p>
          RGB branch와 FFT·DCT·wavelet branch를 각각 평가하고 feature 또는
          prediction 수준에서 결합합니다. Codec, bitrate, resolution과 social-media
          re-encoding별 성능을 matrix로 보면 frequency branch가 manipulation이
          아니라 compression source를 분류하는지 확인할 수 있습니다.
        </p>
        <p>
          결합 효과는 같은 video split의 out-of-fold prediction으로 측정합니다.
          주파수 branch가 RGB model과 같은 sample에서 틀린다면 계산만 늘고,
          error가 보완적일 때만 ensemble이나 fusion의 근거가 생깁니다.
        </p>
      </div>
      <div id="paper-fourier-discrepancy" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Fourier spectrum discrepancy 재검토</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Chandrasegaran 등은 CNN-generated image의 high-frequency decay 차이가 생성 모델의 본질적·robust 특징이라는 해석을 재검토하고, 해당 단서만으로 synthetic image를 안정적으로 검출하기 어렵다고 보였습니다. 따라서 spectrum pattern은 generator·post-processing에 조건부인 feature로 다뤄야 합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content/CVPR2021/html/Chandrasegaran_A_Closer_Look_at_Fourier_Spectrum_Discrepancies_for_CNN-Generated_Images_CVPR_2021_paper.html" target="_blank" rel="noreferrer">주파수 단서의 robustness 한계 보기</a>
      </div>
    </section>
  );
}
