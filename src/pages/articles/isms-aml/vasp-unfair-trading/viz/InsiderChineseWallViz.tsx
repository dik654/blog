import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  dept1: '#6366f1',
  dept2: '#10b981',
  wall: '#ef4444',
  approval: '#f59e0b',
};

const STEPS = [
  { label: '정보 차단벽: 부서 간 분리', body: '상장심사팀과 트레이딩팀은 물리적+논리적으로 분리. 출입카드, 시스템 권한, 커뮤니케이션 모두 차단.' },
  { label: 'Wall Crossing: 예외 절차', body: '불가피하게 차단벽을 넘어야 할 때 준법감시인 사전 승인 + 정보 수령자 거래 제한 + 전 과정 기록이 필수.' },
  { label: '정보 관리 체계: 생성~폐기', body: '기밀 등급 지정 → 최소 인원 접근 → 생성~폐기 전 과정 기록. 사후 추적 가능한 상태 유지.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#icw-arrow)" />;
}

export default function InsiderChineseWallViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="icw-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">정보 차단벽 (Chinese Wall)</text>

              <ModuleBox x={30} y={35} w={160} h={50} label="상장심사팀" sub="상장 결정 정보 보유" color={C.dept1} />

              {/* Wall */}
              <rect x={220} y={30} width={4} height={65} rx={2} fill={C.wall} />
              <rect x={216} y={30} width={12} height={65} rx={2} fill={`${C.wall}20`} stroke={C.wall} strokeWidth={0.8} />
              <text x={222} y={110} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.wall}>차단벽</text>

              <ModuleBox x={255} y={35} w={160} h={50} label="트레이딩팀" sub="매매 업무 수행" color={C.dept2} />

              {/* Crossed arrow */}
              <line x1={190} y1={60} x2={255} y2={60} stroke={C.wall} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
              <text x={222} y={58} textAnchor="middle" fontSize={18} fill={C.wall}>{'X'}</text>

              <DataBox x={30} y={128} w={160} h={28} label="물리 분리: 다른 층/사무실" color={C.dept1} />
              <DataBox x={255} y={128} w={160} h={28} label="시스템 분리: 접근 권한 분리" color={C.dept2} />

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">커뮤니케이션 차단: 업무 관련 대화/이메일/메신저 교환 금지</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Wall Crossing 절차</text>

              <DataBox x={20} y={35} w={120} h={32} label="정보 공유 필요 발생" color={C.dept1} />
              <Arrow x1={140} y1={51} x2={163} y2={51} color={C.approval} />

              <ModuleBox x={165} y={30} w={150} h={42} label="준법감시인 사전 승인" sub="공유 사유 + 범위 심사" color={C.approval} />
              <Arrow x1={315} y1={51} x2={338} y2={51} color={C.dept2} />

              <DataBox x={340} y={35} w={120} h={32} label="정보 수령자 지정" color={C.dept2} />

              <Arrow x1={400} y1={67} x2={400} y2={90} color={C.wall} />

              <AlertBox x={290} y={93} w={170} h={38} label="수령자 거래 제한" sub="정보 대상 자산 매매 금지" color={C.wall} />

              <Arrow x1={240} y1={72} x2={240} y2={93} color={C.approval} />

              <rect x={80} y={95} width={180} height={35} rx={6} fill={`${C.approval}10`} stroke={C.approval} strokeWidth={0.6} />
              <text x={170} y={110} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.approval}>전 과정 기록</text>
              <text x={170} y={124} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">누가, 언제, 무엇을 공유했는지</text>

              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">M&A 검토 등 불가피한 교류만 예외적으로 허용</text>
              <text x={240} y={178} textAnchor="middle" fontSize={8} fill={C.wall}>승인 없는 벽 넘기 = 내부자 거래 온상</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">미공개정보 관리 생명주기</text>

              <ModuleBox x={15} y={40} w={100} h={40} label="생성" sub="기밀 등급 즉시 지정" color={C.dept1} />
              <Arrow x1={115} y1={60} x2={138} y2={60} color={C.dept1} />

              <ModuleBox x={140} y={40} w={100} h={40} label="접근 제한" sub="Need-to-Know" color={C.approval} />
              <Arrow x1={240} y1={60} x2={263} y2={60} color={C.approval} />

              <ModuleBox x={265} y={40} w={100} h={40} label="이용 기록" sub="접근·공유 로그" color={C.dept2} />
              <Arrow x1={365} y1={60} x2={388} y2={60} color={C.dept2} />

              <ModuleBox x={390} y={40} w={75} h={40} label="폐기" sub="공개 후 파기" color={C.wall} />

              {/* Details */}
              <DataBox x={30} y={105} w={120} h={28} label="암호화 저장" color={C.dept1} />
              <DataBox x={175} y={105} w={130} h={28} label="최소 인원 명단 관리" color={C.approval} />
              <DataBox x={330} y={105} w={130} h={28} label="사후 추적 가능 보장" color={C.dept2} />

              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">"누가, 언제, 어떤 정보에 접근했는가" → 전 과정 추적 가능해야</text>
              <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">접근 로그 + 출력 제한 + 암호화 = 3중 보호</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
