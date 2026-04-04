import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: '이더리움 EL+CL 구조를 Cosmos에서 재현', body: 'Omni Network의 Octane — CometBFT 합의 위에 EVM 실행 환경을 Engine API로 연결. 이더리움 Post-Merge 아키텍처를 Cosmos 생태계에서 그대로 사용.' },
  { label: 'CL 교체: Beacon Chain → CometBFT', body: '이더리움의 Beacon Chain(Casper FFG) 대신 CometBFT의 BFT 합의를 사용. 즉시 최종성으로 reorg 없이 블록 확정.' },
  { label: 'Engine API 동일 인터페이스', body: 'forkchoiceUpdatedV3, getPayloadV3, newPayloadV3 — 이더리움과 동일한 Engine API. geth/reth를 거의 수정 없이 재활용 가능.' },
  { label: 'EL 재활용: geth 기반 EVM', body: 'go-ethereum 기반 EVM 실행 환경을 그대로 사용. 이더리움의 모든 스마트 컨트랙트, 도구, 라이브러리와 100% 호환.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Omni Octane 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Omni Network는 이더리움 롤업을 연결하는 크로스체인 프로토콜.<br />
        핵심 Octane 엔진 — CometBFT + Engine API + geth로 EVM 실행 환경 통합.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OverviewSteps step={step} />
            {onCodeRef && step >= 2 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('octane-enginecl', codeRefs['octane-enginecl'])} />
                <span className="text-[10px] text-muted-foreground">enginecl.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
