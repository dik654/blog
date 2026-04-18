import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  net: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '망분리 · ping 테스트', body: 'DMZ와 내부망 사이 ICMP 차단 확인. DMZ 웹서버 → 내부 DB ping 시 100% packet loss가 정상.' },
  { label: '방화벽 규칙 점검', body: 'ANY→ANY 규칙, Hit Count 0 규칙, 과도한 포트 범위를 필터링. 정기 검토 기록(반기 1회+)도 확인.' },
  { label: '불필요 포트 · OS 보안', body: 'ss -tlnp로 리스닝 포트 조회. SSH root 허용, 패스워드 정책 미설정, 불필요 서비스 활성화를 점검.' },
  { label: '패치 현황', body: '마지막 패치 일자, 분기 1회 정기 패치, 긴급 CVE 패치 절차, 테스트 환경 검증 여부를 확인.' },
  { label: '네트워크 장비 · 클라우드', body: '기본 계정 변경, SNMP 커뮤니티 문자열, 펌웨어 버전. 클라우드는 Security Group의 0.0.0.0/0 규칙을 확인.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#sna-arrow)" />;
}

export default function ServerNetworkAuditViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sna-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 망분리 ping 테스트 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">네트워크 구간별 ping 테스트</text>

              {/* 구간 라벨 */}
              <rect x={20} y={30} width={120} height={24} rx={4} fill={C.warn} opacity={0.15} />
              <text x={80} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>DMZ 구간</text>

              <rect x={180} y={30} width={120} height={24} rx={4} fill={C.net} opacity={0.15} />
              <text x={240} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.net}>방화벽</text>

              <rect x={340} y={30} width={120} height={24} rx={4} fill={C.ok} opacity={0.15} />
              <text x={400} y={46} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.ok}>내부망</text>

              {/* 서버 박스 */}
              <ModuleBox x={25} y={65} w={110} h={44} label="웹서버" sub="DMZ, 외부 접근 가능" color={C.warn} />
              <ModuleBox x={345} y={65} w={110} h={44} label="DB서버" sub="내부망, 차단 필수" color={C.ok} />

              {/* ping 시도 → 차단 */}
              <motion.line x1={135} y1={87} x2={260} y2={87}
                stroke={C.fail} strokeWidth={1.5} strokeDasharray="6 3"
                initial={{ x2: 135 }} animate={{ x2: 260 }} transition={{ duration: 0.6 }} />
              <text x={200} y={82} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.fail}>ping</text>

              {/* 차단 표시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <line x1={265} y1={78} x2={280} y2={96} stroke={C.fail} strokeWidth={2.5} />
                <line x1={280} y1={78} x2={265} y2={96} stroke={C.fail} strokeWidth={2.5} />
                <text x={272} y={75} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.fail}>BLOCK</text>
              </motion.g>

              {/* 기대 결과 */}
              <DataBox x={60} y={130} w={160} h={30} label="100% packet loss" color={C.ok} />
              <AlertBox x={260} y={125} w={180} h={38} label="ping 통과 = 망분리 미흡" sub="즉시 결함 판정" color={C.fail} />

              <text x={240} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증적: 방화벽 ICMP 차단 규칙 + ping 실패 화면 캡처</text>
              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">예외 허용 시 → 승인서(일자, 승인자, 사유, 만료일) 필수</text>
            </motion.g>
          )}

          {/* Step 1: 방화벽 규칙 점검 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={165} y={8} w={150} h={44} label="방화벽 규칙 목록" sub="심사원: 전체 규칙 보여주세요" color={C.net} />

              <Arrow x1={200} y1={52} x2={80} y2={72} color={C.fail} />
              <Arrow x1={240} y1={52} x2={240} y2={72} color={C.warn} />
              <Arrow x1={280} y1={52} x2={400} y2={72} color={C.fail} />

              <AlertBox x={15} y={75} w={130} h={42} label="ANY → ANY" sub="사실상 방화벽 무력화" color={C.fail} />
              <AlertBox x={170} y={75} w={140} h={42} label="Hit Count = 0" sub="사용 안 하는 규칙 잔존" color={C.warn} />
              <AlertBox x={335} y={75} w={130} h={42} label="포트 1-65535" sub="전체 포트 허용 = 결함" color={C.fail} />

              {/* 정기 검토 */}
              <rect x={30} y={135} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={148} w={130} h={38} label="규칙 CSV 추출" sub="규칙번호·출발지·목적지" color={C.net} />
              <Arrow x1={160} y1={167} x2={178} y2={167} color={C.net} />
              <ActionBox x={180} y={148} w={120} h={38} label="필터링 점검" sub="ANY / Hit0 / 빈 설명" color={C.warn} />
              <Arrow x1={300} y1={167} x2={318} y2={167} color={C.ok} />
              <ActionBox x={320} y={148} w={130} h={38} label="정기 검토 보고서" sub="반기 1회 이상 필수" color={C.ok} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사전 필터링 → 문제 규칙 정리 → 심사 대응 시간 단축</text>
            </motion.g>
          )}

          {/* Step 2: 불필요 포트 + OS 보안 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">서버 보안 설정 점검</text>

              {/* 포트 확인 */}
              <ActionBox x={15} y={28} w={100} h={36} label="ss -tlnp" sub="리스닝 포트 조회" color={C.net} />
              <Arrow x1={115} y1={46} x2={133} y2={46} color={C.net} />

              <DataBox x={135} y={30} w={95} h={32} label="0.0.0.0:22" color={C.warn} />
              <DataBox x={245} y={30} w={95} h={32} label="0.0.0.0:3306" color={C.fail} />
              <DataBox x={355} y={30} w={100} h={32} label="127.0.0.1:6379" color={C.ok} />

              <text x={182} y={75} textAnchor="middle" fontSize={7.5} fill={C.warn}>SSH IP 제한 필요</text>
              <text x={292} y={75} textAnchor="middle" fontSize={7.5} fill={C.fail}>DB 외부 노출 결함</text>
              <text x={405} y={75} textAnchor="middle" fontSize={7.5} fill={C.ok}>로컬만 양호</text>

              {/* OS 보안 설정 */}
              <rect x={30} y={90} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ModuleBox x={15} y={100} w={140} h={44} label="/etc/login.defs" sub="PASS_MAX_DAYS <= 90" color={C.net} />
              <ModuleBox x={170} y={100} w={140} h={44} label="/etc/ssh/sshd_config" sub="PermitRootLogin no" color={C.warn} />
              <ModuleBox x={325} y={100} w={140} h={44} label="systemctl" sub="불필요 데몬 비활성화" color={C.fail} />

              <Arrow x1={85} y1={144} x2={85} y2={162} color={C.fail} />
              <Arrow x1={240} y1={144} x2={240} y2={162} color={C.fail} />
              <Arrow x1={395} y1={144} x2={395} y2={162} color={C.fail} />

              <AlertBox x={20} y={165} w={130} h={35} label="99999 = 미설정" sub="즉시 결함" color={C.fail} />
              <AlertBox x={175} y={165} w={130} h={35} label="yes = root 원격허용" sub="2.5.1 위반" color={C.fail} />
              <AlertBox x={330} y={165} w={130} h={35} label="cups, avahi 등" sub="운영 불필요 서비스" color={C.warn} />
            </motion.g>
          )}

          {/* Step 3: 패치 현황 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={15} y={15} w={130} h={42} label="패치 내역 조회" sub="apt list --upgradable" color={C.net} />
              <Arrow x1={145} y1={36} x2={168} y2={36} color={C.net} />

              <ModuleBox x={170} y={13} w={140} h={46} label="마지막 패치 일자" sub="rpm -qa --last | head" color={C.warn} />
              <Arrow x1={310} y1={36} x2={333} y2={36} color={C.warn} />

              <AlertBox x={335} y={13} w={130} h={46} label="6개월 이전?" sub="패치 미흡 결함" color={C.fail} />

              {/* 심사원 확인 포인트 */}
              <rect x={30} y={75} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={15} y={88} w={110} h={40} label="패치 주기" sub="분기 1회 이상" color={C.ok} />
              <ActionBox x={138} y={88} w={105} h={40} label="긴급 패치 절차" sub="CVE 발표 시 대응" color={C.warn} />
              <ActionBox x={256} y={88} w={105} h={40} label="테스트 환경" sub="운영 전 사전 검증" color={C.net} />
              <ActionBox x={374} y={88} w={92} h={40} label="패치 관리대장" sub="일자·서버·내용" color={C.ok} />

              {/* 커널 버전 */}
              <AlertBox x={100} y={148} w={280} h={42} label="uname -r → EOL 커널이면 지적" sub="예: CentOS 7 (2024년 6월 지원 종료) → OS 마이그레이션 계획 필요" color={C.fail} />

              <text x={240} y={212} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">운영 직접 적용 = 변경관리 미준수. 테스트 환경 검증 필수.</text>
            </motion.g>
          )}

          {/* Step 4: 네트워크 장비 + 클라우드 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">네트워크 장비 + 클라우드 점검</text>

              {/* 네트워크 장비 */}
              <ModuleBox x={15} y={28} w={95} h={44} label="스위치" sub="기본 계정 변경" color={C.net} />
              <ModuleBox x={125} y={28} w={95} h={44} label="라우터" sub="펌웨어 버전" color={C.net} />
              <ModuleBox x={235} y={28} w={95} h={44} label="VPN 장비" sub="관리 IP 제한" color={C.net} />

              <Arrow x1={62} y1={72} x2={62} y2={92} color={C.fail} />
              <Arrow x1={172} y1={72} x2={172} y2={92} color={C.warn} />
              <Arrow x1={282} y1={72} x2={282} y2={92} color={C.ok} />

              <AlertBox x={15} y={95} w={95} h={35} label="admin/admin" sub="기본 계정 = 결함" color={C.fail} />
              <AlertBox x={125} y={95} w={95} h={35} label="SNMP: public" sub="기본값 = 결함" color={C.warn} />
              <DataBox x={235} y={98} w={95} h={28} label="Syslog 전송" color={C.ok} />

              {/* 클라우드 */}
              <rect x={345} y={28} width={125} height={102} rx={8} fill={C.warn} opacity={0.06} stroke={C.warn} strokeWidth={0.5} />
              <text x={407} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>클라우드</text>

              <DataBox x={355} y={50} w={105} h={28} label="Security Group" color={C.warn} />
              <Arrow x1={407} y1={78} x2={407} y2={96} color={C.fail} />
              <AlertBox x={355} y={98} w={105} h={28} label="0.0.0.0/0" sub="" color={C.fail} />

              {/* 하단 메시지 */}
              <rect x={30} y={148} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={240} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.fail}>
                "클라우드라서 괜찮다"는 항변은 통하지 않는다
              </text>
              <text x={240} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">온프레미스와 동일한 접근통제 기준 적용</text>
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">AWS SG / GCP 방화벽 규칙에서 인바운드 0.0.0.0/0 = 동일 지적</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
