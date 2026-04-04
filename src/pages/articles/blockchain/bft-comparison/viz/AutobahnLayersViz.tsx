import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Autobahn 레이어 아키텍처', body: 'Highway(합의) + Lanes(데이터) 분리로 독립 최적화' },
  { label: 'Lanes — 비동기 데이터 전파', body: '병렬 lane + Reliable Broadcast로 데이터 가용성 보장' },
  { label: 'Ride-Sharing 피기백', body: '합의 메시지를 lane car에 피기백 — 네트워크 메시지 50% 절감' },
  { label: 'Highway — 합의 확정', body: 'Fast 3 delays / Slow 5 delays — Hangover 없이 즉시 복구' },
];

const LANES = ['V1', 'V2', 'V3', 'V4'];
const C = { lane: '#10b981', ride: '#f59e0b', highway: '#6366f1', node: '#0ea5e9' };

export default function AutobahnLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Highway band */}
          <motion.rect x={20} y={10} width={340} height={40} rx={6}
            fill={`${C.highway}12`} stroke={C.highway} strokeWidth={1.5}
            animate={{ opacity: step === 0 || step === 3 ? 1 : 0.25 }} />
          <text x={190} y={35} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.highway}>
            Highway (합의 레이어)
          </text>
          {/* Ride-Sharing band */}
          <motion.rect x={20} y={65} width={340} height={30} rx={6}
            fill={`${C.ride}12`} stroke={C.ride} strokeWidth={1.5}
            animate={{ opacity: step === 0 || step === 2 ? 1 : 0.25 }} />
          <text x={190} y={84} textAnchor="middle" fontSize={10} fontWeight="600" fill={C.ride}>
            Ride-Sharing (피기백)
          </text>
          {/* Lanes band */}
          <motion.rect x={20} y={110} width={340} height={80} rx={6}
            fill={`${C.lane}08`} stroke={C.lane} strokeWidth={1.5}
            animate={{ opacity: step === 0 || step === 1 ? 1 : 0.25 }} />
          <text x={50} y={128} fontSize={10} fontWeight="700" fill={C.lane}>Lanes (데이터)</text>
          {/* Parallel lanes per validator */}
          {LANES.map((v, i) => {
            const y = 140 + i * 12;
            return (
              <g key={v}>
                <text x={30} y={y + 4} fontSize={10} fill={C.node} fontWeight="600">{v}</text>
                <motion.line x1={50} y1={y} x2={350} y2={y}
                  stroke={C.lane} strokeWidth={1.5} strokeDasharray="6 4"
                  animate={{ opacity: step >= 1 ? 1 : 0.3 }} />
                {step >= 1 && (
                  <motion.circle r={4} fill={C.lane}
                    animate={{ cx: [60, 340], cy: [y, y] }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 0.8 }} />
                )}
              </g>
            );
          })}
          {/* Piggybacked messages */}
          {step >= 2 && LANES.slice(0, 2).map((_, i) => {
            const y = 140 + i * 12;
            return (
              <motion.circle key={`pb-${i}`} r={3} fill={C.ride}
                animate={{ cx: [80, 300], cy: [y, 80] }}
                transition={{ duration: 1, delay: i * 0.3, repeat: Infinity, repeatDelay: 2 }} />
            );
          })}
          {/* Highway commit pulse */}
          {step === 3 && (
            <motion.rect x={260} y={15} width={80} height={30} rx={4}
              fill={C.highway} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
