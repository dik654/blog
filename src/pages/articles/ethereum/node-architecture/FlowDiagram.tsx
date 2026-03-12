import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { codeRefs } from './archCodeRefs';
import RustLine from './RustLine';

export interface FlowNode {
  id: string;
  fn: string;
  desc: string;
  color: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose' | 'slate';
  detail?: string;
  codeRefKey?: string;
  children?: FlowNode[];
}

const C = {
  sky:     { border: '#0ea5e9', bg: 'rgba(14,165,233,0.07)',  text: '#0369a1' },
  emerald: { border: '#10b981', bg: 'rgba(16,185,129,0.07)',  text: '#065f46' },
  amber:   { border: '#f59e0b', bg: 'rgba(245,158,11,0.07)',  text: '#92400e' },
  violet:  { border: '#8b5cf6', bg: 'rgba(139,92,246,0.07)',  text: '#4c1d95' },
  rose:    { border: '#f43f5e', bg: 'rgba(244,63,94,0.07)',   text: '#881337' },
  slate:   { border: '#64748b', bg: 'rgba(100,116,139,0.07)', text: '#334155' },
};

/* ── 용어 사전 ── */
const GLOSSARY: { term: string; def: string }[] = [
  { term: 'MDBX',            def: 'Memory-Mapped B-Tree Database. 파일을 메모리에 직접 매핑(mmap)해 시스템 콜 없이 디스크 I/O를 수행하는 고성능 키-값 DB.' },
  { term: 'LRU',             def: 'Least Recently Used. 가장 오래 사용하지 않은 항목부터 제거하는 캐시 교체 정책.' },
  { term: 'BLS / BLS12-381', def: 'Boneh-Lynn-Shacham 서명. 여러 서명을 하나로 집계(aggregate)할 수 있어 비콘 체인이 수천 개의 어테스테이션을 효율적으로 처리.' },
  { term: 'gossipsub',       def: 'libp2p의 토픽 기반 pub/sub 프로토콜. 각 노드가 관심 토픽만 구독하고 수신 메시지를 일부 피어에게만 재전파해 O(n²) 브로드캐스트를 피함.' },
  { term: 'fork digest',     def: 'SHA256(genesis_validators_root, fork_version)의 앞 4바이트. 포크마다 달라 다른 포크 노드의 메시지가 섞이지 않도록 토픽 이름에 포함됨.' },
  { term: 'EVM',             def: 'Ethereum Virtual Machine. 이더리움 스마트 컨트랙트를 실행하는 스택 기반 가상 머신. Reth는 revm 크레이트를 사용.' },
  { term: 'JWT',             def: 'JSON Web Token. CL과 EL이 32바이트 공유 비밀키로 HS256 서명한 토큰을 매 요청마다 교환해 인증. ±60초 이내 토큰만 유효.' },
  { term: 'DevP2P',          def: '이더리움 EL의 P2P 프로토콜. TCP 위에서 RLP 인코딩 메시지 교환. EthWire 핸드셰이크 → 블록·트랜잭션 동기화.' },
  { term: 'ecrecover',       def: 'ECDSA 서명(v,r,s)에서 secp256k1 공개키를 역산해 이더리움 주소를 복구하는 연산. eth_sendRawTransaction 발신자 인증에 사용.' },
  { term: 'RANDAO',          def: '검증자들이 BLS 서명으로 랜덤 값을 제출하고 XOR로 혼합해 블록 제안자·어테스테이션 위원회를 무작위 선정하는 메커니즘.' },
  { term: 'epoch / finalized', def: 'epoch = 32 슬롯(약 6.4분). finalized = 2/3 이상 검증자가 어테스테이션한 체크포인트로 영구 확정된 상태.' },
  { term: 'SparseStateTrie', def: '변경된 계정·스토리지 노드만 선택적으로 해싱해 stateRoot를 구하는 방식. 전체 트리 재해싱 없이 훨씬 빠름.' },
  { term: 'PersistenceService', def: 'MDBX 디스크 저장을 비동기 태스크로 분리한 서비스. EL은 인메모리 트리에 블록을 보관하고 즉시 VALID를 반환한 뒤 백그라운드에서 저장.' },
  { term: 'SSZ / RLP',       def: 'SSZ(SimpleSerialize) = CL 직렬화 포맷. RLP(Recursive Length Prefix) = EL 직렬화 포맷.' },
];

function GlossaryPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className="shrink-0 border-b border-border/40">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-1.5 px-4 py-1.5 text-left hover:bg-accent/50 transition-colors cursor-pointer">
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">📖 용어 사전</span>
        <span className="text-[9px] text-muted-foreground ml-auto">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-3 space-y-1">
              {GLOSSARY.map(g => (
                <div key={g.term} className="flex gap-2">
                  <code className="shrink-0 text-[10px] font-bold text-[#0969da] dark:text-[#58a6ff] font-mono w-32">{g.term}</code>
                  <span className="text-[10px] text-muted-foreground leading-snug">{g.def}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 노드에 연결된 코드 ref의 하이라이트 구간을 인라인 미리보기 */
function CodePreview({ refKey }: { refKey: string }) {
  const ref = codeRefs[refKey];
  if (!ref) return null;
  const allLines = ref.code.split('\n');
  const MAX = 18;
  const from = ref.highlight[0] - 1;
  const to   = Math.min(ref.highlight[1] - 1, from + MAX - 1);
  const lines = allLines.slice(from, to + 1);
  const truncated = ref.highlight[1] - ref.highlight[0] > MAX;
  return (
    <div className="mt-2 rounded border border-[#d0d7de] dark:border-[#30363d] overflow-hidden text-[10px] font-mono">
      <div className="px-2 py-1 bg-[#f6f8fa] dark:bg-[#161b22] text-[#57606a] dark:text-[#8b949e] text-[9px] truncate">
        {ref.path}  L{ref.highlight[0]}–{Math.min(ref.highlight[1], ref.highlight[0] + MAX - 1)}{truncated && ' …'}
      </div>
      <div className="overflow-x-auto bg-white dark:bg-[#0d1117] max-h-[220px] overflow-y-auto">
        <table className="border-collapse w-full leading-5">
          <tbody>
            {lines.map((line, i) => {
              const ln = ref.highlight[0] + i;
              return (
                <tr key={ln} className="hover:bg-[#f6f8fa] dark:hover:bg-[#161b22]">
                  <td className="select-none text-right pr-2 pl-3 py-0 text-[#57606a] dark:text-[#636e7b] w-10 shrink-0 border-r border-[#eaecef] dark:border-[#21262d]">{ln}</td>
                  <td className="pl-3 pr-3 py-0 whitespace-pre text-[#24292f] dark:text-[#e6edf3] border-l-2 border-[#d4a72c]">
                    <RustLine text={line} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NodeCard({ node, depth = 0, onNavigate }: {
  node: FlowNode; depth?: number; onNavigate?: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const c = C[node.color];
  const hasChildren = !!(node.children?.length);

  return (
    <div className="w-full">
      <div className="rounded-lg border px-3 py-2.5 select-none"
        style={{ borderLeftWidth: 4, borderLeftColor: c.border, background: c.bg, borderColor: 'rgba(0,0,0,0.08)' }}>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <code className="text-[11px] font-bold block font-mono leading-tight" style={{ color: c.text }}>
              {node.fn}
            </code>
            <p className="text-[11px] text-foreground/80 mt-0.5 leading-snug">{node.desc}</p>
            <AnimatePresence>
              {showDetail && node.detail && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line overflow-hidden">
                  {node.detail}
                </motion.p>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showCode && node.codeRefKey && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <CodePreview refKey={node.codeRefKey} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {node.codeRefKey && onNavigate && (
              <button onClick={(e) => { e.stopPropagation(); onNavigate(node.codeRefKey!); }}
                className="text-[9px] px-1.5 py-0.5 rounded border cursor-pointer leading-none font-semibold"
                style={{ borderColor: c.border, color: c.text, background: 'rgba(255,255,255,0.7)' }}
                title="전체 코드 뷰로 이동">↗ 소스</button>
            )}
            {node.codeRefKey && (
              <button onClick={() => setShowCode(v => !v)}
                className="text-[9px] px-1.5 py-0.5 rounded border cursor-pointer leading-none"
                style={{ borderColor: c.border, color: c.text }}>
                {showCode ? '코드 닫기' : '⬚ 코드'}
              </button>
            )}
            {node.detail && (
              <button onClick={() => setShowDetail(v => !v)}
                className="text-[9px] px-1.5 py-0.5 rounded border cursor-pointer leading-none"
                style={{ borderColor: c.border, color: c.text }}>
                {showDetail ? '닫기' : '상세'}
              </button>
            )}
            {hasChildren && (
              <button onClick={() => setOpen(v => !v)}
                className="text-[9px] px-1.5 py-0.5 rounded cursor-pointer leading-none text-muted-foreground border border-border hover:bg-accent">
                {open ? '▲ 접기' : '▼ 내부 보기'}
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && hasChildren && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="ml-5 mt-1 pl-3 border-l-2 border-dashed border-border/60">
              {node.children!.map((child, i) => (
                <div key={child.id}>
                  {i > 0 && <Arrow />}
                  <NodeCard node={child} depth={depth + 1} onNavigate={onNavigate} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <div className="w-px h-3 bg-border/60" />
      <span className="text-[9px] text-muted-foreground leading-none">↓</span>
    </div>
  );
}

export default function FlowDiagram({ nodes, onNavigate }: {
  nodes: FlowNode[];
  onNavigate?: (key: string) => void;
}) {
  if (!nodes.length) return (
    <div className="p-6 text-center text-sm text-muted-foreground">플로우 데이터가 없습니다.</div>
  );
  return (
    <div>
      <GlossaryPanel />
      <div className="p-4">
        <p className="text-[10px] text-muted-foreground mb-3">
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
