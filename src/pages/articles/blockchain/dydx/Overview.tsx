import StepViz from '@/components/ui/step-viz';
import type { CodeRef } from '@/components/code/types';
import OverviewSteps from './OverviewSteps';

const STEPS = [
  { label: 'dYdX v4 — 2계층 아키텍처', body: 'Cosmos SDK + CometBFT 기반 주권형 블록체인.\nProtocol Layer(블록체인 코어) + Indexer Layer(마이크로서비스 API).' },
  { label: 'External: 가격 피드 + 브릿지 + 클라이언트', body: '외부 거래소(Binance, Coinbase)에서 가격 피드.\n이더리움 크로스체인 브릿지. 웹/모바일 클라이언트.' },
  { label: 'Protocol: Daemons + Cosmos Modules + CometBFT', body: 'Go 1.22 / Cosmos SDK v0.50 / CometBFT v0.38.\n3개 Daemon(청산/가격/브릿지) + 17개 커스텀 모듈.' },
  { label: 'Indexer: 5개 마이크로서비스', body: 'TypeScript / PostgreSQL / Kafka.\nEnder(온체인) + Vulcan(오프체인) + Comlink(REST) + Socks(WS) + Roundtable(배치).' },
];

interface Props { onCodeRef?: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">dYdX v4 개요</h2>
      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
        고성능 탈중앙화 영구 선물 거래소 — 인메모리 매칭 엔진 MemCLOB으로 고성능 주문 처리.
      </p>
      <StepViz steps={STEPS}>
        {(step) => <OverviewSteps step={step} />}
      </StepViz>
    </section>
  );
}
