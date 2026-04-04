import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { s: '#6366f1', r: '#10b981', k: '#f59e0b' };

const STEPS = [
  { label: '키 생성 (수신자)', body: 'p = 23, g = 5   // 공개\nx = 6            // 비밀키 (수신자만 보유)\ny = g^x mod p\n  = 5⁶ mod 23 = 15625 mod 23 = 8  // 공개키\n\n공개: (p=23, g=5, y=8),  비밀: x=6' },
  { label: '암호화 (송신자)', body: 'm = 7   // 원문 메시지\nk = 3   // 일회용 랜덤 (매번 새로)\n\nc₁ = g^k mod p = 5³ mod 23 = 125 mod 23 = 10\ns  = y^k mod p = 8³ mod 23 = 512 mod 23 = 6\nc₂ = m · s mod p = 7 · 6 mod 23 = 42 mod 23 = 19' },
  { label: '암호문 전송', body: '송신자 → 수신자:  (c₁ = 10, c₂ = 19)\n\n도청자가 아는 것: p, g, y, c₁, c₂\n도청자가 모르는 것: k, x\ns = y^k = g^(xk) 계산에 x 또는 k 필요 → DLP.' },
  { label: '복호화 (수신자)', body: '① 공유 비밀 s 복원:\n  s = c₁^x mod p = 10⁶ mod 23 = 6\n  // c₁^x = g^(kx) = y^k ← 같은 s!\n\n② s의 역원 계산:\n  s⁻¹ = modpow(6, 23-2, 23) = 6²¹ mod 23 = 4\n  검증: 6 · 4 = 24 mod 23 = 1 ✓\n\n③ m 복원: c₂ · s⁻¹ = 19 · 4 = 76 mod 23 = 7 ✓' },
];

export default function ElGamalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r}>키 생성</text>
              {['p = 23, g = 5',
                'x = 6           // 비밀키',
                'y = g^x mod p',
                '  = 5⁶ mod 23 = 8  // 공개키', '',
                '공개: (p, g, y) = (23, 5, 8)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.s}>암호화</text>
              {['m = 7, k = 3   // 일회용 랜덤',
                'c₁ = g^k = 5³ mod 23 = 10',
                's  = y^k = 8³ mod 23 = 6',
                'c₂ = m·s = 7·6 mod 23 = 19', '',
                '// (c₁, c₂) = (10, 19) 전송'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.s}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.k}>암호문 전송</text>
              {['(c₁, c₂) = (10, 19)', '',
                '도청자: p=23, g=5, y=8, c₁=10, c₂=19',
                's = y^k = g^(xk) 필요', '',
                'k = log_g(c₁) = log₅(10) mod 23  (DLP)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={i < 2 ? C.k : '#ef4444'}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r}>복호화</text>
              {['s = c₁^x = 10⁶ mod 23 = 6',
                's⁻¹ = modpow(6, 21, 23) = 4',
                'check: 6·4 = 24 mod 23 = 1 ✓', '',
                'm = c₂ · s⁻¹ mod p',
                '  = 19 · 4 mod 23 = 76 mod 23 = 7 ✓'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
