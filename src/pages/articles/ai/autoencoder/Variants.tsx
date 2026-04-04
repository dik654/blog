import VariantsViz from './viz/VariantsViz';

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">변형</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Denoising(노이즈 강인), Sparse(희소 특징), VAE(확률 분포 생성).<br />
        각 변형은 기본 오토인코더에 제약 조건을 추가한 것.
      </p>
      <VariantsViz />
    </section>
  );
}
