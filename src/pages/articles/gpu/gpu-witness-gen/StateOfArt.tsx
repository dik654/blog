import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const gnarkCode = `// gnark: Go 기반 ZK 프레임워크의 병렬 solver
// CPU 멀티코어를 활용한 레벨 병렬 witness 생성
func (s *solver) solve(levels [][]int, w []fr.Element) {
    for _, level := range levels {
        // 같은 레벨의 hint 함수들을 goroutine으로 병렬 실행
        var wg sync.WaitGroup
        wg.Add(len(level))
        for _, constraintID := range level {
            go func(id int) {
                defer wg.Done()
                s.solveConstraint(id, w)  // 독립 제약 → 동시 실행
            }(constraintID)
        }
        wg.Wait()  // 레벨 완료 후 다음 레벨로
    }
}
// gnark는 CPU 병렬화로 4-8배 가속을 달성한다.
// GPU 포팅 시 레벨당 수천 개 제약을 CUDA 스레드로 매핑하면
// 이론적 100배 이상 가속이 가능하다.`;

const speedupData = [
  ['circom witnesscalc', '순차 (단일 스레드)', '1x', '1x', 'CPU 싱글코어'],
  ['gnark (8코어)', '레벨 병렬 (goroutine)', '4-8x', '-', 'CPU 멀티코어'],
  ['Scroll prover', '레벨 병렬 + 프리페치', '6-10x', '15-30x', 'CPU + GPU'],
  ['GPU 레벨 병렬 (이론)', 'CSR SpMV 커널', '-', '50-200x', 'GPU (A100)'],
];

export default function StateOfArt() {
  return (
    <section id="state-of-art" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">현황: Scroll, Celer, gnark</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPU witness 생성은 아직 초기 단계다.
          <strong>gnark</strong>가 CPU 멀티코어 레벨 병렬화를 가장 먼저 구현했고,
          <strong>Scroll</strong>은 zkEVM prover에서 GPU 가속을 실험 중이다.
          <strong>circom</strong> 생태계는 아직 순차 실행이 기본이며, GPU 포팅이 진행 중이다.
        </p>

        <CitationBlock source="gnark -- ConsenSys ZK Framework" citeKey={4} type="code"
          href="https://github.com/Consensys/gnark">
          <p className="text-xs">
            gnark의 solver는 제약을 레벨별로 분류한 뒤 Go goroutine으로 병렬 실행한다.
            8코어 CPU에서 순차 대비 4-8배 가속을 달성한다.
          </p>
        </CitationBlock>

        <CodePanel title="gnark 레벨 병렬 Solver (Go)" code={gnarkCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '레벨별 순회' },
            { lines: [6, 12], color: 'emerald', note: 'goroutine으로 동일 레벨 병렬 실행' },
            { lines: [14, 14], color: 'amber', note: '레벨 간 동기화 (WaitGroup)' },
            { lines: [17, 19], color: 'violet', note: 'GPU 포팅 시 100x+ 가속 가능성' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">프로젝트별 성능 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로젝트</th>
                <th className="border border-border px-4 py-2 text-left">전략</th>
                <th className="border border-border px-4 py-2 text-left">CPU 가속</th>
                <th className="border border-border px-4 py-2 text-left">GPU 가속</th>
                <th className="border border-border px-4 py-2 text-left">하드웨어</th>
              </tr>
            </thead>
            <tbody>
              {speedupData.map(([proj, strategy, cpu, gpu, hw]) => (
                <tr key={proj}>
                  <td className="border border-border px-4 py-2 font-medium">{proj}</td>
                  <td className="border border-border px-4 py-2">{strategy}</td>
                  <td className="border border-border px-4 py-2">{cpu}</td>
                  <td className="border border-border px-4 py-2">{gpu}</td>
                  <td className="border border-border px-4 py-2">{hw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">향후 방향</h3>
        <p>
          <strong>FPGA/ASIC</strong>: Ingonyama, Cysic 등이 witness 생성 전용 하드웨어를 개발 중이다.<br />
          결정론적 연산 패턴을 갖는 witness 생성은 고정 파이프라인 설계에 적합하다.
          <strong>zkVM</strong> 계열(RISC Zero, SP1)은 범용 실행 트레이스에서 witness를 추출하므로,
          GPU보다 메모리 대역폭이 병목이 되어 HBM 기반 가속기가 유리할 수 있다.
        </p>
      </div>
    </section>
  );
}
