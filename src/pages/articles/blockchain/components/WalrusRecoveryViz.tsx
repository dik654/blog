import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const N = 10;
const OFF = [2, 5, 8];
const C = { online: '#3b82f6', offline: '#6b7280', donor: '#10b981', target: '#f59e0b' };

const STEPS = [
  { label: '노드 배치: 온라인/오프라인 식별', body: `${N}개 노드 중 ${OFF.length}개가 오프라인(회색). 나머지 정직 노드가 복구에 참여합니다.` },
  { label: '복구 대상 선택 및 요청 브로드캐스트', body: '오프라인 노드(#2)에 대해 복구 요청을 온라인 노드들에게 전파합니다.' },
  { label: '정직 노드가 복구 심볼 전송', body: '각 온라인 노드가 자신의 슬라이버에서 디코딩 심볼을 계산하여 대상 노드로 전송합니다.' },
  { label: 'f+1 심볼 수집 → 슬라이버 복원', body: `f+1=${Math.floor((N - 1) / 3) + 1}개 이상 수집하면 try_recover_sliver로 원본 슬라이버를 재구성합니다.` },
];

const cx = (i: number) => 50 + (i % 5) * 88;
const cy = (i: number) => (i < 5 ? 40 : 100);

export default function WalrusRecoveryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.donor} opacity={0.6} />
            </marker>
          </defs>
          {Array.from({ length: N }, (_, i) => {
            const off = OFF.includes(i);
            const isTarget = i === 2 && step >= 1;
            const isDonor = !off && step >= 2;
            const col = isTarget ? C.target : isDonor ? C.donor : off ? C.offline : C.online;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: step >= 0 ? 1 : 0.3, scale: 1 }}
                transition={{ delay: i * 0.04 }}>
                <circle cx={cx(i)} cy={cy(i)} r={18}
                  fill={col + '18'} stroke={col} strokeWidth={isTarget ? 2.5 : 1.5} />
                <text x={cx(i)} y={cy(i) + 1} textAnchor="middle" fontSize={9} fontWeight={600} fill={col}>
                  {i}
                </text>
                {off && (
                  <text x={cx(i)} y={cy(i) + 11} textAnchor="middle" fontSize={9} fill={C.offline}>오프라인</text>
                )}
              </motion.g>
            );
          })}
          {/* Arrows from donors to target */}
          {step >= 2 && Array.from({ length: N }, (_, i) => {
            if (OFF.includes(i) || i === 2) return null;
            return (
              <motion.line key={`arr-${i}`}
                x1={cx(i)} y1={cy(i)} x2={cx(2)} y2={cy(2)}
                stroke={C.donor} strokeWidth={1} strokeDasharray="4 2"
                markerEnd="url(#wr-a)" opacity={0.5}
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ delay: i * 0.06 }} />
            );
          })}
          {/* Recovered badge */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={cx(2) - 32} y={cy(2) + 24} width={64} height={18} rx={9}
                fill={C.donor + '30'} stroke={C.donor} strokeWidth={1} />
              <text x={cx(2)} y={cy(2) + 36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.donor}>복원 완료</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
