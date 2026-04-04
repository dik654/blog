import CodePanel from '@/components/ui/code-panel';

const sortApproach = `// 버킷 누적: 정렬 기반 접근 (race condition 회피)
//
// 문제: 여러 스레드가 같은 bucket[k]에 점을 더하면 충돌
// 해법: (window_val, point_idx) 쌍을 window_val 기준 정렬
//       → 같은 버킷의 점들이 연속 배치 → 순차 누적
//
// 단계:
// 1. (window_val, point_idx) 쌍 생성
// 2. cub::DeviceRadixSort::SortPairs — GPU 기수 정렬
// 3. 연속된 같은 window_val 구간을 찾아 점 누적

// 정렬 후 데이터 예시 (c=4, 16개 버킷):
// window_val: [0, 0, 1, 1, 1, 3, 3, 5, ...]
// point_idx:  [7, 2, 0, 5, 9, 1, 4, 8, ...]
//             ↑ bucket 0  ↑ bucket 1   ↑ bucket 3`;

const accumKernel = `// 버킷 누적 커널 (정렬 후)
// 각 스레드 블록이 하나의 버킷 범위를 처리
__global__ void bucket_accumulate(
    const Point* points,           // 타원곡선 점 배열 [n]
    const uint16_t* sorted_vals,   // 정렬된 윈도우 값
    const uint32_t* sorted_idxs,   // 정렬된 점 인덱스
    const uint32_t* bucket_offsets, // 각 버킷의 시작 오프셋
    const uint32_t* bucket_sizes,   // 각 버킷의 크기
    Point* buckets,                 // 출력: 버킷 누적 결과 [2^c]
    int num_buckets
) {
    int bid = blockIdx.x;
    if (bid >= num_buckets) return;

    uint32_t offset = bucket_offsets[bid];
    uint32_t size   = bucket_sizes[bid];

    // 순차 누적 — 같은 버킷이므로 충돌 없음
    Point acc = Point::identity();
    for (uint32_t i = 0; i < size; i++) {
        uint32_t pidx = sorted_idxs[offset + i];
        acc = point_add(acc, points[pidx]);
    }
    buckets[bid] = acc;
}`;

export default function BucketKernel() {
  return (
    <section id="bucket-kernel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">버킷 누적 CUDA 커널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          버킷 누적의 핵심 난제는 <strong>race condition</strong>이다.<br />
          여러 스레드가 동시에 같은 버킷에 점을 더하면 결과가 손상된다.<br />
          세 가지 해결책이 있다.
        </p>
        <p>
          <strong>방법 1</strong>: 원자적 점 덧셈. 구현이 간단하지만 직렬화되어 느리다.
          <strong>방법 2</strong>: 버킷 인덱스 기준 정렬 후 순차 누적. 정렬 비용은 O(n log n)이지만 누적은 충돌 없이 진행된다.
          <strong>방법 3</strong>: 스레드별 로컬 버킷 할당 후 병합. 메모리 사용량이 크다.
        </p>
        <p>
          실전 구현(sppark, ICICLE)은 방법 2를 주로 사용한다.<br />
          CUDA의 <code>cub::DeviceRadixSort</code>가 GPU 기수 정렬을 효율적으로 수행하기 때문이다.
        </p>
        <CodePanel title="정렬 기반 버킷 분류 전략" code={sortApproach} annotations={[
          { lines: [3, 5], color: 'sky', note: '문제와 해법' },
          { lines: [7, 10], color: 'emerald', note: '3단계 파이프라인' },
          { lines: [12, 15], color: 'amber', note: '정렬 후 데이터 배치' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">누적 커널 구현</h3>
        <p>
          정렬이 끝나면 각 버킷의 시작 오프셋과 크기를 알 수 있다.<br />
          블록 하나가 버킷 하나를 담당하여 해당 구간의 점들을 순차적으로 더한다.<br />
          같은 버킷 내에서는 하나의 스레드만 접근하므로 동기화가 불필요하다.
        </p>
        <CodePanel title="버킷 누적 CUDA 커널" code={accumKernel} annotations={[
          { lines: [4, 10], color: 'sky', note: '입출력: 정렬된 인덱스 + 버킷 결과' },
          { lines: [15, 16], color: 'emerald', note: '오프셋/크기로 구간 특정' },
          { lines: [19, 23], color: 'amber', note: '순차 누적 — 충돌 없음' },
        ]} />
      </div>
    </section>
  );
}
