import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import CosmosSteps from './CosmosSteps';

const STEPS = [
  { label: '17개 커스텀 모듈 구성', body: 'dYdX v4 — 표준 Cosmos SDK + 17개 dYdX 전용 모듈.\nCLOB이 가장 많은 의존성, Genesis 초기화 시 마지막 로드.' },
  { label: 'Trading: 거래 핵심 모듈', body: 'clob(주문서) + perpetuals(영구 선물) + subaccounts(서브계정) + feetiers(수수료 등급).\nBeginBlocker/EndBlocker에서 주문 정리 + 펀딩 레이트 업데이트.' },
  { label: 'Core: 인프라 모듈', body: 'prices(오라클 가격 피드) + assets(자산) + epochs(에포크) + blocktime(블록 시간).\nBeginBlocker에서 순서: blocktime → epochs → prices → assets.' },
  { label: 'Support: 보조 모듈', body: 'bridge(이더리움 브릿지) + rewards(보상) + delaymsg(지연 메시지) + stats(통계).\n크로스체인 브릿지와 보상 시스템을 위한 독립 모듈.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function CosmosIntegration({ onCodeRef }: Props) {
  return (
    <section id="cosmos-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cosmos SDK 통합</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        표준 Cosmos SDK 모듈에 거래소 전용 모듈을 추가한 모듈 구조.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <CosmosSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('dx-module-lifecycle', codeRefs['dx-module-lifecycle'])} />
                <span className="text-[10px] text-muted-foreground">app.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
