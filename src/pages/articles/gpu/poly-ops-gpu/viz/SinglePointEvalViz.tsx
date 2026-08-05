import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  horner: '#0ea5e9',
  dot: '#10b981',
  cost: '#f59e0b',
  win: '#a855f7',
  bad: '#ef4444',
};

const STEPS = [
  {
    label: '문제: p(z) = sum c[i]·z^i 단일 점 평가',
    body: 'KZG opening에서 challenge point z 1개에서 다항식 평가가 필요.\nk=1일 때 Horner는 순차적이라 GPU 활용도가 낮다.',
  },
  {
    label: 'Dot product 변환 — 2단계',
    body: '1) z 거듭제곱 배열 생성: [z^0, z^1, ..., z^{n-1}] (parallel prefix product)\n2) 원소별 곱 + parallel reduction: dot(coeffs, z_powers).',
  },
  {
    label: '비용 비교: n = 2^24, T = 1024',
    body: 'Horner: 16M 순차 곱셈 (1 스레드).\nDot product: 16K 곱셈/스레드 + 10단계 reduction (1024 스레드).',
  },
  {
    label: '실전 결론: KZG는 Horner로도 충분',
    body: 'KZG opening은 점이 1~수개뿐 → 커널 오버헤드 > 병렬화 이득.\n다항식 수 m이 클 때(batch opening)는 Horner를 m개 병렬 실행이 단순/효율적.',
  },
];

export default function SinglePointEvalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            단일 점 평가: Horner vs Dot Product
          </text>

          {/* 좌: Horner */}
          <ModuleBox x={10} y={26} w={220} h={20} label="Horner (순차)" color={C.horner} />
          {/* 우: Dot product */}
          <ModuleBox x={250} y={26} w={220} h={20} label="Dot Product (병렬)" color={C.dot} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={60} w={200} h={36} label="acc = c[n−1]" sub="최고차 계수부터" color={C.horner} outlined />
              <ActionBox x={20} y={104} w={200} h={36} label="for i = n−2..0" sub="acc = acc·z + c[i]" color={C.horner} />
              <DataBox x={20} y={148} w={200} h={32} label="result = acc" color={C.horner} outlined />
              <DataBox x={260} y={60} w={200} h={36} label="z 거듭제곱 [z^0..z^{n−1}]" sub="prefix product" color={C.dot} outlined />
              <ActionBox x={260} y={104} w={200} h={36} label="dot(coeffs, z_powers)" sub="원소곱 + reduction" color={C.dot} />
              <DataBox x={260} y={148} w={200} h={32} label="result = sum(c[i]·z^i)" color={C.dot} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Dot product 단계 강조 */}
              <ActionBox x={260} y={60} w={200} h={32} label="단계 1: 거듭제곱" sub="parallel prefix product" color={C.dot} />
              <ActionBox x={260} y={100} w={200} h={32} label="단계 2: 원소곱" sub="c[i] * z_powers[i]" color={C.dot} />
              <ActionBox x={260} y={140} w={200} h={32} label="단계 3: reduction" sub="log T 단계 합" color={C.dot} />
              <DataBox x={20} y={100} w={200} h={32} label="단일 스레드 루프" sub="O(n) sequential" color={C.horner} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={60} w={200} h={32} label="16M 곱셈" sub="1 스레드 순차" color={C.horner} outlined />
              <StatusBox x={20} y={102} w={200} h={36} label="Horner" sub="총 시간 = 16M cycles" color={C.horner} progress={1} />
              <DataBox x={260} y={60} w={200} h={32} label="16K 곱셈/스레드" sub="× 1024 스레드 병렬" color={C.dot} outlined />
              <StatusBox x={260} y={102} w={200} h={36} label="Dot + Reduction" sub="16K + 10 단계" color={C.dot} progress={0.16} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                병렬화 이득: 약 1000배 (이론치)
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={60} w={440} h={36} label="KZG opening: 평가점 1~수개" sub="커널 launch 오버헤드 > 병렬화 이득" color={C.cost} outlined />
              <DataBox x={20} y={104} w={210} h={32} label="Horner: 단순/효율적" color={C.horner} outlined />
              <DataBox x={250} y={104} w={210} h={32} label="Dot: 거대 다항식 단일 점에 유리" color={C.dot} outlined />
              <StatusBox x={20} y={146} w={440} h={36} label="실전 선택: Horner (m개 다항식 병렬)" sub="batch opening에서 m이 클수록 GPU 활용도 ↑" color={C.win} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
