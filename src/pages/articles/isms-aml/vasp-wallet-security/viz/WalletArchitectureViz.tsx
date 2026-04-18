import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#6366f1', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '콜드월렛 → HSM/에어갭 격리', body: 'HSM 내부에서 키 생성+서명 수행, 키가 장치 밖으로 나오지 않음. FIPS 140-2 L3 인증 시 물리적 탐침 시도 시 키 자동 삭제.' },
  { label: '핫월렛 한도 관리와 서버 보안', body: '일일 출금 한도로 최대 피해액 제한. 개인키는 메모리에만 존재, 디스크 평문 기록 금지. Secrets Manager에서 암호화된 키 주입.' },
  { label: '법적 요구: 80% 콜드월렛 보관', body: '이용자 자산의 경제적 가치(전월 말 기준 1년 일평균 원화환산액) 80% 이상을 콜드월렛에 보관. 매월 초 5영업일 이내 재산정.' },
  { label: '콜드→핫 전송과 자산 분리', body: '전송 요청→CISO 승인→Multi-sig 서명→브로드캐스트→온체인 컨펌→잔고 대조. 이용자/회사 자산 별도 지갑 분리, Proof of Reserves 공개.' },
  { label: '외부 수탁 통제와 온체인 검증', body: '수탁업체 보안 사전 평가, 이해상충 방지, 재위탁 원칙 금지. 온체인 잔고와 내부 원장 실시간 대조, 블록 높이 스냅샷으로 감사 증거 제출.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#wa-arrow)" />;
}

export default function WalletArchitectureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="wa-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* HSM device */}
              <rect x={30} y={20} width={160} height={110} rx={10} fill="var(--card)" stroke={C.blue} strokeWidth={1} />
              <rect x={30} y={20} width={160} height={22} rx={10} fill={`${C.blue}18`} />
              <rect x={30} y={32} width={160} height={10} fill={`${C.blue}18`} />
              <text x={110} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>HSM</text>
              <text x={110} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">FIPS 140-2 Level 3</text>
              <text x={50} y={78} fontSize={9} fill="var(--muted-foreground)">1. 키 생성 (내부)</text>
              <text x={50} y={93} fontSize={9} fill="var(--muted-foreground)">2. 서명 연산 (내부)</text>
              <text x={50} y={108} fontSize={9} fill="var(--muted-foreground)">3. 키 외부 유출 불가</text>
              <text x={50} y={123} fontSize={9} fill={C.red}>탐침 시 키 자동 삭제</text>
              {/* Air-gapped */}
              <rect x={220} y={20} width={160} height={110} rx={10} fill="var(--card)" stroke={C.green} strokeWidth={1} />
              <rect x={220} y={20} width={160} height={22} rx={10} fill={`${C.green}18`} />
              <rect x={220} y={32} width={160} height={10} fill={`${C.green}18`} />
              <text x={300} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.green}>에어갭 컴퓨터</text>
              <text x={240} y={58} fontSize={9} fill="var(--muted-foreground)">네트워크 카드 물리 제거</text>
              <text x={240} y={78} fontSize={9} fill="var(--muted-foreground)">USB/QR로 서명 요청 전달</text>
              <text x={240} y={93} fontSize={9} fill="var(--muted-foreground)">서명 결과만 반출</text>
              <text x={240} y={108} fontSize={9} fill={C.green}>원격 공격 경로 원천 차단</text>
              {/* Physical security */}
              <rect x={400} y={20} width={70} height={110} rx={6} fill={`${C.amber}08`} stroke={C.amber} strokeWidth={0.6} />
              <text x={435} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>물리 보안</text>
              <text x={435} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">금고</text>
              <text x={435} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">CCTV</text>
              <text x={435} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">출입 로그</text>
              <text x={435} y={104} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인원 최소</text>
              {/* Shamir */}
              <DataBox x={80} y={150} w={150} h={30} label="Shamir's Secret Sharing" color={C.blue} />
              <DataBox x={260} y={150} w={120} h={30} label="Multi-sig 적용" color={C.green} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">단일 장치 탈취 → 자금 이동 불가</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Hot wallet server */}
              <ModuleBox x={20} y={20} w={140} h={55} label="핫월렛 서버" sub="서명 전용 역할" color={C.amber} />
              {/* Key flow */}
              <rect x={190} y={20} width={170} height={80} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={275} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">개인키 관리</text>
              <text x={200} y={58} fontSize={9} fill="var(--muted-foreground)">메모리에만 존재 (디스크 X)</text>
              <text x={200} y={73} fontSize={9} fill="var(--muted-foreground)">재시작 시 Secrets Manager 주입</text>
              <text x={200} y={88} fontSize={9} fill="var(--muted-foreground)">불필요 포트/서비스 비활성화</text>
              <Arrow x1={160} y1={47} x2={188} y2={47} color={C.amber} />
              {/* Daily limit */}
              <rect x={380} y={20} width={90} height={80} rx={8} fill={`${C.red}08`} stroke={C.red} strokeWidth={0.6} />
              <text x={425} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>일일 한도</text>
              <text x={425} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">초과 출금</text>
              <text x={425} y={74} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ 자동 보류</text>
              <text x={425} y={88} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ 별도 승인</text>
              {/* Limit adjustments */}
              <rect x={20} y={120} width={450} height={38} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={30} y={138} fontSize={9} fontWeight={600} fill={C.amber}>한도 산정 기준</text>
              <text x={30} y={152} fontSize={9} fill="var(--muted-foreground)">일평균 출금량 + 시장 변동성 + 보안 상황 종합 → 주기적 조정</text>
              {/* Attack surface */}
              <AlertBox x={100} y={175} w={280} h={34} label="핫월렛 침해 시 최대 피해액 = 일일 한도" sub="공격 표면(attack surface) 최소화가 핵심" color={C.red} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 80% rule */}
              <StatusBox x={20} y={20} w={200} h={55} label="콜드월렛 보관 비율" sub="법적 의무: 80% 이상" color={C.blue} progress={0.8} />
              <StatusBox x={260} y={20} w={200} h={55} label="핫월렛 잔고" sub="최대 20%" color={C.amber} progress={0.2} />
              {/* Calculation */}
              <rect x={20} y={95} width={440} height={50} rx={6} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.5} />
              <text x={30} y={113} fontSize={10} fontWeight={600} fill={C.blue}>경제적 가치 산정</text>
              <text x={30} y={130} fontSize={9} fill="var(--muted-foreground)">보유 수량 x 전월 말 기준 최근 1년 일평균 원화환산액</text>
              <text x={30} y={140} fontSize={8} fill="var(--muted-foreground)">예) 100 BTC x 5,000만 원 = 50억 원 → 콜드 40억 원 이상</text>
              {/* Timeline */}
              <rect x={20} y={160} width={440} height={45} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={30} y={178} fontSize={10} fontWeight={600} fill={C.green}>재산정 주기</text>
              <text x={30} y={195} fontSize={9} fill="var(--muted-foreground)">매월 초 5영업일 이내 · 80% 미달 시 즉시 콜드월렛으로 이동 · 자동 모니터링 알림 필수</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Cold to Hot transfer flow */}
              <ActionBox x={10} y={25} w={75} h={38} label="전송 요청" sub="운영팀 작성" color={C.blue} />
              <Arrow x1={85} y1={44} x2={98} y2={44} color={C.blue} />
              <ActionBox x={100} y={25} w={75} h={38} label="CISO 승인" sub="검토 후 승인" color={C.green} />
              <Arrow x1={175} y1={44} x2={188} y2={44} color={C.green} />
              <ActionBox x={190} y={25} w={80} h={38} label="Multi-sig" sub="분산 서명" color={C.amber} />
              <Arrow x1={270} y1={44} x2={283} y2={44} color={C.amber} />
              <ActionBox x={285} y={25} w={80} h={38} label="브로드캐스트" sub="온체인 전송" color={C.blue} />
              <Arrow x1={365} y1={44} x2={378} y2={44} color={C.blue} />
              <ActionBox x={380} y={25} w={90} h={38} label="잔고 대조" sub="정합성 검증" color={C.green} />
              {/* Asset separation */}
              <rect x={10} y={85} width={220} height={55} rx={6} fill={`${C.blue}08`} stroke={C.blue} strokeWidth={0.6} />
              <text x={20} y={103} fontSize={10} fontWeight={600} fill={C.blue}>자산 분리</text>
              <text x={20} y={118} fontSize={9} fill="var(--muted-foreground)">이용자 지갑 ≠ 회사 지갑</text>
              <text x={20} y={133} fontSize={9} fill="var(--muted-foreground)">혼합 보관 시 부도 위험 + 검증 불가</text>
              {/* Proof of Reserves */}
              <rect x={250} y={85} width={220} height={55} rx={6} fill={`${C.green}08`} stroke={C.green} strokeWidth={0.6} />
              <text x={260} y={103} fontSize={10} fontWeight={600} fill={C.green}>Proof of Reserves</text>
              <text x={260} y={118} fontSize={9} fill="var(--muted-foreground)">Merkle Tree로 증명 생성</text>
              <text x={260} y={133} fontSize={9} fill="var(--muted-foreground)">이용자가 독립적 검증 가능</text>
              {/* Log */}
              <DataBox x={140} y={158} w={200} h={30} label="전 과정 로그 기록 → 월간 감사 대상" color={C.amber} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* External custody requirements */}
              <ModuleBox x={20} y={15} w={140} h={48} label="외부 수탁 통제" sub="위탁 보관 시 요건" color={C.blue} />
              <rect x={180} y={15} width={280} height={80} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={190} y={34} fontSize={9} fontWeight={600} fill={C.blue}>1. 사고예방 체계 평가</text>
              <text x={310} y={34} fontSize={8} fill="var(--muted-foreground)">콜드월렛 비율, Multi-sig, 대응절차</text>
              <text x={190} y={52} fontSize={9} fontWeight={600} fill={C.green}>2. 이해상충 방지</text>
              <text x={310} y={52} fontSize={8} fill="var(--muted-foreground)">위탁 자산 자기거래/담보 금지</text>
              <text x={190} y={70} fontSize={9} fontWeight={600} fill={C.amber}>3. 재위탁 원칙 금지</text>
              <text x={310} y={70} fontSize={8} fill="var(--muted-foreground)">불가피 시 서면동의 + 보안 검증</text>
              <text x={190} y={88} fontSize={9} fontWeight={600} fill={C.red}>4. 정기 재평가</text>
              <text x={310} y={88} fontSize={8} fill="var(--muted-foreground)">연간 감사보고서/사고이력/재무 검토</text>
              {/* On-chain verification */}
              <rect x={20} y={110} width={440} height={50} rx={6} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.5} />
              <text x={30} y={128} fontSize={10} fontWeight={600} fill={C.green}>온체인 검증</text>
              <text x={30} y={143} fontSize={9} fill="var(--muted-foreground)">블록 탐색기/노드 API → 지갑 잔고 실시간 조회 → 내부 원장 대조</text>
              <text x={30} y={156} fontSize={9} fill="var(--muted-foreground)">감사 시 블록 높이 스냅샷 기준 검증 · 온체인 데이터 위변조 불가 → 높은 증거 신뢰도</text>
              {/* Audit checks */}
              <DataBox x={50} y={175} w={110} h={28} label="80% 비율 준수" color={C.blue} />
              <DataBox x={180} y={175} w={120} h={28} label="이용자/회사 분리" color={C.green} />
              <DataBox x={320} y={175} w={130} h={28} label="명부 수량 = 실잔고" color={C.amber} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
