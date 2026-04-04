import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BlockLifecycleSteps from './BlockLifecycleSteps';

const STEPS = [
  { label: 'BeaconKit ABCI 2.0 블록 생명주기', body: '표준 Cosmos SDK 모듈 미사용 — CometBFT 합의 엔진만 유지, 나머지 자체 구현.\n직렬화: Protobuf 대신 이더리움의 SSZ(Simple Serialize) 채택.' },
  { label: 'PrepareProposal → forkchoiceUpdated', body: '제안자가 Engine API로 EVM 페이로드 빌드 요청.\nCometBFT 라운드 로빈 → 이더리움의 RANDAO 선출 대체.' },
  { label: 'ProcessProposal → newPayload 검증', body: 'EL에서 페이로드 실행 & 검증.\n검증자들이 동기 BFT(Prevote/Precommit)로 투표 — 비동기 Attestation 대체.' },
  { label: 'FinalizeBlock → 상태 확정', body: '즉시 최종성 — 1 블록으로 확정 (이더리움: 2 에폭, ~12.8분).\n포크 불가: BFT safety 보장.' },
  { label: 'Commit → Optimistic Payload Building', body: 'BeaconKit 핵심 최적화 — ProcessProposal에서 이미 StateRoot 검증.\n다음 블록 N+1 페이로드를 병렬로 선행 빌드 → 블록 타임 ~40% 단축.' },
];

const CODE_MAP = ['bk-service', 'bk-block-builder', 'bk-process-proposal', 'bk-finalize-block', 'bk-block-builder'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function BeaconKitArch({ onCodeRef }: Props) {
  return (
    <section id="beaconkit-arch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BeaconKit 블록 생명주기</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        ABCI 2.0 콜백 → Engine API → EVM 실행 — 이더리움 블록 제안 흐름을 CometBFT에서 재현.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <BlockLifecycleSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step].replace('bk-', '').replace(/-/g, '_')}.go
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
