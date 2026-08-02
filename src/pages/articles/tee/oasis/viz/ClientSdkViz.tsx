import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'JavaScript/TS — sapphire-paratime', body: 'sapphire.wrap(provider) + wrap(wallet).\nethers v6 호환, 모든 tx 자동 암호화.' },
  { label: '컨트랙트 호출 — encrypted envelope 자동', body: 'contract.secretMethod(42) — calldata 자동 암호화.\nKM 공개키 자동 조회·캐싱.' },
  { label: 'Python — oasis-sdk', body: 'paratime.Paratime.sapphire_mainnet().\nasync/await 기반, signature 모듈 통합.' },
  { label: 'Rust — client-sdk crate', body: 'sapphire::mainnet().await + transaction::Builder.\n타입 안전, 저수준 제어.' },
];

const SDKS = [
  { name: 'JavaScript', sub: 'sapphire-paratime', color: '#f59e0b' },
  { name: 'Python',     sub: 'oasis-sdk',         color: '#3b82f6' },
  { name: 'Rust',       sub: 'client-sdk crate',  color: '#ec4899' },
];

export default function ClientSdkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {SDKS.map((s, i) => {
            const x = 30 + i * 150;
            const active =
              (i === 0 && (step === 0 || step === 1)) ||
              (i === 1 && step === 2) ||
              (i === 2 && step === 3);
            return (
              <motion.g key={s.name} animate={{ opacity: active ? 1 : 0.35 }}>
                <ModuleBox x={x} y={20} w={130} h={50}
                  label={s.name} sub={s.sub} color={s.color} />
              </motion.g>
            );
          })}

          {/* Step 0: JS wrap */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30}  y={100} w={180} h={28}
                label="sapphire.wrap(provider)" color="#f59e0b" outlined />
              <DataBox x={250} y={100} w={180} h={28}
                label="sapphire.wrap(wallet)" color="#f59e0b" outlined />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                ethers v6 그대로 — 자동 암호화 활성화
              </text>
            </motion.g>
          )}

          {/* Step 1: contract call */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30}  y={100} w={140} h={28}
                label="contract.method(42)" color="#10b981" outlined />
              <ActionBox x={185} y={98} w={130} h={32}
                label="auto-encrypt" sub="envelope" color="#3b82f6" />
              <ActionBox x={325} y={98} w={140} h={32}
                label="fetch KM pubkey" sub="cached" color="#ec4899" />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                개발자 코드 변경 없이 기밀 호출
              </text>
            </motion.g>
          )}

          {/* Step 2: Python */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30}  y={100} w={210} h={28}
                label="paratime.sapphire_mainnet()" color="#3b82f6" outlined />
              <DataBox x={260} y={100} w={180} h={28}
                label="signature.Signer" color="#3b82f6" outlined />
              <DataBox x={130} y={140} w={220} h={28}
                label="await pt.accounts_balance(addr)" color="#3b82f6" outlined />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                async/await — high-level Python API
              </text>
            </motion.g>
          )}

          {/* Step 3: Rust */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30}  y={100} w={200} h={28}
                label="sapphire::mainnet().await" color="#ec4899" outlined />
              <DataBox x={250} y={100} w={200} h={28}
                label="transaction::Builder::new()" color="#ec4899" outlined />
              <ActionBox x={130} y={140} w={220} h={32}
                label='conn.submit_tx(tx).await' color="#ec4899" />
              <text x={240} y={190} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                타입 안전 + 저수준 제어 (TEE-side도 동일 crate)
              </text>
            </motion.g>
          )}

          <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            언어별 client SDK — 동일 ParaTime 접근
          </text>
        </svg>
      )}
    </StepViz>
  );
}
