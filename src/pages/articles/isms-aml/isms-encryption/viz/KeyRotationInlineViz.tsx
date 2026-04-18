import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  danger: '#ef4444',
  safe: '#10b981',
  warn: '#f59e0b',
  action: '#6366f1',
};

const STEPS = [
  {
    label: '키 회전 흐름 — 새 키 활성 → 기존 키 비활성 → 재암호화 → 폐기',
    body: '새 키를 생성하여 "활성(active)" 지정. 기존 키는 "비활성(inactive)". 신규 데이터는 새 키로 암호화, 기존 데이터는 배경 작업으로 재암호화 후 이전 키 폐기.',
  },
  {
    label: '봉투 암호화 — KEK가 DEK를 래핑, DEK가 데이터를 암호화',
    body: 'KEK(1~3년)가 DEK(90일~1년)를 래핑하는 2계층 구조. DEK 교체 시 데이터 전체 재암호화 불필요 — DEK만 새 KEK로 다시 래핑하면 됨. 대규모 데이터에서 회전 비용 최소화.',
  },
  {
    label: 'Exposure Window — 동일 키 장기 사용의 위험',
    body: '키가 유출되었으나 인지하지 못한 기간이 exposure window. 동일 키 장기 사용 시 이 기간이 길어져 피해 범위 확대. 주기적 회전으로 window를 제한. KMS가 전체 과정 자동화.',
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#kri-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function KeyRotationInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="kri-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* ── Step 0: 키 회전 흐름 ── */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.action}>자동 키 회전 6단계</text>

              {/* 6-step chain */}
              <ActionBox x={5} y={26} w={72} h={38} label="새 키 생성" color={C.action} />
              <Arrow x1={77} y1={45} x2={87} y2={45} color={C.action} />

              <StatusBox x={89} y={20} w={72} h={50} label="활성 지정" sub="active" color={C.safe} progress={1} />
              <Arrow x1={161} y1={45} x2={171} y2={45} color={C.warn} />

              <ActionBox x={173} y={26} w={75} h={38} label="기존 키 비활성" sub="inactive" color={C.warn} />
              <Arrow x1={248} y1={45} x2={258} y2={45} color={C.safe} />

              <ActionBox x={260} y={26} w={72} h={38} label="새 키 암호화" sub="신규 데이터" color={C.safe} />
              <Arrow x1={332} y1={45} x2={342} y2={45} color={C.safe} />

              <ActionBox x={344} y={26} w={60} h={38} label="재암호화" sub="배경 작업" color={C.safe} />
              <Arrow x1={404} y1={45} x2={414} y2={45} color={C.danger} />

              <AlertBox x={416} y={24} w={56} h={42} label="폐기" sub="이전 키" color={C.danger} />

              {/* 흐르는 진행 볼 */}
              <motion.circle r={3.5} fill={C.action} opacity={0.5}
                initial={{ cx: 41, cy: 22 }}
                animate={{ cx: 444, cy: 22 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

              {/* 구분선 */}
              <line x1={15} y1={84} x2={465} y2={84} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 상세: 신규 vs 기존 데이터 처리 */}
              <text x={140} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>신규 데이터</text>
              <text x={370} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>기존 데이터</text>

              <DataBox x={30} y={112} w={80} h={30} label="새 데이터" color={C.safe} />
              <Arrow x1={110} y1={127} x2={133} y2={127} color={C.safe} />
              <ActionBox x={135} y={110} w={80} h={34} label="새 키 암호화" color={C.safe} />
              <Arrow x1={215} y1={127} x2={235} y2={127} color={C.safe} />
              <StatusBox x={237} y={102} w={50} h={50} label="완료" color={C.safe} progress={1} />

              <DataBox x={300} y={112} w={80} h={30} label="기존 데이터" color={C.warn} />
              <Arrow x1={380} y1={127} x2={398} y2={127} color={C.warn} />
              <ActionBox x={400} y={110} w={70} h={34} label="이전 키 복호" sub="→ 새 키 암호" color={C.warn} />

              {/* KMS 자동화 */}
              <rect x={80} y={162} width={320} height={32} rx={6} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={240} y={178} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">KMS(Key Management Service)가 키 버전 관리 + 감사 로그 + 전체 과정 자동화</text>
              <text x={240} y={190} textAnchor="middle" fontSize={8} fill={C.action}>클라우드 KMS: AWS KMS, GCP Cloud KMS, Azure Key Vault</text>
            </motion.g>
          )}

          {/* ── Step 1: 봉투 암호화 ── */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.safe}>봉투 암호화 (Envelope Encryption)</text>

              {/* KEK */}
              <ModuleBox x={20} y={30} w={120} h={55} label="KEK" sub="키 암호화 키 (1~3년)" color={C.action} />

              {/* KEK → DEK 래핑 */}
              <Arrow x1={140} y1={57} x2={175} y2={57} color={C.action} />
              <rect x={146} y={46} width={28} height={14} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={160} y={56} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.action}>래핑</text>

              {/* DEK */}
              <ModuleBox x={177} y={30} w={130} h={55} label="DEK" sub="데이터 암호화 키 (90일~1년)" color={C.safe} />

              {/* DEK → 데이터 암호화 */}
              <Arrow x1={307} y1={57} x2={342} y2={57} color={C.safe} />
              <rect x={311} y={46} width={28} height={14} rx={3} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={325} y={56} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>암호화</text>

              <DataBox x={344} y={41} w={125} h={32} label="암호화된 데이터" color={C.safe} />

              {/* 구분선 */}
              <line x1={15} y1={100} x2={465} y2={100} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.warn}>DEK 교체 시 — 데이터 재암호화 불필요</text>

              {/* DEK 교체 과정 */}
              <DataBox x={20} y={128} w={90} h={30} label="기존 DEK" sub="만료" color={C.danger} />
              <Arrow x1={110} y1={143} x2={133} y2={143} color={C.danger} />

              <ActionBox x={135} y={126} w={95} h={34} label="새 DEK 생성" color={C.action} />
              <Arrow x1={230} y1={143} x2={253} y2={143} color={C.action} />

              <ActionBox x={255} y={126} w={100} h={34} label="새 KEK로 래핑" sub="DEK만 교체" color={C.action} />
              <Arrow x1={355} y1={143} x2={378} y2={143} color={C.safe} />

              <StatusBox x={380} y={118} w={90} h={50} label="교체 완료" sub="데이터 그대로" color={C.safe} progress={1} />

              {/* 이점 */}
              <rect x={60} y={178} width={360} height={24} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={240} y={194} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>TB급 데이터도 DEK 래핑만 교체 — 회전 비용 최소화</text>
            </motion.g>
          )}

          {/* ── Step 2: Exposure Window ── */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.danger}>Exposure Window — 유출 미인지 기간</text>

              {/* 장기 사용 시나리오 */}
              <text x={240} y={34} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">동일 키를 장기간 사용한 경우</text>

              {/* 타임라인 바 — 긴 exposure */}
              <rect x={30} y={44} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />
              <rect x={30} y={44} width={420} height={8} rx={4} fill={C.danger} opacity={0.3} />

              {/* 유출 시점 */}
              <line x1={120} y1={40} x2={120} y2={56} stroke={C.danger} strokeWidth={1.5} />
              <text x={120} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>유출 시점</text>
              <text x={120} y={78} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">(인지 못함)</text>

              {/* 발견 시점 */}
              <line x1={400} y1={40} x2={400} y2={56} stroke={C.warn} strokeWidth={1.5} />
              <text x={400} y={68} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>발견 시점</text>

              {/* exposure window 표시 */}
              <rect x={120} y={44} width={280} height={8} rx={0} fill={C.danger} opacity={0.5} />
              <text x={260} y={92} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>exposure window가 길다 = 피해 범위 넓다</text>

              {/* 구분선 */}
              <line x1={15} y1={102} x2={465} y2={102} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 주기적 회전 시나리오 */}
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">주기적 키 회전을 적용한 경우</text>

              {/* 타임라인 바 — 짧은 세그먼트 */}
              <rect x={30} y={130} width={420} height={8} rx={4} fill="var(--border)" opacity={0.3} />

              {/* 회전 구간들 */}
              <rect x={30} y={130} width={100} height={8} rx={0} fill={C.safe} opacity={0.4} />
              <rect x={135} y={130} width={100} height={8} rx={0} fill={C.safe} opacity={0.4} />
              <rect x={240} y={130} width={100} height={8} rx={0} fill={C.safe} opacity={0.4} />
              <rect x={345} y={130} width={105} height={8} rx={0} fill={C.safe} opacity={0.4} />

              {/* 회전 시점 표시 */}
              <line x1={130} y1={126} x2={130} y2={142} stroke={C.action} strokeWidth={1} />
              <line x1={235} y1={126} x2={235} y2={142} stroke={C.action} strokeWidth={1} />
              <line x1={340} y1={126} x2={340} y2={142} stroke={C.action} strokeWidth={1} />

              <text x={130} y={152} textAnchor="middle" fontSize={7} fill={C.action}>교체</text>
              <text x={235} y={152} textAnchor="middle" fontSize={7} fill={C.action}>교체</text>
              <text x={340} y={152} textAnchor="middle" fontSize={7} fill={C.action}>교체</text>

              {/* 짧은 exposure window */}
              <line x1={190} y1={126} x2={190} y2={142} stroke={C.danger} strokeWidth={1.5} />
              <text x={190} y={152} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.danger}>유출</text>

              <rect x={190} y={130} width={45} height={8} rx={0} fill={C.danger} opacity={0.5} />

              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>유출 발생해도 다음 회전에서 키 무효화 — window 제한</text>

              {/* KMS 자동화 */}
              <rect x={80} y={182} width={320} height={24} rx={6} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={240} y={198} textAnchor="middle" fontSize={9} fill={C.action}>KMS 자동 회전: 주기 설정 → 키 생성·전환·폐기 전 과정 자동화</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
