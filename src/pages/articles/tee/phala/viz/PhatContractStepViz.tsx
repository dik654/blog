import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Pink Runtime — pallet-contracts + pink-chain-ext 구성' },
  { label: 'Chain Extension — PinkExtension::call(env) → match func_id()' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function PhatContractStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">Pink Runtime 구성</text>
            {[
              { line: '// Substrate 팔렛 (재사용)', c: '#6366f1', y: 42 },
              { line: 'pallet_contracts::Config  // ink! 컨트랙트 실행', c: '#6366f1', y: 64 },
              { line: 'pallet_balances::Config   // 토큰 잔액 관리', c: '#6366f1', y: 84 },
              { line: '// Pink 특화 컴포넌트', c: '#10b981', y: 108 },
              { line: 'pink::PinkRuntime  // 코어 런타임', c: '#10b981', y: 128 },
              { line: 'pink_chain_ext::PinkExtension  // TEE 확장', c: '#10b981', y: 148 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">PinkExtension: TEE 전용 확장</text>
            {[
              { line: 'fn call(env: Environment) -> Result {', c: '#f59e0b', y: 42 },
              { line: '  match env.func_id() {', c: '#f59e0b', y: 62 },
              { line: '    HTTP_REQUEST => http_request(env),', c: '#6366f1', y: 84 },
              { line: '    CRYPTO_SIGN => sgx_sign(env),  // TEE 내 서명', c: '#6366f1', y: 104 },
              { line: '    GET_RANDOM  => sgx_random(env), // RDRAND', c: '#10b981', y: 124 },
              { line: '    CACHE_SET   => local_cache.set(env),', c: '#10b981', y: 144 },
              { line: '  }', c: '#f59e0b', y: 162 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={30} y={l.y - 13} width={460} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={45} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
