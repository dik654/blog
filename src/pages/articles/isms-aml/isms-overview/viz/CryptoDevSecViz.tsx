import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3B82F6',
  green: '#22C55E',
  amber: '#F59E0B',
  red: '#EF4444',
};

const STEPS = [
  {
    label: '2.7 암호화: 저장 + 전송 구간',
    body: '비밀번호는 bcrypt/Argon2 단방향 해시. 개인정보는 AES-256 암호화 저장. 전송은 TLS 1.2+. 키는 KMS에 보관 — 소스코드 하드코딩 절대 금지.',
  },
  {
    label: '2.8 개발 보안: Secure by Design',
    body: '서버 정보 노출 차단(server_tokens off), 커스텀 에러 페이지, UUID로 열거 공격 방지, 입력값 허용목록 검증, 환경 분리(개발/스테이징/운영).',
  },
  {
    label: '2.11 사고 대응 5단계',
    body: '탐지(SIEM/IDS) → 초동 대응(1시간 내 팀 소집) → 분석(포렌식) → 복구(RPO/RTO 기준) → 재발 방지(근본 원인 분석). 로그 무결성이 전제조건.',
  },
];

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#cds-arrow)" />;
}

export default function CryptoDevSecViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cds-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">암호화 적용 영역</text>

              {/* Storage encryption */}
              <ModuleBox x={20} y={28} w={200} h={48} label="저장 데이터 암호화" sub="At-Rest Encryption" color={C.blue} />

              <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <DataBox x={30} y={85} w={85} h={22} label="비밀번호" color={C.blue} />
                <text x={72} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">bcrypt/Argon2</text>

                <DataBox x={125} y={85} w={85} h={22} label="개인정보" color={C.blue} />
                <text x={167} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AES-256</text>
              </motion.g>

              {/* Transport encryption */}
              <ModuleBox x={260} y={28} w={200} h={48} label="전송 구간 암호화" sub="In-Transit Encryption" color={C.green} />

              <motion.g initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <DataBox x={270} y={85} w={80} h={22} label="외부 통신" color={C.green} />
                <text x={310} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">TLS 1.2+</text>

                <DataBox x={360} y={85} w={90} h={22} label="내부 통신" color={C.green} />
                <text x={405} y={118} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">mTLS 권장</text>
              </motion.g>

              {/* Key management */}
              <Arrow x1={240} y1={120} x2={240} y2={135} />
              <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }}>
                <ModuleBox x={130} y={138} w={220} h={40} label="키 관리 (KMS)" sub="Secrets Manager / Vault" color={C.amber} />
              </motion.g>

              {/* Anti-pattern */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <AlertBox x={100} y={185} w={280} h={22} label="소스코드에 키 하드코딩 = Git 이력 포함 정리 필수" color={C.red} />
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">개발 보안 체크리스트</text>

              {/* Attack vectors and mitigations */}
              <rect x={20} y={28} width={180} height={24} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
              <text x={110} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>공격 벡터</text>

              <rect x={280} y={28} width={180} height={24} rx={4} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
              <text x={370} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>방어 조치</text>

              {/* Row 1 */}
              <DataBox x={25} y={60} w={170} h={22} label="서버 버전 노출" color={C.red} />
              <Arrow x1={195} y1={71} x2={275} y2={71} />
              <DataBox x={280} y={60} w={175} h={22} label="server_tokens off" color={C.green} />

              {/* Row 2 */}
              <DataBox x={25} y={90} w={170} h={22} label="스택 트레이스 노출" color={C.red} />
              <Arrow x1={195} y1={101} x2={275} y2={101} />
              <DataBox x={280} y={90} w={175} h={22} label="커스텀 에러 페이지" color={C.green} />

              {/* Row 3 */}
              <DataBox x={25} y={120} w={170} h={22} label="열거 공격 (순차 ID)" color={C.red} />
              <Arrow x1={195} y1={131} x2={275} y2={131} />
              <DataBox x={280} y={120} w={175} h={22} label="UUID v4 (122비트 랜덤)" color={C.green} />

              {/* Row 4 */}
              <DataBox x={25} y={150} w={170} h={22} label="SQL Injection / XSS" color={C.red} />
              <Arrow x1={195} y1={161} x2={275} y2={161} />
              <DataBox x={280} y={150} w={175} h={22} label="허용목록 기반 입력 검증" color={C.green} />

              {/* Environment separation */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={80} y={182} width={320} height={22} rx={11} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
                <text x={240} y={197} textAnchor="middle" fontSize={9} fill={C.amber}>개발 → 스테이징 → 운영 환경 분리 (개인정보 마스킹)</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">침해사고 대응 5단계</text>

              {/* 5 stages pipeline */}
              <ActionBox x={10} y={30} w={80} h={38} label="탐지" sub="SIEM/IDS" color={C.blue} />
              <Arrow x1={90} y1={49} x2={105} y2={49} />

              <ActionBox x={107} y={30} w={80} h={38} label="초동 대응" sub="1시간 이내" color={C.red} />
              <Arrow x1={187} y1={49} x2={202} y2={49} />

              <ActionBox x={204} y={30} w={80} h={38} label="분석" sub="포렌식" color={C.amber} />
              <Arrow x1={284} y1={49} x2={299} y2={49} />

              <ActionBox x={301} y={30} w={80} h={38} label="복구" sub="RPO/RTO" color={C.green} />
              <Arrow x1={381} y1={49} x2={396} y2={49} />

              <ActionBox x={398} y={30} w={75} h={38} label="재발 방지" sub="근본 원인" color={C.green} />

              {/* Detail for each stage */}
              <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {/* Detection detail */}
                <rect x={10} y={80} width={120} height={36} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={0.6} />
                <text x={70} y={95} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.blue}>VASP 특화 탐지</text>
                <text x={70} y={108} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">대량/심야/신규주소 출금</text>

                {/* Initial response */}
                <rect x={140} y={80} width={100} height={36} rx={6} fill="var(--card)" stroke={C.red} strokeWidth={0.6} />
                <text x={190} y={95} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.red}>즉시 조치</text>
                <text x={190} y={108} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">서버 격리, 출금 중지</text>

                {/* Analysis */}
                <rect x={250} y={80} width={100} height={36} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.6} />
                <text x={300} y={95} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.amber}>전제조건</text>
                <text x={300} y={108} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">로그 무결성 확보</text>

                {/* Recovery */}
                <rect x={360} y={80} width={110} height={36} rx={6} fill="var(--card)" stroke={C.green} strokeWidth={0.6} />
                <text x={415} y={95} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>목표</text>
                <text x={415} y={108} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">RPO/RTO 사전 정의</text>
              </motion.g>

              {/* Feedback loop */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <motion.path d="M 435 68 C 465 68, 465 145, 435 145 L 50 145 C 30 145, 25 140, 25 130 L 25 120"
                  fill="none" stroke={C.green} strokeWidth={0.8} strokeDasharray="4 3" markerEnd="url(#cds-arrow)"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.7 }} />
                <text x={240} y={155} textAnchor="middle" fontSize={8} fill={C.green}>사고 보고서 → 위험평가 반영 → DoA 재검토</text>
              </motion.g>

              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">침해사고는 "발생 여부"가 아니라 "발생 시기"의 문제</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
