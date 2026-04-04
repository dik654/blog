import WhySparseViz from './viz/WhySparseViz';

export default function WhySparse() {
  return (
    <section id="why-sparse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 희소한가: twist 구조</h2>
      <div className="not-prose mb-8"><WhySparseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          l(P)가 sparse한 이유는 G1 점 P와 G2 점 T의{' '}
          <strong>좌표 공간 차이</strong> 때문이다.<br />
          P의 좌표는 Fp(정수 1개), T의 좌표는 Fp2(a+bu 형태)다.
        </p>
        <p>
          degree-6 twist 구조 덕분에 접선 방정식{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            l(x,y) = yP + (-lambda*xP)*w + (lambda*xT - yT)*w*v
          </code>{' '}
          를 Fp12로 매핑하면, 특정 위치만 값이 채워진다.
        </p>
        <p>
          Fp 원소는 첫 번째 슬롯에만 들어간다. 나머지 11개는 0이다.<br />
          Fp2 원소는 특정 2개 슬롯에만 들어간다.<br />
          합치면 12개 중 <strong>3개 슬롯만 non-zero</strong>가 된다.
        </p>
        <p>
          twist의 degree가 6이라는 사실이 이 구조를 결정한다.<br />
          BN254처럼 embedding degree 12, twist degree 6인 곡선에서는
          항상 이 희소 패턴이 나타난다.
        </p>
      </div>
    </section>
  );
}
