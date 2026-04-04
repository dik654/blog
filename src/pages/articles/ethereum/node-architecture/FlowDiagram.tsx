import GlossaryPanel from './GlossaryPanel';
import NodeCard, { Arrow } from './NodeCard';
import type { FlowNode } from './flowDiagramData';

// Re-export FlowNode type for consumers
export type { FlowNode } from './flowDiagramData';

export default function FlowDiagram({ nodes, onNavigate }: {
  nodes: FlowNode[];
  onNavigate?: (key: string) => void;
}) {
  if (!nodes.length) return (
    <div className="p-6 text-center text-sm text-foreground/75">플로우 데이터가 없습니다.</div>
  );
  return (
    <div>
      <GlossaryPanel />
      <div className="p-4">
        <p className="text-[10px] text-foreground/75 mb-3">
          <strong>▼ 내부 보기</strong> 하위 호출 · <strong>⬚ 코드</strong> 코드 미리보기 · <strong>↗ 소스</strong> 전체 코드로 이동
        </p>
        {nodes.map((node, i) => (
          <div key={node.id}>
            {i > 0 && <Arrow />}
            <NodeCard node={node} onNavigate={onNavigate} />
          </div>
        ))}
      </div>
    </div>
  );
}
