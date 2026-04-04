import StepViz from '@/components/ui/step-viz';
import { CLITreeStep, ConfigStep, WorkflowStep } from './DevToolsVizParts';

const STEPS = [
  { label: 'CLI 명령어: 네트워크 & 지갑', body: 'oasis network: 네트워크 추가/제거/RPC 설정.\noasis wallet: 지갑 생성, 키 가져오기/내보내기.' },
  { label: 'CLI 명령어: 계정 & 컨트랙트', body: 'oasis account: 잔액 조회, 토큰 전송, 스테이킹 위임.\noasis contract: 컨트랙트 업로드, 호출.' },
  { label: '네트워크 & 지갑 설정 (TOML)', body: '[networks.mainnet] rpc, chain_context, denomination.\n[wallet.default] kind(file/ledger), address.' },
  { label: '개발 워크플로우', body: '1. oasis network add → 2. oasis wallet create → 3. oasis contract upload → 4. oasis contract call' },
];

export default function DevToolsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {(step === 0 || step === 1) && <CLITreeStep step={step} />}
          {step === 2 && <ConfigStep />}
          {step === 3 && <WorkflowStep />}
        </svg>
      )}
    </StepViz>
  );
}
