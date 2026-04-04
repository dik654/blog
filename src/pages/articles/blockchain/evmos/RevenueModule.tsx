import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ERC20Steps from './ERC20Steps';

const STEPS = [
  { label: 'ERC20 양방향 변환 구조', body: 'Cosmos Coin ↔ ERC20 토큰 양방향 변환.\nTokenPair로 매핑 관리, IBC 전송 시에도 자동 변환.' },
  { label: 'Cosmos Coin → ERC20 변환', body: '1. Cosmos 코인을 모듈에 에스크로.\n2. 코인 잠금.\n3. 대응 ERC20 토큰을 사용자에게 민팅.' },
  { label: 'ERC20 → Cosmos Coin 변환', body: '1. ERC20 토큰을 모듈에 전송.\n2. ERC20 토큰을 번(burn).\n3. 에스크로된 Cosmos 코인을 사용자에게 전송.' },
  { label: 'TokenPair 구조체', body: 'Erc20Address(컨트랙트 주소) + Denom(Cosmos denomination) + Enabled(활성화).\nContractOwner로 소유권 관리.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function RevenueModule({ onCodeRef }: Props) {
  return (
    <section id="revenue-module" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ERC20 & Revenue 모듈</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Cosmos 네이티브 코인과 ERC20 토큰 간 양방향 변환 시스템.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <ERC20Steps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('ev-token-pair', codeRefs['ev-token-pair'])} />
                <span className="text-[10px] text-muted-foreground">token_pair.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
