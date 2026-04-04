import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { int: '#6366f1', fs: '#f59e0b', ni: '#10b981', rom: '#8b5cf6' };

const STEPS = [
  { label: '대화형 Sigma 프로토콜 (3-move)', body: 'P → V: a = gʳ mod p        // 커밋\nV → P: e ← random(Zq)     // 챌린지 (V가 생성)\nP → V: z = r + e·x mod q  // 응답\n\nV 검증: gᶻ == a · yᵉ mod p\n// 문제: V가 온라인이어야 함. 블록체인 불가.' },
  { label: 'Fiat-Shamir: e = H(a, stmt)', body: '핵심 변환: V의 랜덤 e를 해시로 대체.\n\ne = H(g ∥ y ∥ a)          // H: SHA-256 등\n  = H(04 ∥ 18 ∥ 08)       // 예시 값\n  = 0x3f2a...mod q = 2    // q로 축소\n\n// a가 정해진 뒤에만 e 결정 → 조작 불가.' },
  { label: '비대화형 증명 π = (a, z)', body: '증명자 단독 생성:\n  r ← random(Zq)\n  a = gʳ mod p\n  e = H(g ∥ y ∥ a)    // 스스로 챌린지 계산\n  z = r + e·x mod q\n  π = (a, z)           // 전송\n\n검증자: e = H(g ∥ y ∥ a)  // 동일 해시\n  → gᶻ == a · yᵉ mod p 확인.' },
  { label: 'Random Oracle Model (ROM)', body: '안전성 가정:\n  H를 "완전한 랜덤 함수"로 모델링.\n  H(x) = truly random, 같은 x → 같은 출력.\n\n실제 구현: SHA-256, BLAKE2, Poseidon\n  → ROM 하에서 대화형과 동일한 건전성.\n  // Extractor: H를 제어하면 비밀 추출 가능.' },
];

export default function FiatShamirViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.int}>대화형 (Interactive)</text>
              {['P → V: a = g^r mod p   // 커밋',
                'V → P: e ← random(Zq) // 챌린지',
                'P → V: z = r + e·x mod q', '',
                'V: g^z == a · y^e ?',
                '// V가 온라인 필요 → 블록체인 불가'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.int}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fs}>Fiat-Shamir 변환</text>
              {['e = H(g ∥ y ∥ a)   // 해시가 V를 대체',
                '  = H(04 ∥ 18 ∥ 08) // 예시',
                '  = SHA256(...) mod q', '',
                '// a가 먼저 결정 → e 조작 불가',
                '// H: "프로그래밍 가능한 랜덤 오라클"'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ni}>비대화형 증명</text>
              {['r ← random(Zq)',
                'a = g^r mod p',
                'e = H(g ∥ y ∥ a)  // 자체 챌린지',
                'z = r + e·x mod q',
                'π = (a, z)         // 전송', '',
                '검증: e\' = H(g∥y∥a), g^z == a·y^e\'?'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.ni}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.rom}>ROM 안전성</text>
              {['가정: H(x) = truly random oracle',
                '같은 입력 → 같은 출력, 그 외 무작위.', '',
                '실제: SHA-256, BLAKE2, Poseidon',
                '→ ROM 하 대화형과 동일한 건전성.', '',
                '// Extractor: H를 제어 → x 추출 가능'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.rom}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
