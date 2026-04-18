import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = { store: '#6366f1', time: '#10b981', secure: '#3b82f6', warn: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '4가지 보관 범주', body: 'CDD 자료, 거래 내역, SAR 사본+조치 기록, 내부 통제 기록. 모두 5년 이상.' },
  { label: '보관 방법 5대 요건', body: '전자 보관 + 암호화(AES-256) + 접근 통제(RBAC) + 무결성(WORM) + 이중 백업.' },
  { label: 'SAR 사본 특별 관리', body: 'SAR 내용 유출 = Tipping-off. AML 담당자+준법감시인만 접근. 별도 저장소 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#rreq-arrow)" />;
}

export default function RetentionRequirementsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rreq-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.store}>보관 대상 4가지 범주</text>
              {[
                { label: 'CDD 자료', sub: '실명확인·EDD·위험등급', x: 10, color: C.store },
                { label: '거래 내역', sub: '입출금·TX해시·상대방', x: 130, color: C.store },
                { label: 'SAR 사본', sub: '보고서·경보로그·조치', x: 250, color: C.red },
                { label: '내부 통제', sub: '정책·교육·감사 기록', x: 370, color: C.store },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 0.12 * i }}>
                  <DataBox x={item.x} y={30} w={100} h={44} label={item.label} sub={item.sub} color={item.color} />
                </motion.g>
              ))}
              {/* All → 5 years */}
              {[60, 180, 300, 420].map((x, i) => (
                <Arrow key={i} x1={x} y1={74} x2={240} y2={98} color={C.time} />
              ))}
              <ModuleBox x={155} y={100} w={170} h={36} label="최소 5년 이상 보관" sub="특금법 제5조의3" color={C.time} />
              {/* Timeline */}
              <rect x={40} y={152} width={400} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <motion.rect x={40} y={152} width={300} height={8} rx={4} fill={C.time} opacity={0.5}
                initial={{ width: 0 }} animate={{ width: 300 }} transition={{ duration: 0.8 }} />
              <text x={340} y={148} fontSize={8} fill={C.time} fontWeight={600}>5년</text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                수사 진행 중이면 수사 종료 시까지 연장. 실무 권고: 7~10년
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.secure}>보관 방법 5대 요건</text>
              {[
                { label: '전자적 보관', sub: 'DB + 스캔', x: 10 },
                { label: '암호화', sub: 'AES-256+', x: 105 },
                { label: '접근 통제', sub: 'RBAC + 로그', x: 200 },
                { label: '무결성', sub: 'WORM/해시체인', x: 295 },
                { label: '이중 백업', sub: '온+오프사이트', x: 390 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + 0.1 * i }}>
                  <ActionBox x={item.x} y={30} w={85} h={44} label={item.label} sub={item.sub} color={C.secure} />
                </motion.g>
              ))}
              {/* Converge to purpose */}
              {[52, 147, 242, 337, 432].map((x, i) => (
                <Arrow key={i} x1={x} y1={74} x2={240} y2={98} color={C.secure} />
              ))}
              <DataBox x={140} y={100} w={200} h={30} label="즉시 검색·제공 가능 상태" color={C.secure} />
              <AlertBox x={40} y={148} w={400} h={32} label='"보관하고 있지만 못 찾겠다" = 미보관' sub="FIU/수사기관 요청 시 즉시 제공 불가하면 동일 제재" color={C.red} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>SAR 사본 — 특별 접근 통제</text>
              <ModuleBox x={140} y={30} w={200} h={40} label="SAR 사본 저장소" sub="별도 격리 보관" color={C.red} />
              {/* Access allowed */}
              <Arrow x1={200} y1={70} x2={100} y2={92} color={C.store} />
              <Arrow x1={280} y1={70} x2={360} y2={92} color={C.store} />
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DataBox x={30} y={95} w={140} h={30} label="준법감시인 (접근)" color={C.store} />
                <DataBox x={290} y={95} w={150} h={30} label="AML 담당자 (접근)" color={C.store} />
              </motion.g>
              {/* Access denied */}
              <line x1={240} y1={70} x2={240} y2={92} stroke={C.warn} strokeWidth={0.7} strokeDasharray="3 2" />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={175} y={95} width={110} height={30} rx={5} fill={`${C.warn}08`} stroke={C.warn} strokeWidth={0.6} strokeDasharray="3 2" />
                <text x={230} y={114} textAnchor="middle" fontSize={8} fill={C.warn}>그 외 전원 차단</text>
              </motion.g>
              <AlertBox x={40} y={142} w={400} h={38} label="SAR 내용 유출 = Tipping-off" sub="CS팀·운영팀·일반 직원은 SAR 존재 자체를 모르는 것이 원칙" color={C.red} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
