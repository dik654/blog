import CodePanel from '@/components/ui/code-panel';

const reductionCode = `// 버킷 환원: 삼각 합산 (running sum trick)
// 입력: buckets[1..2^c-1] — 각 버킷의 누적 점
// 출력: window_sum = sum(i * buckets[i])
//
// 직접 계산하면 i번 버킷을 i번 더해야 한다 → 비효율
// 삼각 합산: 위에서 아래로 내려오면서 running sum을 누적
//
// bucket[3] bucket[2] bucket[1]   (2^c = 4일 때)
// running:  b3       b3+b2     b3+b2+b1
// total:    b3     2*b3+b2   3*b3+2*b2+b1  ← 원하는 결과!
//
// 핵심: O(2^c) 점 덧셈으로 가중합 완성 (곱셈 없음)

__global__ void bucket_reduce(
    const Point* buckets,   // [num_windows][num_buckets]
    Point* window_sums,     // [num_windows]
    int num_buckets         // 2^c
) {
    int wid = blockIdx.x;   // 윈도우 인덱스
    const Point* win_buckets = buckets + wid * num_buckets;

    Point running = Point::identity();
    Point total   = Point::identity();

    // 최상위 버킷부터 내려오면서 누적
    for (int k = num_buckets - 1; k >= 1; k--) {
        running = point_add(running, win_buckets[k]);
        total   = point_add(total, running);
    }
    window_sums[wid] = total;
}`;

const combineCode = `// 윈도우 조합: CPU에서 수행 (윈도우 수 = 16개 정도)
//
// window_sums[0..num_windows-1] 를 최종 MSM 결과로 합침
// result = w[nw-1]
// for j in (nw-2) downto 0:
//     result = double_n(result, c)   // c번 더블링 = *2^c
//     result = point_add(result, w[j])
//
// 호너법과 동일: ((w[nw-1] * 2^c + w[nw-2]) * 2^c + ...) * 2^c + w[0]

Point msm_final_combine(Point* window_sums, int num_windows, int c) {
    Point result = window_sums[num_windows - 1];
    for (int j = num_windows - 2; j >= 0; j--) {
        for (int d = 0; d < c; d++)
            result = point_double(result);    // c번 더블링
        result = point_add(result, window_sums[j]);
    }
    return result;   // 최종 MSM 결과
}`;

export default function Reduction() {
  return (
    <section id="reduction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">버킷 환원과 윈도우 조합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          버킷 누적이 끝나면 각 윈도우의 2^c개 버킷을 하나의 점으로 환원해야 한다.<br />
          목표는 <code>sum(i * bucket[i])</code>이지만, 스칼라 곱을 직접 수행하면 비용이 크다.
        </p>
        <p>
          <strong>삼각 합산</strong>(running sum trick)은 최상위 버킷부터 내려오며 누적하는 방식이다.<br />
          O(2^c)번의 점 덧셈만으로 가중합을 완성한다. 곱셈이 전혀 필요 없다.
        </p>
        <p>
          이 단계는 윈도우당 하나의 스레드가 순차 실행한다.<br />
          윈도우 수가 16개 정도로 적으므로 병렬성은 낮지만,
          버킷 수(2^c)가 크기 때문에 전체 연산량은 무시할 수 없다.
        </p>
        <CodePanel title="삼각 합산 커널" code={reductionCode} annotations={[
          { lines: [5, 6], color: 'sky', note: '삼각 합산 아이디어' },
          { lines: [8, 10], color: 'emerald', note: '동작 예시' },
          { lines: [22, 27], color: 'amber', note: '역순 루프로 running sum 누적' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">최종 윈도우 조합</h3>
        <p>
          윈도우별 결과를 <code>w[j] * 2^(j*c)</code> 가중치로 합친다.<br />
          호너법(Horner's method)을 적용하면 더블링 c번과 덧셈 1번의 반복으로 처리된다.<br />
          윈도우 수가 16개 이하이므로 CPU에서 수행해도 충분하다.
        </p>
        <CodePanel title="윈도우 조합 (CPU)" code={combineCode} annotations={[
          { lines: [5, 7], color: 'sky', note: '호너법 적용' },
          { lines: [12, 15], color: 'emerald', note: 'c번 더블링 + 덧셈' },
        ]} />
      </div>
    </section>
  );
}
