import FewShot from "./prompt-engineering/FewShot";

export default function PromptFewShotArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">Demonstration first</p>
        <h2 className="text-3xl font-bold tracking-tight">
          예시 한 개의 형태를 이해한 뒤 selection·order·비용을 붙인다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          Demonstration은 model weight를 바꾸는 학습 데이터가 아니라 현재 request
          안의 조건입니다. 이 작은 형태를 먼저 고정한 뒤 여러 예시의 구성과 순서,
          매 요청에서 반복되는 context 비용을 조합합니다.
        </p>
      </section>
      <FewShot />
    </article>
  );
}
