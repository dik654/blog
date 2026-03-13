import { CitationBlock } from '../../../../components/ui/citation';
import L1L2Viz from './viz/L1L2Viz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initia MiniEVM 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Initia의 MiniEVM은 Cosmos SDK 모듈로 구현된 <strong>경량 EVM</strong>입니다.
          Omni Octane이 Engine API로 외부 geth를 연결하는 반면,
          MiniEVM은 <strong>EVM을 Cosmos 모듈 내부에 직접 임베딩</strong>합니다.
        </p>

        <CitationBlock source="Initia Documentation — Interwoven Rollup" citeKey={1} type="paper" href="https://docs.initia.xyz">
          <p className="italic text-foreground/80">"Initia introduces the concept of 'Interwoven Rollups' — an architecture where the L1 serves as a shared security and liquidity layer, while application-specific L2 rollups (Minitias) can choose their execution environment (EVM, MoveVM, or WasmVM) while inheriting L1 security through the OPinit stack."</p>
          <p className="mt-2 text-xs">Initia는 L1이 보안과 유동성을 제공하고, 각 L2(Minitia)가 용도에 맞는 VM을 선택하는 모듈형 아키텍처를 지향합니다. 이를 통해 VM 간 상호운용성과 공유 유동성을 동시에 달성합니다.</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Initia Interwoven Rollup 구조</h3>

        <L1L2Viz />

        <h3 className="text-xl font-semibold mt-6 mb-3">EVM 통합 방식 비교</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`EVM 통합의 세 가지 접근법:

1. 이더리움 네이티브:
   ┌─────────┐
   │   CL    │ ← Engine API → │   EL (geth)   │
   └─────────┘                 │   EVM 내장     │
                               └───────────────┘

2. Omni Octane (외부 연결):
   ┌─────────────┐
   │  CometBFT   │ ← ABCI → │ Cosmos App │ ← Engine API → │ geth │
   └─────────────┘           └────────────┘                 │ EVM  │
                                                            └──────┘

3. Initia MiniEVM (내부 임베딩):
   ┌─────────────┐
   │  CometBFT   │ ← ABCI → │ Cosmos App      │
   └─────────────┘           │ ┌──────────────┐│
                             │ │ x/evm 모듈   ││  ← EVM이 모듈 안에!
                             │ │ (MiniEVM)     ││
                             │ └──────────────┘│
                             │ ┌──────────────┐│
                             │ │ x/bank 등    ││
                             │ └──────────────┘│
                             └─────────────────┘

트레이드오프:
  외부 연결: 이더리움 클라이언트 재활용, 하지만 IPC 오버헤드
  내부 임베딩: 낮은 지연, 하지만 EVM 업데이트를 직접 추적해야 함`}</code>
        </pre>
      </div>
    </section>
  );
}
