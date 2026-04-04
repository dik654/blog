import JacobianAffineViz from './viz/JacobianAffineViz';
import CodePanel from '@/components/ui/code-panel';
import { structCode, doubleCode, addCode, scalarMulCode } from './g1CurveData';

export default function G1Curve() {
  return (
    <section id="g1-curve" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">G1 — BN254 위의 타원곡선군</h2>
      <div className="not-prose mb-8"><JacobianAffineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">타원곡선과 Jacobian 좌표</h3>
        <p>
          유한체(Finite Field) Fp 위에서 y² = x³ + ax + b를 만족하는 점의 집합과 무한원점 O가 타원곡선군을 이룬다.
          <br />
          BN254에서는 a = 0, b = 3이므로 y² = x³ + 3이다.
          <br />
          타원곡선 위의 점들은 덧셈에 대해 군을 이루며, 스칼라 곱 k·P는 쉽다.
          <br />
          반면 P와 Q = k·P로부터 k를 구하는 것은 어렵다 (ECDLP, 타원곡선 이산로그 문제).
        </p>
        <p>
          Affine 좌표 (x, y)에서는 점 덧셈마다 역원(Fp::inv)이 필요하여 비용이 크다.
          <br />
          Jacobian 좌표(사영 좌표) (X, Y, Z)는 affine (x, y) = (X/Z², Y/Z³)로 대응된다.
          <br />
          역원 없이 mul/add만으로 연산이 가능하다.
          <br />
          최종 결과가 필요할 때만 to_affine으로 역원 1번 호출한다.
        </p>
        <CodePanel title="G1 구조체 정의" code={structCode} annotations={[
          { lines: [2, 3], color: 'sky', note: 'Affine vs Jacobian 좌표계' },
          { lines: [6, 8], color: 'emerald', note: '항등원과 생성자' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">점 더블링과 점 덧셈</h3>
        <p>
          더블링(2P)은 곡선 위의 점 P에서 접선을 그어 곡선과 만나는 점을 x축 대칭시킨다.
          <br />
          a=0 특화 공식으로 A=Y², B=4XA, C=8A², D=3X²를 구한 뒤
          X₃=D²-2B, Y₃=D(B-X₃)-C, Z₃=2YZ로 계산한다. 역원 호출 0회.
        </p>
        <CodePanel title="점 더블링 (a=0 최적화)" code={doubleCode} annotations={[
          { lines: [2, 2], color: 'sky', note: '항등원/영점 예외 처리' },
          { lines: [3, 6], color: 'emerald', note: '중간 계수 A, B, C, D' },
          { lines: [7, 9], color: 'amber', note: '결과 좌표 계산' },
        ]} />
        <p>
          덧셈(P+Q)은 두 점을 잇는 직선이 곡선과 만나는 세 번째 점을 x축 대칭시킨다.
          <br />
          U₁=X₁Z₂², U₂=X₂Z₁², S₁=Y₁Z₂³, S₂=Y₂Z₁³, H=U₂-U₁, R=S₂-S₁로 계산하며,
          U₁==U₂일 때 S₁==S₂이면 double, 아니면 역원(-Q)이므로 identity를 반환한다.
        </p>
        <CodePanel title="점 덧셈 (Jacobian)" code={addCode} annotations={[
          { lines: [2, 3], color: 'sky', note: '항등원 처리' },
          { lines: [4, 5], color: 'emerald', note: 'U, S 계수 계산' },
          { lines: [6, 9], color: 'amber', note: 'P==Q / P==-Q 분기' },
          { lines: [10, 14], color: 'violet', note: '일반 덧셈 공식' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">스칼라 곱과 위수 검증</h3>
        <p>
          스칼라 곱 k·P는 double-and-add 알고리즘으로 구현한다.
          <br />
          254-bit 스칼라에 대해 최대 254 doublings + 254 additions이 필요하다.
          <br />
          r·G = O (항등원)를 검증하여 G1의 위수가 r임을 확인할 수 있다.
        </p>
        <CodePanel title="스칼라 곱 + 위수 검증" code={scalarMulCode} annotations={[
          { lines: [1, 9], color: 'sky', note: 'double-and-add 알고리즘' },
          { lines: [11, 13], color: 'emerald', note: '위수 r 검증: r·G = O' },
          { lines: [14, 16], color: 'amber', note: '분배법칙 검증' },
        ]} />
      </div>
    </section>
  );
}
