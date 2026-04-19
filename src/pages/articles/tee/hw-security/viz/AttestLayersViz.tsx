import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Layer 1: Hardware Root — CPU manufacturer eFuse root key, 변조 불가' },
  { label: 'Layer 2: Platform Cert — PCK/VCEK/IAK, CPU 고유 cert, manufacturer 서명' },
  { label: 'Layer 3: Attestation Key — 런타임 생성, PCK로 서명 (증명)' },
  { label: 'Layer 4: Report Sig — TEE가 생성, measurement·nonce·platform info 포함' },
  { label: 'Layer 5: Application Data — 세션 키 암호화, 증명된 채널로 전송' },
  { label: '체인 무결성 — 한 레이어 깨지면 전체 무효, 위계가 trust transfer' },
];

const LAYERS = [
  { name: 'Layer 1: HW Root', sub: 'eFuse root key', color: '#ef4444' },
  { name: 'Layer 2: Platform Cert', sub: 'PCK/VCEK/IAK', color: '#f59e0b' },
  { name: 'Layer 3: Attestation Key', sub: '런타임 생성', color: '#10b981' },
  { name: 'Layer 4: Report Signature', sub: 'measurement+nonce', color: '#0ea5e9' },
  { name: 'Layer 5: Application Data', sub: '세션 키 암호화', color: '#a855f7' },
];

const LAYER_DETAILS: { color: string; details: string[] }[] = [
  {
    color: '#ef4444',
    details: [
      'CPU manufacturer (Intel, AMD, Arm)',
      'eFuse 저장 root key',
      '불변, 변조 불가',
      'Trust anchor (의심할 수 없는 기준점)',
    ],
  },
  {
    color: '#f59e0b',
    details: [
      'Intel PCK / AMD VCEK / ARM IAK',
      'CPU 고유 certificate',
      'Manufacturer가 서명',
      '제조 시점 HW 상태 증명',
    ],
  },
  {
    color: '#10b981',
    details: [
      '런타임 생성',
      'PCK로 서명 (증명)',
      '일회용 또는 수명 제한',
      'Quote 서명에 사용',
    ],
  },
  {
    color: '#0ea5e9',
    details: [
      '실행 중 TEE가 생성',
      'Measurement, nonce, platform info 포함',
      'AK로 서명',
      'replay 방어 (nonce)',
    ],
  },
  {
    color: '#a855f7',
    details: [
      'TEE가 처리하는 실제 데이터',
      '세션 키로 암호화',
      '증명된 채널로 전송',
      'RA-TLS 등 통합 프로토콜',
    ],
  },
];

const CHAIN_FACTS = [
  { line: '각 레이어가 하위 레이어 보증', c: '#6366f1' },
  { line: 'One chain of trust', c: '#10b981' },
  { line: '어떤 레이어 깨지면 전체 무효', c: '#ef4444' },
];

export default function AttestLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 5 && (<g>
            <text x={130} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6b7280">Stack</text>
            <text x={390} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={LAYER_DETAILS[step].color}>
              Layer {step + 1} 상세
            </text>
            {LAYERS.map((l, i) => (
              <motion.g key={i} animate={{ opacity: i === step ? 1 : 0.22 }}>
                <ModuleBox x={20} y={32 + i * 36} w={220} h={28}
                  label={l.name} sub={l.sub} color={l.color} />
              </motion.g>
            ))}
            {LAYER_DETAILS[step].details.map((d, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={260} y={32 + i * 40} width={250} height={32} rx={4}
                  fill={`${LAYER_DETAILS[step].color}10`} stroke={`${LAYER_DETAILS[step].color}40`} strokeWidth={0.8} />
                <text x={275} y={52 + i * 40} fontSize={9.5} fill="var(--foreground)">{d}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Chain of Trust
            </text>
            {CHAIN_FACTS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${f.c}10`} stroke={`${f.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={f.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={f.c}>{f.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
