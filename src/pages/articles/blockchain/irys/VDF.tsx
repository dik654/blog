import CodePanel from '@/components/ui/code-panel';
import VDFStepsViz from './viz/VDFStepsViz';
import VDFConsensusFlowViz from './viz/VDFConsensusFlowViz';
import { VDF_PROPERTIES, VDF_SHA_CODE, VDF_CONFIG_CODE, BLOCK_FLOW_CODE } from './VDFData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function VDF({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="vdf" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'VDF 합의 메커니즘'}</h2>
      <div className="not-prose mb-8"><VDFStepsViz /></div>
      <div className="not-prose mb-8"><VDFConsensusFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys의 합의는 <strong>VDF(Verifiable Delay Function)</strong>를 기반으로 합니다.<br />
          VDF는 계산이 반드시 순차적으로 이루어져야 하고(병렬화 불가),
          결과를 빠르게 검증할 수 있는 암호학적 함수입니다.
        </p>

        <h3>VDF의 세 가지 속성</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {VDF_PROPERTIES.map(p => (
            <div key={p.name} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="font-semibold text-sm text-emerald-400">{p.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('irys-vdf-sha', codeRefs['irys-vdf-sha'])} />
            <span className="text-[10px] text-muted-foreground self-center">vdf/src/lib.rs</span>
            <CodeViewButton onClick={() => onCodeRef('irys-vdf-run', codeRefs['irys-vdf-run'])} />
            <span className="text-[10px] text-muted-foreground self-center">vdf/src/vdf.rs</span>
          </div>
        )}

        <h3>SHA256 기반 VDF 구현</h3>
        <CodePanel title="VDF SHA256 순차 해시" code={VDF_SHA_CODE} annotations={[
          { lines: [8, 13], color: 'sky', note: '체크포인트별 순차 해싱 루프' },
        ]} />

        <h3>VDF 파라미터</h3>
        <CodePanel title="VDF 설정 구조체" code={VDF_CONFIG_CODE} annotations={[
          { lines: [1, 5], color: 'emerald', note: 'VDF 설정 필드' },
        ]} />

        <h3>블록 생성 흐름</h3>
        <CodePanel title="VDF 기반 블록 생성 루프" code={BLOCK_FLOW_CODE} annotations={[
          { lines: [5, 5], color: 'sky', note: 'VDF 순차 계산' },
          { lines: [13, 13], color: 'emerald', note: '네트워크 전파' },
        ]} />
      </div>
    </section>
  );
}
