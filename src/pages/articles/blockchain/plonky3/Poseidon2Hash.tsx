import Poseidon2RoundsViz from '../components/Poseidon2RoundsViz';
import CodePanel from '@/components/ui/code-panel';
import { POSEIDON2_CODE, POSEIDON2_ANNOTATIONS, SBOX_CODE, SBOX_ANNOTATIONS } from './Poseidon2HashData';

export default function Poseidon2Hash({ title }: { title?: string }) {
  return (
    <section id="poseidon2-hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Poseidon2 해시 상세'}</h2>
      <div className="not-prose mb-8"><Poseidon2RoundsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3는 <strong>Poseidon2</strong>를 Merkle 트리 압축 함수와
          Fiat-Shamir 챌린저에 사용합니다. BabyBear 위에서 WIDTH=16, D=7으로
          128비트 보안을 달성하며, 부분 라운드 최적화로 Poseidon1 대비
          약 30% 빠릅니다.
        </p>

        <h3>Poseidon2 구조</h3>
        <CodePanel title="퍼뮤테이션 구조 & 라운드 설정" code={POSEIDON2_CODE}
          annotations={POSEIDON2_ANNOTATIONS} />

        <h3>S-box 최적화</h3>
        <CodePanel title="x^7 S-box & 외부/내부 라운드 차이" code={SBOX_CODE}
          annotations={SBOX_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Poseidon2 파라미터 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Poseidon2 파라미터
// - Prime field p (e.g., BabyBear: 2^31 - 2^27 + 1)
// - State width t (e.g., 16)
// - S-box degree d (e.g., 7 for BabyBear)
// - Full rounds R_F (e.g., 8)
// - Partial rounds R_P (e.g., 12)

// Round count 결정
// Security analysis 기반:
// 1) Statistical attack resistance
// 2) Interpolation attack resistance
// 3) Grobner basis attack resistance

// S-box degree d 선택
// - d ≥ 3: security 하한
// - gcd(d, p-1) = 1: bijection 보장
// - BabyBear: d = 7 (smallest valid)
// - Goldilocks: d = 7
// - BN254: d = 5

// MDS (Maximum Distance Separable) matrix
// - Diffusion layer
// - Poseidon2: diagonal matrix (더 빠름)
// - Poseidon1: Cauchy matrix (더 강한 diffusion but 느림)

// Tradeoff
// - 더 많은 rounds → 더 안전, 더 느림
// - 더 큰 width → 더 많은 parallelism
// - 더 높은 degree → 더 적은 rounds but 더 큰 per-round cost

// Plonky3 typical
// BabyBear, t=16, d=7: ~300ns per hash
// Goldilocks, t=12, d=7: ~500ns per hash
// BN254, t=3, d=5: ~5μs per hash (on-chain efficient)`}</pre>

      </div>
    </section>
  );
}
