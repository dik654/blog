import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '근절 — 악성코드 제거와 백도어 점검',
    body: '안티바이러스 + 수동 분석 병행. 레지스트리·crontab·서비스 목록 전수 점검. 파일 무결성을 baseline 해시와 비교.',
  },
  {
    label: '복구 — 클린 복원 + 단계별 검증',
    body: '검증된 백업에서 시스템 복원 → DB 무결성 검증 → 앱 기능 테스트 → 서비스 재개 후 2주 이상 강화 모니터링.',
  },
  {
    label: '사후 보고서 + 유관기관 신고',
    body: '타임라인(분 단위) + 원인 분석(표면+근본) + 피해 규모 + 대응 평가. KISA 24시간, 금감원 병행, 경찰 수사 의뢰.',
  },
  {
    label: '재발방지 — 정책·시스템·교육',
    body: '정책 조항 강화 → 시스템 하드닝(불필요 서비스 OFF, micro-segmentation) → 전 직원 보안 교육.',
  },
  {
    label: '내부자 모니터링 + 정기 모의훈련',
    body: 'UBA로 이상 행위 탐지. 모의훈련: 탁상(분기) + 시뮬레이션(연 1회). 레드팀 vs 블루팀 + AAR 사후 검토.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-rl-arrow)" />;
}

export default function RecoveryLessonsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-rl-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={8} w={160} h={36} label="근절 (Eradication)" sub="공격 흔적 완전 제거" color={C.red} />

              {/* Three eradication tasks */}
              <Arrow x1={200} y1={46} x2={80} y2={65} color={C.red} />
              <Arrow x1={240} y1={46} x2={240} y2={65} color={C.red} />
              <Arrow x1={280} y1={46} x2={400} y2={65} color={C.red} />

              <ActionBox x={15} y={65} w={130} h={40} label="악성코드 제거" sub="AV + 수동 분석 병행" color={C.red} />
              <ActionBox x={175} y={65} w={130} h={40} label="백도어 점검" sub="웹셸·SSH키·숨긴 계정" color={C.amber} />
              <ActionBox x={335} y={65} w={130} h={40} label="취약점 패치" sub="제로데이 시 WAF 우회방어" color={C.blue} />

              {/* Integrity check */}
              <Arrow x1={240} y1={107} x2={240} y2={125} color={C.green} />
              <StatusBox x={130} y={125} w={220} h={42} label="파일 무결성 검증" sub="baseline 해시 vs 현재 해시 비교" color={C.green} progress={0.85} />

              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">레지스트리 · crontab · 서비스 목록 전수 점검</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Recovery flow: left to right */}
              <DataBox x={10} y={25} w={90} h={30} label="검증된 백업" sub="클린 이미지" color={C.green} />
              <Arrow x1={102} y1={40} x2={118} y2={40} color={C.green} />
              <ActionBox x={120} y={22} w={100} h={36} label="시스템 복원" sub="클린 복원" color={C.green} />
              <Arrow x1={222} y1={40} x2={238} y2={40} color={C.green} />
              <ActionBox x={240} y={22} w={100} h={36} label="DB 무결성" sub="테이블·레코드 대조" color={C.blue} />
              <Arrow x1={342} y1={40} x2={358} y2={40} color={C.blue} />
              <ActionBox x={360} y={22} w={100} h={36} label="기능 테스트" sub="앱·API 검증" color={C.amber} />

              {/* Service resume */}
              <Arrow x1={410} y1={60} x2={350} y2={85} color={C.amber} />
              <StatusBox x={240} y={85} w={220} h={42} label="서비스 재개" sub="모니터링 강화 2주 이상 유지" color={C.green} progress={0.9} />

              {/* Warning */}
              <AlertBox x={20} y={85} w={190} h={42} label="감염 위 패치만? 잔여 위험" sub="클린 복원이 원칙" color={C.red} />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">동일 공격 재발 여부 + 다른 경로 재침입 집중 감시</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Post-incident report */}
              <ModuleBox x={140} y={5} w={200} h={36} label="사후 보고서" sub="Post-Incident Report" color={C.blue} />

              {/* 4 report elements */}
              <Arrow x1={200} y1={43} x2={70} y2={60} color={C.blue} />
              <Arrow x1={220} y1={43} x2={190} y2={60} color={C.blue} />
              <Arrow x1={260} y1={43} x2={310} y2={60} color={C.blue} />
              <Arrow x1={280} y1={43} x2={420} y2={60} color={C.blue} />

              <DataBox x={15} y={60} w={110} h={28} label="타임라인" sub="분 단위 기록" color={C.blue} />
              <DataBox x={140} y={60} w={110} h={28} label="원인 분석" sub="표면 + 근본" color={C.amber} />
              <DataBox x={265} y={60} w={100} h={28} label="피해 규모" sub="건수·손실" color={C.red} />
              <DataBox x={380} y={60} w={85} h={28} label="대응 평가" sub="잘한 점·개선" color={C.green} />

              {/* External reports */}
              <text x={240} y={115} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>유관기관 신고</text>
              <AlertBox x={20} y={124} w={130} h={34} label="KISA" sub="개인정보 유출 24h" color={C.red} />
              <AlertBox x={170} y={124} w={130} h={34} label="금감원 / FIU" sub="금융·가상자산" color={C.amber} />
              <AlertBox x={320} y={124} w={140} h={34} label="경찰 사이버수사대" sub="범죄 의심 시" color={C.blue} />

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">포렌식 증거 + CoC 기록 함께 제출</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={160} y={5} w={160} h={32} label="재발방지 3축" sub="" color={C.green} />

              {/* Three pillars */}
              <Arrow x1={200} y1={39} x2={80} y2={58} color={C.blue} />
              <Arrow x1={240} y1={39} x2={240} y2={58} color={C.green} />
              <Arrow x1={280} y1={39} x2={400} y2={58} color={C.amber} />

              <ModuleBox x={20} y={58} w={120} h={50} label="정책 개정" sub="조항 강화·신설" color={C.blue} />
              <text x={80} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">MFA 의무화 확대</text>
              <text x={80} y={133} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">이메일 보안 게이트웨이</text>

              <ModuleBox x={175} y={58} w={130} h={50} label="시스템 하드닝" sub="공격 표면 축소" color={C.green} />
              <text x={240} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">불필요 서비스 OFF</text>
              <text x={240} y={133} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">micro-segmentation</text>

              <ModuleBox x={340} y={58} w={120} h={50} label="교육" sub="인식 + 심화" color={C.amber} />
              <text x={400} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">전 직원 보안 인식</text>
              <text x={400} y={133} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">기술팀 심화 교육</text>

              <StatusBox x={130} y={150} w={220} h={40} label="재발방지 적용률" sub="정책 + 시스템 + 교육 모두 완료" color={C.green} progress={1} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* UBA section */}
              <text x={120} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>내부자 모니터링</text>
              <ModuleBox x={20} y={25} w={200} h={40} label="UBA (사용자 행위 분석)" sub="로그인 시간·접근 리소스·전송량" color={C.amber} />
              <AlertBox x={20} y={75} w={90} h={30} label="대량 다운" sub="업무 외 시간" color={C.red} />
              <AlertBox x={120} y={75} w={100} h={30} label="임파서블 트래블" sub="지리 불일치" color={C.red} />

              {/* divider */}
              <line x1={240} y1={22} x2={240} y2={180} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3" />

              {/* Drill section */}
              <text x={370} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>정기 모의훈련</text>
              <ActionBox x={270} y={25} w={100} h={36} label="탁상 훈련" sub="분기별 · 저비용" color={C.blue} />
              <ActionBox x={385} y={25} w={80} h={36} label="시뮬레이션" sub="연 1회" color={C.red} />

              {/* Red vs Blue */}
              <Arrow x1={425} y1={63} x2={340} y2={80} color={C.red} />
              <Arrow x1={425} y1={63} x2={425} y2={80} color={C.blue} />
              <DataBox x={290} y={80} w={80} h={28} label="Red Team" sub="공격자" color={C.red} />
              <text x={395} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">vs</text>
              <DataBox x={410} y={80} w={65} h={28} label="Blue Team" sub="방어자" color={C.blue} />

              <Arrow x1={380} y1={110} x2={380} y2={125} color={C.green} />
              <StatusBox x={285} y={125} w={180} h={40} label="AAR → 절차서 반영" sub="결과 경영진 보고 → 예산 근거" color={C.green} progress={0.75} />

              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">훈련 미실시 = ISMS 인증 결함 판정 가능</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
