import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Storage 정의 — admin AccountId + 암호화 저장 api_key' },
  { label: 'Constructor — 호출자(caller)를 admin으로 등록 + key 보관' },
  { label: 'get_btc_price() — pink::http_get으로 외부 API 호출 (TEE 안에서만 가능)' },
  { label: 'JSON 파싱 → on-chain 반환 — u128 가격을 1e8 스케일로 정수화' },
  { label: 'sign_message — TEE 내부 sr25519 키로 서명, 외부 체인 tx 가능' },
];

const STORAGE_FIELDS = [
  { name: 'admin', type: 'AccountId', note: '컨트랙트 운영자 식별' },
  { name: 'api_key', type: 'String', note: '외부 API 인증키 (암호화 저장)' },
];

const FLOW_STEPS = [
  { idx: '1', label: 'pink::http_get(url)', color: '#6366f1', sub: 'TEE 안에서만 가능' },
  { idx: '2', label: 'serde_json::from_slice', color: '#10b981', sub: 'JSON → struct' },
  { idx: '3', label: 'price * 1e8 → u128', color: '#10b981', sub: '소수 → 정수 스케일링' },
  { idx: '4', label: 'Ok(price_u128)', color: '#f59e0b', sub: 'on-chain 반환' },
];

export default function PhatInkExampleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              #[ink(storage)] PriceOracle
            </text>
            {STORAGE_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={60 + i * 56} width={420} height={42} rx={6}
                  fill="#6366f110" stroke="#6366f150" strokeWidth={0.8} />
                <text x={70} y={80 + i * 56} fontSize={11} fontWeight={700} fill="#6366f1"
                  style={{ fontFamily: 'monospace' }}>{f.name}: {f.type}</text>
                <text x={70} y={94 + i * 56} fontSize={9.5} fill="var(--muted-foreground)">{f.note}</text>
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              storage는 cluster 내 모든 워커가 같은 값을 유지 (consensus)
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              #[ink(constructor)] new(api_key)
            </text>
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={80} y={50} w={160} h={50}
                label="env().caller()" sub="호출자 AccountId" color="#6366f1" />
              <text x={250} y={80} fontSize={14} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={280} y={50} w={160} h={50}
                label="self.admin" sub="저장된 운영자" color="#6366f1" />
            </motion.g>
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <ActionBox x={80} y={120} w={160} h={50}
                label="param api_key" sub="String 인자" color="#f59e0b" />
              <text x={250} y={150} fontSize={14} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={280} y={120} w={160} h={50}
                label="self.api_key" sub="암호화 저장" color="#f59e0b" />
            </motion.g>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              get_btc_price — HTTP 호출 (Pink 확장)
            </text>
            {FLOW_STEPS.slice(0, 2).map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={60} y={50 + i * 50} width={400} height={36} rx={5}
                  fill={`${s.color}10`} stroke={`${s.color}50`} strokeWidth={0.8} />
                <circle cx={80} cy={68 + i * 50} r={10} fill={s.color} />
                <text x={80} y={72 + i * 50} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={100} y={66 + i * 50} fontSize={11} fontWeight={600} fill={s.color}
                  style={{ fontFamily: 'monospace' }}>{s.label}</text>
                <text x={100} y={80 + i * 50} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
              </motion.g>
            ))}
            <text x={260} y={180} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              일반 EVM 컨트랙트는 외부 HTTP 불가 — Pink 확장이 핵심 차별점
            </text>
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              JSON 파싱 + on-chain 반환
            </text>
            {FLOW_STEPS.slice(2, 4).map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={60} y={50 + i * 50} width={400} height={36} rx={5}
                  fill={`${s.color}10`} stroke={`${s.color}50`} strokeWidth={0.8} />
                <circle cx={80} cy={68 + i * 50} r={10} fill={s.color} />
                <text x={80} y={72 + i * 50} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={100} y={66 + i * 50} fontSize={11} fontWeight={600} fill={s.color}
                  style={{ fontFamily: 'monospace' }}>{s.label}</text>
                <text x={100} y={80 + i * 50} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
              </motion.g>
            ))}
            <text x={260} y={180} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              u128 정수가 on-chain 안전 — 부동소수 결과는 결정성 위배 위험
            </text>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              sign_message — TEE 내부 키로 서명
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={50} y={60} w={130} h={56}
                label="TEE 내부" sub="signing_key 비공개" color="#10b981" />
              <text x={210} y={92} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={240} y={60} w={150} h={56}
                label="pink::signing::sign" sub="Sr25519" color="#0ea5e9" />
              <text x={420} y={92} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ModuleBox x={440} y={60} w={70} h={56}
                label="signature" sub="외부 검증" color="#f59e0b" />
            </motion.g>
            <text x={260} y={150} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              개인키가 enclave 외부로 절대 노출되지 않음
            </text>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              결과 서명을 다른 체인에 제출하는 cross-chain bridge 패턴 가능
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
