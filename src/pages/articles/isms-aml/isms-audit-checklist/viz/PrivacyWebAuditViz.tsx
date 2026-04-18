import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  web: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '개인정보 처리방침', body: 'Footer에 링크 존재 확인. 법정 필수 8개 항목(처리목적, 항목, 보유기간 등)을 하나씩 대조. 변경 이력도 확인.' },
  { label: '동의 화면 · 비밀번호 규칙', body: '필수/선택 분리, 사전 체크 금지, 수집 항목·목적·기간 명시. 비밀번호 규칙 안내 + 서버 측 검증 확인.' },
  { label: '에러 페이지 · 정보 노출', body: '404/500 페이지에서 스택 트레이스, 서버 버전, 내부 경로 노출 여부. 응답 헤더의 서버 정보도 점검.' },
  { label: 'HTTPS · TLS', body: 'HTTPS 적용, HTTP 리다이렉트, 인증서 유효기간, TLS 1.2+ 사용, 혼합 콘텐츠 여부를 브라우저에서 확인.' },
  { label: '회원탈퇴 · 쿠키 배너', body: '탈퇴 접근성(3단계 이내), 파기/분리보관 안내. 쿠키 배너 동의 전 설치 금지, 거부 옵션, 종류별 선택.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#pwa-arrow)" />;
}

export default function PrivacyWebAuditViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pwa-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 처리방침 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 심사원 행동 */}
              <ActionBox x={15} y={8} w={135} h={40} label="메인 페이지 스크롤" sub="Footer 확인" color={C.web} />
              <Arrow x1={150} y1={28} x2={175} y2={28} color={C.web} />
              <DataBox x={177} y={12} w={130} h={32} label="개인정보 처리방침" color={C.web} />
              <Arrow x1={307} y1={28} x2={330} y2={28} color={C.web} />

              <ModuleBox x={332} y={6} w={135} h={44} label="필수 8개 항목" sub="개인정보보호법 제30조" color={C.web} />

              {/* 8개 항목 */}
              <DataBox x={10} y={60} w={105} h={24} label="1. 처리 목적" color={C.web} />
              <DataBox x={125} y={60} w={105} h={24} label="2. 처리 항목" color={C.web} />
              <DataBox x={240} y={60} w={105} h={24} label="3. 보유 기간" color={C.web} />
              <DataBox x={355} y={60} w={110} h={24} label="4. 제3자 제공" color={C.web} />

              <DataBox x={10} y={92} w={105} h={24} label="5. 파기 절차" color={C.web} />
              <DataBox x={125} y={92} w={105} h={24} label="6. 정보주체 권리" color={C.web} />
              <DataBox x={240} y={92} w={105} h={24} label="7. 안전성 확보" color={C.web} />
              <DataBox x={355} y={92} w={110} h={24} label="8. 보호책임자" color={C.web} />

              {/* 결함 */}
              <rect x={30} y={130} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={20} y={140} w={200} h={38} label="실제 수집 vs 방침 불일치" sub="수집은 하는데 방침에 없는 항목" color={C.fail} />
              <AlertBox x={250} y={140} w={210} h={38} label="변경 이력 미관리" sub="1년+ 미변경 → 현황 불일치 의심" color={C.warn} />

              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">방침 하단에 "시행일: 2026.03.01 (이전 버전 보기)" 표시 권장</text>
            </motion.g>
          )}

          {/* Step 1: 동의 화면 + 비밀번호 규칙 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 동의 화면 */}
              <text x={140} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">동의 화면 점검</text>

              {/* 회원가입 흐름 */}
              <rect x={10} y={24} width={255} height={110} rx={6} fill={C.web} opacity={0.04} stroke={C.web} strokeWidth={0.5} />

              <ActionBox x={20} y={32} w={110} h={32} label="필수/선택 분리" sub="포괄 동의 금지" color={C.ok} />
              <ActionBox x={145} y={32} w={110} h={32} label="사전 체크 금지" sub="checked=false 필수" color={C.fail} />

              <ActionBox x={20} y={72} w={110} h={32} label="항목·목적·기간" sub="구체적 명시" color={C.ok} />
              <ActionBox x={145} y={72} w={110} h={32} label="미동의 시 차단" sub="다음 버튼 비활성" color={C.ok} />

              <text x={137} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적: 전체 화면 캡처 (스크롤 포함)</text>

              {/* 비밀번호 규칙 */}
              <rect x={280} y={24} width={190} height={110} rx={6} fill={C.warn} opacity={0.04} stroke={C.warn} strokeWidth={0.5} />
              <text x={375} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>비밀번호 규칙</text>

              <ActionBox x={290} y={48} w={170} h={30} label="규칙 안내 텍스트" sub="영+숫+특수 8자 이상" color={C.warn} />
              <ActionBox x={290} y={84} w={170} h={30} label="서버 측 검증 필수" sub="클라이언트만 = 우회 가능" color={C.fail} />

              {/* 결함 */}
              <AlertBox x={60} y={148} w={360} h={35} label="하나의 체크박스로 전체 동의 = 포괄 동의 결함" sub="필수 동의와 선택 동의를 분리해야 유효한 동의" color={C.fail} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사원이 직접 회원가입 페이지에서 확인</text>
            </motion.g>
          )}

          {/* Step 2: 에러 페이지 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={15} y={10} w={170} h={40} label="존재하지 않는 URL 입력" sub="example.com/asdfjkl123" color={C.web} />
              <Arrow x1={185} y1={30} x2={210} y2={30} color={C.web} />

              <ModuleBox x={212} y={8} w={120} h={44} label="에러 페이지" sub="404 / 500 응답" color={C.web} />
              <Arrow x1={332} y1={30} x2={350} y2={30} color={C.fail} />

              <text x={415} y={25} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fail}>노출 금지 항목</text>

              {/* 노출 금지 항목 */}
              <AlertBox x={350} y={32} w={120} h={28} label="스택 트레이스" sub="" color={C.fail} />
              <AlertBox x={350} y={66} w={120} h={28} label="서버 버전" sub="nginx/1.18.0" color={C.fail} />
              <AlertBox x={350} y={100} w={120} h={28} label="내부 경로" sub="/home/deploy/..." color={C.fail} />
              <AlertBox x={350} y={134} w={120} h={28} label="DB 에러" sub="MySQL Error 1045" color={C.fail} />

              {/* 서버 설정 */}
              <rect x={15} y={68} width={320} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={175} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">서버 설정으로 방지</text>

              <ActionBox x={15} y={96} w={150} h={38} label="nginx: server_tokens off" sub="버전 정보 숨김" color={C.ok} />
              <ActionBox x={180} y={96} w={155} h={38} label="Apache: ServerTokens Prod" sub="ServerSignature Off" color={C.ok} />

              {/* 응답 헤더 */}
              <ActionBox x={15} y={148} w={320} h={36} label="curl -I → Server, X-Powered-By, X-AspNet-Version 확인" sub="프레임워크 정보 노출도 지적 가능" color={C.warn} />

              <text x={175} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사원이 브라우저 + CLI로 직접 확인</text>
            </motion.g>
          )}

          {/* Step 3: HTTPS · TLS */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">HTTPS · TLS 점검</text>

              {/* 확인 항목 */}
              <ActionBox x={15} y={28} w={85} h={40} label="HTTPS 적용" sub="자물쇠 아이콘" color={C.ok} />
              <ActionBox x={110} y={28} w={85} h={40} label="HTTP 전환" sub="자동 리다이렉트" color={C.ok} />
              <ActionBox x={205} y={28} w={85} h={40} label="인증서 유효" sub="만료 30일+ 여유" color={C.warn} />
              <ActionBox x={300} y={28} w={85} h={40} label="TLS 1.2+" sub="1.0/1.1 = 결함" color={C.fail} />
              <ActionBox x={395} y={28} w={75} h={40} label="Mixed" sub="HTTP 리소스" color={C.fail} />

              {/* 상태 표시 */}
              <Arrow x1={57} y1={68} x2={57} y2={86} color={C.ok} />
              <Arrow x1={152} y1={68} x2={152} y2={86} color={C.ok} />
              <Arrow x1={247} y1={68} x2={247} y2={86} color={C.warn} />
              <Arrow x1={342} y1={68} x2={342} y2={86} color={C.fail} />
              <Arrow x1={432} y1={68} x2={432} y2={86} color={C.fail} />

              <StatusBox x={15} y={90} w={85} h={38} label="양호" sub="" color={C.ok} progress={1} />
              <StatusBox x={110} y={90} w={85} h={38} label="양호" sub="" color={C.ok} progress={1} />
              <StatusBox x={205} y={90} w={85} h={38} label="주의" sub="만료 임박" color={C.warn} progress={0.3} />
              <StatusBox x={300} y={90} w={85} h={38} label="결함" sub="TLS 1.0 사용" color={C.fail} progress={0.1} />
              <StatusBox x={395} y={90} w={75} h={38} label="결함" sub="HTTP 혼합" color={C.fail} progress={0.1} />

              {/* CLI 확인 */}
              <rect x={30} y={142} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={152} w={200} h={36} label="openssl s_client -tls1_2" sub="TLS 1.2 지원 여부 확인" color={C.web} />
              <ActionBox x={250} y={152} w={200} h={36} label="nmap ssl-enum-ciphers" sub="약한 cipher = Grade C 이하" color={C.web} />

              <text x={240} y={212} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Let's Encrypt: certbot renew --dry-run 사전 확인 필수</text>
            </motion.g>
          )}

          {/* Step 4: 회원탈퇴 + 쿠키 배너 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 탈퇴 */}
              <text x={130} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">회원탈퇴 절차</text>

              <DataBox x={15} y={26} w={80} h={26} label="마이페이지" color={C.web} />
              <Arrow x1={95} y1={39} x2={108} y2={39} color={C.web} />
              <DataBox x={110} y={26} w={60} h={26} label="설정" color={C.web} />
              <Arrow x1={170} y1={39} x2={183} y2={39} color={C.web} />
              <DataBox x={185} y={26} w={70} h={26} label="탈퇴" color={C.fail} />
              <text x={130} y={66} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">3단계 이내 접근 권장</text>

              <Arrow x1={130} y1={70} x2={130} y2={86} color={C.fail} />

              <ActionBox x={15} y={88} w={100} h={34} label="파기 안내" sub="어떤 정보가 삭제" color={C.fail} />
              <ActionBox x={125} y={88} w={100} h={34} label="분리보관 안내" sub="법적 보존 의무분" color={C.warn} />

              <Arrow x1={65} y1={122} x2={65} y2={138} color={C.ok} />
              <DataBox x={20} y={140} w={200} h={26} label="DB에서 실제 삭제/비식별화" color={C.ok} />

              {/* 쿠키 배너 */}
              <rect x={270} y={20} width={200} height={150} rx={8} fill={C.warn} opacity={0.04} stroke={C.warn} strokeWidth={0.5} />
              <text x={370} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">쿠키 배너</text>

              <ActionBox x={280} y={46} w={180} h={28} label="동의 전 쿠키 설치 금지" sub="" color={C.fail} />
              <ActionBox x={280} y={80} w={180} h={28} label="거부 옵션 필수" sub="동의만 있으면 지적" color={C.warn} />
              <ActionBox x={280} y={114} w={180} h={28} label="종류별 선택 동의" sub="필수/분석/마케팅 분리" color={C.web} />
              <ActionBox x={280} y={148} w={180} h={28} label="쿠키 정책 링크" sub="상세 정책 페이지 연결" color={C.web} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">심사원이 브라우저에서 직접 서비스에 접속하여 확인</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
