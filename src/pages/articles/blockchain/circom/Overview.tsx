import CompilerPipelineViz from './viz/CompilerPipelineViz';
import CodePanel from '@/components/ui/code-panel';

const CRATE_CODE = `circom/
 parser/           # LALRPOP 기반 .circom 파싱 → AST
 program_structure/ # Template, Signal, ProgramArchive
 type_analysis/     # 신호 타입 검증, 매개변수 추론
 constraint_generation/ # R1CS 제약 생성 핵심
 dag/               # DAG 기반 제약 최적화
 code_producers/    # .r1cs, .wasm, .sym, C++ 출력
 circom_algebra/    # 유한체 산술 연산
 constant_tracking/ # 상수 전파 최적화
 constraint_list/   # 제약 조건 리스트 관리
 constraint_writers/ # 제약 직렬화`;

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 컴파일 파이프라인'}</h2>
      <div className="not-prose mb-8">
        <CompilerPipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Circom</strong>은 zkSNARK 증명 시스템을 위한 산술 회로를 정의하는
          도메인 특화 언어(DSL)입니다. <code>.circom</code> 소스를 파싱하여
          R1CS 제약 조건과 WASM 증인 계산기를 생성하고,
          snarkjs/rapidSnark와 연동하여 증명을 생성합니다.
        </p>
        <CodePanel
          title="circom 컴파일러 크레이트 구조"
          code={CRATE_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '프론트엔드 (파싱 + AST)' },
            { lines: [5, 6], color: 'emerald', note: '제약 생성 핵심' },
            { lines: [7, 8], color: 'amber', note: '최적화 + 출력' },
          ]}
        />
      </div>
    </section>
  );
}
