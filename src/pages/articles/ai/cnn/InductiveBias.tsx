import InductiveBiasViz from './viz/InductiveBiasViz';
import BiasDetailViz from './viz/BiasDetailViz';
import M from '@/components/ui/math';

export default function InductiveBias() {
  return (
    <section id="inductive-bias" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">귀납적 편향 & CNN의 한계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CNN이 이미지를 처리하는 방식에는 <strong>세 가지 강한 가정</strong>이 내장되어 있음<br />
          이를 <strong>귀납적 편향(Inductive Bias)</strong>이라 함 — 모델이 탐색할 수 있는 함수 공간을 제한
        </p>

        <h3>1. 지역성(Locality)</h3>
        <p>
          작은 커널이 이미지 위를 슬라이딩하며 <strong>인접 픽셀만</strong> 결합<br />
          단일 합성곱 층에서 한 픽셀은 자신의 근방에만 영향 가능 = 좁은 수용야(Receptive Field)<br />
          결과적으로 CNN은 <strong>텍스처를 구조보다 우선시</strong>하는 경향이 있음
        </p>
        <p>
          예: 앵무새 깃털을 가진 고양이 이미지 → ResNet(CNN)은 "macaw"로 분류<br />
          깃털 디테일을 줄이면 "cat"으로 바뀜 — 지역적 텍스처에 강하게 의존하기 때문
        </p>

        <h3>2. 평행이동 불변성(Translation Invariance)</h3>
        <p>
          눈을 감지하는 커널은 이미지 전체를 슬라이딩하며 <strong>어디서나 같은 패턴</strong>을 찾음<br />
          물체가 이미지의 어느 위치에 있든 동일하게 인식 = 위치에 무관한 감지<br />
          유용하지만, 물체의 <strong>상대적 배치(spatial arrangement)</strong> 정보는 잃을 수 있음
        </p>

        <h3>3. 계층적 구조(Hierarchy)</h3>
        <p>
          합성곱 + 풀링을 반복하며 해상도를 점진적으로 축소<br />
          저수준 피처(엣지) → 중수준(도형) → 고수준(물체 부분) 순으로 조합<br />
          이미지가 이런 계층적 구조를 가진다는 가정 자체는 합리적이나,<br />
          <strong>장거리 의존성(long-range dependency)</strong>을 포착하려면 수십 층이 필요
        </p>
      </div>
      <div className="not-prose my-8">
        <InductiveBiasViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>편향-분산 트레이드오프</h3>
        <p>
          <strong>높은 편향</strong> = 강한 가정 → 나쁜 함수 공간을 미리 제거, 학습 효율적<br />
          <strong>높은 분산</strong> = 적은 가정 → 더 넓은 함수 공간 탐색, 표현력 높음<br />
          CNN은 높은 편향, Transformer(Self-Attention)는 높은 분산 — 정반대 설계 철학
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">수용야 & 효율적 합성곱</h3>
        <M display>{'\\text{RF}_l = \\text{RF}_{l-1} + \\underbrace{(k_l - 1) \\times \\prod_{i=1}^{l-1} s_i}_{\\text{누적 stride 반영}}'}</M>
      </div>
      <div className="not-prose my-6">
        <BiasDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>Receptive Field</strong>가 클수록 전역 정보 활용 — 깊이/stride/dilation으로 조정.<br />
          요약 2: <strong>Dilated Conv</strong>는 파라미터 증가 없이 RF 확장 — segmentation 핵심.<br />
          요약 3: <strong>Depthwise Separable</strong>은 모바일 CNN의 표준 — 연산/파라미터 대폭 절감.
        </p>
      </div>
    </section>
  );
}
