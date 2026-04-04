import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import OrderbookSteps from './OrderbookSteps';

const STEPS = [
  { label: 'CLOB 오더북 데이터 구조', body: 'dYdX v4의 핵심 — CLOB(Central Limit Order Book) 모듈.\n인메모리 매칭 엔진 MemCLOB으로 고성능 주문 처리.' },
  { label: 'Orderbook: 양방향 가격 레벨 맵', body: 'Bids(매수)와 Asks(매도) 두 개의 가격→Level 맵.\nBestBid/BestAsk로 최적 가격을 O(1)로 추적.' },
  { label: 'Level: 동일 가격 FIFO 큐', body: '같은 가격의 주문들을 시간순으로 정렬.\n먼저 들어온 주문이 먼저 매칭(Price-Time Priority).' },
  { label: 'Order: 주문 구조체', body: 'OrderId, Side(BUY/SELL), Quantums(수량), Subticks(가격).\n주문 타입: Short-Term(인메모리) / Long-Term(상태 저장) / Conditional(조건부).' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function OrderbookArch({ onCodeRef }: Props) {
  return (
    <section id="orderbook-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">오더북 아키텍처</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        블록체인 상에서 중앙 지정가 주문서를 직접 관리하는 CLOB 모듈.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <OrderbookSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('dx-memclob', codeRefs['dx-memclob'])} />
                <span className="text-[10px] text-muted-foreground">memclob.go</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
