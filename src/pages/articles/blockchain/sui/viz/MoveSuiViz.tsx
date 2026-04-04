import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const STEPS = [
  { label: 'Aptos: 계정 기반 모델', body: '리소스가 계정 주소 하위에 저장. move_to(signer, resource)' },
  { label: 'Sui: 객체 기반 모델', body: '각 객체가 고유 UID 보유, 독립적으로 존재' },
  { label: '객체 전송', body: 'transfer(coin, recipient) → 소유권 이동, 원래 소유자 접근 불가' },
  { label: '병렬 처리 이점', body: '독립 객체이므로 서로 다른 객체 TX가 완전히 병렬 처리' },
];

export default function MoveSuiViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
              <rect x={20} y={10} width={140} height={75} rx={8} fill="#6366f110" stroke="#6366f1" strokeWidth={1.5} />
              <text x={90} y={26} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">Account 0x1</text>
              <rect x={35} y={33} width={110} height={20} rx={4} fill="#6366f118" stroke="#6366f1" strokeWidth={1} />
              <text x={90} y={46} textAnchor="middle" fontSize={9} fill="#6366f1">Coin (under acct)</text>
              <rect x={35} y={58} width={110} height={20} rx={4} fill="#6366f118" stroke="#6366f1" strokeWidth={1} />
              <text x={90} y={71} textAnchor="middle" fontSize={9} fill="#6366f1">NFT (under acct)</text>
            </motion.g>
            <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
              <motion.rect x={200} y={10} width={75} height={35} rx={8}
                fill="#10b98115" stroke="#10b981" strokeWidth={1.5}
                animate={{ x: step === 2 ? 290 : 200 }} transition={sp} />
              <motion.text textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981"
                animate={{ x: step === 2 ? 337 : 237 }} y={26} transition={sp}>Coin</motion.text>
              <motion.text textAnchor="middle" fontSize={9} fill="#10b981"
                animate={{ x: step === 2 ? 337 : 237 }} y={38} transition={sp}>
                {step === 2 ? 'owner: Bob' : 'owner: Alice'}
              </motion.text>
              <rect x={290} y={10} width={75} height={35} rx={8} fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1.5} />
              <text x={327} y={26} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">NFT</text>
              <text x={327} y={38} textAnchor="middle" fontSize={9} fill="#f59e0b">id: 0xABC</text>
            </motion.g>
            {step === 2 && (
              <motion.text x={260} y={70} textAnchor="middle" fontSize={9} fill="#10b981"
                fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>transfer</motion.text>
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('sui-move-object')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
