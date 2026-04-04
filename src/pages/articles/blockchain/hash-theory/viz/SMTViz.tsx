import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b', DEF = '#94a3b8';
const MUT = 'var(--muted-foreground)';

const STEPS = [
  { label: 'SMT 구조', body: '2^256 리프가 고정 위치에 항상 존재한다.\n빈 리프 = 기본값. 빈 서브트리는 깊이별 상수 해시로 대체.' },
  { label: '멤버십 증명', body: '리프에 실제 데이터가 있음을 sibling 경로로 증명.\n리프부터 루트까지 해시를 재계산하여 루트와 비교.' },
  { label: '비멤버십 증명', body: '키의 비트열로 위치를 찾아가서 리프가 기본값인지 확인.\n같은 방식으로 루트까지 재계산 → "데이터 없음" 증명.' },
];

const NR = 13;
/* Tree shifted right slightly, edges get 0/1 labels */
const N = [
  { x: 160, y: 22, l: 'Root', def: false },
  { x: 96, y: 66, l: 'H', def: false },
  { x: 224, y: 66, l: '기본값', def: true },
  { x: 64, y: 110, l: 'H', def: false },
  { x: 128, y: 110, l: '기본값', def: true },
  { x: 42, y: 154, l: 'Data', def: false },
  { x: 86, y: 154, l: '기본값', def: true },
];
const ED = [[0, 1], [0, 2], [1, 3], [1, 4], [3, 5], [3, 6]];
/* bit labels on edges: left=0, right=1 */
const EDGE_BITS = ['0', '1', '0', '1', '0', '1'];
const MEM_PATH = [5, 3, 1, 0];
const NON_PATH = [6, 3, 1, 0];

function Badge({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  const w = text.length * 7.5 + 12;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
      <rect x={x - w / 2} y={y - 9} width={w} height={18} rx={9} fill={color} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="white">
        {text}
      </text>
    </motion.g>
  );
}

function Tree({ step }: { step: number }) {
  const path = step === 1 ? MEM_PATH : step === 2 ? NON_PATH : [];
  const ac = step === 1 ? C2 : C3;

  return (
    <g>
      {ED.map(([a, b], ei) => {
        const on = path.includes(a) && path.includes(b);
        const mx = (N[a].x + N[b].x) / 2;
        const my = (N[a].y + N[b].y) / 2;
        return (
          <g key={`e${ei}`}>
            <line x1={N[a].x} y1={N[a].y + NR} x2={N[b].x} y2={N[b].y - NR}
              stroke={on ? ac : N[b].def ? DEF : 'var(--border)'}
              strokeWidth={on ? 1.6 : 0.6}
              strokeDasharray={N[b].def ? '4 3' : 'none'} />
            {step >= 1 && (
              <text x={mx + (EDGE_BITS[ei] === '0' ? -8 : 8)} y={my + 4}
                textAnchor="middle" fontSize={9} fontWeight={600}
                fill={on ? ac : MUT} opacity={on ? 1 : 0.4}>
                {EDGE_BITS[ei]}
              </text>
            )}
          </g>
        );
      })}
      {N.map((n, i) => {
        const on = path.includes(i);
        const isTgt = (step === 1 && i === 5) || (step === 2 && i === 6);
        const c = isTgt ? ac : n.def ? DEF : on ? ac : C1;
        return (
          <g key={i}>
            {n.def ? (
              <rect x={n.x - 26} y={n.y - 14} width={52} height={28} rx={5}
                fill={`${DEF}10`} stroke={isTgt ? ac : DEF}
                strokeWidth={isTgt ? 2 : .6}
                strokeDasharray={isTgt ? 'none' : '4 3'} />
            ) : (
              <circle cx={n.x} cy={n.y} r={NR} fill={`${c}12`} stroke={c}
                strokeWidth={on ? 1.6 : 0.8} />
            )}
            <text x={n.x} y={n.y + 5} textAnchor="middle"
              fontSize={n.def ? 10 : 11} fontWeight={600} fill={isTgt ? ac : c}>
              {n.l}
            </text>
          </g>
        );
      })}
      {step === 1 && <Badge x={42} y={130} text="증명 대상" color={C2} />}
      {step === 2 && <Badge x={86} y={130} text="빈 위치" color={C3} />}
    </g>
  );
}

export default function SMTViz() {
  const rx = 320;
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 680 230" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          <Tree step={step} />

          {/* ═══ Step 0: structure + default hash mini-tree ═══ */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={rx} y={18} fontSize={14} fontWeight={700} fill={C1}>
                Sparse Merkle Tree
              </text>
              <text x={rx} y={38} fontSize={12} fill={MUT}>
                2²⁵⁶ 리프가 고정 위치에 항상 존재
              </text>
              <text x={rx} y={56} fontSize={12} fill={MUT}>
                빈 리프 = 기본값. 빈 서브트리 = 상수 해시로 대체
              </text>

              {/* Mini default-hash tree diagram */}
              {(() => {
                const bx = rx + 16, by = 78;
                const cw = 74, ch = 32, gap = 10;
                const leafY = by + 76, midY = by + 38;
                const l0x = bx, l1x = bx + cw + gap;
                const mx = bx + (cw + gap) / 2;

                return (<>
                  <text x={rx} y={by - 6} fontSize={11} fontWeight={600} fill={DEF}>
                    빈 서브트리 해시 계산 예시:
                  </text>

                  {/* Leaf level */}
                  {[l0x, l1x].map((lx, i) => (
                    <g key={`dl${i}`}>
                      <rect x={lx} y={leafY} width={cw} height={ch} rx={5}
                        fill={`${DEF}10`} stroke={DEF} strokeWidth={.6} strokeDasharray="4 3" />
                      <text x={lx + cw / 2} y={leafY + 14} textAnchor="middle"
                        fontSize={10} fill={DEF}>hash(0x00)</text>
                      <text x={lx + cw / 2} y={leafY + 28} textAnchor="middle"
                        fontSize={9} fontWeight={600} fill={DEF}>= e3b0c4...</text>
                      <line x1={lx + cw / 2} y1={leafY} x2={mx + cw / 2} y2={midY + ch}
                        stroke={DEF} strokeWidth={.5} strokeDasharray="3 2" />
                    </g>
                  ))}
                  <text x={l0x - 4} y={leafY + ch / 2 + 4} textAnchor="end"
                    fontSize={10} fill={DEF}>D₀</text>
                  <text x={l1x + cw + 4} y={leafY + ch / 2 + 4}
                    fontSize={10} fill={DEF}>D₀</text>

                  {/* Mid level */}
                  <rect x={mx} y={midY} width={cw} height={ch} rx={5}
                    fill={`${DEF}10`} stroke={DEF} strokeWidth={.6} strokeDasharray="4 3" />
                  <text x={mx + cw / 2} y={midY + 14} textAnchor="middle"
                    fontSize={10} fill={DEF}>hash(D₀∥D₀)</text>
                  <text x={mx + cw / 2} y={midY + 28} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={DEF}>= 5df6e0...</text>
                  <text x={mx - 4} y={midY + ch / 2 + 4} textAnchor="end"
                    fontSize={10} fill={DEF}>D₁</text>

                  {/* Arrow up */}
                  <line x1={mx + cw / 2} y1={midY} x2={mx + cw / 2} y2={midY - 12}
                    stroke={DEF} strokeWidth={.5} strokeDasharray="3 2" />
                  <text x={mx + cw / 2} y={midY - 16} textAnchor="middle"
                    fontSize={10} fill={DEF}>↑ hash(D₁∥D₁) = D₂ ...</text>

                  {/* Summary */}
                  <text x={rx} y={leafY + ch + 18} fontSize={12} fill={C1}>
                    → 깊이마다 상수 1개만 저장하면 충분
                  </text>
                </>);
              })()}
            </motion.g>
          )}

          {/* ═══ Step 1: membership proof ═══ */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={rx} y={20} fontSize={14} fontWeight={700} fill={C2}>
                멤버십 증명 (Inclusion Proof)
              </text>
              <text x={rx} y={42} fontSize={12} fill={MUT}>
                경로 비트: 0→왼 1→오. 리프까지 내려감
              </text>

              {/* Verification going up */}
              <rect x={rx - 8} y={56} width={348} height={106} rx={8}
                fill={`${C2}06`} stroke={C2} strokeWidth={.5} strokeDasharray="4 3" />
              <text x={rx} y={74} fontSize={12} fontWeight={600} fill={C2}>
                리프부터 올라가며 검증:
              </text>
              <text x={rx} y={94} fontSize={11} fill={C2}>
                leaf = hash(Data) — 실제 데이터 해시
              </text>
              <text x={rx} y={112} fontSize={11} fill={C2}>
                h₁ = hash(leaf ∥ sibling₁)
              </text>
              <text x={rx} y={130} fontSize={11} fill={C2}>
                h₂ = hash(h₁ ∥ sibling₂)
              </text>
              <text x={rx} y={148} fontSize={11} fontWeight={600} fill={C2}>
                h₂ == Root ✓ → "이 데이터는 트리에 있다"
              </text>

              <text x={rx} y={180} fontSize={12} fill={MUT}>
                일반 Merkle Tree의 Inclusion Proof와 동일
              </text>
            </motion.g>
          )}

          {/* ═══ Step 2: non-membership proof ═══ */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={rx} y={20} fontSize={14} fontWeight={700} fill={C3}>
                비멤버십 증명 (Exclusion Proof)
              </text>

              {/* Key K explanation */}
              <rect x={rx - 8} y={32} width={348} height={42} rx={8}
                fill={`${C3}08`} stroke={C3} strokeWidth={.5} />
              <text x={rx} y={50} fontSize={12} fill={C3}>
                키 K = 검색할 주소/ID의 해시값
              </text>
              <text x={rx} y={66} fontSize={11} fill={MUT}>
                K의 비트열이 경로를 결정: 0→왼 1→오 0→왼
              </text>

              {/* Verification going up */}
              <rect x={rx - 8} y={82} width={348} height={106} rx={8}
                fill={`${C3}06`} stroke={C3} strokeWidth={.5} strokeDasharray="4 3" />
              <text x={rx} y={100} fontSize={12} fontWeight={600} fill={C3}>
                리프부터 올라가며 검증:
              </text>
              <text x={rx} y={120} fontSize={11} fill={C3}>
                leaf = 기본값 (빈 리프의 고정값)
              </text>
              <text x={rx} y={138} fontSize={11} fill={C3}>
                h₁ = hash(sibling₁ ∥ leaf)
              </text>
              <text x={rx} y={156} fontSize={11} fill={C3}>
                h₂ = hash(h₁ ∥ sibling₂)
              </text>
              <text x={rx} y={174} fontSize={11} fontWeight={600} fill={C3}>
                h₂ == Root ✓ → "이 키에 데이터 없음"
              </text>

              <text x={rx} y={206} fontSize={12} fill={MUT}>
                검증 방식은 멤버십과 동일 — 리프 값만 다름
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
