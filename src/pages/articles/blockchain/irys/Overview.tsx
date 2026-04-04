import CodePanel from '@/components/ui/code-panel';
import IrysDataFlowViz from './viz/IrysDataFlowViz';
import { DATA_FLOW_CODE, DATA_FLOW_ANNOTATIONS } from './OverviewData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const components = [
    { name: 'irys-chain', color: '#6366f1', desc: '메인 바이너리 & 체인 코어. 전체 시스템 조율.' },
    { name: 'irys-vdf', color: '#10b981', desc: 'SHA256 기반 VDF 합의. 순차 계산으로 블록 시간 보장.' },
    { name: 'irys-packing', color: '#f59e0b', desc: '매트릭스 패킹. CUDA 가속 C 바인딩.' },
    { name: 'irys-actors', color: '#8b5cf6', desc: '비동기 액터 시스템. 컴포넌트 간 메시지 통신.' },
    { name: 'irys-reth-node-bridge', color: '#ec4899', desc: 'Ethereum 호환. Reth 엔진과 EVM 실행.' },
    { name: 'irys-storage', color: '#14b8a6', desc: '청킹 & 인덱싱. Merkle 트리 검증.' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 아키텍처'}</h2>
      <div className="not-prose mb-8"><IrysDataFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys는 데이터 영구 저장에 특화된 블록체인입니다.<br />
          전통적인 PoW/PoS 대신 <strong>VDF(Verifiable Delay Function)</strong>를
          핵심 합의 메커니즘으로 사용합니다. Ethereum과 호환되며
          Reth 엔진 위에 EVM 실행 환경을 갖추고 있습니다.
        </p>

        <h3>핵심 설계 목표</h3>
        <ul>
          <li><strong>영구 저장</strong>: 한 번 업로드한 데이터는 영구적으로 보존</li>
          <li><strong>공정한 합의</strong>: VDF는 병렬화가 불가능해 고성능 ASIC이 유리하지 않음</li>
          <li><strong>Ethereum 호환</strong>: EVM + JSON-RPC + Reth 기반</li>
          <li><strong>효율적 샘플링</strong>: 매트릭스 패킹으로 저장 증명 효율 극대화</li>
        </ul>

        <h3>Arweave vs Irys</h3>
        <p>
          Irys는 Arweave의 영구 저장 개념을 계승하지만,
          Arweave의 RandomX PoW 대신 VDF를 사용하고
          EVM 호환성을 추가했습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {components.map(c => (
          <div key={c.name} className="rounded-lg border p-3"
            style={{ borderColor: c.color + '30', background: c.color + '08' }}>
            <p className="font-mono text-xs font-bold" style={{ color: c.color }}>{c.name}</p>
            <p className="text-sm mt-1 text-foreground/75">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('irys-vdf-run', codeRefs['irys-vdf-run'])} />
            <span className="text-[10px] text-muted-foreground self-center">vdf.rs — VDF 루프</span>
            <CodeViewButton onClick={() => onCodeRef('irys-api-routes', codeRefs['irys-api-routes'])} />
            <span className="text-[10px] text-muted-foreground self-center">API 라우트</span>
          </div>
        )}

        <h3>데이터 저장 흐름</h3>
        <CodePanel title="데이터 저장 파이프라인" code={DATA_FLOW_CODE} annotations={DATA_FLOW_ANNOTATIONS} />
      </div>
    </section>
  );
}
