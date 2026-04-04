import CodePanel from '@/components/ui/code-panel';

const sboxCode = `// S-box CUDA 커널: x → x^5 in Fp
// x^5 = (x^2)^2 * x  → Fp 곱셈 3회 (squaring 2 + mul 1)
__device__ Fp sbox(Fp x) {
    Fp x2 = fp_mul(x, x);    // x^2   (1st mul)
    Fp x4 = fp_mul(x2, x2);  // x^4   (2nd mul)
    return fp_mul(x4, x);     // x^5   (3rd mul)
}

// Full round: S-box를 모든 상태 원소에 적용
// 각 스레드가 state[lane]을 담당 → width개 스레드 병렬
__device__ void full_round(Fp* state, int width, int lane,
                           const Fp* round_constants, int rc_offset) {
    // 1) round constant 덧셈
    state[lane] = fp_add(state[lane], round_constants[rc_offset + lane]);
    // 2) S-box 적용 (모든 lane)
    state[lane] = sbox(state[lane]);
}

// Partial round: S-box를 첫 번째 원소만 적용
// 나머지 원소는 identity (round constant만 더함)
__device__ void partial_round(Fp* state, int width, int lane,
                              const Fp* round_constants, int rc_offset) {
    state[lane] = fp_add(state[lane], round_constants[rc_offset + lane]);
    if (lane == 0) {
        state[0] = sbox(state[0]);  // 첫 번째만 S-box
    }
}`;

export default function SboxKernel() {
  return (
    <section id="sbox-kernel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">S-box 커널: x^5 거듭제곱</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Poseidon의 S-box는 <code>x^alpha</code> 거듭제곱이다.<br />
          BN254에서 alpha=5를 사용하는 이유는 간단하다.
          alpha가 p-1과 서로소여야 S-box가 전단사(bijection)이고,
          alpha=3은 gcd(3, p-1)=3이라 불가하므로 최소값인 5를 선택한다.
        </p>
        <p>
          <code>x^5</code>는 squaring 2회 + 곱셈 1회, 총 Fp 곱셈 3회로 구현한다.<br />
          GPU에서 Full round는 상태의 모든 원소에 S-box를 병렬 적용하고,
          Partial round는 첫 번째 원소만 S-box를 적용한다.<br />
          이 비대칭 구조 덕분에 Partial round의 비용은 Full round의 1/width 수준이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Full vs Partial 라운드 커널</h3>
        <p>
          GPU 구현에서 하나의 해시 인스턴스를 width개 스레드(또는 워프 내 lane)가 분담한다.<br />
          각 스레드는 상태 벡터의 한 원소를 전담하여 round constant 덧셈과 S-box를 수행한다.<br />
          Full round에서는 모든 lane이 S-box를 실행하고,
          Partial round에서는 lane 0만 S-box를 실행한다.
        </p>
        <CodePanel title="S-box 및 Full/Partial 라운드 커널" code={sboxCode} annotations={[
          { lines: [3, 8], color: 'sky', note: 'S-box: x^5 = x^4 * x, Fp 곱셈 3회' },
          { lines: [12, 18], color: 'emerald', note: 'Full round: 모든 lane에 S-box' },
          { lines: [22, 28], color: 'amber', note: 'Partial round: lane 0만 S-box' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">연산 비용 비교</h3>
        <p>
          arity=11(width=12) 기준으로 Full round는 S-box 12회(Fp mul 36회),
          Partial round는 S-box 1회(Fp mul 3회)다.<br />
          전체 65라운드 중 Partial 57라운드가 S-box 연산의 대부분을 절약한다.<br />
          이 절약분이 없으면 Poseidon은 ZK-friendly 해시로서의 의미를 잃는다.
        </p>
      </div>
    </section>
  );
}
