import ExplainedFormula from "@/components/ui/explained-formula";
import ApplicationsViz from "./viz/ApplicationsViz";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">활용법은 reconstruction score의 의미부터 다시 정해야 합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Denoising에서는 손상된 입력을 clean target으로 되돌리고, representation
          pretraining에서는 encoder output을 downstream model에 넘깁니다. Anomaly
          detection은 별도의 가정이 더 필요합니다. 정상 sample로 학습한 model이
          정상은 잘 복원하고 이상 sample은 못 복원해야 score가 의미를 갖습니다.
          Capacity가 너무 크면 처음 보는 anomaly도 잘 복원할 수 있어 이 가정이
          깨집니다.
        </p>
      </div>

      <ExplainedFormula
        question="Reconstruction error를 anomaly score로 쓸 때 무엇을 측정하고 어떻게 판정할까?"
        idea={<>Sample마다 입력과 복원의 거리를 하나의 score로 만들고 validation data에서 threshold τ를 정합니다. Score가 크다는 사실 자체가 anomaly를 뜻하는 것이 아니라, 정상·이상 distribution을 실제로 분리하는지 확인해야 합니다.</>}
        formula={String.raw`\begin{aligned}
s(x)&=\frac{1}{n}\lVert x-g_\phi(f_\theta(x))\rVert_2^2 \\
\widehat{y}(x)&=\mathbf{1}\!\left[s(x)>\tau\right]
\end{aligned}`}
        terms={[
          { symbol: "s(x)", name: "reconstruction anomaly score", description: "Sample 하나의 coordinate별 squared error 평균입니다." },
          { symbol: "τ", name: "decision threshold", description: "Validation set의 false-positive·recall trade-off로 정하는 운영 값입니다." },
          { symbol: "1[·]", name: "indicator", description: "조건이 참이면 1, 거짓이면 0을 반환합니다." },
        ]}
        assumptions={["Training data가 정상 distribution을 충분히 대표합니다.", "Model capacity가 anomaly까지 identity mapping으로 복원하지 않습니다.", "배포 anomaly와 정상 data의 score가 평가 dataset에서 분리됩니다."]}
        interpretation="Threshold는 training loss에서 자동으로 나오지 않습니다. Class imbalance가 큰 환경에서는 accuracy 대신 precision–recall, false-positive cost, drift를 함께 봐야 합니다."
      />

      <ApplicationsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>현대 모델에는 objective의 형태가 남았습니다</h3>
        <p>
          Latent diffusion은 pretrained autoencoder로 image를 압축한 뒤 latent에서
          diffusion을 수행합니다. Masked autoencoder는 image patch 일부를 숨기고
          보이지 않은 patch를 복원해 encoder를 pretrain합니다. BERT의 masked
          language modeling도 corruption에서 원래 token을 예측한다는 점은 닮았지만,
          전통적인 encoder–decoder reconstruction architecture와 같다는 뜻은
          아닙니다.
        </p>
      </div>
    </section>
  );
}
