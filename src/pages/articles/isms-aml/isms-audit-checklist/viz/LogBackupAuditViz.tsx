import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  log: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '로그 수집 · 보존', body: '서버 접속, 앱, DB, 방화벽, 개인정보 처리 로그를 수집. 법적 보존 기간(6개월~2년)을 충족해야 한다.' },
  { label: '로그 위변조 방지', body: '개인정보 처리 시스템 접속기록은 위변조 방지 법적 의무. 중앙 로그 서버(Syslog, ELK)로 실시간 전송이 핵심.' },
  { label: '백업 정상 수행', body: '크론 스케줄 확인, 백업 파일 연속성, 크기 일관성, 실패 알림, 암호화 여부, 소산 백업까지 점검.' },
  { label: '복구 테스트', body: '백업이 있어도 복구 불가능하면 무의미. 연 1회+ 복구 테스트 보고서(RPO/RTO, 결과, 개선사항) 필수.' },
  { label: 'NTP · 변경관리', body: '서버 시간 동기화(NTP) 미설정 시 로그 시간 정합성 불가. 변경관리 기록(요청서, 이력대장, 긴급변경) 점검.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#lba-arrow)" />;
}

export default function LogBackupAuditViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="lba-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 로그 수집 · 보존 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">로그 유형별 수집 · 보존 기간</text>

              {/* 로그 유형 */}
              <DataBox x={10} y={28} w={85} h={30} label="서버 접속" color={C.log} />
              <DataBox x={105} y={28} w={75} h={30} label="앱 로그" color={C.log} />
              <DataBox x={190} y={28} w={80} h={30} label="DB 접속" color={C.warn} />
              <DataBox x={280} y={28} w={80} h={30} label="방화벽" color={C.log} />
              <DataBox x={370} y={28} w={100} h={30} label="개인정보 처리" color={C.fail} />

              {/* 보존 기간 */}
              <Arrow x1={52} y1={58} x2={52} y2={78} color={C.log} />
              <Arrow x1={142} y1={58} x2={142} y2={78} color={C.log} />
              <Arrow x1={230} y1={58} x2={230} y2={78} color={C.warn} />
              <Arrow x1={320} y1={58} x2={320} y2={78} color={C.log} />
              <Arrow x1={420} y1={58} x2={420} y2={78} color={C.fail} />

              <StatusBox x={10} y={82} w={85} h={42} label="6개월+" sub="/var/log/auth.log" color={C.log} progress={0.5} />
              <StatusBox x={105} y={82} w={75} h={42} label="내부 정책" sub="서비스별 경로" color={C.log} progress={0.4} />
              <StatusBox x={190} y={82} w={80} h={42} label="1년+" sub="접근제어 솔루션" color={C.warn} progress={0.7} />
              <StatusBox x={280} y={82} w={80} h={42} label="6개월+" sub="Syslog 서버" color={C.log} progress={0.5} />
              <StatusBox x={370} y={82} w={100} h={42} label="1~2년" sub="5만 명+: 2년" color={C.fail} progress={1} />

              {/* 확인 명령어 */}
              <rect x={30} y={140} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={150} w={130} h={36} label="ls -la /var/log/" sub="파일 존재 + 크기 확인" color={C.log} />
              <ActionBox x={175} y={150} w={130} h={36} label="tail -20 auth.log" sub="실제 기록 여부 확인" color={C.log} />
              <ActionBox x={320} y={150} w={135} h={36} label="logrotate 설정" sub="rotate 52 weekly = 1년" color={C.ok} />

              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">가장 오래된 로그 파일 날짜로 보존 기간 충족 여부를 검증</text>
            </motion.g>
          )}

          {/* Step 1: 위변조 방지 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">로그 위변조 방지 구조</text>

              {/* 서버들 */}
              <ModuleBox x={15} y={30} w={85} h={40} label="웹서버" sub="로그 생성" color={C.log} />
              <ModuleBox x={15} y={80} w={85} h={40} label="DB서버" sub="로그 생성" color={C.log} />
              <ModuleBox x={15} y={130} w={85} h={40} label="앱서버" sub="로그 생성" color={C.log} />

              {/* 전송 화살표 */}
              <motion.line x1={100} y1={50} x2={200} y2={90}
                stroke={C.ok} strokeWidth={1.5}
                initial={{ x2: 100 }} animate={{ x2: 200 }} transition={{ duration: 0.5 }}
                markerEnd="url(#lba-arrow)" />
              <motion.line x1={100} y1={100} x2={200} y2={100}
                stroke={C.ok} strokeWidth={1.5}
                initial={{ x2: 100 }} animate={{ x2: 200 }} transition={{ duration: 0.5, delay: 0.1 }}
                markerEnd="url(#lba-arrow)" />
              <motion.line x1={100} y1={150} x2={200} y2={110}
                stroke={C.ok} strokeWidth={1.5}
                initial={{ x2: 100 }} animate={{ x2: 200 }} transition={{ duration: 0.5, delay: 0.2 }}
                markerEnd="url(#lba-arrow)" />

              <text x={155} y={75} textAnchor="middle" fontSize={7.5} fill={C.ok}>실시간 전송</text>

              {/* 중앙 로그 서버 */}
              <ModuleBox x={202} y={72} w={140} h={55} label="중앙 로그 서버" sub="ELK / Splunk / CloudWatch" color={C.ok} />

              {/* 결과 */}
              <Arrow x1={342} y1={85} x2={365} y2={50} color={C.ok} />
              <Arrow x1={342} y1={110} x2={365} y2={140} color={C.ok} />

              <DataBox x={367} y={35} w={100} h={30} label="원본 보호" color={C.ok} />
              <DataBox x={367} y={125} w={100} h={30} label="통합 대시보드" color={C.ok} />

              {/* 결함 사례 */}
              <rect x={30} y={172} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={80} y={180} w={320} h={32} label="같은 서버에만 저장 = 위변조 방지 미흡 결함" sub="개인정보보호법 시행령 제48조의2 위반" color={C.fail} />
            </motion.g>
          )}

          {/* Step 2: 백업 정상 수행 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">백업 정상 수행 확인</text>

              {/* 크론 → 백업 파일 */}
              <ActionBox x={15} y={28} w={110} h={40} label="crontab -l" sub="백업 스케줄 확인" color={C.log} />
              <Arrow x1={125} y1={48} x2={148} y2={48} color={C.log} />

              <ModuleBox x={150} y={26} w={130} h={44} label="백업 파일 목록" sub="ls -lh /backup/daily/" color={C.log} />
              <Arrow x1={280} y1={48} x2={303} y2={48} color={C.log} />

              <DataBox x={305} y={32} w={160} h={32} label="날짜별 파일 연속성" color={C.ok} />

              {/* 확인 포인트 */}
              <rect x={30} y={82} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={100} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">심사원 확인 포인트</text>

              <ActionBox x={15} y={108} w={85} h={38} label="연속성" sub="빠진 날짜 없는지" color={C.ok} />
              <ActionBox x={110} y={108} w={85} h={38} label="크기 일관성" sub="0 또는 1/10이면 비정상" color={C.warn} />
              <ActionBox x={205} y={108} w={85} h={38} label="실패 알림" sub="Slack/이메일/SMS" color={C.warn} />
              <ActionBox x={300} y={108} w={80} h={38} label="암호화" sub="AES-256 필수" color={C.fail} />
              <ActionBox x={390} y={108} w={75} h={38} label="소산 백업" sub="물리적 분리" color={C.fail} />

              {/* 결함 */}
              <AlertBox x={30} y={162} w={195} h={35} label="평문 백업 + 개인정보 포함" sub="= 암호화 미적용 결함" color={C.fail} />
              <AlertBox x={255} y={162} w={195} h={35} label="같은 장소에만 보관" sub="= 소산 백업 미흡 결함" color={C.fail} />

              <text x={240} y={215} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">클라우드 백업: aws s3 ls로 원격 저장 확인</text>
            </motion.g>
          )}

          {/* Step 3: 복구 테스트 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">복구 테스트 보고서 필수 항목</text>

              <ActionBox x={15} y={30} w={85} h={40} label="테스트 일시" sub="연 1회+" color={C.log} />
              <Arrow x1={100} y1={50} x2={118} y2={50} color={C.log} />
              <ActionBox x={120} y={30} w={85} h={40} label="복구 대상" sub="어떤 시스템/DB" color={C.log} />
              <Arrow x1={205} y1={50} x2={223} y2={50} color={C.warn} />
              <ActionBox x={225} y={30} w={70} h={40} label="RPO" sub="복구 시점" color={C.warn} />
              <Arrow x1={295} y1={50} x2={313} y2={50} color={C.warn} />
              <ActionBox x={315} y={30} w={70} h={40} label="RTO" sub="복구 시간" color={C.warn} />
              <Arrow x1={385} y1={50} x2={403} y2={50} color={C.ok} />
              <ActionBox x={405} y={30} w={65} h={40} label="결과" sub="성공/실패" color={C.ok} />

              {/* 보고서 → 증적 */}
              <Arrow x1={240} y1={70} x2={240} y2={92} color={C.ok} />

              <StatusBox x={130} y={95} w={220} h={45} label="복구 테스트 보고서" sub="정형화 양식 → 매 테스트 동일 형식" color={C.ok} progress={1} />

              {/* 결함 + 팁 */}
              <rect x={30} y={155} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <AlertBox x={20} y={165} w={200} h={38} label="보고서 없음 = 결함" sub="구두 '작년에 했다' = 증적 미비" color={C.fail} />
              <DataBox x={250} y={170} w={210} h={28} label="Docker DB import → 레코드 수 비교" color={C.ok} />

              <text x={355} y={213} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">테스트 환경 어려울 때 간이 검증 방법</text>
            </motion.g>
          )}

          {/* Step 4: NTP · 변경관리 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* NTP */}
              <text x={130} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">NTP 동기화</text>

              <ModuleBox x={15} y={26} w={85} h={40} label="서버 A" sub="14:03 로그" color={C.log} />
              <ModuleBox x={110} y={26} w={85} h={40} label="서버 B" sub="14:05 로그" color={C.log} />

              <Arrow x1={57} y1={66} x2={57} y2={85} color={C.ok} />
              <Arrow x1={152} y1={66} x2={152} y2={85} color={C.ok} />

              <ActionBox x={45} y={88} w={130} h={36} label="timedatectl" sub="NTP active + synced = yes" color={C.ok} />

              <AlertBox x={15} y={132} w={200} h={30} label="NTP inactive = 시간 정합성 불가" sub="" color={C.fail} />
              <text x={115} y={178} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">모든 서버 동일 NTP 소스 필수</text>

              {/* 변경관리 */}
              <rect x={230} y={16} width={1} height={180} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <text x={360} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">변경관리 기록</text>

              <ActionBox x={250} y={26} w={100} h={36} label="변경 요청서" sub="내용·영향·롤백" color={C.warn} />
              <Arrow x1={350} y1={44} x2={365} y2={44} color={C.warn} />
              <ActionBox x={367} y={26} w={100} h={36} label="변경 이력 대장" sub="일시·대상·수행자" color={C.warn} />

              <Arrow x1={310} y1={62} x2={310} y2={78} color={C.warn} />

              <ActionBox x={260} y={80} w={200} h={36} label="긴급 변경 절차" sub="사전 승인 없이 변경 → 사후 보고서" color={C.fail} />

              <Arrow x1={360} y1={116} x2={360} y2={132} color={C.fail} />

              <AlertBox x={260} y={135} w={200} h={35} label="변경 건 有, 이력 無 = 결함" sub="audit.log와 대조하여 검증 가능" color={C.fail} />

              <text x={360} y={195} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">중앙화: 서버 → Fluentd → ELK</text>
              <text x={360} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">대시보드 = 심사원에게 좋은 인상</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
