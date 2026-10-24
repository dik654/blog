import LanguageModel from "./rnn/LanguageModel";
import { RnnTrackLocator } from "./rnn/shared/RnnSeriesLocator";

export default function RNNLanguageModelArticle() {
  return (
    <article className="space-y-14">
      <RnnTrackLocator current="language-model" question="현재까지의 state를 다음 token 전체의 확률로 어떻게 바꿀까요?" fixture="[BOS, 나, 간다, EOS] 한 문장을 세 개의 shifted pair로 만들고, hidden state→logit→probability→NLL→perplexity를 한 경로로 추적합니다." parentHref="/cs/ai/rnn#overview" parentLabel="직전 입력까지를 hidden state로 압축하는 RNN" secondaryHref="/cs/ai/cross-entropy#cross-entropy" secondaryLabel="정답 probability를 NLL로 바꾸는 과정" />
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">Prediction contract first</p>
        <h2 className="text-3xl font-bold tracking-tight">
          Token 한 칸 이동에서 다음-token 확률까지 쌓는다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          이 글은 perplexity 숫자부터 시작하지 않습니다. 입력 token과 정답 token을
          한 칸 어긋나게 만드는 이유, hidden state를 logits로 바꾸는 형태, NLL과
          perplexity가 각각 무엇을 측정하는지를 순서대로 연결합니다.
        </p>
      </section>
      <LanguageModel />
    </article>
  );
}
