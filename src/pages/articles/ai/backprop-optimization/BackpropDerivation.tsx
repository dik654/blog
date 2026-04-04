import BackpropDerivViz from './viz/BackpropDerivViz';

export default function BackpropDerivation() {
  return (
    <section id="backprop-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">역전파 수식 전개</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        소프트맥스 + 교차엔트로피를 합쳐 미분하면 놀랍도록 단순해진다.<br />
        dL/dh = y - ŷ (예측 - 정답)
      </p>
      <BackpropDerivViz />
    </section>
  );
}
