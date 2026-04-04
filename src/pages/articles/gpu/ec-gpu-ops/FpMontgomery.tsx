import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const montMulCode = `// Montgomery 곱셈: CIOS (Coarsely Integrated Operand Scanning)
// 입력: a, b (Montgomery form: aR mod p, bR mod p)
// 출력: abR mod p  (나눗셈 없이 곱셈 완료)
__device__ void mont_mul(const uint64_t a[4], const uint64_t b[4],
                         uint64_t result[4], const uint64_t p[4],
                         uint64_t inv) {      // inv = -p^{-1} mod 2^64
    uint64_t t[5] = {0};  // 5-limb 임시 버퍼 (오버플로 대비)

    for (int i = 0; i < 4; i++) {
        // Step 1: 부분곱 누적
        uint128_t carry = 0;
        for (int j = 0; j < 4; j++) {
            carry += (uint128_t)a[j] * b[i] + t[j];
            t[j] = (uint64_t)carry;
            carry >>= 64;
        }
        t[4] = (uint64_t)carry;

        // Step 2: Montgomery 환원 (핵심: 나눗셈 대신 shift)
        uint64_t m = t[0] * inv;          // m = t[0] * (-p^{-1}) mod 2^64
        carry = (uint128_t)m * p[0] + t[0];
        carry >>= 64;                     // t[0]은 0이 되어 버려짐 → shift 효과
        for (int j = 1; j < 4; j++) {
            carry += (uint128_t)m * p[j] + t[j];
            t[j-1] = (uint64_t)carry;
            carry >>= 64;
        }
        t[3] = t[4] + (uint64_t)carry;
        t[4] = 0;
    }
    // Step 3: 최종 감산 (t >= p이면 t -= p)
    subtract_if_gte(t, p, result);
}`;

export default function FpMontgomery() {
  return (
    <section id="fp-montgomery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp Montgomery 곱셈 커널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모듈러 곱셈 <code>a * b mod p</code>를 직접 구현하면 매번 나눗셈이 필요하다.
          <strong>Montgomery form</strong>은 원소를 <code>aR mod p</code> (R = 2^256)로 변환해두면,
          곱셈 결과에서 R을 제거할 때 <strong>shift와 덧셈만으로</strong> 환원이 가능하다.
        </p>

        <CitationBlock source="Montgomery (1985) -- Modular Multiplication Without Trial Division"
          citeKey={2} type="paper" href="https://doi.org/10.1090/S0025-5718-1985-0777282-X">
          <p className="italic">"We present a method for multiplying two integers modulo N while avoiding division by N."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">CIOS 알고리즘</h3>
        <p>
          <strong>CIOS</strong>(Coarsely Integrated Operand Scanning)는 부분곱 누적과 Montgomery 환원을 같은 루프에서 수행한다.<br />
          GPU에서는 레지스터 사용량이 핵심이다.
          4-limb CIOS는 약 <strong>40개 레지스터</strong>를 사용하며, SM당 점유율과 직접 트레이드오프된다.
        </p>
        <CodePanel title="Montgomery 곱셈 CIOS 커널 (CUDA C++)" code={montMulCode}
          annotations={[
            { lines: [4, 6], color: 'sky', note: 'Montgomery form 입출력' },
            { lines: [10, 16], color: 'emerald', note: 'Step 1: 부분곱 누적 (4x4 = 16 곱셈)' },
            { lines: [19, 27], color: 'amber', note: 'Step 2: Montgomery 환원 (나눗셈 없이 shift)' },
            { lines: [30, 31], color: 'violet', note: 'Step 3: 조건부 감산' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">성능 특성</h3>
        <p>
          H100 기준 단일 Fp 곱셈은 약 <strong>50 클럭</strong>이다.<br />
          SM 132개 x 워프 64개 x 파이프라인 활용을 감안하면,
          이론적 처리량은 <strong>~10억 Fp mul/sec</strong>에 달한다.<br />
          실제 MSM/NTT에서는 메모리 대역폭이 병목이 되어 이론치의 30-50%를 달성한다.
        </p>
      </div>
    </section>
  );
}
