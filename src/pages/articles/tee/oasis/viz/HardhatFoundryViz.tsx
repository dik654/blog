import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Hardhat — sapphire-hardhat 플러그인', body: 'import "@oasisprotocol/sapphire-hardhat".\nethers.js provider 자동 wrapping.' },
  { label: 'Hardhat 네트워크 설정', body: 'sapphire mainnet (chainId 0x5afe) + testnet (0x5aff).\naccounts: PRIVATE_KEY.' },
  { label: 'Foundry — foundry.toml profile', body: '[profile.sapphire]: rpc_url + chain_id + private_key.\nforge / cast 명령 그대로 작동.' },
  { label: '플러그인이 자동 처리', body: '기밀 tx 자동 암호화 + 서명된 query 생성 + KM 공개키 캐싱.\n개발자는 일반 ETH 개발과 동일한 경험.' },
];

export default function HardhatFoundryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* tools */}
          <motion.g animate={{ opacity: step === 0 || step === 1 || step === 3 ? 1 : 0.35 }}>
            <ModuleBox x={20} y={20} w={140} h={50}
              label="Hardhat" sub="@sapphire-hardhat" color="#f59e0b" />
          </motion.g>

          <motion.g animate={{ opacity: step === 2 || step === 3 ? 1 : 0.35 }}>
            <ModuleBox x={320} y={20} w={140} h={50}
              label="Foundry" sub="profile sapphire" color="#10b981" />
          </motion.g>

          {/* Step 0/1: Hardhat config */}
          {(step === 0 || step === 1) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={20} y={90} w={250} h={120}
                label="hardhat.config.ts" color="#f59e0b" />
              {step === 0 && (
                <>
                  <DataBox x={35} y={120} w={220} h={26}
                    label='import "@oasisprotocol/sapphire-hardhat"' color="#f59e0b" outlined />
                  <text x={145} y={195} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                    plugin 으로 자동 wrapping
                  </text>
                </>
              )}
              {step === 1 && (
                <>
                  <DataBox x={35} y={120} w={220} h={22}
                    label="sapphire: 0x5afe" color="#f59e0b" outlined />
                  <DataBox x={35} y={150} w={220} h={22}
                    label="sapphire-testnet: 0x5aff" color="#f59e0b" outlined />
                  <text x={145} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                    chainId + accounts: [PRIVATE_KEY]
                  </text>
                </>
              )}
            </motion.g>
          )}

          {/* Step 2: Foundry */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={210} y={90} w={250} h={130}
                label="foundry.toml" color="#10b981" />
              <DataBox x={225} y={120} w={220} h={22}
                label="[profile.sapphire]" color="#10b981" outlined />
              <DataBox x={225} y={148} w={220} h={22}
                label="rpc_url + chain_id" color="#10b981" outlined />
              <DataBox x={225} y={176} w={220} h={22}
                label="private_key" color="#10b981" outlined />
            </motion.g>
          )}

          {/* Step 3: auto handling */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20}  y={90} w={130} h={36}
                label="encrypt tx" color="#3b82f6" />
              <ActionBox x={170} y={90} w={140} h={36}
                label="sign query" color="#a855f7" />
              <ActionBox x={325} y={90} w={140} h={36}
                label="cache KM pubkey" color="#ec4899" />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={700}>
                개발자는 일반 ETH 개발 경험
              </text>
              <DataBox x={140} y={170} w={200} h={28}
                label="forge / cast / hardhat run" color="#10b981" outlined />
            </motion.g>
          )}

          <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            기존 EVM tooling 그대로 작동
          </text>
        </svg>
      )}
    </StepViz>
  );
}
