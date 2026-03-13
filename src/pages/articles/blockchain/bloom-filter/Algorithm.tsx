import { CitationBlock } from '../../../../components/ui/citation';

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">알고리즘과 수학적 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">기본 구조</h3>
        <p>
          Bloom Filter는 두 가지 구성 요소로 이루어집니다: <strong>m-bit 배열</strong>과{' '}
          <strong>k개의 독립적인 해시 함수</strong>입니다. 각 해시 함수는 입력을 0부터 m-1 사이의
          정수로 매핑합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`BloomFilter {
  bit_array: [0; m],       // m개의 비트, 모두 0으로 초기화
  hash_functions: [h₁, h₂, ..., hₖ],  // k개의 독립 해시 함수
}

// 각 해시 함수: hᵢ(x) → {0, 1, ..., m-1}`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">삽입 (Insert)</h3>
        <p>
          원소 x를 삽입할 때, k개의 해시 함수 각각에 x를 입력하고 결과 위치의 비트를 1로 설정합니다.
          이미 1인 비트는 그대로 유지됩니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`fn insert(x):
  for i in 1..k:
    pos = hᵢ(x) mod m
    bit_array[pos] = 1`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">조회 (Query)</h3>
        <p>
          원소 x의 존재 여부를 확인할 때, k개의 해시 함수로 계산한 모든 위치의 비트가 1이면{' '}
          <strong>"아마도 존재(probably in set)"</strong>, 하나라도 0이면{' '}
          <strong>"확실히 없음(definitely not in set)"</strong>으로 판정합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`fn query(x) → bool:
  for i in 1..k:
    pos = hᵢ(x) mod m
    if bit_array[pos] == 0:
      return false     // 확실히 없음
  return true          // 아마도 존재 (false positive 가능)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">False Positive 확률</h3>
        <p>
          n개의 원소를 삽입한 후, 임의의 비트가 여전히 0일 확률은 (1 - 1/m)^(kn) 입니다.
          이를 근사하면 false positive 확률 P(fp)는 다음과 같습니다:
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`P(false positive) ≈ (1 - e^(-kn/m))^k

여기서:
  m = 비트 배열 크기
  n = 삽입된 원소 수
  k = 해시 함수 수
  e = 자연 상수 (≈ 2.71828)

예시: m = 1024, n = 100, k = 7
  P(fp) ≈ (1 - e^(-7×100/1024))^7
        ≈ (1 - e^(-0.684))^7
        ≈ (0.495)^7
        ≈ 0.0061 (약 0.61%)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">최적 해시 함수 개수</h3>
        <p>
          주어진 m과 n에 대해 false positive 확률을 최소화하는 최적의 k 값은 다음과 같습니다:
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`k_optimal = (m/n) × ln 2 ≈ (m/n) × 0.6931

이때 최소 false positive 확률:
  P_min = (1/2)^k = (0.6185)^(m/n)

실무 가이드:
  m/n = 10 (원소당 10비트) → k = 7, P(fp) ≈ 0.82%
  m/n = 15 (원소당 15비트) → k = 10, P(fp) ≈ 0.05%
  m/n = 20 (원소당 20비트) → k = 14, P(fp) ≈ 0.0027%`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Counting Bloom Filter</h3>
        <p>
          표준 Bloom Filter는 원소 삭제를 지원하지 않습니다. 비트를 0으로 되돌리면 다른 원소의
          정보까지 손상되기 때문입니다. <strong>Counting Bloom Filter</strong>는 각 비트를
          카운터(보통 4-bit)로 확장하여 삭제를 가능하게 합니다.
        </p>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`CountingBloomFilter {
  counters: [0; m],   // 각 슬롯이 4-bit 카운터 (0~15)
}

fn insert(x):
  for i in 1..k:
    counters[hᵢ(x) mod m] += 1

fn delete(x):
  for i in 1..k:
    counters[hᵢ(x) mod m] -= 1  // 0 이하로 내려가지 않도록

fn query(x) → bool:
  for i in 1..k:
    if counters[hᵢ(x) mod m] == 0:
      return false
  return true

// 단점: 메모리 사용량 4배 증가 (1-bit → 4-bit)`}</code></pre>

        <CitationBlock source="Burton H. Bloom — Space/Time Trade-offs in Hash Coding with Allowable Errors" citeKey={1} type="paper" href="https://doi.org/10.1145/362686.362692">
          <p className="italic text-foreground/80">
            "The allowable fraction of errors in the hash area can be reduced
            by factors of more than 2 by the use of additional hash functions."
          </p>
          <p className="mt-2 text-xs">
            1970년 Communications of the ACM에 발표된 원본 논문으로, Bloom Filter의
            공간-시간 트레이드오프와 확률적 오류 허용 해시 코딩 기법을 최초로 제안했습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
