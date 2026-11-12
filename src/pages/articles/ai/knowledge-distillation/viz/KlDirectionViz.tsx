import KdSceneShell from "./KdSceneShell";

/**
 * 본문 대응: #hard-soft-loss — (가정) q=(.5,.5), p=(.99,.01)에서 forward KL ≈ 1.61, reverse KL ≈ 0.64.
 * Forward: 0.5·ln(0.5/0.99) ≈ −0.34, 0.5·ln(0.5/0.01) ≈ +1.96 → 1.61.
 * Reverse: 0.99·ln(0.99/0.5) ≈ +0.68, 0.01·ln(0.01/0.5) ≈ −0.04 → 0.64. 자연로그 기준입니다.
 */
const Q = [0.5, 0.5] as const;
const P = [0.99, 0.01] as const;

const forwardTerms = Q.map((q, i) => q * Math.log(q / P[i]));
const reverseTerms = P.map((p, i) => p * Math.log(p / Q[i]));
const FORWARD = forwardTerms.reduce<number>((sum, value) => sum + value, 0);
const REVERSE = reverseTerms.reduce<number>((sum, value) => sum + value, 0);

const SCENES = [
  { label: "같은 두 분포", summary: "q = (.5, .5) · p = (.99, .01)", note: "Teacher q는 class A와 B에 반반을 두고, student p는 거의 전부를 A에 둡니다(가정). 아래 두 장면은 이 같은 분포를 서로 다른 순서로 비교합니다." },
  { label: "Forward KL · teacher q로 가중", summary: `−0.34 + 1.96 ≈ ${FORWARD.toFixed(2)}`, note: "각 class의 log 비율에 teacher 확률 q를 곱해 더합니다. Teacher가 0.5를 둔 class B에 student가 0.01만 두었으므로 그 항이 1.96으로 커지고 합의 대부분을 차지합니다." },
  { label: "Reverse KL · student p로 가중", summary: `0.68 − 0.04 ≈ ${REVERSE.toFixed(2)}`, note: "이번에는 student 확률 p를 곱합니다. Student가 0.01만 둔 class B는 가중치가 작아 거의 0이 되고, student가 몰아 둔 class A가 teacher에서도 허용되는지가 주로 남습니다." },
] as const;

const CLASSES = ["class A", "class B"] as const;
const TERM_SCALE = 2;

function ProbBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value}</span>
    </div>
  );
}

function TermBar({ value, color }: { value: number; color: string }) {
  const width = (Math.abs(value) / TERM_SCALE) * 50;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">이 class의 항</span>
      <div className="relative h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-1/2 w-px bg-[#94a3b8]" />
        <div
          className="absolute inset-y-0 rounded-sm"
          style={value >= 0 ? { left: "50%", width: `${width}%`, backgroundColor: color } : { right: "50%", width: `${width}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-right font-mono font-bold">{value >= 0 ? "+" : "−"}{Math.abs(value).toFixed(2)}</span>
    </div>
  );
}

export default function KlDirectionViz() {
  return (
    <KdSceneShell
      eyebrow="KL 방향"
      title="같은 두 분포라도 누구의 확률로 가중하느냐에 따라 KL이 달라집니다"
      description="KL divergence는 class마다 두 확률의 log 비율에 한쪽 확률을 곱해 더한 값입니다(자연로그). 위 카드의 (가정) q·p를 class별 항으로 풀었고, 가운데 세로선이 0입니다."
      ariaLabel="Teacher q와 student p 사이 forward KL과 reverse KL의 class별 항"
      scenes={SCENES}
      render={(active) => {
        const terms = active === 1 ? forwardTerms : active === 2 ? reverseTerms : null;
        const weight = active === 1 ? "q" : active === 2 ? "p" : null;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {CLASSES.map((name, i) => (
              <div key={name} className="min-w-0 space-y-2 rounded-lg border border-border bg-background px-3 py-3">
                <p className="text-sm font-bold">{name}</p>
                <ProbBar label="teacher q" value={Q[i]} color="#16a34a" />
                <ProbBar label="student p" value={P[i]} color="#2563eb" />
                <div className="min-h-[2.75rem] space-y-1">
                  {terms && weight ? (
                    <>
                      <TermBar value={terms[i]} color={active === 1 ? "#16a34a" : "#2563eb"} />
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {weight === "q" ? `${Q[i]} × ln(${Q[i]} ÷ ${P[i]})` : `${P[i]} × ln(${P[i]} ÷ ${Q[i]})`}
                      </p>
                    </>
                  ) : (
                    <p className="text-[11px] leading-5 text-muted-foreground">아직 항을 계산하지 않았습니다.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
