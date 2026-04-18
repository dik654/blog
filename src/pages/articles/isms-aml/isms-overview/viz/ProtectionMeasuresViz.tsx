import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '2.2 인적 보안 + 2.4 물리 보안',
    body: '내부자 위협은 VASP의 가장 치명적 공격 벡터. 보안 서약서, 정보보호 교육(연 1회), 퇴사자 즉시 권한 회수가 핵심. 물리 보안은 월렛룸을 최고 보안 구역으로 설정.',
  },
  {
    label: '2.5 인증/권한 + 2.6 접근통제',
    body: '인증(Authentication) = 신원 확인, 인가(Authorization) = 권한 부여. MFA 필수, 최소 권한 원칙. 접근통제는 DB 프록시, IP 제한, 월간 로그 검토로 기술적 강제.',
  },
  {
    label: '2.7 암호화 + 2.8 개발 보안',
    body: '비밀번호는 bcrypt 단방향 해시, 키는 KMS 관리, 전송은 TLS 1.2+, 저장은 AES-256. 개발 보안은 서버 정보 숨김, 에러 페이지 커스텀, UUID 사용, 입력값 검증.',
  },
  {
    label: '2.11 사고 대응 + 2.12 재해 복구',
    body: '사고 대응 5단계: 탐지 -> 초동 대응(1시간 내) -> 분석(포렌식) -> 복구(RPO/RTO) → 재발 방지. 재해 복구는 백업 암호화, 소산 백업, 연 1회 복구 훈련 필수.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#pm-arrow)" />;
}

export default function ProtectionMeasuresViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pm-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Human + Physical Security */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 2.2 Human Security */}
              <ModuleBox x={20} y={10} w={200} h={40} label="2.2 인적 보안" sub="내부자 위협 통제" color={C.blue} />

              <ActionBox x={20} y={62} w={90} h={32} label="보안 서약서" sub="입사+연1회" color={C.blue} />
              <ActionBox x={120} y={62} w={90} h={32} label="정보보호 교육" sub="전 임직원" color={C.blue} />

              <ActionBox x={20} y={104} w={90} h={32} label="입사자 절차" sub="교육->권한 순서" color={C.blue} />
              <ActionBox x={120} y={104} w={90} h={32} label="퇴사자 절차" sub="당일 계정 삭제" color={C.blue} />

              <Arrow x1={65} y1={50} x2={65} y2={60} />
              <Arrow x1={165} y1={50} x2={165} y2={60} />

              {/* 2.4 Physical Security */}
              <ModuleBox x={260} y={10} w={200} h={40} label="2.4 물리 보안" sub="물리 접근 통제" color={C.green} />

              <ActionBox x={260} y={62} w={100} h={32} label="출입통제 구역" sub="3단계 분리" color={C.green} />
              <ActionBox x={370} y={62} w={90} h={32} label="작업 승인" sub="계획->승인->수행" color={C.green} />

              <ActionBox x={260} y={104} w={100} h={32} label="반출입 통제" sub="저장매체 기록" color={C.green} />
              <ActionBox x={370} y={104} w={90} h={32} label="CCTV/로그" sub="6개월 보관" color={C.green} />

              <Arrow x1={360} y1={50} x2={360} y2={60} />

              {/* Wallet Room highlight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <AlertBox x={140} y={155} w={200} h={40} label="월렛룸 = 최고 보안 구역" sub="이중 인증 + CCTV + 동행 원칙" color={C.red} />
                <Arrow x1={165} y1={136} x2={200} y2={153} />
                <Arrow x1={360} y1={136} x2={300} y2={153} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 1: Auth + Access Control */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={10} w={200} h={40} label="2.5 인증 및 권한관리" sub="누구에게 권한을?" color={C.blue} />
              <ModuleBox x={260} y={10} w={200} h={40} label="2.6 접근통제" sub="기술적으로 어떻게 강제?" color={C.green} />

              <Arrow x1={220} y1={30} x2={258} y2={30} />

              {/* 2.5 items */}
              <DataBox x={10} y={62} w={75} h={28} label="MFA 필수" color={C.blue} />
              <DataBox x={95} y={62} w={75} h={28} label="비밀번호 정책" color={C.blue} />
              <DataBox x={10} y={98} w={80} h={28} label="미접속 잠금" color={C.blue} />
              <DataBox x={100} y={98} w={75} h={28} label="최소 권한" color={C.blue} />

              {/* 2.6 items */}
              <DataBox x={250} y={62} w={95} h={28} label="DB 접근제어" color={C.green} />
              <DataBox x={355} y={62} w={80} h={28} label="계정 분리" color={C.green} />
              <DataBox x={250} y={98} w={80} h={28} label="IP 제한" color={C.green} />
              <DataBox x={340} y={98} w={95} h={28} label="월간 로그 검토" color={C.green} />

              {/* Flow: request -> auth -> access control → resource */}
              <text x={240} y={150} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">접근 요청 흐름</text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <ActionBox x={30} y={160} w={80} h={36} label="사용자 요청" sub="" color="var(--muted-foreground)" />
                <Arrow x1={110} y1={178} x2={138} y2={178} />
                <ActionBox x={140} y={160} w={80} h={36} label="MFA 인증" sub="2.5 인증" color={C.blue} />
                <Arrow x1={220} y1={178} x2={248} y2={178} />
                <ActionBox x={250} y={160} w={80} h={36} label="권한 확인" sub="2.6 통제" color={C.green} />
                <Arrow x1={330} y1={178} x2={358} y2={178} />
                <ModuleBox x={360} y={160} w={80} h={36} label="리소스" sub="DB/서버" color={C.amber} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: Encryption + Dev Security */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={10} w={200} h={40} label="2.7 암호화 적용" sub="데이터 기밀성 보장" color={C.amber} />
              <ModuleBox x={260} y={10} w={200} h={40} label="2.8 개발 보안" sub="Secure by Design" color={C.green} />

              {/* Encryption categories */}
              <ActionBox x={15} y={62} w={105} h={34} label="비밀번호 저장" sub="bcrypt 단방향 해시" color={C.amber} />
              <ActionBox x={130} y={62} w={95} h={34} label="키 관리" sub="KMS (Vault)" color={C.amber} />

              <ActionBox x={15} y={106} w={105} h={34} label="전송 암호화" sub="TLS 1.2+" color={C.amber} />
              <ActionBox x={130} y={106} w={95} h={34} label="저장 암호화" sub="AES-256" color={C.amber} />

              {/* Dev security categories */}
              <ActionBox x={260} y={62} w={100} h={34} label="서버 정보 숨김" sub="server_tokens off" color={C.green} />
              <ActionBox x={370} y={62} w={90} h={34} label="에러 페이지" sub="스택트레이스 차단" color={C.green} />

              <ActionBox x={260} y={106} w={100} h={34} label="UUID 사용" sub="열거 공격 방지" color={C.green} />
              <ActionBox x={370} y={106} w={90} h={34} label="입력값 검증" sub="OWASP Top 10" color={C.green} />

              {/* Key warning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <AlertBox x={100} y={160} w={280} h={40} label="소스코드에 키 하드코딩 = 절대 금지" sub="Git 이력에 키 존재 시 '키 노출 사고'로 간주" color={C.red} />
              </motion.g>
            </motion.g>
          )}

          {/* Step 3: Incident Response + Disaster Recovery */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={5} w={440} h={30} label="2.11 사고 대응 — 사고는 '발생 여부'가 아니라 '발생 시기'의 문제" sub="" color={C.red} />

              {/* 5 phases of incident response */}
              <ActionBox x={10} y={45} w={82} h={38} label="탐지" sub="SIEM/IDS" color={C.red} />
              <ActionBox x={102} y={45} w={82} h={38} label="초동 대응" sub="1시간 내 소집" color={C.red} />
              <ActionBox x={194} y={45} w={82} h={38} label="분석" sub="포렌식" color={C.amber} />
              <ActionBox x={286} y={45} w={82} h={38} label="복구" sub="RPO/RTO" color={C.green} />
              <ActionBox x={378} y={45} w={82} h={38} label="재발 방지" sub="원인 분석" color={C.blue} />

              <Arrow x1={92} y1={64} x2={100} y2={64} />
              <Arrow x1={184} y1={64} x2={192} y2={64} />
              <Arrow x1={276} y1={64} x2={284} y2={64} />
              <Arrow x1={368} y1={64} x2={376} y2={64} />

              {/* Disaster Recovery */}
              <ModuleBox x={20} y={100} w={440} h={30} label="2.12 재해 복구 — 백업이 없으면 복구 불가, 테스트 없으면 보장 불가" sub="" color={C.blue} />

              <DataBox x={20} y={140} w={100} h={28} label="백업 정책" color={C.blue} />
              <DataBox x={130} y={140} w={90} h={28} label="NTP 동기화" color={C.blue} />
              <DataBox x={230} y={140} w={100} h={28} label="백업 암호화" color={C.amber} />
              <DataBox x={340} y={140} w={100} h={28} label="소산 백업" color={C.green} />

              {/* Recovery drill */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={100} y={182} width={280} height={30} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={1} />
                <text x={240} y={200} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.green}>연 1회 복구 훈련 + RTO/RPO 측정 필수</text>
                <Arrow x1={170} y1={168} x2={200} y2={180} />
                <Arrow x1={390} y1={168} x2={340} y2={180} />
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
