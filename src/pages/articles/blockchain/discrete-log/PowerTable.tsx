import PowerTableViz from './viz/PowerTableViz';

export default function PowerTable() {
  return (
    <section id="power-table" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">거듭제곱 테이블</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          g=3이 mod 17의 <strong>생성원(generator)</strong>이면, 3의 거듭제곱이 1부터 16까지 모든 값을 정확히 한 번씩 순환한다.
          <br />
          이 순환 순서가 무작위처럼 뒤섞여 보이기 때문에 y로부터 x를 역추적하기 어렵다.
          <br />
          패턴이 없다는 것이 이산로그 문제의 난이도를 직관적으로 보여준다.
        </p>
      </div>
      <div className="not-prose"><PowerTableViz /></div>
    </section>
  );
}
