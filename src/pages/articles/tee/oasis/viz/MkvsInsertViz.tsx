import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. Root에서 시작 — bit 따라 descend', body: '각 InternalNode 의 Label(공유 prefix) 와 key bit 를 비교.\n매칭되면 더 깊이 진입.' },
  { label: '2. Common prefix < label → 분기', body: 'commonLen < LabelBitLength → splitInternal 호출.\n새 InternalNode 가 두 leaf 를 분기.' },
  { label: '3. LeafNode 도달 — 같은 키면 update', body: 'bytes.Equal(n.Key, key) 면 value 만 갱신, 해시 재계산.\n구조 변경 없음.' },
  { label: '4. 다른 키면 branchLeaf — 새 분기 생성', body: '기존 leaf + 새 leaf 를 둘 다 자식으로 갖는 InternalNode 생성.\nO(log n) with path compression.' },
];

export default function MkvsInsertViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Root */}
          <ModuleBox x={180} y={20} w={120} h={42}
            label="root" sub="InternalNode" color="#6366f1" />

          {/* Step 0: descend illustration */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={210} y1={62} x2={120} y2={120}
                stroke="#10b981" strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={155} y={100} fontSize={9} fill="#10b981" fontWeight={600}>bit=0</text>
              <ModuleBox x={70} y={120} w={120} h={40} label="Internal" color="#6366f1" />
              <ModuleBox x={290} y={120} w={120} h={40} label="Internal" color="#6366f1" />
              <DataBox x={140} y={180} w={150} h={28}
                label="key=10110... follow Left" color="#10b981" outlined />
            </motion.g>
          )}

          {/* Step 1: split */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={90} w={200} h={42}
                label="splitInternal()" color="#f59e0b" />
              <DataBox x={140} y={150} w={90} h={26}
                label="old leaf" color="#10b981" outlined />
              <DataBox x={250} y={150} w={90} h={26}
                label="new leaf" color="#a855f7" outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                commonLen &lt; LabelBitLength → 둘로 쪼갬
              </text>
            </motion.g>
          )}

          {/* Step 2: update */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={150} y={100} w={180} h={32}
                label="key=ABC, value=42" color="#10b981" outlined />
              <text x={240} y={148} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">==</text>
              <DataBox x={150} y={155} w={180} h={32}
                label="key=ABC, value=99 (new)" color="#a855f7" outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                bytes.Equal → value 만 교체, hashLeaf 재계산
              </text>
            </motion.g>
          )}

          {/* Step 3: branchLeaf */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={170} y={75} w={140} h={36}
                label="branchLeaf()" color="#a855f7" />
              <motion.line x1={210} y1={111} x2={130} y2={150}
                stroke="#a855f7" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={270} y1={111} x2={350} y2={150}
                stroke="#a855f7" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <ModuleBox x={70}  y={150} w={120} h={42}
                label="old leaf" sub="key=ABC" color="#10b981" />
              <ModuleBox x={290} y={150} w={120} h={42}
                label="new leaf" sub="key=ABD" color="#10b981" />
              <text x={240} y={215} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                새 InternalNode 가 두 leaf 를 자식으로 (path compression)
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            tree.Insert(key, value) — go/storage/mkvs/tree_insert.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
