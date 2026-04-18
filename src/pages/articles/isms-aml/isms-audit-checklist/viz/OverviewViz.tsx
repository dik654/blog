import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  audit: '#6366f1',
  evidence: '#10b981',
  defect: '#ef4444',
  fix: '#f59e0b',
};

const STEPS = [
  { label: '심사 구조', body: '심사원 2~4명이 팀을 구성하여 영역별로 병렬 점검. 3~5일 동안 문서 확인, 인터뷰, 시스템 실사를 반복.' },
  { label: '3단계 검증 루프', body: '심사원은 한 항목에 대해 문서 확인 → 담당자 인터뷰 → 시스템 실사 세 가지를 조합하여 교차 검증.' },
  { label: '증적자료 준비', body: '증적은 "정책이 실제로 작동함"을 증명하는 자료. 스크린샷, 로그, 문서, 사진, 시스템 기록 등 다양한 형태.' },
  { label: '사전 체크리스트', body: '현장심사 2~4주 전: 증적 폴더 정리, 담당자 배정, 시연 환경 테스트, 리허설까지 완료.' },
  { label: '결함 등급과 보완', body: '결함(Minor)은 40일 내 개선. 중결함(Major)은 심사 중단 가능. 보완조치는 "재발 방지 체계"가 핵심.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#aco-arrow)" />;
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="aco-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 심사 구조 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={170} y={8} w={140} h={44} label="심사팀장" sub="전체 조율, 최종 판정" color={C.audit} />

              <Arrow x1={200} y1={52} x2={80} y2={75} color={C.audit} />
              <Arrow x1={240} y1={52} x2={240} y2={75} color={C.audit} />
              <Arrow x1={280} y1={52} x2={400} y2={75} color={C.audit} />

              <ActionBox x={20} y={78} w={120} h={42} label="심사원 A" sub="관리체계 + 인적보안" color={C.audit} />
              <ActionBox x={175} y={78} w={130} h={42} label="심사원 B" sub="인증·접근·암호화" color={C.audit} />
              <ActionBox x={340} y={78} w={120} h={42} label="심사원 C" sub="개발·운영·사고" color={C.audit} />

              <Arrow x1={80} y1={120} x2={80} y2={145} color={C.evidence} />
              <Arrow x1={240} y1={120} x2={240} y2={145} color={C.evidence} />
              <Arrow x1={400} y1={120} x2={400} y2={145} color={C.evidence} />

              <DataBox x={30} y={148} w={100} h={30} label="정책·물리보안" color={C.evidence} />
              <DataBox x={185} y={148} w={110} h={30} label="서버·DB·접근" color={C.evidence} />
              <DataBox x={345} y={148} w={110} h={30} label="패치·백업·로그" color={C.evidence} />

              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">3~5일간 영역별 병렬 점검</text>
            </motion.g>
          )}

          {/* Step 1: 3단계 검증 루프 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={20} w={130} h={48} label="1. 문서 확인" sub="정책서, 지침서, 절차서" color={C.audit} />
              <Arrow x1={140} y1={44} x2={168} y2={44} color={C.audit} />

              <ModuleBox x={170} y={20} w={140} h={48} label="2. 담당자 인터뷰" sub="실무 반영 여부 질문" color={C.evidence} />
              <Arrow x1={310} y1={44} x2={338} y2={44} color={C.evidence} />

              <ModuleBox x={340} y={20} w={130} h={48} label="3. 시스템 실사" sub="화면 확인, 명령어 실행" color={C.fix} />

              {/* 교차 검증 */}
              <motion.path
                d="M 405 68 Q 405 100 240 105 Q 75 110 75 68"
                fill="none" stroke={C.defect} strokeWidth={1} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
              <text x={240} y={100} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.defect}>세 결과가 일치해야 적합 판정</text>

              {/* 불일치 사례 */}
              <AlertBox x={30} y={125} w={190} h={45} label="문서 vs 실무 괴리" sub="정책서: '월 1회' / 실제: 분기 1회" color={C.defect} />
              <AlertBox x={260} y={125} w={190} h={45} label="구두 답변 불인정" sub="증적 없는 설명 = 미이행 판정" color={C.defect} />

              <text x={240} y={200} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.audit}>
                심사원은 증적(Evidence)으로만 판단한다
              </text>
            </motion.g>
          )}

          {/* Step 2: 증적자료 유형 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">증적(Evidence) 유형</text>

              <DataBox x={15} y={35} w={85} h={32} label="스크린샷" color={C.audit} />
              <DataBox x={115} y={35} w={75} h={32} label="로그 파일" color={C.audit} />
              <DataBox x={205} y={35} w={75} h={32} label="문서" color={C.evidence} />
              <DataBox x={295} y={35} w={75} h={32} label="사진" color={C.evidence} />
              <DataBox x={385} y={35} w={80} h={32} label="시스템 기록" color={C.fix} />

              <Arrow x1={57} y1={67} x2={57} y2={90} color={C.audit} />
              <Arrow x1={152} y1={67} x2={152} y2={90} color={C.audit} />
              <Arrow x1={242} y1={67} x2={242} y2={90} color={C.evidence} />
              <Arrow x1={332} y1={67} x2={332} y2={90} color={C.evidence} />
              <Arrow x1={425} y1={67} x2={425} y2={90} color={C.fix} />

              <text x={57} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">설정 화면</text>
              <text x={57} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">방화벽 규칙</text>
              <text x={152} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">접근 기록</text>
              <text x={152} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">변경 이력</text>
              <text x={242} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">정책서</text>
              <text x={242} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">교육 수료증</text>
              <text x={332} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">서버실 출입</text>
              <text x={332} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">CCTV 현황</text>
              <text x={425} y={102} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">감사 로그</text>
              <text x={425} y={112} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">알림 기록</text>

              <rect x={30} y={130} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={100} y={145} w={280} h={45} label="구두 설명만 = 미이행 판정" sub="'하고 있습니다'가 아닌 '여기 증거입니다'" color={C.defect} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적 폴더: 2.5.1_비밀번호정책/ 형태로 항목별 구성</text>
            </motion.g>
          )}

          {/* Step 3: 사전 체크리스트 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">심사 2~4주 전 준비</text>

              <ActionBox x={15} y={30} w={105} h={42} label="증적 정리" sub="항목별 폴더 + 파일 배치" color={C.evidence} />
              <Arrow x1={120} y1={51} x2={135} y2={51} color={C.evidence} />

              <ActionBox x={138} y={30} w={105} h={42} label="담당자 배정" sub="항목별 응답자 + 대리인" color={C.audit} />
              <Arrow x1={243} y1={51} x2={258} y2={51} color={C.audit} />

              <ActionBox x={261} y={30} w={100} h={42} label="시연 환경" sub="로그인·쿼리 사전 테스트" color={C.fix} />
              <Arrow x1={361} y1={51} x2={376} y2={51} color={C.fix} />

              <ActionBox x={379} y={30} w={85} h={42} label="리허설" sub="모의 응답 연습" color={C.defect} />

              {/* 하단: 주의 사항 */}
              <rect x={30} y={95} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.defect}>심사원이 싫어하는 것</text>

              <AlertBox x={15} y={125} w={140} h={38} label="구두 설명만" sub="증적 없으면 미이행" color={C.defect} />
              <AlertBox x={170} y={125} w={140} h={38} label="나중에 보내드릴게요" sub="현장 미제시 = 증적 미비" color={C.defect} />
              <AlertBox x={325} y={125} w={140} h={38} label="정책만, 실행 없음" sub="기록 연속성 부재" color={C.defect} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">담당자 부재, 문서 날짜 불일치, 과도한 예외 처리도 결함 사유</text>
            </motion.g>
          )}

          {/* Step 4: 결함 등급과 보완 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={15} w={130} h={48} label="현장심사 완료" sub="결함 보고서 도출" color={C.audit} />

              <Arrow x1={150} y1={39} x2={178} y2={25} color={C.fix} />
              <Arrow x1={150} y1={39} x2={178} y2={55} color={C.defect} />

              <StatusBox x={180} y={8} w={130} h={42} label="결함 (Minor)" sub="보완조치 40일 이내" color={C.fix} progress={0.6} />
              <StatusBox x={180} y={55} w={130} h={42} label="중결함 (Major)" sub="심사 중단 가능" color={C.defect} progress={0.3} />

              <Arrow x1={310} y1={29} x2={340} y2={45} color={C.evidence} />
              <Arrow x1={310} y1={76} x2={340} y2={60} color={C.evidence} />

              <ModuleBox x={342} y={22} w={125} h={50} label="보완조치 제출" sub="재발 방지 체계 증적" color={C.evidence} />

              {/* 하단: 보완 전략 */}
              <rect x={30} y={105} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">보완조치 전략: 일시적 땜질 X, 재발 방지 체계 O</text>

              <ActionBox x={30} y={140} w={130} h={40} label="패치 미적용 결함" sub="원인: 절차 부재" color={C.defect} />
              <Arrow x1={160} y1={160} x2={178} y2={160} color={C.evidence} />
              <ActionBox x={180} y={140} w={130} h={40} label="절차서 수립" sub="정기 패치 프로세스" color={C.evidence} />
              <Arrow x1={310} y1={160} x2={328} y2={160} color={C.evidence} />
              <ActionBox x={330} y={140} w={130} h={40} label="자동화 + 모니터링" sub="스크립트 + 알림 설정" color={C.evidence} />

              <text x={240} y={207} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">대부분의 조직은 5~15개 결함. 결함 = 인증 실패가 아님.</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
