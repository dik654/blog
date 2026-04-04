import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'CPU: 강력한 소수 코어', body: 'CPU는 복잡한 제어 흐름에 최적화된 4~64개의 고성능 코어를 보유합니다.' },
  { label: 'GPU: 대량의 경량 코어', body: 'GPU는 수천 개의 단순 코어로 동일 명령을 대량 데이터에 병렬 적용합니다.' },
  { label: 'SIMT 실행 모델', body: 'SIMT(Single Instruction, Multiple Threads): 32개 스레드가 한 워프로 묶여 동일 명령을 실행합니다.' },
];
const C = { cpu: '#6366f1', gpu: '#10b981', simt: '#f59e0b' };

export default function CpuGpuCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CPU side */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.2 }}>
            <rect x={20} y={20} width={180} height={130} rx={10} fill={C.cpu + '08'} stroke={C.cpu} strokeWidth={1.5} />
            <text x={110} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cpu}>CPU</text>
            {[0, 1, 2, 3].map(i => (
              <motion.rect key={i} x={40 + (i % 2) * 70} y={35 + Math.floor(i / 2) * 50}
                width={55} height={38} rx={6} fill={C.cpu + '18'} stroke={C.cpu} strokeWidth={1.5}
                initial={{ scale: 0.8 }} animate={{ scale: step === 0 ? 1 : 0.9 }}
                style={{ transformOrigin: `${67 + (i % 2) * 70}px ${54 + Math.floor(i / 2) * 50}px` }} />
            ))}
            {[0, 1, 2, 3].map(i => (
              <text key={`t${i}`} x={67 + (i % 2) * 70} y={58 + Math.floor(i / 2) * 50}
                textAnchor="middle" fontSize={10} fontWeight={600} fill={C.cpu}>Core {i}</text>
            ))}
          </motion.g>
          {/* GPU side */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
            <rect x={240} y={20} width={240} height={130} rx={10} fill={C.gpu + '08'} stroke={C.gpu} strokeWidth={1.5} />
            <text x={360} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.gpu}>GPU (SM x N)</text>
            {Array.from({ length: 8 }, (_, r) =>
              Array.from({ length: 12 }, (_, c) => (
                <motion.rect key={`${r}-${c}`}
                  x={253 + c * 18} y={30 + r * 14} width={14} height={10} rx={2}
                  fill={step === 2 && r < 4 ? C.simt + '30' : C.gpu + '15'}
                  stroke={step === 2 && r < 4 ? C.simt : C.gpu}
                  strokeWidth={step === 2 && r < 4 ? 1.5 : 0.8}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: (r * 12 + c) * 0.005 }} />
              ))
            )}
          </motion.g>
          {/* SIMT label */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={253} y={155} width={220} height={18} rx={4} fill={C.simt + '15'} stroke={C.simt} strokeWidth={1} />
              <text x={363} y={167} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.simt}>
                Warp (32 threads) = 동일 명령, 다른 데이터
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
