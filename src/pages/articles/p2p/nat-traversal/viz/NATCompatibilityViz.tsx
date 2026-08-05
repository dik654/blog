import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS = [
  {
    label: '매핑 행동 — 같은 source 포트가 외부에서 어떻게 보이나',
    body: 'Endpoint-Independent: 어디로 보내든 동일한 외부 포트 (Cone).\nAddress-Dependent: 목적지 IP가 다르면 다른 매핑.\nAddress-Port-Dependent: 목적지 IP+Port 조합마다 새 매핑 (Symmetric).',
  },
  {
    label: '필터링 행동 — 누구의 패킷을 받아들이나',
    body: 'Endpoint-Independent: 모든 외부 source 허용.\nAddress-Dependent: 내부가 먼저 보낸 IP만.\nAddress-Port-Dependent: 내부가 먼저 보낸 IP+Port만.',
  },
  {
    label: '현실의 NAT 분포 — 환경별 빈도',
    body: '가정용 라우터: Full Cone / Restricted 다수.\n모바일 캐리어: Symmetric NAT 흔함.\n기업망: Symmetric + 엄격한 방화벽.\nCGN(Carrier-Grade NAT): 이중 NAT, 홀 펀칭 더 어려움.',
  },
  {
    label: '조합별 P2P 성공률 — 경험적',
    body: '같은 네트워크 99% / 둘 다 Full Cone 95%.\nFull + Restricted 90% / 둘 다 Restricted 80%.\nSymmetric + Restricted 50% / 둘 다 Symmetric 5~10%.\n전체 평균 70~80% — TURN/DERP 폴백이 필수인 이유.',
  },
];

const MAPPING_TYPES = [
  { name: 'Endpoint\nIndependent', short: 'Cone', color: '#10b981', y: 30 },
  { name: 'Address\nDependent', short: 'Restricted', color: '#f59e0b', y: 80 },
  { name: 'Address-Port\nDependent', short: 'Symmetric', color: '#ef4444', y: 130 },
];

const ENVS = [
  { name: '가정 라우터', kinds: ['Full Cone', 'Restricted'], color: '#10b981', y: 22 },
  { name: '모바일 캐리어', kinds: ['Symmetric'], color: '#ef4444', y: 62 },
  { name: '기업망', kinds: ['Symmetric', 'Strict FW'], color: '#8b5cf6', y: 102 },
  { name: 'CGN/이중 NAT', kinds: ['CGN'], color: '#64748b', y: 142 },
];

const SUCCESS = [
  { combo: '둘 다 Full Cone', rate: 0.95, color: '#10b981' },
  { combo: 'Full + Restricted', rate: 0.90, color: '#10b981' },
  { combo: '둘 다 Restricted', rate: 0.80, color: '#f59e0b' },
  { combo: 'Sym + Restricted', rate: 0.50, color: '#f59e0b' },
  { combo: '둘 다 Symmetric', rate: 0.075, color: '#ef4444' },
];

export default function NATCompatibilityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#64748b">
                내부 :3000 → 외부 매핑
              </text>
              {/* Internal host */}
              <DataBox x={20} y={85} w={70} h={32} label="Internal" sub=":3000" color="#6366f1" outlined />
              {/* Mapping behaviors */}
              {MAPPING_TYPES.map((m, i) => {
                const sameMap = i === 0;
                const partial = i === 1;
                return (
                  <motion.g key={m.short}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: i * 0.08 }}>
                    <line x1={90} y1={101} x2={150} y2={m.y + 14}
                      stroke={m.color} strokeWidth={0.8} strokeOpacity={0.5} />
                    <DataBox x={150} y={m.y} w={88} h={28} label={m.short}
                      sub={sameMap ? '단일 매핑' : partial ? 'IP별 매핑' : 'IP+Port별'}
                      color={m.color} outlined />
                    {/* Outgoing arrows showing mapping behavior */}
                    {[0, 1, 2].map(j => {
                      const port = sameMap ? 5678
                        : partial ? (j < 2 ? 5678 : 5680)
                        : 5678 + j * 2;
                      return (
                        <g key={j}>
                          <line x1={238} y1={m.y + 14} x2={310} y2={m.y - 10 + j * 14}
                            stroke={m.color} strokeOpacity={0.4} strokeWidth={0.7} />
                          <text x={365} y={m.y - 7 + j * 14} fontSize={7.5}
                            fontFamily="monospace" fill={m.color}>:{port}</text>
                        </g>
                      );
                    })}
                  </motion.g>
                );
              })}
              <text x={395} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="#64748b">목적지별</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#64748b">
                외부 → 내부 패킷의 통과 여부
              </text>
              {/* NAT 가운데 */}
              <ModuleBox x={210} y={85} w={70} h={42} label="NAT" sub="filter" color="#6366f1" />
              <DataBox x={20} y={94} w={60} h={26} label="Internal" color="#6366f1" outlined />
              <line x1={80} y1={107} x2={210} y2={107} stroke="#6366f1" strokeWidth={1} />
              {/* External hosts */}
              {[
                { id: 'A', y: 25, prior: 'sent', allow: [true, true, true] },
                { id: 'B', y: 95, prior: 'same IP', allow: [true, true, false] },
                { id: 'C', y: 165, prior: 'never', allow: [true, false, false] },
              ].map((h, i) => (
                <g key={h.id}>
                  <DataBox x={400} y={h.y} w={64} h={28} label={`Host ${h.id}`}
                    sub={h.prior} color="#64748b" outlined />
                  {MAPPING_TYPES.map((m, j) => (
                    <line key={j} x1={400} y1={h.y + 14}
                      x2={280} y2={106 + (j - 1) * 6}
                      stroke={h.allow[j] ? m.color : '#64748b'}
                      strokeOpacity={h.allow[j] ? 0.6 : 0.12}
                      strokeWidth={0.8}
                      strokeDasharray={h.allow[j] ? '0' : '3 2'} />
                  ))}
                </g>
              ))}
              {/* Filter type labels */}
              {MAPPING_TYPES.map((m, i) => (
                <text key={i} x={302} y={102 + (i - 1) * 6 + 3}
                  fontSize={7.5} fontWeight={600} fill={m.color}>
                  {i === 0 ? 'EI' : i === 1 ? 'AD' : 'APD'}
                </text>
              ))}
              {/* Legend */}
              <text x={20} y={195} fontSize={7.5} fill="#64748b">
                EI = 모두 통과 / AD = 보낸 IP만 / APD = 보낸 IP+Port만
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#64748b">
                환경별 NAT 유형 분포
              </text>
              {ENVS.map((e, i) => (
                <motion.g key={e.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <DataBox x={20} y={e.y} w={120} h={30} label={e.name}
                    color={e.color} outlined />
                  {e.kinds.map((k, j) => (
                    <DataBox key={k} x={160 + j * 110} y={e.y} w={100} h={30}
                      label={k} color={e.color} />
                  ))}
                </motion.g>
              ))}
              <text x={20} y={195} fontSize={7.5} fill="#64748b">
                CGN: ISP가 가입자 공유 IPv4 → 이중 NAT → IPv6 전환 권장
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#64748b">
                NAT 조합별 직접 연결 성공률 (홀 펀칭)
              </text>
              {SUCCESS.map((s, i) => {
                const y = 28 + i * 30;
                const barW = 240 * s.rate;
                return (
                  <motion.g key={s.combo}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    <text x={20} y={y + 14} fontSize={9} fontWeight={600}
                      fill="#64748b">{s.combo}</text>
                    <rect x={150} y={y + 4} width={240} height={14} rx={3}
                      fill="#64748b" opacity={0.12} />
                    <motion.rect x={150} y={y + 4} height={14} rx={3} fill={s.color}
                      initial={{ width: 0 }}
                      animate={{ width: barW }}
                      transition={{ ...sp, delay: i * 0.1 + 0.2 }} />
                    <text x={400} y={y + 14} fontSize={9} fontWeight={700}
                      fontFamily="monospace" fill={s.color}>
                      {Math.round(s.rate * 100)}%
                    </text>
                  </motion.g>
                );
              })}
              <AlertBox x={20} y={185} w={440} h={28}
                label="TURN/DERP 폴백 필수"
                sub="평균 70~80% — Symmetric 페어는 거의 폴백" color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
