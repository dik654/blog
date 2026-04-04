import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { win: '#6366f1', window: '#10b981' };

const STEPS = [
  { label: 'WindowPoSt: 24시간 주기, 전체 섹터 증명', body: '모든 섹터 파티션을 24시간(2880 에포크) 내 증명 완료. 실패 시 Power 페널티 + 슬래싱.' },
  { label: 'WinningPoSt: 블록 당첨 시 즉시 증명', body: '당첨 섹터 5개, 섹터당 66개 챌린지. 소형 회로로 빠른 생성. 실패 시 블록 보상 없음.' },
  { label: '공통점: Groth16 + OctMerkle TreeR', body: '둘 다 Arity-8 OctMerkle + Poseidon(TreeR) 기반. Groth16으로 최종 증명 생성.' },
  { label: '비교 요약: 범위 vs 속도', body: 'WindowPoSt=전체 파워 유지 증명(대규모), WinningPoSt=리더 선출 즉시 증명(소형, 빠름).' },
];

const COL_X = [80, 300], HDR_Y = 22, ROW_Y = 44, ROW_H = 22;
const FIELDS = ['트리거', '대상 섹터', '챌린지', '증명', '실패 결과'];
const WIN_VALS = ['24시간 주기', '전체 섹터', '10개/섹터', 'Groth16×파티션', '파워 슬래싱'];
const WINNING_VALS = ['블록 당첨 시', '5개 섹터', '66개/섹터', 'Groth16 단일', '보상 없음'];

export default function PoStCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Column headers */}
          {[
            { label: 'WindowPoSt', x: COL_X[0], c: C.window },
            { label: 'WinningPoSt', x: COL_X[1], c: C.win },
          ].map((h) => (
            <motion.text key={h.label} x={h.x} y={HDR_Y} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={h.c}
              animate={{ opacity: 1 }}>{h.label}</motion.text>
          ))}
          <line x1={20} y1={30} x2={420} y2={30} stroke="var(--border)" strokeWidth={0.5} />
          {/* Rows */}
          {FIELDS.map((f, i) => {
            const y = ROW_Y + i * ROW_H;
            const highlight = step === 0 ? true : step === 1 ? true : step === 2 && i >= 3;
            return (
              <motion.g key={f}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: highlight || step === 3 ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <text x={190} y={y + 14} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">{f}</text>
                {/* WindowPoSt value */}
                <motion.rect x={30} y={y} width={100} height={ROW_H - 2} rx={4}
                  fill={C.window + (step === 0 ? '18' : '08')}
                  stroke={step === 0 ? C.window : 'transparent'} strokeWidth={0.8}
                  animate={{ opacity: step === 0 || step >= 2 ? 1 : 0.3 }} />
                <text x={80} y={y + 13} textAnchor="middle" fontSize={9} fill={C.window}>{WIN_VALS[i]}</text>
                {/* WinningPoSt value */}
                <motion.rect x={250} y={y} width={100} height={ROW_H - 2} rx={4}
                  fill={C.win + (step === 1 ? '18' : '08')}
                  stroke={step === 1 ? C.win : 'transparent'} strokeWidth={0.8}
                  animate={{ opacity: step === 1 || step >= 2 ? 1 : 0.3 }} />
                <text x={300} y={y + 13} textAnchor="middle" fontSize={9} fill={C.win}>{WINNING_VALS[i]}</text>
              </motion.g>
            );
          })}
          {/* Summary badges */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={50} y={158} width={80} height={16} rx={8} fill={C.window + '20'} stroke={C.window} />
              <text x={90} y={169} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.window}>대규모 범위</text>
              <rect x={310} y={158} width={80} height={16} rx={8} fill={C.win + '20'} stroke={C.win} />
              <text x={350} y={169} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.win}>빠른 속도</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
