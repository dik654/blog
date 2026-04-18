import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  dev: '#6366f1',
  test: '#0ea5e9',
  prod: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  {
    label: 'ISMS 2.8 핵심 3가지 — 시큐어코딩·환경분리·보안검수',
    body: '1)시큐어코딩 기준 수립+교육. 2)개발/테스트/운영 환경 분리(데이터·접근 통제). 3)배포 전 보안 검수(코드 리뷰+취약점 스캔). 설계 시 반영 비용 << 운영 중 수정 비용.',
  },
  {
    label: 'OWASP Top 10 — 개발 보안 체크리스트',
    body: 'Broken Access Control(IDOR), Injection(SQL/XSS), Cryptographic Failures(평문 저장), Authentication Failures(약한 비밀번호), Misconfiguration(기본 계정), SSRF. 이 목록으로 공격의 80%+ 사전 차단.',
  },
  {
    label: '시큐어코딩 — 입력 불신 + 화이트리스트 + 출력 인코딩',
    body: '"Never Trust User Input": 폼·URL·헤더·쿠키 전부 조작 가능. 화이트리스트: 허용 문자·길이·형식 정의, 나머지 거부. 출력 인코딩: HTML 특수문자 이스케이프 → XSS 차단. React 기본 인코딩하나 dangerouslySetInnerHTML 주의.',
  },
  {
    label: '환경 분리 + 보안 검수(SAST/DAST) 파이프라인',
    body: '개발(전체 권한) → 테스트(통합+보안 검수) → 운영(읽기전용/접근불가). 운영 데이터 개발 금지(가명처리). SAST: 커밋 시 정적 분석. DAST: staging 배포 후 모의 공격. CI/CD 통합으로 매 배포 자동 보안 검사.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#ds-ov-arrow)" />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ds-ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 핵심 3가지 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">ISMS 2.8 개발 보안 3대 요구사항</text>

              <ModuleBox x={15} y={30} w={140} h={55} label="시큐어코딩" sub="기준 수립 + 개발자 교육" color={C.dev} />
              <ModuleBox x={170} y={30} w={140} h={55} label="환경 분리" sub="개발/테스트/운영 격리" color={C.test} />
              <ModuleBox x={325} y={30} w={140} h={55} label="보안 검수" sub="코드 리뷰 + 취약점 스캔" color={C.prod} />

              {/* 화살표: 흐름 */}
              <Arrow x1={155} y1={57} x2={168} y2={57} color={C.dev} />
              <Arrow x1={310} y1={57} x2={323} y2={57} color={C.test} />

              <line x1={15} y1={100} x2={465} y2={100} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 비용 비교 */}
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">수정 비용 비교</text>

              <rect x={40} y={128} width={60} height={30} rx={4} fill="#6366f120" stroke={C.dev} strokeWidth={1} />
              <text x={70} y={147} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dev}>설계 1x</text>

              <rect x={130} y={118} width={80} height={40} rx={4} fill="#0ea5e920" stroke={C.test} strokeWidth={1} />
              <text x={170} y={142} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.test}>개발 6x</text>

              <rect x={240} y={108} width={90} height={50} rx={4} fill="#f59e0b20" stroke="#f59e0b" strokeWidth={1} />
              <text x={285} y={137} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">테스트 15x</text>

              <rect x={360} y={96} width={100} height={62} rx={4} fill="#ef444420" stroke={C.danger} strokeWidth={1} />
              <text x={410} y={131} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>운영 100x</text>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">설계 단계 반영 비용 {'<<'} 운영 중 수정 비용</text>

              <motion.path d="M 40 160 Q 200 160 460 98" fill="none" stroke={C.danger} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1 }} />
            </motion.g>
          )}

          {/* Step 1: OWASP Top 10 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">OWASP Top 10 주요 취약점</text>

              <AlertBox x={15} y={28} w={140} h={38} label="Access Control" sub="IDOR: 타인 데이터 접근" color={C.danger} />
              <AlertBox x={170} y={28} w={140} h={38} label="Injection" sub="SQL/XSS/Command" color={C.danger} />
              <AlertBox x={325} y={28} w={140} h={38} label="Crypto Failures" sub="평문 저장, 약한 알고리즘" color={C.danger} />

              <AlertBox x={15} y={78} w={140} h={38} label="Auth Failures" sub="약한 비밀번호, 세션 고정" color={C.danger} />
              <AlertBox x={170} y={78} w={140} h={38} label="Misconfiguration" sub="기본 계정, 디버그 모드" color={C.danger} />
              <AlertBox x={325} y={78} w={140} h={38} label="SSRF" sub="서버가 내부 URL 요청" color={C.danger} />

              <line x1={15} y1={130} x2={465} y2={130} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 방어 결과 */}
              <rect x={80} y={140} width={320} height={32} rx={6} fill="#10b98112" stroke={C.prod} strokeWidth={1} />
              <text x={240} y={160} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.prod}>개발 단계에서 체계적 점검 → 실제 공격의 80%+ 사전 차단</text>

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">대부분의 시큐어코딩 가이드라인이 OWASP Top 10 기반으로 작성됨</text>
            </motion.g>
          )}

          {/* Step 2: 시큐어코딩 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">시큐어코딩: 입력 불신 원칙</text>

              {/* 입력 소스 */}
              <text x={60} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>조작 가능한 입력</text>
              <DataBox x={15} y={42} w={45} h={22} label="폼" color={C.danger} />
              <DataBox x={65} y={42} w={45} h={22} label="URL" color={C.danger} />
              <DataBox x={15} y={68} w={45} h={22} label="헤더" color={C.danger} />
              <DataBox x={65} y={68} w={45} h={22} label="쿠키" color={C.danger} />

              <Arrow x1={115} y1={58} x2={138} y2={58} color={C.dev} />

              {/* 검증 */}
              <ActionBox x={140} y={38} w={120} h={44} label="서버측 검증" sub="화이트리스트 방식" color={C.dev} />

              <Arrow x1={260} y1={58} x2={283} y2={58} color={C.prod} />

              {/* 출력 인코딩 */}
              <ActionBox x={285} y={38} w={120} h={44} label="출력 인코딩" sub="HTML 이스케이프" color={C.prod} />

              <Arrow x1={405} y1={58} x2={428} y2={58} color={C.prod} />
              <StatusBox x={430} y={38} w={40} h={44} label="안전" color={C.prod} />

              <line x1={15} y1={98} x2={465} y2={98} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* 화이트리스트 vs 블랙리스트 */}
              <StatusBox x={20} y={108} w={200} h={40} label="화이트리스트 (허용 목록)" sub="허용 문자·길이·형식 정의, 나머지 거부" color={C.prod} />
              <AlertBox x={260} y={108} w={200} h={40} label="블랙리스트 (차단 목록)" sub="우회 가능 → 근본 방어 안됨" color={C.danger} />

              {/* XSS 예시 */}
              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">XSS 방어: 출력 인코딩</text>
              <rect x={50} y={178} width={170} height={24} rx={4} fill="#ef444412" stroke={C.danger} strokeWidth={0.5} />
              <text x={135} y={194} textAnchor="middle" fontSize={9} fill={C.danger}>{'<script>'} → 실행됨</text>

              <Arrow x1={225} y1={190} x2={253} y2={190} color={C.prod} />

              <rect x={258} y={178} width={170} height={24} rx={4} fill="#10b98112" stroke={C.prod} strokeWidth={0.5} />
              <text x={343} y={194} textAnchor="middle" fontSize={9} fill={C.prod}>{'&lt;script&gt;'} → 텍스트</text>
            </motion.g>
          )}

          {/* Step 3: 환경 분리 + SAST/DAST */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">환경 분리 + CI/CD 보안 파이프라인</text>

              {/* 3환경 */}
              <ModuleBox x={15} y={28} w={130} h={45} label="개발 환경" sub="전체 권한 / 가명 데이터" color={C.dev} />
              <Arrow x1={145} y1={50} x2={163} y2={50} color={C.dev} />

              <ModuleBox x={165} y={28} w={150} h={45} label="테스트 환경" sub="통합 테스트 + 보안 검수" color={C.test} />
              <Arrow x1={315} y1={50} x2={333} y2={50} color={C.test} />

              <ModuleBox x={335} y={28} w={130} h={45} label="운영 환경" sub="승인 후 배포만" color={C.prod} />

              <line x1={15} y1={86} x2={465} y2={86} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* CI/CD 파이프라인 */}
              <text x={240} y={102} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">CI/CD 보안 단계</text>

              <ActionBox x={15} y={110} w={100} h={38} label="SAST" sub="정적 분석 (커밋 시)" color={C.dev} />
              <Arrow x1={115} y1={129} x2={133} y2={129} color={C.dev} />

              <ActionBox x={135} y={110} w={100} h={38} label="의존성 검사" sub="CVE 확인" color={C.test} />
              <Arrow x1={235} y1={129} x2={253} y2={129} color={C.test} />

              <ActionBox x={255} y={110} w={100} h={38} label="DAST" sub="동적 분석 (staging)" color={C.test} />
              <Arrow x1={355} y1={129} x2={373} y2={129} color={C.prod} />

              <StatusBox x={375} y={110} w={95} h={38} label="배포 승인" sub="검증 통과 시" color={C.prod} />

              <motion.circle r={3} fill={C.dev} opacity={0.5}
                initial={{ cx: 65 }} animate={{ cx: 422 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={129} />

              {/* 실패 시 */}
              <AlertBox x={130} y={165} w={220} h={34} label="Critical/High → 파이프라인 즉시 중단" sub="취약 코드가 운영에 도달하지 않도록 차단" color={C.danger} />

              <text x={240} y={212} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">운영 데이터는 개발 환경에 사용 금지 — 가명처리 데이터만 허용</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
