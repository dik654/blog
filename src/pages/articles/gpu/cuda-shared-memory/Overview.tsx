import CodePanel from '@/components/ui/code-panel';

const allocCode = `// 정적 할당: 컴파일 시점에 크기 결정
__shared__ float tile[BLOCK_SIZE][BLOCK_SIZE];

// 동적 할당: 커널 호출 시 크기 지정
extern __shared__ float dynamicMem[];
kernel<<<grid, block, sharedBytes>>>(args);

// 동적 메모리를 여러 배열로 분할
extern __shared__ char shared[];
float* A = (float*)shared;                   // 0번째부터
float* B = (float*)&shared[n * sizeof(float)]; // n번째부터`;

const useCasesCode = `공유 메모리 3가지 핵심 용도:

1. 스레드 간 통신 (Inter-thread Communication)
   __shared__ float partialSum[256];
   partialSum[tid] = myValue;
   __syncthreads();           // 모든 스레드가 쓰기 완료 대기
   if (tid == 0) total = sum(partialSum);

2. 사용자 관리 캐시 (User-managed Cache)
   // 글로벌 메모리 → 공유 메모리 한 번 로드
   // 이후 반복 접근은 공유 메모리에서 처리
   tile[ty][tx] = input[row * N + col];
   __syncthreads();
   // tile[ty][tx]를 여러 번 재사용 → 글로벌 접근 횟수 감소

3. 데이터 재사용 (Data Reuse)
   // 행렬 곱셈: A의 행, B의 열을 타일 단위로 로드
   // BLOCK_SIZE개 스레드가 같은 타일을 공유
   // 글로벌 접근: O(N) → O(N/BLOCK_SIZE)`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">공유 메모리란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          공유 메모리(Shared Memory)는 GPU SM(Streaming Multiprocessor) 위에 내장된 <strong>온칩(on-chip) SRAM</strong>이다.<br />
          같은 블록 내 모든 스레드가 접근할 수 있고, 글로벌 메모리(DRAM) 대비 <strong>약 100배 빠르다</strong>.
        </p>
        <p>
          레이턴시 비교 -- 레지스터: ~1 사이클, 공유 메모리: ~5 사이클, L2 캐시: ~200 사이클, 글로벌 메모리: ~400-800 사이클.
          <br />
          공유 메모리는 레지스터 다음으로 빠른 메모리이며, 프로그래머가 직접 제어할 수 있는 유일한 캐시 계층이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">__shared__ 키워드와 할당 방식</h3>
        <p>
          <strong>정적 할당</strong> -- 컴파일 시점에 크기가 확정된다. 상수 크기 배열에 사용한다.
          <br />
          <strong>동적 할당</strong> -- 커널 실행 시 세 번째 인자로 바이트 수를 전달한다. 실행 시점에 크기를 결정할 수 있다.
        </p>
        <CodePanel title="공유 메모리 할당: 정적 vs 동적" code={allocCode}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '정적 할당' },
            { lines: [4, 6], color: 'emerald', note: '동적 할당' },
            { lines: [8, 11], color: 'amber', note: '동적 메모리 분할 기법' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 활용 패턴</h3>
        <CodePanel title="공유 메모리 3가지 용도" code={useCasesCode}
          annotations={[
            { lines: [3, 7], color: 'sky', note: '리덕션 등 블록 내 협업' },
            { lines: [9, 13], color: 'emerald', note: '글로벌 접근 최소화' },
            { lines: [15, 19], color: 'amber', note: '타일링으로 재사용 극대화' },
          ]} />
      </div>
    </section>
  );
}
