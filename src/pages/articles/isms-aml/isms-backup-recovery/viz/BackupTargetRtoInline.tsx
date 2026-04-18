import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '백업 대상 3분류: 정보·구성·로그',
    body: '정보자원(DB·앱·방화벽)은 핵심 자산 → 최고 빈도. 구성정보(OS·네트워크 설정)는 환경 복원 필수. 로그정보는 사고 타임라인·감사 증거.',
  },
  {
    label: 'RTO와 RPO: 복구 시간 목표 vs 데이터 손실 허용',
    body: 'RTO가 짧을수록 고가용성 인프라 필요, RPO가 0에 가까울수록 실시간 복제 필요. BIA로 서비스별 차등 설정.',
  },
  {
    label: '3-2-1 규칙 + 백업 유형',
    body: '3개 복사본, 2가지 매체, 1개 오프사이트. 전체백업(복원 단순) + 증분(공간 효율) + 차등(복원 편의)을 조합.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#br-bt-arrow)" />;
}

export default function BackupTargetRtoInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="br-bt-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={5} w={160} h={26} label="백업 대상 3분류" color={C.blue} />
              <Arrow x1={200} y1={33} x2={70} y2={55} color={C.blue} />
              <Arrow x1={240} y1={33} x2={240} y2={55} color={C.blue} />
              <Arrow x1={280} y1={33} x2={410} y2={55} color={C.blue} />

              <DataBox x={10} y={56} w={120} h={38} label="정보자원" sub="DB·앱 바이너리·방화벽" color={C.red} />
              <DataBox x={180} y={56} w={120} h={38} label="구성정보" sub="OS·네트워크·크론탭" color={C.amber} />
              <DataBox x={350} y={56} w={120} h={38} label="로그정보" sub="접속·변경·관리 이력" color={C.green} />

              <StatusBox x={10} y={108} w={120} h={28} label="백업 빈도" sub="매일 (최고)" color={C.red} progress={1} />
              <StatusBox x={180} y={108} w={120} h={28} label="백업 빈도" sub="분기별" color={C.amber} progress={0.4} />
              <StatusBox x={350} y={108} w={120} h={28} label="백업 빈도" sub="매일 증분" color={C.green} progress={0.7} />

              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">DB 손실은 복구 불가 → 가장 높은 빈도 적용</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* timeline illustration */}
              <line x1={40} y1={60} x2={440} y2={60} stroke="var(--border)" strokeWidth={1} />
              <text x={40} y={50} fontSize={9} fill="var(--muted-foreground)">사고 발생</text>
              <circle cx={40} cy={60} r={4} fill={C.red} />

              {/* RPO */}
              <line x1={40} y1={58} x2={40} y2={30} stroke={C.amber} strokeWidth={0.8} strokeDasharray="3 2" />
              <line x1={180} y1={58} x2={180} y2={30} stroke={C.amber} strokeWidth={0.8} strokeDasharray="3 2" />
              <line x1={40} y1={30} x2={180} y2={30} stroke={C.amber} strokeWidth={1.5} />
              <text x={110} y={24} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.amber}>RPO</text>
              <text x={110} y={44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터 손실 허용</text>

              {/* RTO */}
              <line x1={40} y1={62} x2={40} y2={88} stroke={C.blue} strokeWidth={0.8} strokeDasharray="3 2" />
              <line x1={300} y1={62} x2={300} y2={88} stroke={C.blue} strokeWidth={0.8} strokeDasharray="3 2" />
              <line x1={40} y1={88} x2={300} y2={88} stroke={C.blue} strokeWidth={1.5} />
              <text x={170} y={84} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.blue}>RTO</text>
              <text x={170} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">복구 시간 목표</text>
              <text x={300} y={50} fontSize={9} fill={C.green}>서비스 재개</text>
              <circle cx={300} cy={60} r={4} fill={C.green} />

              {/* examples */}
              <rect x={40} y={120} width={190} height={36} rx={5} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
              <text x={135} y={136} textAnchor="middle" fontSize={9} fill="var(--foreground)">핵심 거래: RTO 1h / RPO 15m</text>
              <text x={135} y={149} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">고가용성 필수</text>
              <rect x={250} y={120} width={190} height={36} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={345} y={136} textAnchor="middle" fontSize={9} fill="var(--foreground)">내부 관리: RTO 24h / RPO 4h</text>
              <text x={345} y={149} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비용 절감 가능</text>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">BIA(업무 영향 분석)로 서비스별 차등 설정</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 3-2-1 */}
              <ModuleBox x={10} y={10} w={70} h={36} label="3" sub="복사본" color={C.blue} />
              <ModuleBox x={90} y={10} w={70} h={36} label="2" sub="매체 종류" color={C.amber} />
              <ModuleBox x={170} y={10} w={70} h={36} label="1" sub="오프사이트" color={C.green} />

              {/* backup types */}
              <ActionBox x={280} y={10} w={180} h={26} label="백업 유형 조합" color={C.blue} />
              <Arrow x1={310} y1={38} x2={310} y2={55} color={C.blue} />
              <Arrow x1={370} y1={38} x2={370} y2={55} color={C.amber} />
              <Arrow x1={430} y1={38} x2={430} y2={55} color={C.green} />

              <DataBox x={270} y={56} w={80} h={32} label="전체백업" sub="Full" color={C.blue} />
              <DataBox x={330} y={94} w={80} h={32} label="증분백업" sub="Incremental" color={C.amber} />
              <DataBox x={390} y={56} w={80} h={32} label="차등백업" sub="Differential" color={C.green} />

              {/* link annotation */}
              <rect x={10} y={60} width={230} height={42} rx={5} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={125} y={76} textAnchor="middle" fontSize={9} fill="var(--foreground)">원본 1 + 백업 2 = 3 복사본</text>
              <text x={125} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">클라우드 + 외장HDD / 별도 도시에 1개</text>

              <rect x={10} y={115} width={450} height={34} rx={5} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
              <text x={235} y={131} textAnchor="middle" fontSize={9} fill="var(--foreground)">주 1회 전체 + 매일 증분(또는 차등) = 공간 효율 + 복원 편의 균형</text>
              <text x={235} y={143} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증분 체인이 길면 중간 손상 시 전체 복원 불가 위험</text>

              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">3-2-1 충족 시 단일 장애점(SPOF) 제거</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
