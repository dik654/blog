import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import IBCSteps from './IBCSteps';

const STEPS = [
  { label: 'IBC EVM 통합 — 미들웨어 스택', body: 'IBC Transfer Module 위에 ERC20 변환 + 스마트 컨트랙트 콜백을 미들웨어로 추가.\n크로스체인 ERC20 토큰 자동 변환 지원.' },
  { label: 'IBC Callbacks: 스마트 컨트랙트 콜백', body: 'IIBCCallback 인터페이스 구현 시 패킷 수신/확인/타임아웃에 컨트랙트 함수 자동 호출.\n크로스체인 DEX, 스테이킹 등에 활용.' },
  { label: 'ERC20 Middleware: 자동 변환', body: 'OnRecvPacket에서 TokenPair 확인 → Cosmos Coin을 ERC20으로 자동 변환.\nOnSendPacket에서 ERC20을 Cosmos Coin으로 역변환 후 IBC 전송.' },
  { label: 'IBC Transfer Module: 기본 전송', body: '표준 ICS-20 토큰 전송.\n미들웨어 스택이 위에서 아래로 처리 후 기본 전송 모듈 도달.' },
  { label: '수신/송신 양방향 흐름', body: '수신: 패킷 → Callbacks MW → ERC20 MW → Transfer Module.\n송신: Transfer Module → ERC20 MW(역변환) → 패킷 전송.' },
];

const CODE_MAP = ['ev-erc20-middleware', 'ev-erc20-middleware', 'ev-erc20-middleware', 'ev-erc20-middleware', 'ev-erc20-middleware'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function IBCIntegration({ onCodeRef }: Props) {
  return (
    <section id="ibc-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IBC EVM 통합</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        IBC를 확장하여 ERC20 토큰의 크로스체인 전송과 스마트 컨트랙트 콜백 지원.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <IBCSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">ibc_middleware.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
