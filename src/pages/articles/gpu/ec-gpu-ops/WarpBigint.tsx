import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const singleThreadCode = `// 접근법 1: 단일 스레드 256비트 곱셈
// 각 스레드가 4-limb 곱셈 전체를 담당
__device__ void mul256_single(const uint64_t a[4], const uint64_t b[4],
                              uint64_t lo[4], uint64_t hi[4]) {
    // 4x4 = 16번의 uint64 곱셈 + 캐리 전파
    // 중간 결과: 8-limb (512비트)
    uint64_t t[8] = {0};
    for (int i = 0; i < 4; i++) {
        uint64_t carry = 0;
        for (int j = 0; j < 4; j++) {
            uint128_t prod = (uint128_t)a[j] * b[i] + t[i+j] + carry;
            t[i+j] = (uint64_t)prod;
            carry = (uint64_t)(prod >> 64);
        }
        t[i+4] = carry;
    }
    // 단점: 레지스터 ~40개 소모 → 점유율 하락
    // 장점: warp 내 통신 불필요 → 레이턴시 최소
}`;

const warpCoopCode = `// 접근법 2: Warp 협력 캐리 전파
// 4개 lane이 각각 1개 limb를 담당
// lane 0 = limb[0], lane 1 = limb[1], ...
__device__ uint64_t warp_add_with_carry(uint64_t a, uint64_t b, int lane) {
    uint64_t sum = a + b;
    uint32_t borrow = (sum < a) ? 1 : 0;   // 캐리 발생 감지

    // __shfl_up_sync: 하위 lane의 캐리를 상위 lane으로 전달
    // lane 0의 캐리 → lane 1에 전달, lane 1 → lane 2, ...
    for (int d = 1; d < 4; d *= 2) {
        uint32_t incoming = __shfl_up_sync(0xF, borrow, d);
        if (lane >= d) {
            uint64_t prev = sum;
            sum += incoming;
            borrow = (sum < prev) ? 1 : 0;  // 연쇄 캐리 처리
        }
    }
    return sum;
    // 장점: 스레드당 레지스터 ~12개 → 높은 점유율
    // 단점: __shfl 레이턴시 (~5 클럭/hop) 누적
}`;

export default function WarpBigint() {
  return (
    <section id="warp-bigint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Warp 단위 Bigint 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          256비트 곱셈은 <strong>4x4 = 16번의 uint64 곱셈</strong>과 캐리 전파가 필요하다.<br />
          이를 GPU에서 구현하는 방법은 두 가지다.<br />
          단일 스레드가 전부 처리하거나, 워프 내 여러 lane이 협력하는 것이다.
        </p>

        <CitationBlock source="Emmart et al. -- Faster Modular Exponentiation Using Double Precision" citeKey={4} type="paper">
          <p className="italic">"Warp-cooperative arithmetic reduces register pressure at the cost of shuffle latency."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">단일 스레드 방식</h3>
        <p>
          한 스레드가 4-limb 곱셈 전체를 수행한다.
          <strong>~40개 레지스터</strong>를 소모하므로 SM당 활성 워프 수가 줄어들고 점유율이 하락한다.<br />
          대신 lane 간 통신이 없어 레이턴시가 낮다.
        </p>
        <CodePanel title="단일 스레드 256비트 곱셈" code={singleThreadCode}
          annotations={[
            { lines: [5, 6], color: 'sky', note: '16번의 uint64 곱셈 필요' },
            { lines: [7, 15], color: 'emerald', note: '이중 루프: 부분곱 + 캐리' },
            { lines: [17, 18], color: 'amber', note: '트레이드오프: 레지스터 vs 레이턴시' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Warp 협력 방식</h3>
        <p>
          4개 lane이 각각 1개 limb를 담당한다.<br />
          덧셈 후 캐리를 <code>__shfl_up_sync</code>로 상위 lane에 전달한다.<br />
          레지스터 사용량이 <strong>~12개로 감소</strong>하여 점유율이 크게 올라간다.<br />
          단, shuffle 레이턴시(~5 클럭/hop)가 누적되는 단점이 있다.
        </p>
        <CodePanel title="Warp 협력 캐리 전파 (__shfl_up_sync)" code={warpCoopCode}
          annotations={[
            { lines: [4, 5], color: 'sky', note: '각 lane이 1개 limb 담당' },
            { lines: [8, 15], color: 'emerald', note: '__shfl_up_sync로 캐리 전달' },
            { lines: [18, 19], color: 'amber', note: '레지스터 절약 vs shuffle 비용' },
          ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 선택 기준</h3>
        <p>
          <strong>ec-gpu-gen</strong>과 <strong>sppark</strong>는 단일 스레드 방식을 사용한다.<br />
          Montgomery 곱셈의 복잡한 의존 관계가 warp 분산에 불리하기 때문이다.<br />
          반면 <strong>ICICLE</strong>은 NTT의 butterfly 연산처럼 구조가 단순한 경우 warp 협력을 활용한다.<br />
          최적 전략은 연산 종류와 GPU 세대에 따라 달라진다.
        </p>
      </div>
    </section>
  );
}
