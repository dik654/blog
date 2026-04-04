import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const TIERS = [
  { label: 'Cold Storage (Filecoin)', c: '#6b7280', lat: '수 시간' },
  { label: 'Hot Storage (Boost+IPFS)', c: '#6366f1', lat: '수 초' },
  { label: 'Saturn CDN (L1/L2)', c: '#10b981', lat: 'ms' },
];
const FLOW = [
  { label: '저장: IPFS → CID → Filecoin 딜', body: 'PoRep+PoSt로 저장 증명. 36개월 이상 장기 보관. 데이터 검색 시 밀봉 해제 필요.' },
  { label: '서빙: IPFS → Saturn L1 → L2 엣지', body: 'Boost 딜 + IPFS 노드로 즉시 서빙. HTTP 게이트웨이 통합. Saturn CDN 연동 가능.' },
  { label: '검색: CID → Kademlia DHT → Bitswap', body: 'L1: IPFS 게이트웨이. L2: 엣지 캐시 CDN. FIL+ 인센티브로 운영자 유치.' },
];
const ALL = [...TIERS, ...FLOW];
const TIER_Y = [100, 60, 20];

export default function HotStorageViz() {
  return (
    <StepViz steps={ALL}>
      {(step) => (
        <svg viewBox="0 0 540 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 3 ? (
            <>
              {TIERS.map((t, i) => {
                const active = i === step;
                const w = 120 + i * 50;
                const x = 200 - w / 2;
                return (
                  <motion.g key={i}
                    animate={{ y: active ? -4 : 0, opacity: active ? 1 : 0.35 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                    <rect x={x} y={TIER_Y[i]} width={w} height={32} rx={6}
                      fill={t.c + (active ? '22' : '0a')} stroke={t.c}
                      strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.3} />
                    <text x={200} y={TIER_Y[i] + 15} textAnchor="middle" fontSize={10}
                      fontWeight={600} fill={t.c}>{t.label.split(' (')[0]}</text>
                    <text x={200} y={TIER_Y[i] + 27} textAnchor="middle" fontSize={9}
                      fill={t.c} fillOpacity={0.5}>지연: {t.lat}</text>
                  </motion.g>
                );
              })}
              {[0, 1].map(i => (
                <line key={i} x1={200} y1={TIER_Y[i] - 2} x2={200} y2={TIER_Y[i + 1] + 32}
                  stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />
              ))}
            </>
          ) : (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {(() => {
                const fi = step - 3;
                const parts = FLOW[fi].label.split(': ')[1].split(' → ');
                return parts.map((p, i) => {
                  const x = 30 + i * (340 / parts.length);
                  const w = 340 / parts.length - 10;
                  return (
                    <motion.g key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}>
                      <rect x={x} y={50} width={w} height={36} rx={7}
                        fill={['#6366f1', '#f59e0b', '#10b981'][fi] + '18'}
                        stroke={['#6366f1', '#f59e0b', '#10b981'][fi]} strokeWidth={1.5} />
                      <text x={x + w / 2} y={72} textAnchor="middle" fontSize={10}
                        fontWeight={600} fill={['#6366f1', '#f59e0b', '#10b981'][fi]}>{p}</text>
                      {i < parts.length - 1 && (
                        <motion.line x1={x + w + 2} y1={68} x2={x + w + 8} y2={68}
                          stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.5}
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                      )}
                    </motion.g>
                  );
                });
              })()}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
