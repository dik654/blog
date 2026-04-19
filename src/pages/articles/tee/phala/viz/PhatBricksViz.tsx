import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'HTTP Oracle Brick — 외부 API 헬퍼, 헤더·인증 자동' },
  { label: 'EVM Transactor Brick — 외부 EVM 체인 tx 전송' },
  { label: 'Lego Registry — action 등록 + 파이프라인 조합' },
  { label: '이점 — 반복 코드 제거, 검증된 보안 패턴, audit 됨' },
];

const HTTP_FIELDS = [
  { line: 'HttpOracle::new("https://api.example.com")', c: '#6366f1' },
  { line: 'oracle.set_header("Authorization", "Bearer xxx")', c: '#10b981' },
  { line: 'oracle.get_json("/prices/BTC").await', c: '#f59e0b' },
  { line: '→ PriceData (typed deserialization)', c: '#0ea5e9' },
];

const EVM_FIELDS = [
  { line: 'EvmTransactor::new(&rpc_url, signing_key)', c: '#6366f1' },
  { line: 'transactor.send_tx(addr, calldata, value)', c: '#10b981' },
  { line: '→ tx_hash (Result<H256, Error>)', c: '#f59e0b' },
];

const LEGO_STEPS = [
  { idx: '1', label: 'lego.register("oracle", oracle_action)', c: '#6366f1' },
  { idx: '2', label: 'lego.register("condition", condition_check)', c: '#10b981' },
  { idx: '3', label: 'lego.register("transactor", transactor_send)', c: '#f59e0b' },
  { idx: '4', label: 'lego.execute_pipeline(["oracle->condition->transactor"])', c: '#ef4444' },
];

const BENEFITS = [
  { name: '반복 코드 제거', sub: 'HTTP/sign 보일러플레이트', c: '#6366f1' },
  { name: '검증된 보안 패턴', sub: 'pre-audited', c: '#10b981' },
  { name: '공유 라이브러리', sub: 'cluster 내 재사용', c: '#f59e0b' },
  { name: 'Pre-audited', sub: 'Phala 팀 검수', c: '#0ea5e9' },
];

export default function PhatBricksViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              HttpOracle — phat_bricks::http_oracle
            </text>
            {HTTP_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={42 + i * 36} width={440} height={28} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <text x={60} y={60 + i * 36} fontSize={10} fontWeight={600} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              EvmTransactor — phat_bricks::evm_transactor
            </text>
            {EVM_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={40} y={50 + i * 42} width={440} height={32} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <text x={60} y={70 + i * 42} fontSize={10.5} fontWeight={600} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.line}</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              External EVM chain (Ethereum, Polygon, BSC, ...) 모두 지원
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              Lego — action 조합 파이프라인
            </text>
            {LEGO_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={20} y={42 + i * 32} width={480} height={26} rx={4}
                  fill={`${s.c}10`} stroke={`${s.c}40`} strokeWidth={0.8} />
                <circle cx={40} cy={55 + i * 32} r={9} fill={s.c} />
                <text x={40} y={59 + i * 32} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={60} y={59 + i * 32} fontSize={9.5} fontWeight={600} fill={s.c}
                  style={{ fontFamily: 'monospace' }}>{s.label}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              Phat Bricks 이점
            </text>
            {BENEFITS.map((b, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}>
                <DataBox x={30 + (i % 2) * 235} y={50 + Math.floor(i / 2) * 60}
                  w={225} h={48} label={b.name} sub={b.sub} color={b.c} outlined />
              </motion.g>
            ))}
            <text x={260} y={185} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              직접 구현보다 검증된 라이브러리 사용 권장
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
