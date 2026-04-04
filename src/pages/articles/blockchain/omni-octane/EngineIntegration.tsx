import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ABCIBridgeSteps from './ABCIBridgeSteps';

const ABCI_STEPS = [
  { label: 'PrepareProposal → FCU + getPayload', body: 'CometBFT가 블록 제안 요청 → Octane이 forkchoiceUpdatedV3으로 geth에 빌드 요청 → getPayloadV3로 수신 → CometBFT 트랜잭션으로 래핑.' },
  { label: 'ProcessProposal → newPayload + FCU', body: '다른 검증자가 제안 검증 → newPayloadV3로 geth가 실행 & 검증 → forkchoiceUpdatedV3으로 새 헤드 확정 → Accept/Reject 반환.' },
  { label: 'FinalizeBlock → 로그 수집', body: '블록 커밋 후 GetBlockReceiptsAt으로 EVM 로그 수집. 크로스체인 이벤트를 파싱하여 XMsg 처리.' },
  { label: '전체 흐름: ABCI가 Engine API로 변환', body: '핵심 패턴 — ABCI 콜백이 Engine API 호출로 1:1 변환.\nEthermint: 순차 처리(병목) vs Octane: 합의 & 실행 병렬 처리.' },
];

const CODE_MAP = ['octane-abci', 'octane-abci', 'octane-abci', 'octane-enginecl'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function EngineIntegration({ onCodeRef }: Props) {
  return (
    <section id="engine-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI → Engine API 브릿지</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Octane의 핵심 — CometBFT ABCI 콜백을 Engine API 호출로 변환하는 어댑터 패턴.
      </p>
      <StepViz steps={ABCI_STEPS}>
        {(step) => (
          <div className="w-full">
            <ABCIBridgeSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">{CODE_MAP[step] === 'octane-abci' ? 'abci.go' : 'enginecl.go'}</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
