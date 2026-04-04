import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const archCode = `// bellperson GPU 아키텍처
//
// [bellperson]  Groth16 prover (Rust)
//     |
//     | multiexp() 호출 (MSM: 수백만 점 × 스칼라)
//     v
// [ec-gpu-gen]  빌드 타임에 커널 소스 생성
//     |         BN254용 FIELD_mul, POINT_add 등
//     v
// [rust-gpu-tools]  런타임 GPU 관리 계층
//     |  - 디바이스 탐색 (OpenCL/CUDA)
//     |  - 커널 소스 → GPU 바이너리 컴파일 (첫 호출 시)
//     |  - GPU 메모리 버퍼 할당/전송
//     v
// [GPU]  실제 커널 실행 (NVIDIA/AMD)`;

const multiexpCode = `// bellperson/src/gpu/multiexp.rs (핵심 흐름 요약)
//
// pub fn multiexp<G: CurveAffine>(
//     bases: &[G],           // 타원곡선 점 배열 (수백만 개)
//     scalars: &[G::Scalar], // 스칼라 배열
// ) -> G::Projective {
//
//     // 1. GPU 디바이스 선택 & 커널 로드
//     let device = rust_gpu_tools::Device::best();
//     let program = device.compile(KERNEL_SOURCE);  // ec-gpu-gen 생성 소스
//
//     // 2. 데이터를 GPU 버퍼로 전송
//     let bases_buf = program.create_buffer(bases);
//     let scalars_buf = program.create_buffer(scalars);
//
//     // 3. 윈도우 분할 (Pippenger 알고리즘)
//     //    스칼라를 c-bit 윈도우로 쪼개어 각 윈도우를 독립 처리
//     let window_size = optimal_window(bases.len());
//     let num_windows = (256 + window_size - 1) / window_size;
//
//     // 4. GPU 커널 실행: 윈도우별 버킷 누적
//     for w in 0..num_windows {
//         program.run_kernel("multiexp", &[bases_buf, scalars_buf, w]);
//     }
//
//     // 5. GPU 결과 → CPU로 복사, 윈도우 결과 합산
//     let partial = program.read_buffer(result_buf);
//     reduce_windows(partial)
// }`;

export default function BellpersonIntegration() {
  return (
    <section id="bellperson-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">bellperson 통합 & GPU 디스패치</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>bellperson</strong>은 Filecoin의 Groth16 증명기다.<br />
          증명의 80% 이상을 차지하는 MSM(Multi-Scalar Multiplication) 연산을 GPU로 오프로드한다.
          ec-gpu-gen이 생성한 커널을 rust-gpu-tools가 런타임에 컴파일하고 실행하는 구조다.
        </p>
        <CodePanel title="bellperson GPU 아키텍처" code={archCode} annotations={[
          { lines: [3, 5], color: 'sky', note: 'bellperson: Groth16 MSM 호출' },
          { lines: [7, 8], color: 'emerald', note: 'ec-gpu-gen: 빌드 타임 커널 생성' },
          { lines: [10, 14], color: 'amber', note: 'rust-gpu-tools: 런타임 GPU 관리' },
        ]} />

        <CitationBlock source="bellperson GPU multiexp" citeKey={3} type="code"
          href="https://github.com/filecoin-project/bellperson">
          <p className="text-xs">
            커널 소스는 첫 번째 multiexp 호출 시 GPU 드라이버에 의해 컴파일된다.<br />
            컴파일된 바이너리는 캐시되어 이후 호출에서 재사용한다.<br />
            이 지연 컴파일(lazy compilation) 전략 덕분에 빌드 타임에 GPU가 없어도 된다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">multiexp GPU 흐름</h3>
        <p>
          Pippenger 알고리즘 기반이다. 스칼라를 c-bit 윈도우로 분할하고,
          각 윈도우의 버킷 누적을 GPU 커널에서 병렬 실행한다.<br />
          최종 윈도우 합산은 CPU에서 수행한다.
        </p>
        <CodePanel title="bellperson multiexp 흐름 (요약)" code={multiexpCode} annotations={[
          { lines: [8, 10], color: 'sky', note: 'GPU 디바이스 선택 & 커널 로드' },
          { lines: [12, 14], color: 'emerald', note: '데이터 → GPU 버퍼 전송' },
          { lines: [21, 23], color: 'amber', note: '윈도우별 GPU 커널 실행' },
          { lines: [26, 28], color: 'violet', note: 'GPU → CPU 복사, 최종 합산' },
        ]} />
      </div>
    </section>
  );
}
