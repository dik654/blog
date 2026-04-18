import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  session: '#6366f1',
  query: '#f59e0b',
  ip: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: '3중 통제: 세션 + 쿼리 + IP 결합',
    body: '허용된 IP에서(IP 축) → 본인 인증(세션 축) → 허가된 쿼리만 실행(쿼리 축).\n3축 모두 동시 만족해야 쿼리가 DB에 도달. 하나의 축만 통제하면 우회 가능.',
  },
  {
    label: 'DB 계정 분리 — 용도별 최소 권한',
    body: '서비스 계정(readWrite, DELETE 미부여) / 관리자(DDL, 점프서버만) / 백업(읽기 전용).\n"만능 계정" 하나로 모든 작업 수행 → 사고 시 피해 범위 무한대.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#tc-viz-arr)" />;
}

export default function TripleControlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tc-viz-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.session}>3중 통제 흐름</text>

              {/* 3축 게이트 */}
              <DataBox x={10} y={35} w={70} h={28} label="요청자" color={C.session} />
              <Arrow x1={80} y1={49} x2={108} y2={49} color={C.ip} />

              <ActionBox x={110} y={30} w={90} h={38} label="IP 검증" sub="허용 IP 그룹?" color={C.ip} />
              <Arrow x1={200} y1={49} x2={218} y2={49} color={C.session} />

              <ActionBox x={220} y={30} w={90} h={38} label="세션 인증" sub="계정+OTP?" color={C.session} />
              <Arrow x1={310} y1={49} x2={328} y2={49} color={C.query} />

              <ActionBox x={330} y={30} w={90} h={38} label="쿼리 필터" sub="허가된 SQL?" color={C.query} />
              <Arrow x1={420} y1={49} x2={438} y2={49} color={C.ip} />

              <StatusBox x={440} y={33} w={36} h={32} label="DB" sub="" color={C.ip} progress={1} />

              {/* 축별 우회 시나리오 */}
              <rect x={10} y={80} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>단일 축만 통제 시 우회</text>

              <AlertBox x={10} y={106} w={145} h={48} label="IP만 통제" sub="허용 IP에서 비인가자가 DB 접속 가능" color={C.danger} />
              <AlertBox x={168} y={106} w={145} h={48} label="세션만 통제" sub="인가 사용자가 권한 밖 쿼리 실행 가능" color={C.danger} />
              <AlertBox x={326} y={106} w={145} h={48} label="쿼리만 통제" sub="누가 실행했는지 특정 불가" color={C.danger} />

              <rect x={80} y={168} width={320} height={32} rx={6} fill="var(--card)" stroke={C.ip} strokeWidth={0.5} />
              <text x={240} y={188} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ip}>3축 동시 만족 시에만 쿼리가 DB에 도달</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.query}>DB 계정 분리: 용도별 최소 권한</text>

              {/* 5개 계정 */}
              <ActionBox x={10} y={30} w={85} h={36} label="서비스 계정" sub="R/W, no DELETE" color={C.ip} />
              <ActionBox x={105} y={30} w={85} h={36} label="관리자 계정" sub="DDL 포함" color={C.query} />
              <ActionBox x={200} y={30} w={85} h={36} label="백업 계정" sub="SELECT only" color={C.session} />
              <ActionBox x={295} y={30} w={85} h={36} label="로그 계정" sub="로그 테이블만" color={C.session} />
              <ActionBox x={390} y={30} w={80} h={36} label="비상 계정" sub="ALL, 평소 OFF" color={C.danger} />

              {/* 허용 IP */}
              <text x={52} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">WAS IP만</text>
              <text x={147} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">점프서버만</text>
              <text x={242} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">백업서버만</text>
              <text x={337} y={80} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">로그수집만</text>
              <text x={430} y={80} textAnchor="middle" fontSize={7.5} fill={C.danger}>빈 그룹</text>

              <rect x={10} y={90} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* DELETE 미부여 이유 */}
              <rect x={10} y={100} width={225} height={55} rx={6} fill="var(--card)" stroke={C.ip} strokeWidth={0.5} />
              <text x={122} y={116} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.ip}>서비스 계정에 DELETE 미부여</text>
              <text x={122} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">삭제 필요 시 Soft Delete(is_deleted 플래그)</text>
              <text x={122} y={144} textAnchor="middle" fontSize={7.5} fill={C.ip}>SQL Injection으로 탈취해도 DROP/DELETE 불가</text>

              {/* 비상 계정 통제 */}
              <rect x={250} y={100} width={220} height={55} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} />
              <text x={360} y={116} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>비상 계정: 평소 비활성화</text>
              <text x={360} y={130} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">긴급 시 CISO 승인 → IP 임시 추가</text>
              <text x={360} y={144} textAnchor="middle" fontSize={7.5} fill={C.danger}>작업 완료 → IP 즉시 제거 + 사후 감사</text>

              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">"만능 계정" 하나로 모든 작업 → 사고 시 피해 범위 무한대 확장</text>
              <text x={240} y={194} textAnchor="middle" fontSize={7.5} fill={C.ip}>용도별 분리 = 최소 권한 원칙의 DB 적용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
