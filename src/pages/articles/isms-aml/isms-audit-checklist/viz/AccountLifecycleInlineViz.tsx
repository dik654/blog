import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  account: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '계정 분리 원칙', body: '서비스·관리자·백업·비상 — 용도별 계정 분리. root나 admin 하나로 모든 작업 수행하면 결함.' },
  { label: '장기 미접속 + 공용 계정', body: '6개월 이상 미접속 계정 조회. 퇴직자 계정 잔존 = 결함. 공용 계정은 사용대장 필수.' },
  { label: 'MFA + 권한 검토', body: '관리자 2차인증 미적용 = 결함. 접근 권한 반기 1회 정기 검토 기록 필수.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ali2-arrow)" />;
}

export default function AccountLifecycleInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ali2-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">계정 분리 원칙 (용도별)</text>

              <DataBox x={15} y={28} w={105} h={38} label="서비스 계정" color={C.ok} />
              <text x={67} y={80} textAnchor="middle" fontSize={7.5} fill={C.ok}>SELECT/INSERT만</text>

              <DataBox x={130} y={28} w={105} h={38} label="관리자 계정" color={C.account} />
              <text x={182} y={80} textAnchor="middle" fontSize={7.5} fill={C.account}>DDL 권한 포함</text>

              <DataBox x={245} y={28} w={105} h={38} label="백업 계정" color={C.warn} />
              <text x={297} y={80} textAnchor="middle" fontSize={7.5} fill={C.warn}>SELECT+LOCK만</text>

              <DataBox x={360} y={28} w={105} h={38} label="비상 계정" color={C.fail} />
              <text x={412} y={80} textAnchor="middle" fontSize={7.5} fill={C.fail}>사용 후 PW 변경</text>

              <rect x={30} y={95} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={30} y={108} w={200} h={38} label="host: % = 모든 IP 접속" sub="특히 root@% → 즉시 중결함" color={C.fail} />
              <ModuleBox x={260} y={108} w={190} h={38} label="host: 10.0.1.%" sub="특정 대역만 허용 = 양호" color={C.ok} />

              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">하나의 계정으로 모든 용도 수행 = 계정 분리 미흡 결함</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">장기 미접속 · 공용 계정 관리</text>

              {/* 장기 미접속 */}
              <ActionBox x={15} y={30} w={110} h={40} label="계정 조회" sub="lastlog, DB 쿼리" color={C.account} />
              <Arrow x1={125} y1={50} x2={145} y2={50} color={C.account} />
              <AlertBox x={148} y={30} w={130} h={40} label="6개월+ 미접속" sub="퇴직자 계정 잔존" color={C.fail} />
              <Arrow x1={278} y1={50} x2={298} y2={50} color={C.ok} />
              <ActionBox x={300} y={30} w={155} h={40} label="비활성화/삭제 조치" sub="분기 1회 정기 점검 보고서" color={C.ok} />

              <rect x={30} y={88} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 공용 계정 */}
              <AlertBox x={15} y={98} w={120} h={40} label="공용 계정" sub="원칙: 사용 금지" color={C.fail} />
              <Arrow x1={135} y1={118} x2={155} y2={118} color={C.warn} />
              <DataBox x={158} y={100} w={150} h={36} label="불가피한 경우만 허용" color={C.warn} />
              <Arrow x1={308} y1={118} x2={328} y2={118} color={C.ok} />
              <ModuleBox x={330} y={98} w={130} h={40} label="사용대장 기록" sub="사용자·기간·사유·승인" color={C.ok} />

              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">퇴직자 계정 삭제 대장 + 계정 생성/삭제 절차서도 증적 대상</text>
              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">공용 계정 사용대장 없이 운영 = 즉시 결함</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">MFA + 접근 권한 정기 검토</text>

              {/* MFA */}
              <ModuleBox x={15} y={28} w={130} h={40} label="관리자 로그인" sub="ID/PW만 = 결함" color={C.fail} />
              <Arrow x1={145} y1={48} x2={168} y2={48} color={C.ok} />
              <ActionBox x={170} y={28} w={120} h={40} label="2차인증 필수" sub="OTP, SMS, 생체" color={C.ok} />
              <Arrow x1={290} y1={48} x2={313} y2={48} color={C.account} />
              <DataBox x={315} y={30} w={150} h={36} label="전체 IAM 사용자 MFA 적용" color={C.account} />

              <rect x={30} y={85} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 권한 검토 */}
              <ActionBox x={30} y={98} w={130} h={40} label="권한 검토 (반기)" sub="서버·DB·클라우드 IAM" color={C.account} />
              <Arrow x1={160} y1={118} x2={178} y2={118} color={C.account} />
              <ActionBox x={180} y={98} w={130} h={40} label="불필요 권한 회수" sub="퇴직·이동·과도 권한" color={C.warn} />
              <Arrow x1={310} y1={118} x2={328} y2={118} color={C.ok} />
              <ModuleBox x={330} y={98} w={130} h={40} label="검토 보고서" sub="검토일·대상·조치결과" color={C.ok} />

              <AlertBox x={60} y={155} w={360} h={32} label="'편의상' 또는 '원래 이랬다' = 결함 사유" sub="모든 권한 부여에 업무적 근거 + 문서화 필수" color={C.fail} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
