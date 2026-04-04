import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const TYPES = [
  { label: 'Felt252', color: '#8b5cf6', x: 10, y: 5 },
  { label: 'Uint8/16/32/64/128', color: '#6366f1', x: 110, y: 5 },
  { label: 'Array<T>', color: '#3b82f6', x: 10, y: 50 },
  { label: 'Struct<...>', color: '#10b981', x: 110, y: 50 },
  { label: 'Enum<...>', color: '#f59e0b', x: 220, y: 50 },
  { label: 'GasBuiltin', color: '#ef4444', x: 10, y: 95 },
  { label: 'RangeCheck', color: '#ec4899', x: 110, y: 95 },
  { label: 'Starknet', color: '#06b6d4', x: 220, y: 95 },
];

const STEPS = [
  { label: 'Sierra 타입 시스템 전체 구조', body: '기본 타입, 데이터 구조, 빌트인으로 구성됩니다.' },
  { label: '기본 타입: Felt252 & 정수', body: 'felt252는 소수체 원소, 정수 타입은 범위 검사(RangeCheck)로 보장.' },
  { label: '복합 타입: Array, Struct, Enum', body: 'Cairo의 복잡한 구조를 단순한 Sierra 명령어로 변환.' },
  { label: '빌트인 타입: Gas, RangeCheck, Starknet', body: '실행 환경과 상호작용하는 특수 타입들.' },
];

const GROUPS: number[][] = [[0,1,2,3,4,5,6,7],[0,1],[2,3,4],[5,6,7]];
const BW = 95, BH = 30;

export default function SierraTypeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {TYPES.map((t, i) => {
            const show = GROUPS[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={t.x} y={t.y} width={BW} height={BH} rx={6}
                  fill={`${t.color}15`} stroke={t.color} strokeWidth={1.5} />
                <text x={t.x + BW / 2} y={t.y + BH / 2 + 4}
                  textAnchor="middle" fontSize={9} fontWeight="700" fill={t.color}>
                  {t.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
