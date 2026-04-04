import PairingGroupsViz from './viz/PairingGroupsViz';
import G1G2ArchViz from './viz/G1G2ArchViz';
import CodePanel from '@/components/ui/code-panel';
import { twistCode, generatorCode, affineCode } from './g1g2Data';

export default function G1G2BN254() {
  return (
    <section id="g1-g2-bn254" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">G1 + G2 — BN254 타원곡선 군</h2>
      <div className="not-prose mb-8"><PairingGroupsViz /></div>
      <div className="not-prose mb-8"><G1G2ArchViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">G1 vs G2와 Sextic Twist</h3>
        <p>
          페어링(Pairing, 두 타원곡선 군의 원소를 곱셈 군으로 매핑하는 쌍선형 함수) e(G1, G2) → GT의 구조다.
          <br />
          G1은 Fp 위의 점, G2는 Fp2 위의 점, GT는 Fp12의 부분군이다.
          <br />
          BN254의 embedding degree k=12에서 G2는 원래 E(Fp12) 위의 점이다.
          <br />
          sextic twist(6차 꼬임)를 사용하면 E&apos;(Fp2) 위의 점으로 표현 가능하여 연산 비용이 극적으로 감소한다.
        </p>
        <CodePanel title="G2 sextic twist 구조" code={twistCode} annotations={[
          { lines: [1, 5], color: 'sky', note: 'G1/G2/GT 페어링 구조' },
          { lines: [7, 11], color: 'emerald', note: '트위스트 커브 b\' 계산' },
          { lines: [14, 15], color: 'amber', note: 'G2 구조체 (Fp2 좌표)' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">G2 생성자와 연산</h3>
        <p>
          G1 생성자는 (1, 2)로 간단하지만, G2 생성자는 254-bit Fp2 좌표로 EIP-197에서 정의된 표준값이다.<br />
          G1과 G2의 더블링/덧셈 코드는 동일하며, Rust의 연산자 오버로딩 덕분에
          Fp 산술이 Fp2 산술로 자동 치환된다. 이것이 타워 구조의 장점이다.
        </p>
        <CodePanel title="G2 생성자 (EIP-197)" code={generatorCode} annotations={[
          { lines: [2, 12], color: 'sky', note: 'EIP-197 표준 좌표' },
          { lines: [17, 19], color: 'emerald', note: 'G1/G2 공통 코드 — 타입만 다름' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Affine/Jacobian 변환과 커브 검증</h3>
        <p>
          Jacobian → Affine 변환은 (X, Y, Z) → (X/Z², Y/Z³)로 역원 1회만 필요하다.<br />
          Affine → Jacobian은 Z=1로 두면 무료이다. Jacobian 동치 비교는
          X₁Z₂² == X₂Z₁²와 Y₁Z₂³ == Y₂Z₁³로 to_affine 없이 가능하다.<br />
          커브 위 검증은 Affine에서 y²=x³+b, Jacobian에서 Y²=X³+bZ⁶이다.
        </p>
        <CodePanel title="좌표 변환 + 동치 비교" code={affineCode} annotations={[
          { lines: [1, 7], color: 'sky', note: 'Jacobian → Affine: inv 1회' },
          { lines: [10, 13], color: 'emerald', note: 'Affine → Jacobian: 무료' },
          { lines: [16, 22], color: 'amber', note: 'Jacobian 동치 비교' },
          { lines: [25, 27], color: 'violet', note: '위수 r 검증' },
        ]} />
      </div>
    </section>
  );
}
