import LanguageModel from "./rnn/LanguageModel";

export default function RNNLanguageModelArticle() {
  return (
    <article className="space-y-14">
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
