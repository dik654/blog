import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { a: '#6366f1', b: '#10b981', c: '#f59e0b', no: '#ef4444' };

const L = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} className="text-indigo-400 hover:underline">{children}</a>
);

const STEPS = [
  { label: '해시 함수 — 임의 입력 → 고정 출력', body: <>H: {'{'}0,1{'}'}* → {'{'}0,1{'}'}ⁿ — 임의 길이 입력을 고정 길이 출력으로 압축<br />같은 입력 → 항상 같은 출력 (결정적)<br />세 가지 안전성 정의가 해시 함수의 강도를 결정</> },
  { label: '역상 저항성 (Preimage Resistance)', body: <>출력 y가 주어졌을 때 H(x) = y인 x를 찾기 어려움<br />정방향: "hello" → H → abc1... (쉬움)<br />역방향: abc1... → ? (어려움, O(2ⁿ) brute force)<br />패스워드 해싱, <L href="/crypto/zk-theory#commitment-scheme">커밋먼트의 바인딩 성질</L>에 필수</> },
  { label: '2차 역상 저항성 (2nd Preimage)', body: <>x가 주어졌을 때 H(x') = H(x)인 다른 x'를 찾기 어려움<br />"hello"의 해시를 아는 상태에서 같은 해시를 내는 다른 입력을 못 만든다<br />디지털 서명 위조 방지에 핵심</> },
  { label: '충돌 저항성 (Collision Resistance)', body: <>H(x) = H(x')인 아무 x ≠ x' 쌍을 찾기 어려움 — 가장 강한 성질<br />생일 역설로 O(2^(n/2)) 공격 가능<br />n=256이면 2¹²⁸ 연산 — 현재 기술로 불가능<br /><L href="/crypto/hash-theory#merkle-tree">Merkle 트리</L>, <L href="/crypto/snark-overview#verify-flow">SNARK 검증</L>에서 핵심</> },
];

export default function HashSecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 정의 */}
              <rect x={40} y={8} width={360} height={22} rx={4}
                fill={`${C.a}10`} stroke={C.a} strokeWidth={0.8} />
              <text x={120} y={23} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.a}>
                {'{'}0,1{'}'}*
              </text>
              <text x={220} y={23} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.a}>
                → H →
              </text>
              <text x={320} y={23} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.a}>
                {'{'}0,1{'}'}ⁿ
              </text>
              <text x={120} y={40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                임의 길이 비트열
              </text>
              <text x={320} y={40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                고정 n비트 출력
              </text>
              {/* 예시: 입력 길이 다름 → 출력 길이 동일 */}
              {[
                { input: '"hello"', iw: 70, output: 'abc1f3...92', d: 0.3 },
                { input: '"hello world!!"', iw: 110, output: '7d9e2b...f4', d: 0.5 },
                { input: '1GB 파일 전체', iw: 130, output: 'f4c8a1...1b', d: 0.7 },
              ].map((e, i) => {
                const y = 52 + i * 30;
                const ix = 20;
                return (
                <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: e.d }}>
                  <rect x={ix} y={y} width={e.iw} height={22} rx={4}
                    fill={`${C.a}12`} stroke={C.a} strokeWidth={0.8} />
                  <text x={ix + e.iw / 2} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.a}>{e.input}</text>
                  <text x={220} y={y + 15} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ H →</text>
                  <rect x={280} y={y} width={120} height={22} rx={4}
                    fill={`${C.b}12`} stroke={C.b} strokeWidth={0.8} />
                  <text x={340} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.b}>{e.output}</text>
                </motion.g>
                );
              })}
              {/* 시각적 강조: 입력 길이 다름 vs 출력 동일 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <text x={75} y={146} textAnchor="middle" fontSize={9} fill={C.a}>↑ 길이 제각각</text>
                <text x={340} y={146} textAnchor="middle" fontSize={9} fill={C.b}>↑ 항상 같은 길이</text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (() => {
            const lx = 30, ax = 160, hx = 195, bx = 230, rx = 360;
            return (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={lx} y={28} fontSize={9} fontWeight={500} fill={C.b}>정방향 (쉬움)</text>
              <rect x={lx} y={32} width={390} height={24} rx={4} fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
              <text x={lx + 20} y={48} fontSize={10} fill={C.b}>"hello"</text>
              <text x={ax} y={48} textAnchor="middle" fontSize={10} fill={C.b}>→</text>
              <text x={hx} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.b}>H</text>
              <text x={bx} y={48} textAnchor="middle" fontSize={10} fill={C.b}>→</text>
              <text x={bx + 30} y={48} fontSize={10} fontWeight={600} fill={C.b}>abc1f3...</text>
              <text x={rx} y={48} fontSize={9} fill={C.b}>계산 즉시</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <text x={lx} y={76} fontSize={9} fontWeight={500} fill={C.no}>역방향 (어려움)</text>
                <rect x={lx} y={80} width={390} height={24} rx={4} fill={`${C.no}10`} stroke={C.no} strokeWidth={0.8} />
                <text x={lx + 20} y={96} fontSize={10} fill={C.no}>abc1f3...</text>
                <text x={ax} y={96} textAnchor="middle" fontSize={10} fill={C.no}>→</text>
                <text x={hx} y={96} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.no}>H⁻¹</text>
                <text x={bx} y={96} textAnchor="middle" fontSize={10} fill={C.no}>→</text>
                <text x={bx + 30} y={96} fontSize={10} fontWeight={600} fill={C.no}>역산 불가</text>
                <text x={rx} y={96} fontSize={9} fill={C.no}>O(2ⁿ)</text>
              </motion.g>
              <motion.text x={220} y={130} textAnchor="middle" fontSize={10} fill={C.a} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                출력만 보고 입력을 역산할 수 없다
              </motion.text>
            </motion.g>);
          })()}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={28} fontSize={9} fontWeight={500} fill={C.b}>주어진 입력</text>
              <rect x={20} y={32} width={400} height={24} rx={4} fill={`${C.b}10`} stroke={C.b} strokeWidth={0.8} />
              <text x={40} y={48} fontSize={10} fill={C.b}>"hello"</text>
              <text x={110} y={48} fontSize={10} fill={C.b}>→ H →</text>
              <text x={170} y={48} fontSize={10} fontWeight={600} fill={C.b}>abc1f3...</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <text x={20} y={76} fontSize={9} fontWeight={500} fill={C.no}>같은 해시를 내는 다른 입력?</text>
                <rect x={20} y={80} width={400} height={24} rx={4} fill={`${C.no}10`} stroke={C.no} strokeWidth={0.8} />
                <text x={40} y={96} fontSize={10} fill={C.no}>"???"</text>
                <text x={110} y={96} fontSize={10} fill={C.no}>→ H →</text>
                <text x={170} y={96} fontSize={10} fontWeight={600} fill={C.no}>abc1f3...</text>
                <text x={310} y={96} fontSize={9} fill={C.no}>← 찾기 불가능</text>
              </motion.g>
              <motion.text x={220} y={130} textAnchor="middle" fontSize={10} fill={C.a} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                특정 해시값을 노리고 다른 입력을 만들 수 없다
              </motion.text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={24} fontSize={9} fontWeight={500} fill={C.no}>아무 충돌쌍이라도 찾기 어려움</text>
              <rect x={20} y={28} width={165} height={24} rx={4} fill={`${C.c}10`} stroke={C.c} strokeWidth={0.8} />
              <text x={102} y={44} textAnchor="middle" fontSize={10} fill={C.c}>x → H → y</text>
              <text x={220} y={44} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.no}>= ?</text>
              <rect x={255} y={28} width={165} height={24} rx={4} fill={`${C.c}10`} stroke={C.c} strokeWidth={0.8} />
              <text x={337} y={44} textAnchor="middle" fontSize={10} fill={C.c}>x' → H → y</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={60} y={66} width={320} height={40} rx={5} fill={`${C.c}08`} stroke={C.c} strokeWidth={0.6} />
                <text x={220} y={82} textAnchor="middle" fontSize={10} fill={C.c}>
                  생일 역설: O(2^(n/2)) 시도로 충돌 가능
                </text>
                <text x={220} y={98} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  n=256 → 2¹²⁸ 연산 필요 — 현재 기술로 불가능
                </text>
              </motion.g>
              <motion.text x={220} y={128} textAnchor="middle" fontSize={10} fill={C.a} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                가장 강한 성질 — Merkle 트리, SNARK의 기반
              </motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
