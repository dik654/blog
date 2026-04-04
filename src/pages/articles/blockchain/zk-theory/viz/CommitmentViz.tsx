import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { cm: '#6366f1', op: '#10b981', bd: '#f59e0b', hi: '#8b5cf6' };

const STEPS = [
  { label: 'Pedersen 커밋먼트 — 세팅', body: 'p = 23, q = 11  (|G| = q)\ng = 2, h = 3    (독립 생성원)\n\n// g와 h의 이산로그 관계를 아무도 모름.\n// log_g(h) = ? → DLP 가정 하에 바인딩 성립.\n// 만약 log_g(h)를 알면 → 커밋먼트 위조 가능.' },
  { label: '① Commit — C = g^m · h^r', body: 'm = 7  (메시지)\nr = 4  (블라인딩 팩터, 랜덤)\n\nC = g^m · h^r mod p\n  = 2⁷ · 3⁴ mod 23\n  = 128 · 81 mod 23\n  = 12 · 12 mod 23\n  = 144 mod 23 = 6\n\n커밋값 C = 6 공개. (m, r)은 비공개.' },
  { label: '② Open — (m, r) 공개', body: '검증자에게 (m=7, r=4) 전달.\n\n검증: C == g^m · h^r mod p ?\n  2⁷ · 3⁴ mod 23 = 6 ✓\n\n// 봉인된 봉투를 열어 내용 확인.\n// 다른 (m\', r\')로 같은 C=6 불가 → 바인딩.' },
  { label: '두 가지 성질', body: '은닉성 (Hiding):\n  C=6에서 m을 유추 불가.\n  r이 균일 랜덤 → C도 균일 분포.\n  (정보이론적 — 무한 계산도 불가)\n\n바인딩 (Binding):\n  g^m·h^r = g^m\'·h^r\' → g^(m-m\') = h^(r\'-r)\n  → log_g(h) 계산 필요 → DLP.\n  (계산적 — 다항 시간 내 불가)' },
];

export default function CommitmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.cm}>세팅</text>
              {['p = 23, q = 11  // |G| = q',
                'g = 2, h = 3    // 독립 생성원', '',
                '// log_g(h) = ? → DLP 가정',
                '// 관계를 모르면 바인딩 성립',
                '// 알면 커밋먼트 위조 가능'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.cm}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.op}>Commit</text>
              {['m = 7, r = 4  // r ← random',
                'C = g^m · h^r mod p',
                '  = 2⁷ · 3⁴ mod 23',
                '  = 128 · 81 mod 23',
                '  = 12 · 12 mod 23 = 144 mod 23', '',
                'C = 6  // 공개 (m,r 비공개)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.op}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.bd}>Open</text>
              {['검증자에게 (m=7, r=4) 전달', '',
                'check: C == g^m · h^r mod p ?',
                '  2⁷ · 3⁴ mod 23 = 6 ✓', '',
                '// 다른 (m\',r\')로 C=6 불가 → 바인딩'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.bd}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.hi}>은닉 + 바인딩</text>
              {['은닉: C=6에서 m 유추 불가',
                '  r 균일 → C도 균일 분포',
                '  (정보이론적 안전)', '',
                '바인딩: g^(m-m\') = h^(r\'-r)',
                '  → log_g(h) 필요 → DLP',
                '  (계산적 안전)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.hi}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
