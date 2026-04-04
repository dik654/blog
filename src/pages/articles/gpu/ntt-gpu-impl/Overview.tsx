import CodePanel from '@/components/ui/code-panel';

const mappingCode = `NTT = FFT over finite field Fp (p는 소수, p-1이 큰 2의 거듭제곱을 포함)

FFT 나비 연산 (복소수):  a' = a + W*b,   b' = a - W*b
NTT 나비 연산 (유한체):  a' = (a + w*b) mod p,  b' = (a - w*b) mod p
  → w = 원시 n차 단위근 (primitive n-th root of unity in Fp)

n = 2^k 일 때:
  총 스테이지 수 = k = log2(n)
  스테이지당 나비 연산 = n/2개
  전체 연산량 = k * n/2 = O(n log n)

ZK 증명에서 전형적 크기:
  Groth16:  n = 2^20 ~ 2^24  (다항식 차수)
  PLONK:   n = 2^22 ~ 2^28  (게이트 수)`;

const parallelismCode = `GPU 병렬성 분석:

스테이지 내부: n/2개 나비 연산이 완전 독립 → 대규모 병렬 실행 가능
스테이지 간:   데이터 의존성 존재 → 동기화(barrier) 필요

GPU 매핑 전략:
  작은 스테이지 (stride < blockDim):
    → 공유 메모리에 로드 후 __syncthreads()로 블록 내 동기화
    → 글로벌 메모리 왕복 불필요, 여러 스테이지를 한 커널에서 처리

  큰 스테이지 (stride >= blockDim):
    → 글로벌 메모리에서 직접 읽기/쓰기
    → 스테이지당 커널 1회 실행 (전체 GPU 동기화)

n = 2^24 기준:
  전체 24 스테이지 중 ~10개는 공유메모리, ~14개는 글로벌 메모리`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cooley-Tukey NTT를 GPU에 매핑하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NTT(Number Theoretic Transform)는 <strong>유한체 위의 FFT</strong>다.<br />
          복소수 대신 소수체 Fp에서 단위근을 사용하며, 부동소수점 오차 없이 정확한 다항식 곱셈을 수행한다.<br />
          ZKP 증명 시스템에서 다항식 곱셈과 평가를 위해 핵심적으로 사용된다.
        </p>
        <CodePanel title="NTT 구조: FFT와의 대응" code={mappingCode}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'FFT vs NTT 나비 연산' },
            { lines: [5, 8], color: 'emerald', note: '연산량 분석' },
            { lines: [10, 12], color: 'amber', note: 'ZK 증명 전형적 크기' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">스테이지 내 병렬성과 스테이지 간 의존성</h3>
        <p>
          핵심 관찰: 같은 스테이지 안의 n/2개 나비 연산은 서로 <strong>완전히 독립</strong>이다.<br />
          GPU의 수천 개 코어에 직접 매핑할 수 있다.<br />
          단, 다음 스테이지로 넘어가려면 이전 스테이지의 모든 결과가 필요하므로 <strong>배리어 동기화</strong>가 필수다.
        </p>
        <p>
          이 제약이 GPU 구현의 핵심 설계 결정을 만든다.<br />
          블록 내 동기화(__syncthreads)는 저렴하지만, 블록 간 동기화는 커널 재실행이 유일한 방법이다.<br />
          따라서 작은 stride 스테이지는 공유 메모리에서 한 번에, 큰 stride 스테이지는 글로벌 메모리에서 스테이지별로 실행한다.
        </p>
        <CodePanel title="GPU 매핑 전략: 공유메모리 vs 글로벌" code={parallelismCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '스테이지 내 독립성' },
            { lines: [6, 9], color: 'emerald', note: '공유메모리: 블록 내 다중 스테이지' },
            { lines: [11, 13], color: 'amber', note: '글로벌: 스테이지당 커널 1회' },
          ]} />
      </div>
    </section>
  );
}
