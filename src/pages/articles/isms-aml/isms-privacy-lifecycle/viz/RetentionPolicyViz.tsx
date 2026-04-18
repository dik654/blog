import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  active: '#6366f1',
  retain: '#f59e0b',
  destroy: '#ef4444',
  safe: '#10b981',
};

const STEPS = [
  {
    label: '회원탈퇴 시 처리 절차 — 즉시 파기 vs 분리보관',
    body: '탈퇴 접수 → 법정 보존 의무 없는 항목(프로필·닉네임)은 5일 내 파기 → 법정 보존 대상(KYC·거래기록)은 분리보관 DB 이동 → 활성 DB에서 삭제 → 보존기간 만료 후 최종 파기.',
  },
  {
    label: '활성 DB vs 분리보관 DB — 접근·암호화·로그 차이',
    body: '활성 DB: 운영팀·개발팀 접근, 서비스 목적. 분리보관 DB: CPO+법무팀만 접근, 법령 준수·수사 협조 목적. 전 항목 암호화 권장. 접근 시 사유+승인 기록 필수. 접근 로그 2년 보관.',
  },
  {
    label: '휴면계정 — 1년 미접속 시 분리보관',
    body: '정보통신망법 제29조 제2항. 만료 30일 전 안내 → 1년 도래 시 분리보관 이동 → 재로그인 시 본인인증 후 복원 → 추가 3년 경과 시 파기. VASP: 지갑 잔액 존재 시 자산 보관 의무와 충돌.',
  },
  {
    label: '파기 배치(Batch) 실행 — 자동 선정·검토·실행',
    body: '매월/매분기 파기 배치. 자동화 쿼리로 파기 대상 선정 → 파기 담당자 검토 → 파기 실행 → 파기 대장 기록. "지체 없이"는 정당 사유 없는 한 5일 이내(시행령 제16조).',
  },
];

function Arrow({ x1, y1, x2, y2, color, dashed }: {
  x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#rp-arrow)"
      strokeDasharray={dashed ? '3 2' : undefined} />
  );
}

export default function RetentionPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rp-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 회원탈퇴 처리 절차 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">회원탈퇴 시 처리 절차</text>

              {/* 탈퇴 접수 */}
              <ActionBox x={185} y={25} w={110} h={34} label="탈퇴 접수" sub="본인인증 후 처리" color={C.active} />

              {/* 분기 */}
              <Arrow x1={240} y1={59} x2={120} y2={80} color={C.destroy} />
              <Arrow x1={240} y1={59} x2={360} y2={80} color={C.retain} />

              <text x={160} y={72} textAnchor="middle" fontSize={8} fill={C.destroy}>보존 의무 없음</text>
              <text x={320} y={72} textAnchor="middle" fontSize={8} fill={C.retain}>법정 보존 대상</text>

              {/* 즉시 파기 경로 */}
              <AlertBox x={40} y={82} w={160} h={38} label="즉시 파기" sub="프로필·닉네임·알림 설정" color={C.destroy} />
              <text x={120} y={133} textAnchor="middle" fontSize={8} fill={C.destroy} fontWeight={600}>5일 이내</text>

              {/* 분리보관 경로 */}
              <StatusBox x={280} y={82} w={160} h={38} label="분리보관 이동" sub="KYC·거래기록·계좌" color={C.retain} />
              <Arrow x1={360} y1={120} x2={360} y2={140} color={C.retain} />

              <ActionBox x={280} y={142} w={160} h={34} label="활성 DB 삭제" sub="분리 이동 완료 확인 후" color={C.active} />
              <Arrow x1={360} y1={176} x2={360} y2={188} color={C.destroy} />

              <DataBox x={300} y={190} w={120} h={24} label="보존기간 후 파기" color={C.destroy} />

              {/* 데이터 흐름 애니메이션 */}
              <motion.circle r={3} fill={C.retain} opacity={0.5}
                initial={{ cx: 240, cy: 59 }} animate={{ cx: 360, cy: 190 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
            </motion.g>
          )}

          {/* Step 1: 활성 DB vs 분리보관 DB */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">활성 DB vs 분리보관 DB</text>

              {/* 활성 DB */}
              <ModuleBox x={15} y={28} w={210} h={52} label="활성 DB" sub="서비스 이용 중 회원" color={C.active} />
              <DataBox x={30} y={90} w={80} h={24} label="운영팀 접근" color={C.active} />
              <DataBox x={120} y={90} w={90} h={24} label="서비스 목적" color={C.active} />
              <DataBox x={30} y={122} w={80} h={24} label="필수 암호화" color={C.active} />
              <DataBox x={120} y={122} w={90} h={24} label="일반 로그" color={C.active} />

              {/* 화살표: 분리 이동 */}
              <Arrow x1={230} y1={54} x2={253} y2={54} color={C.retain} />
              <text x={242} y={48} textAnchor="middle" fontSize={7} fill={C.retain}>탈퇴/</text>
              <text x={242} y={65} textAnchor="middle" fontSize={7} fill={C.retain}>휴면</text>

              {/* 분리보관 DB */}
              <ModuleBox x={255} y={28} w={210} h={52} label="분리보관 DB" sub="탈퇴/휴면 법정 보존" color={C.retain} />
              <DataBox x={270} y={90} w={90} h={24} label="CPO+법무만" color={C.retain} />
              <DataBox x={370} y={90} w={80} h={24} label="법령 준수" color={C.retain} />
              <DataBox x={270} y={122} w={90} h={24} label="전체 암호화" color={C.retain} />
              <DataBox x={370} y={122} w={80} h={24} label="사유 기록" color={C.retain} />

              {/* 접근 통제 강조 */}
              <line x1={15} y1={158} x2={465} y2={158} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={120} y={165} w={240} h={38} label="분리보관 접근: 사전 승인 + 사유 기록 + 로그 2년" sub="CPO/CISO 사전 승인 없이 접근 불가" color={C.destroy} />
            </motion.g>
          )}

          {/* Step 2: 휴면계정 처리 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">휴면계정 처리 흐름</text>

              {/* 타임라인 */}
              <line x1={30} y1={55} x2={450} y2={55} stroke="var(--border)" strokeWidth={1.5} />

              {/* 마커들 */}
              <circle cx={80} cy={55} r={5} fill={C.active} />
              <text x={80} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.active}>마지막 접속</text>

              <circle cx={200} cy={55} r={5} fill={C.retain} />
              <text x={200} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.retain}>11개월 (사전 안내)</text>

              <circle cx={310} cy={55} r={5} fill={C.destroy} />
              <text x={310} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.destroy}>1년 (휴면 전환)</text>

              <circle cx={430} cy={55} r={5} fill={C.destroy} />
              <text x={430} y={45} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.destroy}>4년 (최종 파기)</text>

              {/* 상세 */}
              <ActionBox x={30} y={70} w={120} h={34} label="정상 이용 중" sub="활성 DB 유지" color={C.active} />
              <ActionBox x={155} y={70} w={120} h={34} label="30일 전 안내" sub="이메일·문자 통지" color={C.retain} />
              <ActionBox x={280} y={70} w={120} h={34} label="분리보관 이동" sub="활성 DB → 분리 DB" color={C.destroy} />

              {/* 재활성화 */}
              <Arrow x1={340} y1={104} x2={340} y2={120} color={C.safe} />
              <StatusBox x={260} y={122} w={170} h={35} label="재로그인 → 본인인증" sub="활성 DB로 복원 가능" color={C.safe} />

              {/* VASP 특이점 */}
              <line x1={15} y1={170} x2={465} y2={170} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={80} y={178} w={320} h={34} label="VASP: 지갑 잔액 존재 시 자산 보관 의무 충돌" sub="분리보관 + 자산 인출 안내 병행 필요" color={C.retain} />
            </motion.g>
          )}

          {/* Step 3: 파기 배치 실행 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">파기 배치(Batch) 실행 흐름</text>

              <ActionBox x={15} y={32} w={100} h={40} label="대상 선정" sub="자동화 쿼리" color={C.active} />
              <Arrow x1={115} y1={52} x2={133} y2={52} color={C.active} />

              <ActionBox x={135} y={32} w={100} h={40} label="담당자 검토" sub="파기 목록 확인" color={C.retain} />
              <Arrow x1={235} y1={52} x2={253} y2={52} color={C.retain} />

              <ActionBox x={255} y={32} w={100} h={40} label="파기 실행" sub="DELETE+VACUUM" color={C.destroy} />
              <Arrow x1={355} y1={52} x2={373} y2={52} color={C.destroy} />

              <StatusBox x={375} y={30} w={95} h={44} label="파기 대장" sub="증적 기록" color={C.safe} />

              {/* 흐르는 점 */}
              <motion.circle r={3} fill={C.destroy} opacity={0.5}
                initial={{ cx: 65 }} animate={{ cx: 422 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={52} />

              <line x1={15} y1={88} x2={465} y2={88} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 파기 대장 항목 */}
              <text x={240} y={104} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">파기 대장 기재 항목</text>
              <DataBox x={15} y={112} w={85} h={28} label="파기 일자" color={C.destroy} />
              <DataBox x={110} y={112} w={85} h={28} label="파기 대상" color={C.destroy} />
              <DataBox x={205} y={112} w={85} h={28} label="파기 방법" color={C.destroy} />
              <DataBox x={300} y={112} w={85} h={28} label="수행자" color={C.active} />
              <DataBox x={395} y={112} w={75} h={28} label="확인자" color={C.safe} />

              {/* 주기 */}
              <text x={120} y={165} textAnchor="middle" fontSize={9} fill={C.retain} fontWeight={600}>매월/매분기 정기 실행</text>
              <text x={360} y={165} textAnchor="middle" fontSize={9} fill={C.destroy} fontWeight={600}>"지체 없이" = 5일 이내</text>

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">파기 대장은 최소 3년 보관 — ISMS-P 심사 시 제출</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
