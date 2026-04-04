import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import FrontendSteps from './FrontendSteps';

const STEPS = [
  { label: '주문 처리 & 데이터 조회 플로우', body: '주문 제출 → gRPC/HTTP로 Protocol Layer 직접 전달.\n체결 결과 → Kafka → Indexer → WebSocket 실시간 전달.' },
  { label: '주문 제출 → 매칭 → 이벤트 전파', body: '클라이언트가 Protocol에 주문 제출 → MemCLOB 매칭 → 체결 이벤트 Kafka 발행 → Indexer DB 저장.' },
  { label: 'WebSocket 실시간 업데이트', body: 'Socks 서비스가 DB 변경을 감지하여 실시간 전송.\nv4_orderbook / v4_trades / v4_markets / v4_subaccounts 채널.' },
  { label: 'REST API 데이터 조회', body: 'GET /v4/orderbooks/perpetualMarket/:ticker — 오더북 조회.\nGET /v4/fills — 체결 기록.\n복합 인덱스(clobPairId, side, price)로 성능 최적화.' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Frontend({ onCodeRef }: Props) {
  return (
    <section id="frontend" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프론트엔드 데이터 플로우</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        주문 제출은 Protocol Layer 직접 전달, 체결 결과는 Indexer 경유 실시간 전달.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <FrontendSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef('dx-api', codeRefs['dx-api'])} />
                <span className="text-[10px] text-muted-foreground">api.ts</span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
