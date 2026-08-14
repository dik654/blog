import BPTT from "./rnn/BPTT";

export default function BPTTArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">Credit path first</p>
        <h2 className="text-3xl font-bold tracking-tight">
          펼친 시간 graph에서 어느 loss가 어느 weight를 바꾸는지 추적한다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          BPTT를 별도 마법으로 외우지 않습니다. 같은 recurrent weight가 여러 시점에
          쓰인다는 사실에서 시작해 gradient 합산, Jacobian 반복 곱, clipping과
          detach가 서로 다른 문제를 다룬다는 데까지 진행합니다.
        </p>
      </section>
      <BPTT />
    </article>
  );
}
