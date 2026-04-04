import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: 'Cosmos EVM — 4개 핵심 모듈', body: 'Cosmos SDK 체인에 EVM 호환성을 추가하는 플러그앤플레이 솔루션.\ngo-ethereum의 EVM을 Cosmos 모듈(x/vm)로 통합.' },
  { label: 'x/vm: 이더리움 가상머신', body: 'Keeper 패턴으로 accountKeeper, bankKeeper, feeMarketKeeper와 상호작용.\nApplyMessage() → EVM 실행 → Cosmos 상태 업데이트.' },
  { label: 'x/feemarket: EIP-1559 동적 수수료', body: '블록 가스 사용량이 50% 넘으면 Base Fee 상승, 낮으면 하락.\nBaseFeeChangeDenominator + ElasticityMultiplier로 세부 조정.' },
  { label: 'x/erc20: Cosmos Coin ↔ ERC20 변환', body: 'TokenPair로 양방향 매핑 관리.\nIBC 전송 시에도 자동 변환 — 크로스체인 ERC20 토큰 지원.' },
  { label: 'x/precisebank: 18자리 소수점', body: 'Cosmos SDK 표준(6자리)과 이더리움(18자리) 정밀도 차이 해결.\n정수부 + 소수부 분리 → 소액 거래 정확성 보장.' },
];

const CODE_MAP = ['ev-keeper', 'ev-keeper', 'ev-feemarket', 'ev-token-pair', 'ev-keeper'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cosmos EVM (Evmos) 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        Cosmos SDK 체인에 EVM 호환성을 추가하는 플러그앤플레이 솔루션.<br />
        go-ethereum EVM을 Cosmos 모듈로 통합, 이더리움 스마트 컨트랙트 그대로 실행.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OverviewSteps step={step} />
            {onCodeRef && step > 0 && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step].replace('ev-', '')}.go
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
