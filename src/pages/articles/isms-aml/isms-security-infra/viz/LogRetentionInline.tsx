import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, ActionBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: '수집 방식: Syslog vs Agent vs API',
    body: 'Syslog(네트워크 장비 자동 전송), Agent(서버 설치형), API(클라우드 서비스 연동). 대상에 따라 적합한 방식 선택.',
  },
  {
    label: '로그 보관: 법적 기준 + 무결성 보장',
    body: '접속 기록 6개월+, 개인정보 1~2년, 거래 기록 5년(특정금융정보법). WORM 스토리지·해시값·별도 서버 분리로 위변조 방지.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#si-lr-arrow)" />;
}

export default function LogRetentionInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="si-lr-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={10} y={10} w={130} h={34} label="Syslog" sub="UDP/TCP 514 자동 전송" color={C.blue} />
              <ModuleBox x={175} y={10} w={130} h={34} label="Agent" sub="서버 설치 소프트웨어" color={C.green} />
              <ModuleBox x={340} y={10} w={130} h={34} label="API 연동" sub="클라우드 서비스 호출" color={C.amber} />

              <Arrow x1={75} y1={46} x2={75} y2={62} color={C.blue} />
              <Arrow x1={240} y1={46} x2={240} y2={62} color={C.green} />
              <Arrow x1={405} y1={46} x2={405} y2={62} color={C.amber} />

              <rect x={10} y={64} width={130} height={24} rx={3} fill="var(--card)" stroke={C.blue} strokeWidth={0.5} />
              <text x={75} y={80} textAnchor="middle" fontSize={8} fill="var(--foreground)">방화벽·스위치·라우터</text>
              <rect x={175} y={64} width={130} height={24} rx={3} fill="var(--card)" stroke={C.green} strokeWidth={0.5} />
              <text x={240} y={80} textAnchor="middle" fontSize={8} fill="var(--foreground)">OS·애플리케이션 로그</text>
              <rect x={340} y={64} width={130} height={24} rx={3} fill="var(--card)" stroke={C.amber} strokeWidth={0.5} />
              <text x={405} y={80} textAnchor="middle" fontSize={8} fill="var(--foreground)">AWS CloudTrail 등</text>

              <Arrow x1={75} y1={90} x2={240} y2={108} color={C.blue} />
              <Arrow x1={240} y1={90} x2={240} y2={108} color={C.green} />
              <Arrow x1={405} y1={90} x2={240} y2={108} color={C.amber} />
              <DataBox x={160} y={108} w={160} h={28} label="SIEM 중앙 수집" sub="정규화 + 상관분석" color={C.blue} />

              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">수집 대상에 따라 적합한 방식 선택</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* timeline */}
              <line x1={40} y1={40} x2={460} y2={40} stroke="var(--border)" strokeWidth={1.5} />
              <text x={40} y={30} fontSize={8} fill="var(--muted-foreground)">0</text>
              <text x={120} y={30} fontSize={8} fill="var(--muted-foreground)">6개월</text>
              <text x={210} y={30} fontSize={8} fill="var(--muted-foreground)">1년</text>
              <text x={300} y={30} fontSize={8} fill="var(--muted-foreground)">2년</text>
              <text x={440} y={30} fontSize={8} fill="var(--muted-foreground)">5년</text>

              <rect x={40} y={48} width={80} height={18} rx={2} fill={C.green} opacity={0.2} stroke={C.green} strokeWidth={0.5} />
              <text x={80} y={61} textAnchor="middle" fontSize={8} fill={C.green}>접속 기록</text>
              <rect x={40} y={70} width={260} height={18} rx={2} fill={C.blue} opacity={0.2} stroke={C.blue} strokeWidth={0.5} />
              <text x={170} y={83} textAnchor="middle" fontSize={8} fill={C.blue}>개인정보 접속 (5만건+ 2년)</text>
              <rect x={40} y={92} width={400} height={18} rx={2} fill={C.red} opacity={0.2} stroke={C.red} strokeWidth={0.5} />
              <text x={240} y={105} textAnchor="middle" fontSize={8} fill={C.red}>VASP 거래 기록 (특정금융정보법 5년)</text>
              <rect x={40} y={114} width={260} height={18} rx={2} fill={C.amber} opacity={0.2} stroke={C.amber} strokeWidth={0.5} />
              <text x={170} y={127} textAnchor="middle" fontSize={8} fill={C.amber}>보안 이벤트 (권장 3년)</text>

              <ActionBox x={120} y={142} w={240} h={26} label="무결성 보장: WORM + 해시값 + 별도 서버" color={C.blue} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">위변조된 로그는 증거 가치를 잃는다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
