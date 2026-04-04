import { modules } from './archData';
import type { CodeRef } from '@/components/code/types';
import { Node, HArrow, VConn } from './ArchNodes';
import ArchFlow from './ArchFlow';

export default function ArchDiagramEL({
  sel, conn, flowIds, toggle, handleFlow, handleCodeRef,
}: {
  sel: string | null; conn: Set<string>; flowIds: Set<string>;
  toggle: (id: string) => void;
  handleFlow: (ids: string[]) => void;
  handleCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const fa = (a: string, b: string) => flowIds.has(a) && flowIds.has(b);
  const lm = (from: string, to: string) => modules[from]?.links.find(l => l.target === to)?.msgs;
  const np = (id: string) => (
    <Node id={id} sel={sel} connected={conn} flowActive={flowIds} onSelect={toggle} />
  );
  const selLayer = sel ? modules[sel]?.layer : null;

  return (
    <div className="rounded-xl border-2 border-orange-300 bg-orange-50/50 dark:bg-orange-950/20 p-4">
      <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3">
        Execution Layer — Reth
      </p>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[minmax(130px,1fr)_auto_minmax(130px,1fr)_auto_minmax(130px,1fr)_auto_minmax(130px,1fr)] min-w-[700px]">
          {np('devp2p')}
          <HArrow label="tx 전파" dir="↔" animated={fa('devp2p', 'txpool')} msgs={lm('txpool', 'devp2p')} />
          {np('txpool')}
          <HArrow label="payload" dir="→" animated={fa('txpool', 'engine-tree')} msgs={lm('engine-tree', 'txpool')} />
          {np('engine-tree')}
          <HArrow label="읽기/쓰기" dir="↔" animated={fa('engine-tree', 'storage')} msgs={lm('engine-tree', 'storage')} />
          {np('storage')}
          <div /><div /><div /><div />
          <VConn label="RPC 조회" animated={fa('engine-tree', 'rpc') || fa('rpc', 'engine-tree')} msgs={lm('storage', 'rpc')} />
          <div /><div />
          <div /><div /><div /><div />
          {np('rpc')}
          <div /><div />
        </div>
      </div>
      {selLayer === 'el' && sel && (
        <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800/60">
          <ArchFlow moduleId={sel} onStepModules={handleFlow} onCodeRef={handleCodeRef} />
        </div>
      )}
    </div>
  );
}
