import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

const STEPS = [
  { label: 'External Systems', body: '거래소 가격 수집, 이더리움 브릿지, 클라이언트 앱이 연결됩니다.' },
  { label: 'Protocol Layer', body: 'Cosmos SDK + CometBFT 기반 코어. CLOB 모듈이 온체인 오더북을 관리합니다.' },
  { label: 'Daemon Processes', body: 'Price/Liquidation/Bridge 3개 데몬이 외부 데이터를 중계합니다.' },
  { label: 'Kafka 메시지 큐', body: 'Protocol 이벤트를 비동기로 Indexer Layer에 전달합니다.' },
  { label: 'Indexer Layer', body: 'Ender, Vulcan, Comlink, Socks, Roundtable 5개 서비스로 데이터를 제공합니다.' },
];

const C = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ArchLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 340" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.25 }} transition={sp}>
            <rect x={40} y={10} width={380} height={40} rx={6}
              fill={step === 0 ? '#6366f118' : '#6366f108'} stroke="#6366f1" strokeWidth={step === 0 ? 2 : 0.8} />
            <text x={230} y={35} textAnchor="middle" fontSize={11} fontWeight={600} fill="#6366f1">
              External Systems (거래소 · 이더리움 · 클라이언트)
            </text>
          </motion.g>

          <text x={130} y={62} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" opacity={0.4}>↓</text>
          <text x={230} y={62} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" opacity={0.4}>↓</text>
          <text x={330} y={62} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" opacity={0.4}>↓</text>
          <motion.g animate={{ opacity: step <= 2 ? 1 : 0.2 }} transition={sp}>
            <rect x={20} y={68} width={420} height={152} rx={8}
              fill={step === 1 ? '#10b98110' : 'transparent'} stroke="#10b981" strokeWidth={step === 1 ? 2 : 0.8} />
            <text x={230} y={86} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Protocol Layer
            </text>
            <motion.g animate={{ opacity: step === 2 ? 1 : step <= 2 ? 0.6 : 0.2 }} transition={sp}>
              {['Liquidation', 'Price', 'Bridge'].map((d, i) => (
                <g key={d}>
                  <rect x={55 + i * 130} y={94} width={110} height={30} rx={4}
                    fill={step === 2 ? '#f59e0b18' : '#f59e0b08'} stroke="#f59e0b" strokeWidth={step === 2 ? 1.5 : 0.5} />
                  <text x={110 + i * 130} y={113} textAnchor="middle" fontSize={10} fill="#f59e0b">{d} Daemon</text>
                </g>
              ))}
            </motion.g>
            <rect x={40} y={132} width={380} height={34} rx={4}
              fill="#10b98108" stroke="#10b981" strokeWidth={0.5} />
            <text x={230} y={148} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
              Cosmos SDK Modules
            </text>
            <text x={230} y={160} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              CLOB · Perpetuals · Prices · Subaccounts · Assets
            </text>
            <rect x={40} y={174} width={380} height={30} rx={4}
              fill="#10b98108" stroke="#10b981" strokeWidth={0.5} />
            <text x={230} y={193} textAnchor="middle" fontSize={10} fill="#10b981">CometBFT (합의 엔진)</text>
          </motion.g>
          <motion.g animate={{ opacity: step === 3 ? 1 : step >= 3 ? 0.6 : 0.25 }} transition={sp}>
            <text x={230} y={235} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" opacity={0.4}>↓</text>
            <rect x={120} y={240} width={220} height={28} rx={5}
              fill={step === 3 ? '#8b5cf618' : '#8b5cf608'} stroke="#8b5cf6" strokeWidth={step === 3 ? 2 : 0.8} />
            <text x={230} y={258} textAnchor="middle" fontSize={11} fontWeight={600} fill="#8b5cf6">
              Apache Kafka (이벤트 스트리밍)
            </text>
          </motion.g>
          <text x={230} y={283} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)" opacity={0.4}>↓</text>
          <motion.g animate={{ opacity: step === 4 ? 1 : 0.2 }} transition={sp}>
            <rect x={20} y={288} width={420} height={45} rx={8}
              fill={step === 4 ? '#ec489918' : '#ec489908'} stroke="#ec4899" strokeWidth={step === 4 ? 2 : 0.8} />
            {['Ender', 'Vulcan', 'Comlink', 'Socks', 'RT'].map((s, i) => (
              <g key={s}>
                <rect x={35 + i * 80} y={294} width={70} height={22} rx={3}
                  fill="#ec489910" stroke="#ec4899" strokeWidth={0.5} />
                <text x={70 + i * 80} y={309} textAnchor="middle" fontSize={10} fill="#ec4899">{s}</text>
              </g>
            ))}
            <text x={230} y={328} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">PostgreSQL</text>
          </motion.g>
          <motion.circle r={5}
            animate={{ cx: 12, cy: [50, 140, 110, 254, 310][step] }}
            transition={sp} fill={C[step]} />
        </svg>
      )}
    </StepViz>
  );
}
