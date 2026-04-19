import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';

const C = {
  attack: '#ef4444',
  gen: '#6366f1',
  fix: '#10b981',
};

const STEPS = [
  { label: 'SEVered (2018) — NPT 재매핑', body: 'Hypervisor가 nested page table을 조작해 암호문을 다른 VM으로 재매핑' },
  { label: '레지스터 보호 필요 인식 → SEV-ES', body: 'VMSA 평문 노출이 root cause로 드러남' },
  { label: 'CrossLine + Cipherleaks (2021)', body: 'VMSA 재활용 + 동일 키 누적 ciphertext 패턴 분석' },
  { label: '메모리 무결성·replay 방어 필수 → SEV-SNP', body: 'RMP, VMPL, version nonce, 강한 attestation 도입' },
];

const NODES = [
  { x: 10, y: 30, label: 'SEVered', sub: '2018', kind: 'attack' },
  { x: 10, y: 110, label: 'CrossLine', sub: '2021', kind: 'attack' },
  { x: 10, y: 160, label: 'Cipherleaks', sub: '2021', kind: 'attack' },
  { x: 180, y: 30, label: 'SEV 1.0', sub: '평문 VMSA', kind: 'gen' },
  { x: 180, y: 110, label: 'SEV-ES', sub: '암호화 VMSA', kind: 'gen' },
  { x: 350, y: 30, label: 'SEV-ES', sub: '레지스터 보호', kind: 'fix' },
  { x: 350, y: 130, label: 'SEV-SNP', sub: 'RMP·VMPL·nonce', kind: 'fix' },
];

export default function AcademicAttacksViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const showSEVered = step >= 0;
        const showES = step >= 1;
        const showCross = step >= 2;
        const showSNP = step >= 3;
        return (
          <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={10} y={14} fontSize={9} fontWeight={700} fill={C.attack}>학술 공격</text>
            <text x={180} y={14} fontSize={9} fontWeight={700} fill={C.gen}>취약 세대</text>
            <text x={350} y={14} fontSize={9} fontWeight={700} fill={C.fix}>대응 세대</text>

            {/* SEVered → SEV 1.0 → SEV-ES */}
            <motion.g animate={{ opacity: showSEVered ? 1 : 0.15 }}>
              <AlertBox x={10} y={30} w={140} h={50} label="SEVered" sub="NPT 재매핑 (2018)" color={C.attack} />
            </motion.g>
            <motion.g animate={{ opacity: showSEVered ? 0.7 : 0.15 }}>
              <ModuleBox x={180} y={30} w={140} h={50} label="SEV 1.0" sub="평문 VMSA" color={C.gen} />
            </motion.g>
            <motion.g animate={{ opacity: showES ? 1 : 0.15 }}>
              <ActionBox x={350} y={30} w={120} h={50} label="SEV-ES" sub="레지스터 암호화" color={C.fix} />
            </motion.g>

            {showSEVered && (
              <motion.line x1={150} y1={55} x2={180} y2={55} stroke={C.attack} strokeWidth={1.2}
                markerEnd="url(#arrA)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            )}
            {showES && (
              <motion.line x1={320} y1={55} x2={350} y2={55} stroke={C.fix} strokeWidth={1.2}
                markerEnd="url(#arrF)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
            )}

            {/* CrossLine + Cipherleaks → SEV-ES → SEV-SNP */}
            <motion.g animate={{ opacity: showCross ? 1 : 0.15 }}>
              <AlertBox x={10} y={100} w={140} h={42} label="CrossLine" sub="VMSA 재활용" color={C.attack} />
              <AlertBox x={10} y={150} w={140} h={42} label="Cipherleaks" sub="ciphertext 패턴" color={C.attack} />
            </motion.g>
            <motion.g animate={{ opacity: showCross ? 0.7 : 0.15 }}>
              <ModuleBox x={180} y={120} w={140} h={50} label="SEV-ES" sub="무결성 없음" color={C.gen} />
            </motion.g>
            <motion.g animate={{ opacity: showSNP ? 1 : 0.15 }}>
              <ActionBox x={350} y={120} w={120} h={50} label="SEV-SNP" sub="RMP·VMPL·nonce" color={C.fix} />
            </motion.g>

            {showCross && (
              <>
                <motion.line x1={150} y1={121} x2={180} y2={140} stroke={C.attack} strokeWidth={1.2}
                  markerEnd="url(#arrA)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                <motion.line x1={150} y1={171} x2={180} y2={150} stroke={C.attack} strokeWidth={1.2}
                  markerEnd="url(#arrA)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              </>
            )}
            {showSNP && (
              <motion.line x1={320} y1={145} x2={350} y2={145} stroke={C.fix} strokeWidth={1.2}
                markerEnd="url(#arrF)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
            )}

            <defs>
              <marker id="arrA" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={C.attack} />
              </marker>
              <marker id="arrF" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill={C.fix} />
              </marker>
            </defs>

            <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              학술 공격 → 다음 세대 설계의 직접 동인
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
