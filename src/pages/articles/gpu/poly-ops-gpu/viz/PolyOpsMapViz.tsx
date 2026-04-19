import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  base: '#0ea5e9',
  ext: '#10b981',
  cost: '#f59e0b',
  hi: '#a855f7',
  muted: '#94a3b8',
};

interface Op { name: string; cost: string; desc: string; isExt: boolean; }

const BASE_OPS: Op[] = [
  { name: 'NTT(f)', cost: 'O(n log n)', desc: '계수 → 평가 변환', isExt: false },
  { name: 'INTT(F)', cost: 'O(n log n)', desc: '평가 → 계수 변환', isExt: false },
  { name: 'pointwise_mul', cost: 'O(n)', desc: '평가끼리 곱셈 = 다항식 곱', isExt: false },
];

const EXT_OPS: Op[] = [
  { name: 'coset_NTT(f, g)', cost: 'O(n log n)', desc: 'coset 위에서 평가', isExt: true },
  { name: 'coset_INTT(F, g)', cost: 'O(n log n)', desc: 'coset 평가 → 계수 복원', isExt: true },
  { name: 'poly_div(t, Z)', cost: 'O(n)', desc: 'vanishing poly 나눗셈', isExt: true },
  { name: 'multi_eval(f, z)', cost: 'O(n)', desc: '임의 점에서 평가 (Horner)', isExt: true },
  { name: 'batch_inversion', cost: 'O(n)', desc: 'n개 역원을 1회 역원으로', isExt: true },
];

const STEPS = [
  {
    label: '기본 NTT 연산 — 모든 ZK 프로버의 토대',
    body: 'NTT/INTT/pointwise_mul 세 가지가 다항식 산술의 핵심.\nGPU에서 각 연산은 잘 정립된 병렬 알고리즘이 존재한다.',
  },
  {
    label: '확장 연산 — PLONK/Groth16 프로버에 필수',
    body: '몫 다항식, KZG 오프닝, batch opening 등 실무 프로토콜은 기본 NTT만으로 부족.\ncoset NTT, vanishing poly 나눗셈, 다점 평가, 배치 역원이 매 라운드에 필요.',
  },
  {
    label: 'GPU 매핑 — 모두 embarrassingly parallel',
    body: 'coset NTT = 전처리 곱 + 표준 NTT (스레드 n개).\npoly_div = 원소별 Fp 나눗셈 (스레드 n개).\nmulti_eval = 점마다 독립 Horner (스레드 k개).\nbatch_inversion = prefix product → 1회 역원 → 역순 복원.',
  },
];

export default function PolyOpsMapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            NTT 기반 다항식 연산 맵
          </text>

          {/* 기본 연산 그룹 */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
            <ModuleBox x={10} y={26} w={460} h={20} label="기본 연산" color={C.base} />
            {BASE_OPS.map((op, i) => (
              <Row key={op.name} y={50 + i * 28} op={op} active={step === 0} highlight={step >= 0} />
            ))}
          </motion.g>

          {/* 확장 연산 그룹 */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0.25 }} transition={sp}>
            <ModuleBox x={10} y={140} w={460} h={20} label="확장 연산 (이 글의 주제)" color={C.ext} />
            {EXT_OPS.map((op, i) => (
              <Row key={op.name} y={164 + i * 18} op={op} active={step === 1 || step === 2} highlight={step >= 1} />
            ))}
          </motion.g>

          {/* GPU 병렬화 어노테이션 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <DataBox x={250} y={50} w={210} h={20} label="GPU: O(n log n) 병렬 NTT" color={C.hi} outlined />
              <DataBox x={250} y={164} w={210} h={16} label="GPU: 전처리 + NTT 병합" color={C.hi} outlined />
              <DataBox x={250} y={218} w={210} h={16} label="GPU: 점별 1 스레드" color={C.hi} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

function Row({ y, op, active, highlight }: { y: number; op: Op; active: boolean; highlight: boolean }) {
  const color = op.isExt ? C.ext : C.base;
  return (
    <g opacity={highlight ? 1 : 0.4}>
      <rect x={20} y={y} width={220} height={active ? 14 : 12} rx={4}
        fill={active ? color + '14' : 'transparent'}
        stroke={active ? color : color + '30'} strokeWidth={active ? 0.8 : 0.4} />
      <text x={28} y={y + 9} fontSize={8} fontWeight={700} fill={color}>{op.name}</text>
      <text x={148} y={y + 9} fontSize={7.5} fill="var(--muted-foreground)">{op.cost}</text>
      <text x={250} y={y + 9} fontSize={7.5} fill="var(--foreground)">{op.desc}</text>
    </g>
  );
}
