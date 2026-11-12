import SceneShell from "./SceneShell";

/**
 * 본문 대응: #load-balancing capacity 식의 예. m=128, k=2, n=8 → mk=256, q=256/8=32.
 * φ=1.25 → C=⌈1.25×32⌉=40. 실제 load c=46 → o=max(0, 46−40)=6.
 * 그림은 load가 46인 expert 하나의 buffer만 그린다. 다른 expert의 load는 본문에 없다.
 */
const M = 128;
const K = 2;
const N = 8;
const PHI = 1.25;
const Q = (M * K) / N;
const CAP = Math.ceil(PHI * Q);
const LOAD = 46;
const OVER = Math.max(0, LOAD - CAP);

const SLOTS = 48;
const X0 = 12;
const CELL = 7;
const BASE = 74;
const CELL_H = 26;
const xAt = (count: number) => X0 + count * CELL;

const SCENES = [
  { label: "균등 load", summary: `${M}×${K}÷${N} = ${Q}`, note: `Token ${M}개가 각각 expert ${K}개를 고르면 assignment는 ${M * K}개입니다. Expert ${N}개가 똑같이 나눈다면 하나당 ${Q}개이고, 이것이 균등 load q입니다.` },
  { label: "buffer 상한", summary: `⌈${PHI}×${Q}⌉ = ${CAP}`, note: `균등 load에 여유 배수(capacity factor) φ=${PHI}를 곱해 expert buffer가 받을 상한 C를 정합니다. 굵은 테두리가 이 expert의 buffer ${CAP}칸입니다.` },
  { label: "실제 load가 넘칠 때", summary: `${LOAD} − ${CAP} = ${OVER}`, note: `Router가 이 expert에 실제로 ${LOAD}개를 보냈다면 ${CAP}개는 buffer에 들어가고, 테두리 밖 점선 칸 ${OVER}개가 overflow입니다. 상한 이하였다면 overflow는 0입니다.` },
  { label: "넘친 6개를 어떻게 할까", summary: "drop · reroute · buffer 확장", note: "Overflow를 처리하는 정책은 셋 중 하나를 고르는 일입니다. Drop과 reroute는 model quality와 routing semantics를 바꾸고, buffer 확장은 memory·padding cost를 늘립니다. 그래서 quality와 memory를 함께 보고 정합니다." },
] as const;

const POLICIES = [
  ["drop", "넘친 assignment를 계산하지 않음", "quality·routing semantics 변화"],
  ["reroute", "다른 expert로 보냄", "quality·routing semantics 변화"],
  ["buffer 확장", "상한을 키워 받음", "memory와 padding cost 증가"],
] as const;

export default function CapacityOverflowViz() {
  return (
    <SceneShell
      eyebrow="Capacity · overflow"
      title="Expert buffer 상한 40칸에 46개가 오면 6개가 넘친다"
      description="칸 하나가 assignment 하나이고, load가 46인 expert 하나의 buffer만 그렸습니다. m=128·k=2·n=8·φ=1.25·load 46은 본문 계산의 예입니다."
      ariaLabel="균등 load 32, capacity 40, 실제 load 46, overflow 6을 칸으로 보여 주는 계산"
      scenes={SCENES}
      render={(active) => {
        const filled = active === 0 ? Q : active === 1 ? Q : LOAD;
        const showCap = active >= 1;
        const showLoad = active >= 2;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 126" className="mx-auto block h-auto w-full max-w-xl" role="img" aria-label={SCENES[active].summary}>
              {Array.from({ length: SLOTS }, (_, index) => {
                const on = index < filled;
                const over = showLoad && index >= CAP && index < LOAD;
                return (
                  <rect
                    key={index}
                    x={xAt(index) + 0.75}
                    y={BASE - CELL_H}
                    width={CELL - 1.5}
                    height={CELL_H}
                    rx={1}
                    fill={on ? (over ? "#fef3c7" : "#93c5fd") : "none"}
                    stroke={over ? "#b45309" : on ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={1}
                    strokeDasharray={over ? "2 1.5" : undefined}
                  />
                );
              })}
              {showCap && (
                <rect x={X0} y={BASE - CELL_H - 4} width={CAP * CELL} height={CELL_H + 8} rx={2} fill="none" stroke="#64748b" strokeWidth={1.25} />
              )}
              <line x1={xAt(Q)} x2={xAt(Q)} y1={BASE - CELL_H - 14} y2={BASE + 10} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 2" />
              <text x={xAt(Q)} y={BASE - CELL_H - 18} textAnchor="middle" fontSize={13} fill="#2563eb">q={Q}</text>
              {showCap && (
                <text x={xAt(CAP)} y={BASE + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill="#64748b">C={CAP}</text>
              )}
              {showLoad && (
                <text x={xAt(LOAD)} y={BASE - CELL_H - 18} textAnchor="end" fontSize={13} fontWeight={700} fill="#b45309">c={LOAD}</text>
              )}
              {showLoad && (
                <text x={(xAt(CAP) + xAt(LOAD)) / 2} y={BASE + 44} textAnchor="middle" fontSize={13} fill="#b45309">overflow {OVER}</text>
              )}
              <text x={X0} y={BASE + 24} fontSize={12} fill="#64748b">0</text>
            </svg>
            <div className={`mt-3 grid grid-cols-3 gap-1.5 sm:gap-2 ${active === 3 ? "" : "opacity-30"}`}>
              {POLICIES.map(([name, action, cost]) => (
                <div key={name} className="min-w-0 rounded-lg border border-border bg-background p-2 text-[11px] leading-4 sm:p-2.5 sm:text-xs sm:leading-5">
                  <p className="font-bold">{name}</p>
                  <p className="text-muted-foreground">{action}</p>
                  <p className="text-amber-700 dark:text-amber-400">{cost}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
