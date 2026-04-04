import R1CSGenViz from './viz/R1CSGenViz';
import CodePanel from '@/components/ui/code-panel';

const BUILD_CODE = `pub fn build_circuit(
  program: ProgramArchive,
  config: BuildConfig
) -> BuildRes {
  // 1. 인스턴스화: 템플릿 → 컴포넌트
  let (exe, warnings) = instantiation(
    &program, flags, &config.prime
  )?;

  // 2. 내보내기: ExecutedProgram → DAG + VCP
  let (dag, vcp, warnings) = export(
    exe, program, flags
  )?;

  // 3. 최적화: DAG 기반 제약 단순화
  if config.flag_f {
    sync_dag_and_vcp(&mut vcp, &mut dag);
  } else {
    simplification_process(&mut vcp, dag, &config);
  }
}`;

export default function R1CSGen({ title }: { title?: string }) {
  return (
    <section id="r1cs-gen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'R1CS 제약 생성'}</h2>
      <div className="not-prose mb-8">
        <R1CSGenViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>constraint_generation</code> 모듈은 Circom 컴파일러의 핵심입니다.<br />
          파싱된 AST를 실제 R1CS(Rank-1 Constraint System) 제약으로 변환하며,
          DAG 기반 최적화로 불필요한 제약을 제거합니다.
        </p>
        <CodePanel
          title="build_circuit — 제약 생성 진입점"
          code={BUILD_CODE}
          annotations={[
            { lines: [5, 8], color: 'sky', note: '템플릿 인스턴스화 (재귀적)' },
            { lines: [11, 14], color: 'emerald', note: 'DAG + VCP 구조로 변환' },
            { lines: [17, 21], color: 'amber', note: 'DAG 기반 제약 최적화' },
          ]}
        />
        <h3>R1CS 제약 형식</h3>
        <p>
          모든 제약은 <strong>A * B = C</strong> 형태입니다.
          <code>{'c <== a * b'}</code>는 단일 R1CS 제약으로 변환되지만,
          <code>{'c <== a * b + d'}</code>는 중간 시그널을 추가하여 두 개의 제약으로 분해됩니다.
        </p>
      </div>
    </section>
  );
}
