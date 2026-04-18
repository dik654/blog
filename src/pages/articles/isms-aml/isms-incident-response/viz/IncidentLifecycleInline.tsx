import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b', gray: '#6b7280' };

const STEPS = [
  {
    label: '사고 유형 → CIA 침해 매핑',
    body: '해킹은 기밀성, 랜섬웨어는 가용성, 내부 유출은 기밀성을 주로 침해. 유형에 따라 탐지·대응 경로가 달라진다.',
  },
  {
    label: '외부 공격 vs 내부 위협 탐지 차이',
    body: '외부 공격은 IDS/IPS 시그니처로 탐지 가능하나, 내부 위협은 행위 분석(UBA)이 핵심. 기술적 방어만으로는 내부자를 막을 수 없다.',
  },
  {
    label: '대응 5단계 흐름',
    body: '준비 → 탐지/분석 → 봉쇄 → 근절/복구 → 사후활동. NIST SP 800-61 기반이며, 각 단계를 건너뛰면 재발 위험이 높아진다.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-lc-arrow)" />;
}

export default function IncidentLifecycleInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-lc-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={180} y={8} w={120} h={28} label="CIA Triad" sub="기밀·무결·가용" color={C.red} />
              <Arrow x1={200} y1={38} x2={60} y2={60} color={C.red} />
              <Arrow x1={240} y1={38} x2={240} y2={60} color={C.amber} />
              <Arrow x1={280} y1={38} x2={410} y2={60} color={C.blue} />
              <ActionBox x={10} y={62} w={100} h={32} label="기밀성 침해" sub="Confidentiality" color={C.red} />
              <ActionBox x={190} y={62} w={100} h={32} label="무결성 침해" sub="Integrity" color={C.amber} />
              <ActionBox x={370} y={62} w={100} h={32} label="가용성 침해" sub="Availability" color={C.blue} />
              <Arrow x1={60} y1={96} x2={60} y2={118} color={C.red} />
              <Arrow x1={240} y1={96} x2={240} y2={118} color={C.amber} />
              <Arrow x1={420} y1={96} x2={420} y2={118} color={C.blue} />
              <rect x={10} y={120} width={100} height={24} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={60} y={136} textAnchor="middle" fontSize={9} fill="var(--foreground)">해킹 / 내부유출</text>
              <rect x={190} y={120} width={100} height={24} rx={4} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={240} y={136} textAnchor="middle" fontSize={9} fill="var(--foreground)">데이터 변조</text>
              <rect x={370} y={120} width={100} height={24} rx={4} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={420} y={136} textAnchor="middle" fontSize={9} fill="var(--foreground)">랜섬웨어 / DDoS</text>
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">유형별 탐지 방법과 대응 절차가 다르다</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={20} w={180} h={36} label="외부 공격" sub="해킹·랜섬웨어·DDoS·피싱" color={C.red} />
              <ActionBox x={280} y={20} w={180} h={36} label="내부 위협" sub="내부자 유출" color={C.amber} />
              <Arrow x1={110} y1={58} x2={110} y2={80} color={C.red} />
              <Arrow x1={370} y1={58} x2={370} y2={80} color={C.amber} />
              <StatusBox x={30} y={82} w={160} h={36} label="IDS/IPS 시그니처" sub="알려진 공격 패턴 매칭" color={C.green} progress={0.85} />
              <StatusBox x={290} y={82} w={160} h={36} label="UBA 행위 분석" sub="정상 패턴 이탈 감지" color={C.amber} progress={0.45} />
              <Arrow x1={110} y1={120} x2={110} y2={140} color={C.green} />
              <Arrow x1={370} y1={120} x2={370} y2={140} color={C.amber} />
              <rect x={30} y={142} width={160} height={22} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={110} y={157} textAnchor="middle" fontSize={9} fill="var(--foreground)">높은 탐지율 / 낮은 오탐</text>
              <rect x={290} y={142} width={160} height={22} rx={4} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={370} y={157} textAnchor="middle" fontSize={9} fill="var(--foreground)">탐지 어려움 / 보안교육 병행</text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">기술적 방어만으로는 내부자 위협을 완전히 차단할 수 없다</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StatusBox x={10} y={30} w={80} h={38} label="1. 준비" sub="절차·도구" color={C.blue} progress={0.2} />
              <Arrow x1={92} y1={49} x2={106} y2={49} color={C.blue} />
              <StatusBox x={108} y={30} w={80} h={38} label="2. 탐지" sub="식별·판별" color={C.amber} progress={0.4} />
              <Arrow x1={190} y1={49} x2={204} y2={49} color={C.amber} />
              <StatusBox x={206} y={30} w={80} h={38} label="3. 봉쇄" sub="격리·차단" color={C.red} progress={0.6} />
              <Arrow x1={288} y1={49} x2={302} y2={49} color={C.red} />
              <StatusBox x={304} y={30} w={80} h={38} label="4. 근절" sub="제거·패치" color={C.green} progress={0.8} />
              <Arrow x1={386} y1={49} x2={400} y2={49} color={C.green} />
              <StatusBox x={402} y={30} w={70} h={38} label="5. 사후" sub="보고·개선" color={C.blue} progress={1} />
              <path d="M 437 70 C 437 140, 240 155, 50 135 L 50 70" fill="none" stroke={C.gray} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#ir-lc-arrow)" />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">단계를 건너뛰면 재발 위험 증가</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
