import CodePanel from '@/components/ui/code-panel';

const occupancyCode = `// 점유율 (Occupancy) = Active Warps / Max Warps per SM
//
// SM당 최대 워프 (아키텍처별):
//   Ampere (A100): 64 warps = 2048 threads
//   Hopper (H100): 64 warps = 2048 threads
//   Ada (RTX 4090): 48 warps = 1536 threads
//
// 점유율을 제한하는 3가지 자원:
//   1. 레지스터/스레드 — SM당 총 레지스터 65,536개
//   2. 공유 메모리/블록 — SM당 최대 48~228 KB
//   3. 블록당 최대 스레드 — 1024개`;

const calcCode = `// 점유율 계산 예시 (Ampere A100, 256 threads/block, 64 reg/thread)
//
// Step 1: 레지스터 제한
//   64 reg × 256 threads = 16,384 reg/block
//   SM당 65,536 reg / 16,384 = 4 blocks → 1,024 threads = 32 warps
//
// Step 2: 점유율 = 32 / 64 = 50%
//
// 레지스터를 32개로 줄이면?
//   32 reg × 256 = 8,192 reg/block → 8 blocks → 64 warps → 100%
//   단, 레지스터 부족 시 spill 발생 → 오히려 느려질 수 있음`;

const latencyCode = `// 레이턴시 히딩: 충분한 활성 워프로 메모리 지연을 숨김
//
// 글로벌 메모리 접근: ~400 사이클, 공유 메모리: ~20 사이클
// 워프 스케줄러: 대기 워프를 즉시 다른 활성 워프로 교체
//
// 필요 워프 수 = Latency × Throughput (명령어/사이클)
// 실제로는 ILP + 명령어 혼합으로 이론치보다 적은 워프로 가능
//
// 실무 가이드:
//   점유율 50% 이상 → 대부분 충분
//   점유율 25% 미만 → 레이턴시 히딩 부족, 성능 저하 가능
//
// cudaOccupancyMaxPotentialBlockSize API:
//   점유율을 최대화하는 블록 크기를 런타임에 자동 결정
//   int minGridSize, blockSize;
//   cudaOccupancyMaxPotentialBlockSize(&minGridSize, &blockSize, myKernel, 0, 0);`;

export default function Occupancy() {
  return (
    <section id="occupancy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">점유율(Occupancy) & 활성 워프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>점유율은 SM에서 동시에 활성화된 워프 수를 최대 가능 워프 수로 나눈 비율이다. 높은 점유율은 메모리 지연을 숨기는 데 유리하지만, 항상 100%가 최적은 아니다.</p>

        <h3 className="text-xl font-semibold mt-8 mb-3">점유율 정의 & 제한 자원</h3>
        <CodePanel
          title="점유율 = Active Warps / Max Warps per SM"
          code={occupancyCode}
          annotations={[
            { lines: [1, 1], color: 'sky', note: '핵심 공식' },
            { lines: [3, 6], color: 'emerald', note: '아키텍처별 최대 워프' },
            { lines: [8, 11], color: 'amber', note: '3대 제한 요소' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">점유율 계산 예시</h3>
        <p>레지스터 사용량이 점유율을 가장 크게 좌우한다. 스레드당 레지스터를 64개에서 32개로 줄이면 점유율이 50%에서 100%로 올라가지만, spill이 발생하면 오히려 느려진다.</p>
        <CodePanel
          title="A100 점유율 계산 (레지스터 64 vs 32)"
          code={calcCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'Step 1: 레지스터 → 블록 수' },
            { lines: [7, 7], color: 'emerald', note: '결과: 50% 점유율' },
            { lines: [9, 11], color: 'violet', note: '레지스터 절반 → 100%' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">레이턴시 히딩 & 자동 블록 크기</h3>
        <p>GPU는 한 워프가 메모리 응답을 기다리는 동안 다른 워프를 실행한다. 활성 워프가 충분하면 파이프라인이 항상 바쁘게 유지된다.</p>
        <CodePanel
          title="레이턴시 히딩 & cudaOccupancyMaxPotentialBlockSize"
          code={latencyCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '메모리 지연 & 워프 교체' },
            { lines: [9, 11], color: 'emerald', note: '실무 가이드라인' },
            { lines: [13, 16], color: 'amber', note: 'API로 최적 블록 크기 결정' },
          ]}
        />
      </div>
    </section>
  );
}
