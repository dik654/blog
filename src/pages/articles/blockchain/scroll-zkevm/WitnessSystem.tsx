import WitnessPipelineViz from './viz/WitnessPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import {
  WITNESS_PIPELINE_CODE, pipelineAnnotations,
  BLOCK_WITNESS_CODE, blockAnnotations,
  EXEC_STEP_CODE, execStepAnnotations,
} from './WitnessSystemData';

export default function WitnessSystem() {
  return (
    <section id="witness-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Witness 시스템</h2>
      <div className="not-prose mb-8"><WitnessPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Witness(증인 데이터)는 회로에 입력되는 <strong>비공개 실제 값</strong>입니다.<br />
          EVM 실행의 모든 상태와 연산을 검증 가능한 형태로 변환합니다.<br />
          Geth 트레이스 수집 → Bus-Mapping 변환 → Block 생성 → 회로 할당의 4단계를 거칩니다.
        </p>
        <CodePanel title="Witness 생성 파이프라인" code={WITNESS_PIPELINE_CODE}
          annotations={pipelineAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">Block Witness</h3>
        <p>
          <code>Block</code> 구조체는 모든 회로가 공유하는 <strong>중앙 데이터 저장소</strong>입니다.<br />
          트랜잭션, RW 연산, 바이트코드, MPT 업데이트 등 증명에 필요한 모든 정보를 포함합니다.
        </p>
        <CodePanel title="Block 구조체" code={BLOCK_WITNESS_CODE}
          annotations={blockAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">ExecStep Witness</h3>
        <CodePanel title="ExecStep — 실행 단계" code={EXEC_STEP_CODE}
          annotations={execStepAnnotations} />
      </div>
    </section>
  );
}
