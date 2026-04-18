import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  primary: '#6366f1',
  action: '#f59e0b',
  safe: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '화이트리스트 방화벽 규칙',
    body: '기본 규칙: DENY ALL. 허용 규칙을 출발지 IP + 목적지 IP + 포트 + 프로토콜 조합으로 개별 정의.\nANY 규칙 금지. 블랙리스트(알려진 위협만 차단)는 새로운 공격을 막을 수 없다.',
  },
  {
    label: '방화벽 규칙 변경관리와 정기 검토',
    body: '추가/변경: 작업신청서 → 정보보호팀 검토 → 승인 → 적용 → 사후 확인.\n분기별 전수 검토: 폐기 서버/종료 프로젝트 관련 규칙 삭제. 누적될수록 보안 취약점 증가.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#fw-rule-arr)" />;
}

export default function FirewallRulesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fw-rule-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>화이트리스트: DENY ALL + 허용 목록</text>

              {/* 기본 거부 배경 */}
              <rect x={10} y={28} width={460} height={80} rx={8} fill={`${C.danger}06`} stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={455} y={42} textAnchor="end" fontSize={8} fontWeight={600} fill={C.danger}>DENY ALL</text>

              {/* 허용 규칙 예시 */}
              <rect x={20} y={40} width={135} height={58} rx={4} fill="var(--card)" stroke={C.safe} strokeWidth={0.8} />
              <text x={87} y={54} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>규칙 #1</text>
              <text x={87} y={66} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">DMZ WAS → DB:3306</text>
              <text x={87} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">TCP, 서비스망 IP만</text>
              <text x={87} y={90} textAnchor="middle" fontSize={7.5} fill={C.safe}>ALLOW</text>

              <rect x={170} y={40} width={135} height={58} rx={4} fill="var(--card)" stroke={C.safe} strokeWidth={0.8} />
              <text x={237} y={54} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>규칙 #2</text>
              <text x={237} y={66} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">점프서버 → 서버:22</text>
              <text x={237} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">TCP, 관리 IP만</text>
              <text x={237} y={90} textAnchor="middle" fontSize={7.5} fill={C.safe}>ALLOW</text>

              <rect x={320} y={40} width={135} height={58} rx={4} fill="var(--card)" stroke={C.danger} strokeWidth={0.8} strokeDasharray="3 2" />
              <text x={387} y={54} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>규칙 #3 (위반)</text>
              <text x={387} y={66} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">ANY → ANY:ANY</text>
              <text x={387} y={78} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">전체 허용</text>
              <text x={387} y={90} textAnchor="middle" fontSize={7.5} fill={C.danger}>ANY 규칙 금지!</text>

              <rect x={10} y={120} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 화이트리스트 vs 블랙리스트 */}
              <rect x={20} y={130} width={210} height={58} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={125} y={146} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>화이트리스트 (권장)</text>
              <text x={125} y={160} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">허용된 것만 통과</text>
              <text x={125} y={174} textAnchor="middle" fontSize={7.5} fill={C.safe}>미지의 공격도 차단</text>

              <rect x={250} y={130} width={210} height={58} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={355} y={146} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>블랙리스트 (부적합)</text>
              <text x={355} y={160} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">알려진 위협만 차단</text>
              <text x={355} y={174} textAnchor="middle" fontSize={7.5} fill={C.danger}>새로운 공격에 무방비</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.action}>방화벽 규칙 변경관리 절차</text>

              {/* 변경 절차 흐름 */}
              <DataBox x={5} y={32} w={72} h={26} label="작업 신청" color={C.primary} />
              <Arrow x1={77} y1={45} x2={93} y2={45} color={C.action} />

              <ActionBox x={95} y={30} w={80} h={30} label="정보보호팀" sub="보안 검토" color={C.action} />
              <Arrow x1={175} y1={45} x2={191} y2={45} color={C.action} />

              <ActionBox x={193} y={30} w={60} h={30} label="승인" sub="" color={C.safe} />
              <Arrow x1={253} y1={45} x2={269} y2={45} color={C.safe} />

              <ActionBox x={271} y={30} w={60} h={30} label="적용" sub="" color={C.safe} />
              <Arrow x1={331} y1={45} x2={347} y2={45} color={C.safe} />

              <StatusBox x={349} y={30} w={80} h={30} label="사후 확인" sub="" color={C.safe} progress={1} />

              <rect x={10} y={72} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 분기별 검토 */}
              <text x={240} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.primary}>분기별 전수 검토</text>

              {/* 규칙 누적 → 정리 */}
              <rect x={20} y={100} width={100} height={40} rx={4} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={70} y={116} textAnchor="middle" fontSize={8} fill={C.safe}>활성 규칙</text>
              <text x={70} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">현재 사용 중</text>

              <rect x={135} y={100} width={100} height={40} rx={4} fill="var(--card)" stroke={C.action} strokeWidth={0.5} />
              <text x={185} y={116} textAnchor="middle" fontSize={8} fill={C.action}>검토 대상</text>
              <text x={185} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">사유 재확인</text>

              <rect x={250} y={100} width={100} height={40} rx={4} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={300} y={116} textAnchor="middle" fontSize={8} fill={C.danger}>폐기 대상</text>
              <text x={300} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">종료 프로젝트</text>

              <Arrow x1={300} y1={140} x2={300} y2={155} color={C.danger} />
              <AlertBox x={255} y={155} w={90} h={24} label="즉시 삭제" sub="" color={C.danger} />

              <rect x={365} y={100} width={105} height={80} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={417} y={118} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.primary}>누적 위험</text>
              <text x={417} y={134} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">규칙 수 증가</text>
              <text x={417} y={148} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">→ 관리 복잡도 ↑</text>
              <text x={417} y={162} textAnchor="middle" fontSize={7.5} fill={C.danger}>→ 보안 취약점 ↑</text>
              <text x={417} y={176} textAnchor="middle" fontSize={7.5} fill={C.safe}>정기 정리 필수</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
