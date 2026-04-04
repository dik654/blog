import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const SCHEMES = [
  { label: 'KZG10', color: '#8b5cf6', x: 10, y: 10, group: 'pairing' },
  { label: 'Marlin PC', color: '#6366f1', x: 110, y: 10, group: 'pairing' },
  { label: 'Sonic PC', color: '#3b82f6', x: 210, y: 10, group: 'pairing' },
  { label: 'IPA PC', color: '#10b981', x: 10, y: 60, group: 'dlog' },
  { label: 'Hyrax', color: '#f59e0b', x: 110, y: 60, group: 'dlog' },
  { label: 'Linear Codes', color: '#ef4444', x: 210, y: 60, group: 'hash' },
];

const STEPS = [
  { label: '6가지 다항식 커밋먼트 스킴', body: '페어링 기반(KZG계열), 이산로그 기반(IPA/Hyrax), 해시 기반(Linear Codes)' },
  { label: '페어링 기반 (Trusted Setup 필요)', body: 'KZG10: 가장 기본적, Marlin: 차수 제한+은닉, Sonic: AuroraLight 최적화' },
  { label: '이산로그 기반 (투명 설정)', body: 'IPA: O(log n) 증명, Hyrax: 다변수 다항식 지원. 신뢰 설정 불필요.' },
  { label: '해시 기반 (양자 안전)', body: 'Linear Codes: 오류 정정 부호 기반. 양자 컴퓨터에 대한 강한 저항성.' },
];

const GROUPS: Record<string, number[]> = {
  all: [0,1,2,3,4,5], pairing: [0,1,2], dlog: [3,4], hash: [5],
};
const ACTIVE = [GROUPS.all, GROUPS.pairing, GROUPS.dlog, GROUPS.hash];
const BW = 85, BH = 32;

export default function SchemeCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Group labels */}
          <text x={155} y={7} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Pairing-based (Trusted Setup)</text>
          <text x={60} y={57} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">DLOG-based</text>
          <text x={252} y={57} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Hash-based</text>
          {SCHEMES.map((s, i) => {
            const show = ACTIVE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={s.x} y={s.y} width={BW} height={BH} rx={6}
                  fill={`${s.color}15`} stroke={s.color} strokeWidth={1.5} />
                <text x={s.x + BW / 2} y={s.y + BH / 2 + 4}
                  textAnchor="middle" fontSize={9} fontWeight="700" fill={s.color}>
                  {s.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
