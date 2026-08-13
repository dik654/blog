export default function Nonconvex() {
  return (
    <section id="nonconvex" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Nonconvex landscape: stationary point와 global optimum을 구분하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          깊은 신경망의 objective는 parameter permutation, saddle point와 여러
          basin 때문에 일반적으로 nonconvex입니다. Gradient norm이
          작아졌다는 사실은 stationary point에 가까워졌다는 신호이지,
          global optimum이나 좋은 generalization을 증명하지 않습니다.
        </p>
        <p>
          Stationary point는 gradient가 0인 위치를 뜻할 뿐입니다.
          <code>f(x)=x²</code>의 x=0은 minimum이지만,
          <code>f(x)=−x²</code>의 x=0은 maximum입니다. 두 변수
          <code>f(x,y)=x²−y²</code>의 (0,0)은 x 방향으로는 올라가고 y
          방향으로는 내려가는 saddle point입니다. 그래서 작은 gradient만으로
          세 경우를 구분할 수 없습니다.
        </p>
        <p>
          따라서 optimizer 실험에서는 training loss뿐 아니라 validation metric,
          gradient norm, update norm, numerical stability, wall-clock과 memory를 함께
          봅니다. Convex analysis는 쓸모없는 이상화가 아니라 어떤 보장이 어떤
          구조에서 나오는지 분해하는 기준입니다.
        </p>
      </div>
    </section>
  );
}
