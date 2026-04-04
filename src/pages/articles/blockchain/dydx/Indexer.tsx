import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import IndexerSteps from './IndexerSteps';

const STEPS = [
  { label: 'Indexer — 5개 마이크로서비스', body: 'Protocol 이벤트를 Kafka로 수신 → PostgreSQL에 구조화 → REST/WebSocket으로 제공.' },
  { label: 'Kafka: 이벤트 스트리밍 플랫폼', body: 'Protocol Layer의 블록 이벤트를 실시간 스트리밍.\n온체인/오프체인 이벤트를 분리하여 각각 다른 서비스로 전달.' },
  { label: 'Ender + Vulcan: 이벤트 처리', body: 'Ender — 온체인 이벤트(체결, 상태 변경) 파싱 & DB 저장.\nVulcan — 오프체인 이벤트(주문 업데이트) 처리.' },
  { label: 'PostgreSQL: 통합 데이터베이스', body: 'orders 테이블: id, side, size, price, status, type.\nfills 테이블: side, liquidity(TAKER/MAKER), size, price, fee.' },
  { label: 'Comlink + Socks: API 서빙', body: 'Comlink — Express.js REST API (오더북, 포지션, 체결 조회).\nSocks — WebSocket 실시간 스트리밍 (v4_orderbook, v4_trades).' },
];

const CODE_MAP = ['dx-indexer-ender', 'dx-indexer-ender', 'dx-indexer-ender', 'dx-indexer-ender', 'dx-api'];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Indexer({ onCodeRef }: Props) {
  return (
    <section id="indexer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인덱서</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        5개 마이크로서비스로 온체인 데이터를 실시간 제공.
      </p>
      <StepViz steps={STEPS}>
        {(step) => (
          <div className="w-full">
            <IndexerSteps step={step} />
            {onCodeRef && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onCodeRef(CODE_MAP[step], codeRefs[CODE_MAP[step]])} />
                <span className="text-[10px] text-muted-foreground">
                  {CODE_MAP[step] === 'dx-api' ? 'api.ts' : 'ender.ts'}
                </span>
              </div>
            )}
          </div>
        )}
      </StepViz>
    </section>
  );
}
