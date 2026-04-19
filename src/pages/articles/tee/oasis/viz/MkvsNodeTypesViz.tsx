import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'InternalNode — 브랜치', body: 'Label(공유 prefix) + Left/Right Pointer + 옵션 LeafNode.\nbinary trie 의 분기점.' },
  { label: 'LeafNode — 실제 값', body: 'Key + Value + Hash 만 보유.\n트리 종단(leaf) — 실제 데이터 저장.' },
  { label: 'Hash 계산 — 자기 검증성', body: 'H(Internal) = H(label || H(leaf?) || H(left) || H(right)).\nH(Leaf) = H(key || value).\n루트 해시만 신뢰하면 모든 키 검증 가능.' },
  { label: 'Pointer — Lazy loading', body: 'Clean=false 면 디스크에서 로드 필요.\nNode==nil → DB 에서 fetch (BadgerDB).\n메모리 사용 최소화.' },
];

export default function MkvsNodeTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* InternalNode */}
          <motion.g animate={{ opacity: step === 0 || step === 2 ? 1 : 0.4 }}>
            <ModuleBox x={170} y={20} w={140} h={50}
              label="InternalNode" sub={step === 0 ? 'label · L · R' : ''}
              color="#6366f1" />
          </motion.g>

          {/* Branch links */}
          {(step === 0 || step === 2) && (
            <>
              <motion.line x1={210} y1={70} x2={140} y2={120}
                stroke="#6366f1" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={170} y={100} fontSize={9} fill="#6366f1" fontWeight={600}>0</text>
              <motion.line x1={270} y1={70} x2={340} y2={120}
                stroke="#6366f1" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={310} y={100} fontSize={9} fill="#6366f1" fontWeight={600}>1</text>
            </>
          )}

          {/* LeafNodes */}
          <motion.g animate={{ opacity: step === 1 || step === 2 ? 1 : 0.4 }}>
            <ModuleBox x={70} y={120} w={140} h={50}
              label="LeafNode" sub={step === 1 ? 'key · value · hash' : 'key=ABC val=42'}
              color="#10b981" />
            <ModuleBox x={270} y={120} w={140} h={50}
              label="LeafNode" sub={step === 1 ? 'key · value · hash' : 'key=ABD val=99'}
              color="#10b981" />
          </motion.g>

          {/* Hash callouts (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={32} w={130} h={26}
                label="H(label||L||R)" color="#6366f1" outlined />
              <DataBox x={330} y={32} w={130} h={26}
                label="root hash" color="#a855f7" outlined />
              <DataBox x={70}  y={180} w={140} h={22}
                label="H(key||value)" color="#10b981" outlined />
              <DataBox x={270} y={180} w={140} h={22}
                label="H(key||value)" color="#10b981" outlined />
              <text x={240} y={220} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                bottom-up hash → root commits all values
              </text>
            </motion.g>
          )}

          {/* Pointer (step 3) */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={170} y={185} w={140} h={28}
                label="Pointer{Clean,Hash}" color="#f59e0b" outlined />
              <text x={240} y={225} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                Clean=false → fetch from BadgerDB
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
