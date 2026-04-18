import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  dev: '#6366f1',
  svc: '#10b981',
  admin: '#f59e0b',
  block: '#ef4444',
};

const STEPS = [
  { label: '3망 분리: 개발/서비스/관리', body: '개발망(소스코드+테스트), 서비스망(프로덕션), 관리망(DB+관리도구). 각 망 사이 방화벽+ACL. 개발망에서 서비스망 DB 직접 접근 차단.' },
  { label: 'DB 접근제어 3차원 통제', body: '세션 통제(접근제어SW 경유 필수), 쿼리 통제(DROP/TRUNCATE 차단), IP 통제(관리망 내부 IP만). PETRA, Chakra 등 전문 SW.' },
  { label: 'DB 계정 분리 체계', body: '서비스 계정(readWrite만), 관리자 계정(기간 한정), 백업 계정(SELECT만), 슈퍼관리자(비상시만). 만능 계정 금지.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ns-arrow)" />;
}

export default function NetworkSegmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ns-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">3망 분리 구조</text>

              <ModuleBox x={20} y={35} w={120} h={50} label="개발망" sub="소스코드 + 테스트" color={C.dev} />

              {/* Firewall */}
              <rect x={155} y={35} width={8} height={50} rx={2} fill={C.block} opacity={0.3} />
              <text x={159} y={100} textAnchor="middle" fontSize={7} fill={C.block}>FW</text>

              <ModuleBox x={180} y={35} w={120} h={50} label="서비스망" sub="프로덕션 환경" color={C.svc} />

              <rect x={315} y={35} width={8} height={50} rx={2} fill={C.block} opacity={0.3} />
              <text x={319} y={100} textAnchor="middle" fontSize={7} fill={C.block}>FW</text>

              <ModuleBox x={340} y={35} w={120} h={50} label="관리망" sub="DB + 관리 도구" color={C.admin} />

              {/* Blocked path */}
              <line x1={140} y1={60} x2={155} y2={60} stroke={C.block} strokeWidth={1} strokeDasharray="3 3" />
              <text x={148} y={55} textAnchor="middle" fontSize={14} fill={C.block}>{'X'}</text>

              <text x={240} y={125} textAnchor="middle" fontSize={9} fill={C.block}>개발망 → 서비스망 DB 직접 접근 차단</text>

              <DataBox x={30} y={138} w={180} h={28} label="개발 침해 → 프로덕션 도달 불가" color={C.dev} />
              <DataBox x={270} y={138} w={180} h={28} label="클라우드: VPC 분리 + Security Group" color={C.svc} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">각 망 사이 ACL(Access Control List)로 허용 트래픽만 통과</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">DB 접근제어 3차원 통제</text>

              <ActionBox x={20} y={35} w={130} h={42} label="세션 통제" sub="접근제어SW 경유 필수" color={C.dev} />
              <ActionBox x={175} y={35} w={130} h={42} label="쿼리 통제" sub="DROP/TRUNCATE 차단" color={C.svc} />
              <ActionBox x={330} y={35} w={130} h={42} label="IP 통제" sub="관리망 IP만 허용" color={C.admin} />

              <Arrow x1={85} y1={77} x2={85} y2={98} color={C.dev} />
              <Arrow x1={240} y1={77} x2={240} y2={98} color={C.svc} />
              <Arrow x1={395} y1={77} x2={395} y2={98} color={C.admin} />

              <DataBox x={20} y={100} w={130} h={28} label="직접 접속 차단" color={C.dev} />
              <DataBox x={175} y={100} w={130} h={28} label="대량 SELECT 탐지" color={C.svc} />
              <DataBox x={330} y={100} w={130} h={28} label="VPN 경유 후 접속" color={C.admin} />

              <rect x={80} y={148} width={320} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">모든 세션·쿼리·접속 자동 기록</text>
              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">PETRA / Chakra 등 전문 접근제어 SW 사용</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">DB 계정 분리 체계</text>

              <DataBox x={20} y={32} w={200} h={30} label="서비스 계정: readWrite만" color={C.svc} />
              <text x={230} y={44} fontSize={8} fill="var(--muted-foreground)">앱 서버 전용. DDL 권한 없음. 스키마 변경 불가.</text>

              <DataBox x={20} y={72} w={200} h={30} label="관리자 계정: 기간 한정 발급" color={C.admin} />
              <text x={230} y={84} fontSize={8} fill="var(--muted-foreground)">DBA 유지보수용. 작업 완료 후 즉시 비활성화.</text>

              <DataBox x={20} y={112} w={200} h={30} label="백업 계정: SELECT 전용" color={C.dev} />
              <text x={230} y={124} fontSize={8} fill="var(--muted-foreground)">읽기 전용. 침해되어도 데이터 변경 위험 없음.</text>

              <AlertBox x={20} y={152} w={200} h={36} label="슈퍼관리자: 비상시만" sub="CISO 사전 통보 필수" color={C.block} />
              <text x={230} y={164} fontSize={8} fill="var(--muted-foreground)">팀장급 이상. 세션 내 모든 쿼리 별도 감사 로그.</text>

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill={C.block}>만능 계정(하나로 모든 작업) = 보안상 가장 위험한 구조</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
