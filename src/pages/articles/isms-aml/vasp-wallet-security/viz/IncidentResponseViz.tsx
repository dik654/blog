import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const C = { blue: '#6366f1', green: '#10b981', amber: '#f59e0b', red: '#ef4444' };

const STEPS = [
  { label: '침해사고 대응 4단계', body: '탐지(IDS/FDS/신고) → 초동대응(격리·잠금·출금정지) → 분석(포렌식·영향범위) → 복구+재발방지(패치·교육·모니터링 강화).' },
  { label: '내부/외부 금융사고 대응', body: '내부: 출금 정지 → 1시간 내 CCO/CISO 보고 → SAR 작성 → FIU 보고 → 온체인 추적.\n외부: FDS 자동 보류 → 계정 정지 → 본인 확인 → 수사기관 공조.' },
  { label: '재발방지 제도화', body: 'UBA(사용자 행위 분석) 상시 감시, 핫월렛 한도 자동 조정, AI 기반 FDS 고도화, Mixer 블랙리스트 관리.' },
  { label: '백업: DB · 서버 · 로그', body: 'DB: 매일 전체 백업(30일 보관, PITR). 서버: 분기별 설정 백업(물리 금고). 로그: 매일 증분(6개월~5년). 소산백업(다른 리전) 필수.' },
  { label: '복구 절차와 취약점 점검', body: 'DB 복구: 스테이징 검증 → 프로덕션 적용 → 온체인 대조. 시스템: 디스크 이미지 복원. RTO 4시간·RPO 1시간. 연 1회 모의해킹, Critical/High 30일 내 조치.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ir-arrow)" />;
}

export default function IncidentResponseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 4 stages */}
              <ActionBox x={10} y={20} w={105} h={48} label="1. 탐지" sub="Detection" color={C.blue} />
              <Arrow x1={115} y1={44} x2={128} y2={44} color={C.blue} />
              <ActionBox x={130} y={20} w={105} h={48} label="2. 초동대응" sub="Containment" color={C.amber} />
              <Arrow x1={235} y1={44} x2={248} y2={44} color={C.amber} />
              <ActionBox x={250} y={20} w={105} h={48} label="3. 분석" sub="Analysis" color={C.green} />
              <Arrow x1={355} y1={44} x2={368} y2={44} color={C.green} />
              <ActionBox x={370} y={20} w={100} h={48} label="4. 복구" sub="Recovery" color={C.red} />

              {/* Detection sources */}
              <rect x={10} y={85} width={105} height={55} rx={6} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.5} />
              <text x={62} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>탐지 경로</text>
              <text x={62} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">IDS/IPS</text>
              <text x={62} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">FDS · 로그 · 직원 신고</text>
              <text x={62} y={138} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">자동 + 수동 병행</text>

              {/* Containment actions */}
              <rect x={130} y={85} width={105} height={55} rx={6} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.5} />
              <text x={182} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>격리 조치</text>
              <text x={182} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">네트워크 차단</text>
              <text x={182} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">계정 잠금</text>
              <text x={182} y={138} textAnchor="middle" fontSize={8} fill={C.red}>핫월렛 출금 정지</text>

              {/* Analysis */}
              <rect x={250} y={85} width={105} height={55} rx={6} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.5} />
              <text x={302} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.green}>원인 규명</text>
              <text x={302} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">침해 경로 파악</text>
              <text x={302} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">디스크/메모리 포렌식</text>
              <text x={302} y={138} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">유출 규모 산정</text>

              {/* Recovery */}
              <rect x={370} y={85} width={100} height={55} rx={6} fill={`${C.red}06`} stroke={C.red} strokeWidth={0.5} />
              <text x={420} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.red}>복원+방지</text>
              <text x={420} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">취약점 패치</text>
              <text x={420} y={126} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">정책 강화</text>
              <text x={420} y={138} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">보안 교육</text>

              {/* Speed callout */}
              <AlertBox x={100} y={158} w={280} h={34} label="초동대응의 핵심은 속도 — 격리 지연 = 피해 급증" sub="" color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Internal incident */}
              <ModuleBox x={10} y={10} w={220} h={42} label="내부 금융사고" sub="횡령 · 비인가 출금 · 이중 출금" color={C.red} />
              <ActionBox x={10} y={62} w={65} h={30} label="출금 정지" color={C.red} />
              <Arrow x1={75} y1={77} x2={83} y2={77} color={C.red} />
              <ActionBox x={85} y={62} w={65} h={30} label="1h 보고" sub="CCO/CISO" color={C.amber} />
              <Arrow x1={150} y1={77} x2={158} y2={77} color={C.amber} />
              <ActionBox x={160} y={62} w={65} h={30} label="SAR 작성" sub="FIU 보고" color={C.blue} />

              {/* External incident */}
              <ModuleBox x={250} y={10} w={220} h={42} label="외부 금융사고" sub="계정 탈취 · 피싱 · 해킹" color={C.amber} />
              <ActionBox x={250} y={62} w={65} h={30} label="FDS 보류" color={C.amber} />
              <Arrow x1={315} y1={77} x2={323} y2={77} color={C.amber} />
              <ActionBox x={325} y={62} w={65} h={30} label="계정 정지" color={C.red} />
              <Arrow x1={390} y1={77} x2={398} y2={77} color={C.red} />
              <ActionBox x={400} y={62} w={65} h={30} label="본인 확인" color={C.green} />

              {/* On-chain tracking */}
              <rect x={10} y={105} width={220} height={50} rx={6} fill={`${C.blue}06`} stroke={C.blue} strokeWidth={0.5} />
              <text x={20} y={123} fontSize={9} fontWeight={600} fill={C.blue}>온체인 추적</text>
              <text x={20} y={138} fontSize={9} fill="var(--muted-foreground)">블록체인 분석업체 협력</text>
              <text x={20} y={150} fontSize={9} fill="var(--muted-foreground)">자금 이동 주소 클러스터 → 동결 요청</text>

              {/* Law enforcement */}
              <rect x={250} y={105} width={220} height={50} rx={6} fill={`${C.green}06`} stroke={C.green} strokeWidth={0.5} />
              <text x={260} y={123} fontSize={9} fontWeight={600} fill={C.green}>수사기관 공조</text>
              <text x={260} y={138} fontSize={9} fill="var(--muted-foreground)">포렌식 보고서 + 온체인 증거 제출</text>
              <text x={260} y={150} fontSize={9} fill="var(--muted-foreground)">IP/디바이스 핑거프린트/악성코드 공유</text>

              {/* FDS patterns */}
              <DataBox x={100} y={170} w={280} h={28} label="FDS: 비정상 IP · 대량 출금 · 새벽 활동 → 자동 보류" color={C.amber} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 4 prevention measures */}
              <rect x={15} y={15} width={210} height={70} rx={8} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={120} y={35} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.blue}>UBA (사용자 행위 분석)</text>
              <text x={25} y={52} fontSize={9} fill="var(--muted-foreground)">비정상 접근 · 업무외 로그인</text>
              <text x={25} y={66} fontSize={9} fill="var(--muted-foreground)">대량 데이터 조회 패턴 상시 감시</text>
              <text x={25} y={80} fontSize={9} fill={C.blue}>내부자 위협 조기 탐지</text>

              <rect x={245} y={15} width={220} height={70} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={355} y={35} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>핫월렛 자동 한도 조정</text>
              <text x={255} y={52} fontSize={9} fill="var(--muted-foreground)">이상 징후 감지 → 평시 50%로 축소</text>
              <text x={255} y={66} fontSize={9} fill="var(--muted-foreground)">보안팀 확인 후에만 복원</text>
              <text x={255} y={80} fontSize={9} fill={C.amber}>자동화된 피해 제한</text>

              <rect x={15} y={100} width={210} height={70} rx={8} fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
              <text x={120} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>AI 기반 FDS 고도화</text>
              <text x={25} y={137} fontSize={9} fill="var(--muted-foreground)">ML 모델로 정상 행동 프로파일 학습</text>
              <text x={25} y={151} fontSize={9} fill="var(--muted-foreground)">규칙 기반만으로는 새 공격 놓침</text>
              <text x={25} y={165} fontSize={9} fill={C.green}>일탈 패턴 실시간 탐지</text>

              <rect x={245} y={100} width={220} height={70} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={355} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.red}>Mixer 블랙리스트</text>
              <text x={255} y={137} fontSize={9} fill="var(--muted-foreground)">믹서(자금 혼합 서비스) 주소 관리</text>
              <text x={255} y={151} fontSize={9} fill="var(--muted-foreground)">블랙리스트 출금 → 자동 차단</text>
              <text x={255} y={165} fontSize={9} fill={C.red}>유입 자금 → 추가 심사</text>

              <text x={240} y={195} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">일회성 조치 X → 제도 수준 정착</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Three backup targets */}
              <ModuleBox x={10} y={10} w={145} h={75} label="DB 백업" sub="매일 전체 백업" color={C.blue} />
              <text x={82} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">S3 저장 · 30일 보관</text>
              <text x={82} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">PITR 가능</text>

              <ModuleBox x={170} y={10} w={145} h={75} label="서버 설정 백업" sub="분기별 수동" color={C.green} />
              <text x={242} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">OS · 설정 · 방화벽</text>
              <text x={242} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">물리 금고 보관</text>

              <ModuleBox x={330} y={10} w={140} h={75} label="로그 백업" sub="매일 증분" color={C.amber} />
              <text x={400} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">S3/Glacier</text>
              <text x={400} y={82} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">6개월~5년 보관</text>

              {/* Backup procedure */}
              <rect x={10} y={100} width={460} height={48} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={20} y={118} fontSize={10} fontWeight={600} fill="var(--foreground)">백업 절차</text>
              <ActionBox x={20} y={126} w={80} h={18} label="NTP 동기화" color={C.blue} />
              <Arrow x1={100} y1={135} x2={113} y2={135} color={C.blue} />
              <ActionBox x={115} y={126} w={90} h={18} label="전체 백업 1회" color={C.green} />
              <Arrow x1={205} y1={135} x2={218} y2={135} color={C.green} />
              <ActionBox x={220} y={126} w={90} h={18} label="cron 증분 백업" color={C.amber} />
              <Arrow x1={310} y1={135} x2={323} y2={135} color={C.amber} />
              <ActionBox x={325} y={126} w={90} h={18} label="AES-256 암호화" color={C.red} />
              <Arrow x1={415} y1={135} x2={428} y2={135} color={C.red} />
              <DataBox x={430} y={126} w={30} h={18} label="S3" color={C.blue} />

              {/* Off-site backup */}
              <rect x={10} y={158} width={460} height={40} rx={6} fill={`${C.red}06`} stroke={C.red} strokeWidth={0.5} />
              <text x={20} y={176} fontSize={10} fontWeight={600} fill={C.red}>소산백업 (off-site)</text>
              <text x={140} y={176} fontSize={9} fill="var(--muted-foreground)">물리적으로 다른 지역(다른 IDC / 다른 AWS 리전)에 동일 백업본 추가 보관</text>
              <text x={20} y={192} fontSize={9} fill="var(--muted-foreground)">화재/지진/홍수 등 재해로 주 백업 소실 대비</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* DB Recovery flow */}
              <text x={20} y={22} fontSize={10} fontWeight={700} fill={C.blue}>DB 복구</text>
              <ActionBox x={10} y={30} w={90} h={32} label="S3 다운로드" color={C.blue} />
              <Arrow x1={100} y1={46} x2={113} y2={46} color={C.blue} />
              <ActionBox x={115} y={30} w={100} h={32} label="스테이징 검증" color={C.green} />
              <Arrow x1={215} y1={46} x2={228} y2={46} color={C.green} />
              <ActionBox x={230} y={30} w={100} h={32} label="프로덕션 적용" color={C.amber} />
              <Arrow x1={330} y1={46} x2={343} y2={46} color={C.amber} />
              <ActionBox x={345} y={30} w={120} h={32} label="온체인 잔고 대조" color={C.red} />

              {/* System Recovery */}
              <text x={20} y={82} fontSize={10} fontWeight={700} fill={C.green}>시스템 복구</text>
              <ActionBox x={10} y={90} w={120} h={32} label="디스크 이미지 복원" sub="Clonezilla" color={C.green} />
              <Arrow x1={130} y1={106} x2={148} y2={106} color={C.green} />
              <ActionBox x={150} y={90} w={120} h={32} label="앱 배포" sub="시크릿 주입" color={C.amber} />
              <Arrow x1={270} y1={106} x2={288} y2={106} color={C.amber} />
              <DataBox x={290} y={94} w={100} h={24} label="서비스 재개" color={C.green} />

              {/* RTO / RPO */}
              <rect x={10} y={135} width={220} height={40} rx={6} fill={`${C.blue}08`} stroke={C.blue} strokeWidth={0.6} />
              <text x={20} y={153} fontSize={10} fontWeight={600} fill={C.blue}>RTO (목표 복구 시간)</text>
              <text x={20} y={168} fontSize={10} fontWeight={700} fill={C.blue}>4시간 이내</text>

              <rect x={250} y={135} width={220} height={40} rx={6} fill={`${C.green}08`} stroke={C.green} strokeWidth={0.6} />
              <text x={260} y={153} fontSize={10} fontWeight={600} fill={C.green}>RPO (목표 데이터 손실)</text>
              <text x={260} y={168} fontSize={10} fontWeight={700} fill={C.green}>1시간 이내</text>

              {/* Vulnerability assessment */}
              <rect x={10} y={188} width={460} height={28} rx={6} fill={`${C.amber}06`} stroke={C.amber} strokeWidth={0.5} />
              <text x={20} y={206} fontSize={9} fontWeight={600} fill={C.amber}>취약점 점검</text>
              <text x={115} y={206} fontSize={9} fill="var(--muted-foreground)">연 1회 모의해킹 · Critical/High 30일 내 조치 · 다음 해 재발 여부 확인 → 보안 개선 순환</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
