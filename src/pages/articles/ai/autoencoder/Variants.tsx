import VariantsViz from './viz/VariantsViz';
import AEVariantsViz from './viz/AEVariantsViz';

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">변형</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Denoising(노이즈 강인), Sparse(희소 특징), VAE(확률 분포 생성).<br />
        각 변형은 기본 오토인코더에 제약 조건을 추가한 것.
      </p>
      <VariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">변형 상세 + 비교</h3>
      </div>
      <div className="not-prose mt-4 mb-6">
        <AEVariantsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 각 변형은 <strong>손실 함수 또는 구조에 제약</strong> 추가 — 목적에 맞게 선택.<br />
          요약 2: <strong>VAE</strong>는 생성 모델의 관문, <strong>VQ-VAE</strong>는 이미지-언어 연결 고리.<br />
          요약 3: 2022년 이후 <strong>MAE 스타일 masking</strong>이 자기지도 학습의 표준.
        </p>
      </div>
    </section>
  );
}
