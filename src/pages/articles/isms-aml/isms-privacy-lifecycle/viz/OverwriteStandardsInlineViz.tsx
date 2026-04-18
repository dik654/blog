import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  dod: '#6366f1',
  gutmann: '#f59e0b',
  nist: '#10b981',
  ssd: '#ef4444',
};

const STEPS = [
  { label: '덮어쓰기 3가지 표준 비교', body: 'DoD 5220.22-M: 3회(0x00→0xFF→랜덤). Gutmann: 35회(자기 잔류 제거, 실무 비현실). NIST SP 800-88: 매체별 Clear/Purge/Destroy 3단계(가장 널리 참조).' },
  { label: 'DB 레코드 파기 3가지 방법', body: 'DELETE+VACUUM(빈 공간 덮어쓰기), Crypto Erase(암호화 키 폐기, 클라우드 최적), 비식별화(재식별 불가 시 파기 인정). 매체·환경에 따라 적합한 방법 선택.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#os-inline-arrow)" />;
}

export default function OverwriteStandardsInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="os-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">덮어쓰기 표준 비교</text>

              {/* DoD */}
              <ModuleBox x={15} y={28} w={140} h={50} label="DoD 5220.22-M" sub="미국 국방부 표준" color={C.dod} />
              <DataBox x={20} y={86} w={55} h={22} label="0x00" color={C.dod} />
              <Arrow x1={75} y1={97} x2={82} y2={97} color={C.dod} />
              <DataBox x={84} y={86} w={55} h={22} label="0xFF" color={C.dod} />
              <text x={85} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">3회, HDD 적합</text>

              {/* Gutmann */}
              <ModuleBox x={170} y={28} w={140} h={50} label="Gutmann" sub="35회 덮어쓰기" color={C.gutmann} />
              <text x={240} y={92} textAnchor="middle" fontSize={8} fill={C.gutmann}>다양한 비트 패턴</text>
              <text x={240} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자기 잔류 제거</text>
              <text x={240} y={118} textAnchor="middle" fontSize={8} fill={C.ssd}>실무 비현실적</text>

              {/* NIST */}
              <ModuleBox x={325} y={28} w={140} h={50} label="NIST SP 800-88" sub="매체별 3단계" color={C.nist} />
              <DataBox x={330} y={86} w={55} h={22} label="Clear" color={C.nist} />
              <DataBox x={392} y={86} w={60} h={22} label="Purge" color={C.nist} />
              <text x={395} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가장 널리 참조</text>

              <line x1={15} y1={135} x2={465} y2={135} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={80} y={142} w={320} h={36} label="SSD: 덮어쓰기 불완전 (웨어 레벨링)" sub="Secure Erase 또는 Crypto Erase 필요" color={C.ssd} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                HDD → DoD/NIST Clear 적합, SSD → Crypto Erase/Secure Erase 필수
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">DB 레코드 파기 3가지 방법</text>

              {/* 방법 1 */}
              <ModuleBox x={15} y={30} w={140} h={55} label="DELETE + VACUUM" sub="빈 공간 덮어쓰기" color={C.dod} />
              <text x={85} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PostgreSQL: VACUUM FULL</text>
              <text x={85} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">MySQL: OPTIMIZE TABLE</text>

              {/* 방법 2 */}
              <ModuleBox x={170} y={30} w={140} h={55} label="Crypto Erase" sub="암호화 키 폐기" color={C.nist} />
              <text x={240} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터 잔류 but 복호화 불가</text>
              <StatusBox x={175} y={112} w={130} h={22} label="클라우드 최적" sub="" color={C.nist} />

              {/* 방법 3 */}
              <ModuleBox x={325} y={30} w={140} h={55} label="비식별화" sub="재식별 불가 변환" color={C.gutmann} />
              <text x={395} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가명처리, 총계처리, 삭제</text>
              <text x={395} y={110} textAnchor="middle" fontSize={8} fill={C.ssd}>재식별 불가 시만 파기 인정</text>

              <line x1={15} y1={148} x2={465} y2={148} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={168} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
                환경별 선택: 온프레미스 → DELETE+VACUUM, 클라우드 → Crypto Erase
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                통계 목적 보존 → 비식별화 (단, 재식별 가능성 검증 필수)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
