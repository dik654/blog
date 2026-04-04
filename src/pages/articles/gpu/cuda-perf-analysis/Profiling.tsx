import CodePanel from '@/components/ui/code-panel';

const nsightCode = `// Nsight Systems — 시스템 수준 타임라인 프로파일러
//   nsys profile --stats=true ./my_cuda_app
//   확인: 커널 런치 갭, 전송-연산 중첩, CPU 병목, 스트림 활용
//
// Nsight Compute — 커널 수준 상세 프로파일러
//   ncu --set full ./my_cuda_app
//   ncu --kernel-name myKernel ./my_cuda_app
//
// Nsight Compute 핵심 메트릭:
//   sm__throughput.avg.pct_of_peak_sustained   — 연산 활용률 (%)
//   dram__throughput.avg.pct_of_peak_sustained — 메모리 활용률 (%)
//   launch__occupancy                         — 달성 점유율
//
// Speed of Light (SOL) 판별:
//   연산 높고 + 메모리 낮음 → Compute-bound
//   연산 낮고 + 메모리 높음 → Memory-bound
//   둘 다 낮음 → Latency-bound (점유율 또는 동기화 문제)`;

const bottleneckCode = `// 4대 성능 병목 & 해결
//
// 1. 낮은 점유율 (< 25%)
//    원인: 레지스터 과다, 공유 메모리 과다, 작은 블록
//    해결: --maxrregcount 옵션, 블록 크기 조정
//
// 2. 비정렬 메모리 접근 (Uncoalesced Access)
//    원인: 연속 스레드가 비연속 주소 접근
//    해결: SoA 레이아웃, 접근 패턴 재설계
//
// 3. 뱅크 충돌 (Bank Conflict)
//    원인: 같은 뱅크에 동시 접근
//    해결: 패딩 (배열 크기 +1), 접근 스트라이드 변경
//
// 4. 워프 분기 (Warp Divergence)
//    원인: if-else에서 워프 내 스레드가 다른 경로
//    해결: 분기를 워프 경계에 맞추기, predication 활용`;

const workflowCode = `// 프로파일링 워크플로우
//
// Step 1: Nsight Systems로 전체 타임라인 확인
//   → CPU-GPU 전송, 커널 간 갭, 스트림 활용 점검
//
// Step 2: 실행 시간 기준 병목 커널 Top 3 선별
//
// Step 3: Nsight Compute로 커널 상세 분석
//   → SOL에서 compute/memory bound 판별
//   → 점유율, coalescing, 뱅크 충돌 확인
//
// Step 4: 한 번에 하나의 변경만 적용 & 전후 메트릭 정량 비교`;

export default function Profiling() {
  return (
    <section id="profiling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nsight 프로파일링 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>성능 최적화는 측정에서 시작한다. NVIDIA는 <strong>Nsight Systems</strong>(시스템 타임라인)와 <strong>Nsight Compute</strong>(커널 상세 메트릭) 두 가지 프로파일러를 제공한다.</p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Nsight Systems & Compute</h3>
        <p>Nsight Systems로 전체 CPU-GPU 상호작용을 타임라인에서 파악한 뒤, 병목 커널을 Nsight Compute로 상세 분석한다. SOL 섹션의 연산/메모리 활용률로 bound 유형을 즉시 판별할 수 있다.</p>
        <CodePanel
          title="Nsight Systems & Compute 사용법"
          code={nsightCode}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'Nsight Systems: 타임라인' },
            { lines: [5, 7], color: 'emerald', note: 'Nsight Compute: 커널 분석' },
            { lines: [14, 17], color: 'amber', note: 'SOL 판별 기준' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">병목 유형 & 해결</h3>
        <CodePanel
          title="4대 성능 병목 진단 & 해결"
          code={bottleneckCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '낮은 점유율' },
            { lines: [7, 9], color: 'emerald', note: '비정렬 접근' },
            { lines: [11, 13], color: 'amber', note: '뱅크 충돌' },
            { lines: [15, 17], color: 'violet', note: '워프 분기' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-3">프로파일링 워크플로우</h3>
        <p>최적화는 측정-분석-변경-재측정의 순환으로 진행한다. 한 번에 하나의 변경만 적용해야 어떤 최적화가 효과적이었는지 구분할 수 있다.</p>
        <CodePanel
          title="4단계 프로파일링 워크플로우"
          code={workflowCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: 'Step 1: 전체 타임라인' },
            { lines: [6, 6], color: 'emerald', note: 'Step 2: 병목 커널 식별' },
            { lines: [8, 10], color: 'amber', note: 'Step 3: 상세 분석' },
            { lines: [12, 12], color: 'violet', note: 'Step 4: 최적화 & 반복' },
          ]}
        />
      </div>
    </section>
  );
}
