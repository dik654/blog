import CodePanel from '@/components/ui/code-panel';
import CrateDepViz from './viz/CrateDepViz';
import {CRATE_TREE_CODE, DEP_GRAPH_CODE, DEP_GRAPH_ANNOTATIONS} from './CrateAnalysisData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function CrateAnalysis({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="crate-analysis" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '크레이트 구조 분석'}</h2>
      <div className="not-prose mb-8"><CrateDepViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys는 <strong>모노레포</strong> 구조로 각 기능이 독립 크레이트로 분리되어 있습니다.
          <code>irys-chain</code>이 최상위에서 모든 컴포넌트를 조립하고,
          <code>irys-types</code>가 공유 타입 기반을 제공합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('irys-vdf-sha', codeRefs['irys-vdf-sha'])} />
            <span className="text-[10px] text-muted-foreground self-center">vdf 크레이트</span>
            <CodeViewButton onClick={() => onCodeRef('irys-unpack', codeRefs['irys-unpack'])} />
            <span className="text-[10px] text-muted-foreground self-center">packing 크레이트</span>
          </div>
        )}

        <h3>크레이트 트리</h3>
        <p>
          irys/<br />
          irys-chain/ # 메인 바이너리 & 체인 코어<br />
          src/main.rs # 진입점, 노드 부트스트랩<br />
          src/node.rs # 컴포넌트 조립 & 초기화<br />
          irys-actors/ # Actix 기반 비동기 액터 시스템<br />
          mining_actor.rs # 마이닝 루프<br />
          block_actor.rs # 블록 처리 액터<br />
          irys-vdf/ # SHA256 순차 VDF 합의<br />
          irys-packing/ # 매트릭스 패킹 (CPU + CUDA)<br />
          irys-storage/ # 청킹, Merkle 인덱싱<br />
          irys-reth-node-bridge/ # Reth EVM 실행 계층 브릿지<br />
          irys-gossip/ # P2P 가십 프로토콜
        </p>

        <h3>의존성 그래프</h3>
        <CodePanel title="크레이트 간 의존 관계" code={DEP_GRAPH_CODE}
          annotations={DEP_GRAPH_ANNOTATIONS} />
      </div>
    </section>
  );
}
