import Variants from "./lstm/Variants";

export default function GRUArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">One gate at a time</p>
        <h2 className="text-3xl font-bold tracking-tight">
          Reset으로 candidate를 만들고 update로 기존 state와 섞는다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          네 줄짜리 GRU 식을 한 번에 제시하지 않습니다. reset gate가 과거를 거르는
          위치, candidate의 형태, update gate가 두 state를 보간하는 이유를 각각 본 뒤
          마지막에 하나의 recurrent transition으로 조합합니다.
        </p>
      </section>
      <Variants />
    </article>
  );
}
