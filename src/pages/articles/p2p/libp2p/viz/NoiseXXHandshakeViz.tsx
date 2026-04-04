import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { i: '#6366f1', r: '#10b981', k: '#f59e0b' };

const STEPS = [
  { label: 'Round 1: → e (임시 공개키)', body: 'Initiator:\n  e_priv ← x25519_generate()   // 32B\n  e_pub = x25519_pubkey(e_priv) // 32B\n\n→ 전송: e_pub (plaintext)\n// 아직 암호화 없음.\n// Responder는 Initiator의 정체를 모름.' },
  { label: 'Round 2: ← e, ee, s, es', body: 'Responder:\n  re_priv ← x25519_generate()\n  re_pub = x25519_pubkey(re_priv)\n\n  ee = x25519(re_priv, i_e_pub)  // DH(ee)\n  mix_key(ee)                     // CipherState 갱신\n\n  encrypt(rs_pub)                 // 정적키 암호화 전송\n  es = x25519(rs_priv, i_e_pub)   // DH(es)\n  mix_key(es)' },
  { label: 'Round 3: → s, se + 세션 확립', body: 'Initiator:\n  ee = x25519(e_priv, r_e_pub)    // DH(ee) 동일\n  mix_key(ee)\n  decrypt(rs_pub)                 // Responder 정적키 복원\n  es = x25519(e_priv, rs_pub)     // DH(es)\n  mix_key(es)\n\n  encrypt(is_pub)                 // 내 정적키 암호화 전송\n  se = x25519(is_priv, r_e_pub)   // DH(se)\n  mix_key(se)  → 세션키 확립' },
];

export default function NoiseXXHandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.i}>Round 1: → e</text>
              {['e_priv ← x25519_generate()  // 32B',
                'e_pub = x25519_pubkey(e_priv)', '',
                '→ send: e_pub (plaintext)', '',
                '// 암호화 없음, 정체 미공개'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.i}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r}>Round 2: ← e, ee, s, es</text>
              {['re = x25519_generate()',
                'ee = x25519(re.priv, i_e_pub)  // DH',
                'mix_key(ee)', '',
                'encrypt(rs_pub)  // 정적키 암호화',
                'es = x25519(rs.priv, i_e_pub)',
                'mix_key(es)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.k}>Round 3: → s, se</text>
              {['ee = x25519(e.priv, r_e_pub)',
                'decrypt(rs_pub)  // R 정적키 복원',
                'es = x25519(e.priv, rs_pub)', '',
                'encrypt(is_pub)  // 내 정적키 전송',
                'se = x25519(is.priv, r_e_pub)',
                'mix_key(se) → 세션키 확립'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.k}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
