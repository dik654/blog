import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  log: '#6366f1',
  ok: '#10b981',
  warn: '#f59e0b',
  fail: '#ef4444',
};

const STEPS = [
  { label: '로그 수집 확인', body: '서버 접속, 앱, DB, 방화벽, 개인정보 시스템 — 5종 로그가 모두 수집되고 있는지 확인.' },
  { label: '보존 기간 + 위변조 방지', body: '서버 로그 6개월+, 개인정보 DB 1년+(5만명 이상 2년). 위변조 방지는 중앙 로그 서버 전송이 핵심.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#lsi-arrow)" />;
}

export default function LogStorageInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="lsi-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">5종 로그 수집 여부 확인</text>

              <DataBox x={15} y={28} w={85} h={38} label="서버 접속" color={C.log} />
              <DataBox x={110} y={28} w={75} h={38} label="앱 로그" color={C.log} />
              <DataBox x={195} y={28} w={80} h={38} label="DB 접속" color={C.warn} />
              <DataBox x={285} y={28} w={80} h={38} label="방화벽" color={C.ok} />
              <DataBox x={375} y={28} w={90} h={38} label="개인정보 DB" color={C.fail} />

              <Arrow x1={57} y1={66} x2={57} y2={84} color={C.log} />
              <Arrow x1={147} y1={66} x2={147} y2={84} color={C.log} />
              <Arrow x1={235} y1={66} x2={235} y2={84} color={C.warn} />
              <Arrow x1={325} y1={66} x2={325} y2={84} color={C.ok} />
              <Arrow x1={420} y1={66} x2={420} y2={84} color={C.fail} />

              <text x={57} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">auth.log</text>
              <text x={147} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">서비스별</text>
              <text x={235} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">접근제어 솔루션</text>
              <text x={325} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">Syslog</text>
              <text x={420} y={96} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">별도 관리</text>

              <rect x={30} y={110} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={30} y={120} w={130} h={36} label="ls -la /var/log/" sub="파일 존재 + 크기 확인" color={C.log} />
              <Arrow x1={160} y1={138} x2={178} y2={138} color={C.log} />
              <ActionBox x={180} y={120} w={130} h={36} label="tail -20 auth.log" sub="실제 기록 여부 확인" color={C.ok} />
              <Arrow x1={310} y1={138} x2={328} y2={138} color={C.ok} />
              <ActionBox x={330} y={120} w={130} h={36} label="logrotate 설정" sub="보존 기간 검증" color={C.warn} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">ls -lt auth.log* | tail 로 가장 오래된 로그 파일 확인</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">보존 기간 + 위변조 방지</text>

              {/* 보존 기간 */}
              <DataBox x={15} y={28} w={130} h={34} label="서버·방화벽: 6개월+" color={C.ok} />
              <DataBox x={160} y={28} w={150} h={34} label="개인정보 DB: 1년+" color={C.warn} />
              <DataBox x={325} y={28} w={140} h={34} label="5만명 이상: 2년+" color={C.fail} />

              <rect x={30} y={78} width={420} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={95} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">위변조 방지 구조</text>

              {/* 위변조 방지 흐름 */}
              <ModuleBox x={15} y={102} w={110} h={40} label="원본 서버" sub="로그 생성" color={C.log} />
              <Arrow x1={125} y1={122} x2={155} y2={122} color={C.ok} />

              <ActionBox x={158} y={102} w={140} h={40} label="Rsyslog / Fluentd" sub="실시간 전송" color={C.ok} />
              <Arrow x1={298} y1={122} x2={328} y2={122} color={C.ok} />

              <ModuleBox x={330} y={102} w={135} h={40} label="중앙 로그 서버" sub="ELK, Splunk, CW Logs" color={C.ok} />

              <AlertBox x={60} y={158} w={360} h={32} label="같은 서버에만 저장 = 위변조 방지 미흡 결함" sub="원본 서버에서 삭제해도 중앙 서버에 기록이 남아야 함" color={C.fail} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
