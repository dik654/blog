import { useState, useCallback } from 'react';
import { modules } from './archData';
import ArchDetail from './ArchDetail';
import ArchFlow from './ArchFlow';
import { Node, HArrow, VConn } from './ArchNodes';
import { CodeSidebar } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ArchDiagramEL from './ArchDiagramEL';
import { codeRefs } from './archCodeRefs';
import { lighthouseTree, rethTree } from './archFileTrees';
import { flowData } from './archFlowData';
import FlowDiagram from './FlowDiagram';

export default function ArchDiagram() {
  const [sel, setSel] = useState<string | null>(null);
  const [flowIds, setFlowIds] = useState<Set<string>>(new Set());
  const [codeRefKey, setCodeRefKey] = useState<string | null>(null);
  const [codeRef, setCodeRef] = useState<CodeRef | null>(null);

  const toggle = (id: string) => { setSel(p => p === id ? null : id); setFlowIds(new Set()); };
  const conn = sel ? new Set(modules[sel]?.links.map(l => l.target) ?? []) : new Set<string>();
  const selLayer = sel ? modules[sel]?.layer : null;
  const engineHL = sel !== null && (conn.has('engine') || sel === 'engine' || flowIds.has('engine'));
  const handleFlow = useCallback((ids: string[]) => setFlowIds(new Set(ids)), []);
  const handleCodeRef = useCallback((key: string, ref: CodeRef) => { setCodeRefKey(key); setCodeRef(ref); }, []);

  const fa = (a: string, b: string) => flowIds.has(a) && flowIds.has(b);
  const lm = (from: string, to: string) => modules[from]?.links.find(l => l.target === to)?.msgs;
  const np = (id: string) => <Node id={id} sel={sel} connected={conn} flowActive={flowIds} onSelect={toggle} />;

  return (
    <div className="not-prose space-y-3">
      {/* CL Layer */}
      <div className="rounded-xl border-2 border-blue-300 bg-blue-50/50 dark:bg-blue-950/20 p-4">
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">Consensus Layer — Lighthouse</p>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[minmax(130px,1fr)_auto_minmax(130px,1fr)_auto_minmax(130px,1fr)] min-w-[500px]">
            {np('validator')}
            <HArrow label="Beacon API" dir="→" animated={fa('validator', 'beacon')} msgs={lm('validator', 'beacon')} />
            {np('beacon')}
            <HArrow label="직접 호출" dir="↔" animated={fa('beacon', 'hotcold')} msgs={lm('beacon', 'hotcold')} />
            {np('hotcold')}
            <div /><div />
            <VConn label="channel" animated={fa('beacon', 'sync') || fa('sync', 'beacon')} msgs={lm('beacon', 'sync')} />
            <div /><div />
            <div /><div />
            {np('sync')}
            <HArrow label="tokio ch" dir="↔" animated={fa('sync', 'libp2p')} msgs={lm('sync', 'libp2p')} />
            {np('libp2p')}
          </div>
        </div>
        {selLayer === 'cl' && sel && (
          <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800/60">
            <ArchFlow moduleId={sel} onStepModules={handleFlow} onCodeRef={handleCodeRef} />
          </div>
        )}
      </div>

      {/* Engine API */}
      <div className={`rounded-xl border-2 border-dashed p-3 transition-colors ${engineHL ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/10' : 'border-amber-400'}`}>
        <div className="flex items-center gap-2">
          <div className={`flex-1 border-t-2 border-dashed transition-colors ${engineHL ? 'border-amber-500' : 'border-amber-300'}`} />
          <button onClick={() => toggle('engine')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer
              ${sel === 'engine' ? 'bg-amber-500 text-white' : engineHL ? 'border-2 border-amber-500 bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' : 'border-2 border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'}`}>
            Engine API (JWT)
          </button>
          <div className={`flex-1 border-t-2 border-dashed transition-colors ${engineHL ? 'border-amber-500' : 'border-amber-300'}`} />
        </div>
        {selLayer === 'api' && sel && (
          <div className="mt-3 pt-3 border-t border-amber-300 dark:border-amber-800/60">
            <ArchFlow moduleId={sel} onStepModules={handleFlow} onCodeRef={handleCodeRef} />
          </div>
        )}
      </div>

      {/* EL Layer */}
      <ArchDiagramEL sel={sel} conn={conn} flowIds={flowIds} toggle={toggle} handleFlow={handleFlow} handleCodeRef={handleCodeRef} />

      <ArchDetail sel={sel} onSelect={toggle} />
      <CodeSidebar codeRefKey={codeRefKey} codeRef={codeRef}
        onClose={() => { setCodeRef(null); setCodeRefKey(null); }}
        onNavigate={(key, ref) => { setCodeRefKey(key); setCodeRef(ref); }}
        codeRefs={codeRefs}
        fileTrees={{ lighthouse: lighthouseTree, reth: rethTree }}
        projectMetas={{
          lighthouse: { id: 'lighthouse', label: 'Lighthouse · CL', badgeClass: 'bg-[#ddf4ff] border-[#54aeff] text-[#0550ae]' },
          reth: { id: 'reth', label: 'Reth · EL', badgeClass: 'bg-[#fff3cd] border-[#d4a72c] text-[#7d4e00]' },
        }}
        flowData={flowData}
        FlowDiagram={FlowDiagram}
      />
    </div>
  );
}
