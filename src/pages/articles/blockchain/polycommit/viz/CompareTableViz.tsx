import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ROWS = [
  { name: 'KZG10', setup: 'Trusted', proof: 'O(1)', verify: 'O(1)', color: '#8b5cf6' },
  { name: 'Marlin', setup: 'Trusted', proof: 'O(1)', verify: 'O(1)', color: '#6366f1' },
  { name: 'IPA', setup: 'Transparent', proof: 'O(log n)', verify: 'O(n)', color: '#10b981' },
  { name: 'Linear Codes', setup: 'Transparent', proof: 'O(sqrt n)', verify: 'O(n)', color: '#ef4444' },
];

const STEPS = [
  { label: '스킴별 핵심 비교', body: '설정 방식, 증명 크기, 검증 시간으로 비교합니다.' },
  { label: 'KZG / Marlin: O(1) 증명', body: '페어링 기반으로 상수 크기 증명과 검증. Trusted setup 필요.' },
  { label: 'IPA: O(log n) 증명', body: '이산로그 기반, 투명 설정. 증명 크기는 로그 스케일.' },
  { label: 'Linear Codes: 양자 안전', body: '해시 기반으로 양자 컴퓨터 저항성. 증명 크기 O(sqrt n).' },
];

const ACTIVE: number[][] = [[0,1,2,3],[0,1],[2],[3]];
const COL_X = [5, 80, 145, 210, 275];
const HEADERS = ['Scheme', 'Setup', 'Proof', 'Verify'];

export default function CompareTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {HEADERS.map((h, i) => (
            <text key={h} x={COL_X[i] + 30} y={14} textAnchor="middle"
              fontSize={9} fontWeight="700" fill="var(--muted-foreground)">{h}</text>
          ))}
          <line x1={5} y1={20} x2={335} y2={20} stroke="var(--border)" strokeWidth={0.5} />
          {ROWS.map((r, i) => {
            const y = 28 + i * 28;
            const show = ACTIVE[step].includes(i);
            const vals = [r.name, r.setup, r.proof, r.verify];
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={2} y={y - 2} width={333} height={22} rx={4}
                  fill={`${r.color}08`} stroke={`${r.color}30`} strokeWidth={0.5} />
                {vals.map((v, j) => (
                  <text key={j} x={COL_X[j] + 30} y={y + 12} textAnchor="middle"
                    fontSize={8} fontWeight={j === 0 ? '700' : '400'}
                    fill={j === 0 ? r.color : 'var(--foreground)'}>{v}</text>
                ))}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
