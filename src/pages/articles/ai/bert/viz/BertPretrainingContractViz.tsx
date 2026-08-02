import { motion, useReducedMotion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox, DataBox, ModuleBox, StatusBox } from '@/components/viz/boxes';

const steps = [
  { label: '1. 원문 전체에서 예측할 위치 15%만 먼저 고른다.', body: '선택 집합은 loss를 받을 위치다. 아직 [MASK]로 바꾸는 단계가 아니다.' },
  { label: '2. 선택된 위치에만 80/10/10 corruption을 적용한다.', body: '80%는 [MASK], 10%는 무작위 token, 10%는 원문을 유지하지만 세 경우 모두 원래 ID가 정답이다.' },
  { label: '3. 손상된 sequence를 양방향 encoder가 읽는다.', body: '선택되지 않은 85%도 문맥으로 참여한다. 다만 그 위치에는 직접 MLM loss를 걸지 않는다.' },
  { label: '4. 선택 집합의 원래 token에만 vocabulary loss를 계산한다.', body: 'Corruption 비율과 loss mask는 다른 계약이다. 이 구분이 80/10/10을 attention weight로 오해하지 않게 한다.' },
];

const nodes = [
  { x: 12, kind: 'data' as const },
  { x: 140, kind: 'action' as const },
  { x: 268, kind: 'action' as const },
  { x: 396, kind: 'module' as const },
  { x: 524, kind: 'status' as const },
];

function Pipeline({ active }: { active: number }) {
  const reduceMotion = useReducedMotion();
  const opacity = (index: number) => index <= active + 1 ? 1 : 0.28;
  const lift = (index: number) => index === active + 1 && !reduceMotion ? -4 : 0;

  return (
    <div className="w-full" data-bert-pretraining-step-viz>
      <svg viewBox="0 0 360 220" className="block aspect-[360/220] w-full sm:hidden" role="img" aria-label="현재 BERT MLM 단계의 확대 흐름">
        <defs>
          <marker id="bert-mlm-arrow-mobile" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity="0.55" />
          </marker>
        </defs>
        <path d="M 166 96 C 176 96, 184 96, 194 96" fill="none" stroke="currentColor" strokeWidth="1.8" markerEnd="url(#bert-mlm-arrow-mobile)" opacity="0.65" />
        {active === 0 && <><DataBox x={16} y={66} w={150} h={58} label="원문 token" sub="전체가 context" color="#0f766e" /><ActionBox x={194} y={66} w={150} h={58} label="15% 위치 선택" sub="직접 loss 대상" color="#2563eb" /></>}
        {active === 1 && <><DataBox x={16} y={66} w={150} h={58} label="선택 집합 15%" sub="원래 ID가 정답" color="#2563eb" /><ActionBox x={194} y={66} w={150} h={58} label="80/10/10" sub="입력만 손상" color="#7c3aed" /><AlertBox x={105} y={152} w={150} h={48} label="선택 밖 85%" sub="문맥, 직접 loss 없음" color="#64748b" /></>}
        {active === 2 && <><DataBox x={16} y={66} w={150} h={58} label="손상 sequence" sub="mask·random·원문" color="#7c3aed" /><ModuleBox x={194} y={66} w={150} h={58} label="BERT encoder" sub="양방향 문맥" color="#d97706" /></>}
        {active === 3 && <><ModuleBox x={16} y={66} w={150} h={58} label="BERT encoder" sub="선택 위치 표현" color="#d97706" /><StatusBox x={194} y={65} w={150} h={60} label="MLM loss" sub="원래 token ID" color="#059669" progress={0.8} /></>}
        <text x="180" y="32" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor">현재 장면만 확대</text>
      </svg>
      <svg viewBox="0 0 660 235" className="hidden aspect-[660/235] w-full sm:block" role="img" aria-label="BERT MLM의 선택, 손상, 인코딩, 손실 흐름">
        <defs>
          <marker id="bert-mlm-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="currentColor" opacity="0.5" />
          </marker>
        </defs>
        {nodes.slice(0, -1).map((node, index) => (
          <motion.path
            key={node.x}
            d={`M ${node.x + 112} 101 C ${node.x + 119} 101, ${nodes[index + 1].x - 7} 101, ${nodes[index + 1].x} 101`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#bert-mlm-arrow)"
            initial={false}
            animate={{ opacity: index <= active ? 0.65 : 0.16 }}
          />
        ))}

        <motion.g initial={false} animate={{ opacity: opacity(0), y: lift(0) }}>
          <DataBox x={12} y={82} w={112} h={38} label="원문 token" sub="100% context" color="#0f766e" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: opacity(1), y: lift(1) }}>
          <ActionBox x={140} y={78} w={112} h={46} label="15% 선택" sub="loss 위치" color="#2563eb" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: opacity(2), y: lift(2) }}>
          <ActionBox x={268} y={78} w={112} h={46} label="80/10/10" sub="입력 손상" color="#7c3aed" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: opacity(3), y: lift(3) }}>
          <ModuleBox x={396} y={76} w={112} h={50} label="BERT encoder" sub="양방향 문맥" color="#d97706" />
        </motion.g>
        <motion.g initial={false} animate={{ opacity: active >= 3 ? 1 : 0.28, y: active === 3 && !reduceMotion ? -4 : 0 }}>
          <StatusBox x={524} y={75} w={112} h={52} label="MLM loss" sub="선택 위치만" color="#059669" progress={0.8} />
        </motion.g>

        <motion.g initial={false} animate={{ opacity: active >= 1 ? 1 : 0.2 }}>
          <path d="M 196 126 C 196 151, 324 145, 324 164" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="4 4" />
          <AlertBox x={258} y={164} w={132} h={46} label="선택 밖 85%" sub="문맥, 직접 loss 없음" color="#64748b" />
        </motion.g>
      </svg>
      <p className="mt-3 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted-foreground">
        고정 오라클: <strong className="text-foreground">선택 15%</strong>와 <strong className="text-foreground">corruption 80/10/10</strong>은 서로 다른 확률 단계이며, loss mask는 선택 집합을 따른다.
      </p>
    </div>
  );
}

export default function BertPretrainingContractViz() {
  return <StepViz steps={steps}>{(step) => <Pipeline active={step} />}</StepViz>;
}
