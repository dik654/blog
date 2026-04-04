import CodePanel from '@/components/ui/code-panel';

const kzgScheme = `// KZG Polynomial Commitment Scheme
//
// Setup:  SRS = [G, sG, s^2 G, ..., s^(n-1) G]   (Trusted Setup 산출물)
// Commit: C = sum( a_i * [s^i]G )  for i=0..d    (= MSM!)
// Open:   pi = Commit( q(x) )  where q(x) = (p(x) - p(z)) / (x - z)
// Verify: e(C - v*G, H) == e(pi, [s]H - z*H)     (pairing check)
//
// 핵심: Commit 단계가 그대로 MSM이다.
// GPU MSM 커널을 그대로 호출하면 곧 KZG 커밋이 된다.`;

const useCases = `// KZG를 사용하는 프로토콜들
//
// PLONK    — 5라운드 각각 wire/permutation/quotient 다항식 커밋 (MSM x 10+)
// Groth16  — CRS 자체가 SRS 구조, 증명 = MSM 3회 (A, B, C)
// EIP-4844 — blob당 4096 BLS12-381 G1 점 MSM → blob commitment
// Halo2   — IPA 또는 KZG 백엔드 선택 가능
// Marlin  — Universal KZG + AHP, batch opening 핵심
//
// 공통점: 증명 시간의 60~80%가 MSM(=KZG Commit)이다.`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KZG와 GPU의 관계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>KZG</strong>(Kate-Zaverucha-Goldberg)는 타원곡선 페어링 기반의 다항식 커밋먼트 스킴이다.<br />
          다항식 p(x)를 하나의 타원곡선 점 C로 압축하고,
          임의의 점 z에서의 평가값 p(z)를 페어링 한 번으로 검증할 수 있다.
        </p>
        <p>
          핵심 관찰: <strong>Commit 연산이 MSM 그 자체</strong>다.<br />
          다항식 계수 [a_0, ..., a_d]를 스칼라로, SRS 점 [G, sG, ..., s^d G]를 기저로 놓으면
          C = sum(a_i * [s^i]G)는 정의상 MSM이다.<br />
          따라서 GPU MSM 커널을 직접 호출하면 KZG 커밋이 완성된다.
        </p>
        <CodePanel title="KZG 스킴 정의" code={kzgScheme} annotations={[
          { lines: [3, 3], color: 'sky', note: 'Trusted Setup: SRS 생성' },
          { lines: [4, 4], color: 'emerald', note: 'Commit = MSM' },
          { lines: [5, 6], color: 'amber', note: 'Open & Verify' },
          { lines: [8, 9], color: 'violet', note: 'GPU 활용 핵심' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">어디에 쓰이는가</h3>
        <p>
          PLONK은 라운드마다 다항식을 커밋하므로 MSM을 10회 이상 호출한다.<br />
          Groth16도 CRS 구조가 SRS와 동일하며 증명 생성이 MSM 3회다.<br />
          EIP-4844 blob commitment는 BLS12-381 위의 KZG를 사용한다.<br />
          모든 경우에서 증명 시간의 대부분이 MSM이므로, GPU 가속의 효과가 직접적이다.
        </p>
        <CodePanel title="KZG 사용 프로토콜" code={useCases} annotations={[
          { lines: [3, 4], color: 'sky', note: 'PLONK & Groth16' },
          { lines: [5, 5], color: 'emerald', note: 'EIP-4844 Blob' },
          { lines: [8, 8], color: 'amber', note: '공통 병목: MSM' },
        ]} />
      </div>
    </section>
  );
}
