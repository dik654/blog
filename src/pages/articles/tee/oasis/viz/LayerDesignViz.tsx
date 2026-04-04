import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '합의 계층: 보안 & finality', body: 'CometBFT BFT 합의로 빠른 finality. 밸리데이터 위원회 관리. 여러 ParaTime 상태를 합의 체인에 커밋.' },
  { label: '런타임 계층: 병렬 실행', body: '여러 ParaTime이 독립적으로 병렬 실행. 각 ParaTime은 자체 실행 환경(EVM, WASM, 기밀). TEE 기반 기밀 런타임 지원.' },
  { label: 'ParaTime 종류', body: 'Cipher: WASM + SGX 기밀 실행.\nSapphire: EVM + SGX 기밀 실행.\nEmerald: 일반 EVM (공개 실행).' },
];

export default function LayerDesignViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Consensus layer */}
          <motion.rect x={30} y={10} width={480} height={50} rx={8}
            fill={step === 0 ? '#6366f118' : '#6366f108'}
            stroke={step === 0 ? '#6366f1' : '#6366f130'}
            strokeWidth={step === 0 ? 2 : 0.8}
            animate={{ opacity: step === 0 ? 1 : 0.4 }} />
          <text x={270} y={30} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="#6366f1">합의 계층 (Consensus)</text>
          <text x={270} y={48} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">CometBFT · 밸리데이터 · finality</text>

          {/* Runtime layer */}
          <motion.rect x={30} y={75} width={480} height={80} rx={8}
            fill={step >= 1 ? '#10b98110' : '#10b98106'}
            stroke={step >= 1 ? '#10b981' : '#10b98130'}
            strokeWidth={step >= 1 ? 2 : 0.8}
            animate={{ opacity: step >= 1 ? 1 : 0.3 }} />
          <text x={270} y={93} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="#10b981">런타임 계층 (ParaTime)</text>

          {/* ParaTimes */}
          {[
            { label: 'Cipher', sub: 'WASM+SGX', x: 110, color: '#f59e0b' },
            { label: 'Sapphire', sub: 'EVM+SGX', x: 270, color: '#f59e0b' },
            { label: 'Emerald', sub: 'EVM 공개', x: 430, color: '#f59e0b' },
          ].map((p) => (
            <g key={p.label}>
              <motion.rect x={p.x - 55} y={105} width={110} height={36} rx={6}
                fill={step === 2 ? `${p.color}18` : `${p.color}06`}
                stroke={step === 2 ? p.color : `${p.color}30`}
                strokeWidth={step === 2 ? 1.8 : 0.6}
                animate={{ opacity: step === 2 ? 1 : 0.3 }} />
              <text x={p.x} y={121} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={step === 2 ? p.color : 'var(--muted-foreground)'}>{p.label}</text>
              <text x={p.x} y={135} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">{p.sub}</text>
            </g>
          ))}

          {/* arrows consensus → runtimes */}
          {[110, 270, 430].map((x) => (
            <line key={x} x1={x} y1={60} x2={x} y2={75}
              stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3,3" />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
