import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import CrossChainSteps from './CrossChainSteps';

const STEPS = [
  { label: '이중 합의 & 크로스 롤업 메시징', body: 'Omni Halo — EVM 합의와 XBlock 합의를 동시에 수행.\n이중 스테이킹: OMNI 토큰 + EigenLayer restaked ETH.' },
  { label: '1단계: 소스 체인 이벤트 발생', body: 'Rollup A에서 크로스체인 트랜잭션 실행 → Portal Contract가 XMsg 이벤트를 발행.' },
  { label: '2단계: 검증자 어테스테이션', body: 'Omni 검증자들이 Portal Contract 모니터링 → XBlock 해시에 대해 어테스테이션 → 2/3+ 투표로 확정.' },
  { label: '3단계: 릴레이어 전달', body: '릴레이어가 확정된 어테스테이션을 목적지 체인의 Portal Contract에 제출.' },
  { label: '4단계: 목적지 실행', body: 'Portal Contract가 서명 검증 & 메시지 실행.\n확인 전략: "Finalized"(~12분, 안전) vs "Latest"(~5초, 빠름).' },
];

const CODE_MAP = ['octane-dual-staking', 'octane-xmsg', 'octane-xmsg', 'octane-xmsg', 'octane-xmsg'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function CrossChain({ onCodeRef }: Props) {
  return (
    <section id="crosschain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">크로스 롤업 메시징 (XMsg)</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Omni의 주 목적 — 이더리움 롤업 간 빠른 크로스체인 메시지 전달.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <CrossChainSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {step === 0 ? 'valsync/keeper.go' : 'attest/keeper.go'}
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
