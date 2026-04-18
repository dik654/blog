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
    label: '퇴직자 계정 처리 — 당일 차단',
    body: '인사팀 퇴직 처리 → 즉시 계정 비활성화 → VPN 인증서 폐기 → 보안 토큰 회수 → 공용 PW 변경.\n"삭제"가 아닌 "비활성화" — 감사 추적을 위해 최소 1년 보관.',
  },
  {
    label: '분기별 전수 점검',
    body: '미사용 계정 정리 + 권한 적정성 검토 + 관리자 계정 재확인 + 서비스 계정 점검.\n시간이 지나면 Privilege Creep 발생 → 정기 점검으로만 교정 가능.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#retire-arr)" />;
}

export default function RetirementViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="retire-arr" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>퇴직자 계정: 당일 처리 흐름</text>

              {/* 메인 흐름 */}
              <DataBox x={5} y={30} w={72} h={28} label="퇴직 처리" color={C.danger} />
              <Arrow x1={77} y1={44} x2={93} y2={44} color={C.danger} />

              <ActionBox x={95} y={28} w={80} h={32} label="계정 비활성화" sub="즉시 실행" color={C.danger} />
              <Arrow x1={175} y1={44} x2={191} y2={44} color={C.action} />

              <ActionBox x={193} y={28} w={80} h={32} label="VPN 폐기" sub="인증서 삭제" color={C.action} />
              <Arrow x1={273} y1={44} x2={289} y2={44} color={C.action} />

              <ActionBox x={291} y={28} w={80} h={32} label="토큰 회수" sub="물리 반납" color={C.action} />
              <Arrow x1={371} y1={44} x2={387} y2={44} color={C.action} />

              <ActionBox x={389} y={28} w={82} h={32} label="공용 PW 변경" sub="퇴직자 인지분" color={C.action} />

              {/* 비활성화 vs 삭제 */}
              <rect x={10} y={75} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <rect x={10} y={85} width={220} height={48} rx={6} fill="var(--card)" stroke={C.safe} strokeWidth={0.5} />
              <text x={120} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>비활성화 (올바른 방법)</text>
              <text x={120} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">감사 추적 유지, 최소 1년 보관</text>
              <text x={120} y={126} textAnchor="middle" fontSize={7.5} fill={C.safe}>접근은 차단되지만 이력은 남음</text>

              <rect x={250} y={85} width={220} height={48} rx={6} fill="var(--card)" stroke={C.danger} strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={360} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>삭제 (위험한 방법)</text>
              <text x={360} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">감사 추적 불가</text>
              <text x={360} y={126} textAnchor="middle" fontSize={7.5} fill={C.danger}>퇴직 전 행위 조사 시 증거 소멸</text>

              {/* VASP 특수 */}
              <AlertBox x={80} y={148} w={320} h={40} label="VASP 특수: 멀티시그 재구성" sub="퇴직자를 서명자에서 즉시 제외 → 임계값 재조정 (예: 3-of-5 → 3-of-4)" color={C.danger} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.primary}>분기별 전수 점검 항목</text>

              {/* 4개 점검 항목 */}
              <ActionBox x={10} y={30} w={110} h={42} label="미사용 계정 정리" sub="90일 미로그인 추출" color={C.danger} />
              <ActionBox x={130} y={30} w={110} h={42} label="권한 적정성" sub="현 직무 대비 확인" color={C.action} />
              <ActionBox x={250} y={30} w={110} h={42} label="관리자 재확인" sub="CISO 보고" color={C.primary} />
              <ActionBox x={370} y={30} w={100} h={42} label="서비스 계정" sub="폐기 시스템 확인" color={C.safe} />

              <rect x={10} y={85} width={460} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* Privilege Creep 시각화 */}
              <text x={240} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>Privilege Creep (권한 누적)</text>

              {/* 시간에 따른 권한 증가 바 */}
              <text x={30} y={124} fontSize={7.5} fill="var(--muted-foreground)">입사 시</text>
              <rect x={80} y={116} width={60} height={12} rx={3} fill={C.safe} />

              <text x={30} y={142} fontSize={7.5} fill="var(--muted-foreground)">6개월</text>
              <rect x={80} y={134} width={120} height={12} rx={3} fill={C.action} />

              <text x={30} y={160} fontSize={7.5} fill="var(--muted-foreground)">1년 후</text>
              <rect x={80} y={152} width={200} height={12} rx={3} fill={C.danger} />

              <text x={30} y={178} fontSize={7.5} fill="var(--muted-foreground)">점검 후</text>
              <rect x={80} y={170} width={80} height={12} rx={3} fill={C.safe} />

              {/* 설명 */}
              <rect x={300} y={115} width={170} height={70} rx={6} fill="var(--card)" stroke={C.primary} strokeWidth={0.5} />
              <text x={385} y={132} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.primary}>부서 이동마다 이전</text>
              <text x={385} y={146} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.primary}>권한이 남아 누적</text>
              <text x={385} y={164} textAnchor="middle" fontSize={8} fill={C.safe}>정기 점검으로만</text>
              <text x={385} y={178} textAnchor="middle" fontSize={8} fill={C.safe}>교정 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
