import LanguageModelViz from './viz/LanguageModelViz';

export default function LanguageModel() {
  return (
    <section id="language-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">언어 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        P(w_t | w_1...w_(t-1)) — 다음 단어 예측이 핵심 과제.<br />
        n-gram은 직전 n-1개만 참조. RNN 은닉 상태는 이론적으로 무한 맥락 압축.
      </p>
      <LanguageModelViz />
    </section>
  );
}
