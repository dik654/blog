/**
 * Montgomery 곱셈 시각화 — CIOS 알고리즘의 step-by-step.
 */
export default function MontgomeryMulViz() {
  const W = 720;
  const H = 380;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 880 }}>
        <text x={W / 2} y={22} textAnchor="middle" fontSize={13} fontWeight={700}
          fill="var(--foreground)">Montgomery 곱셈 — CIOS · 나눗셈 없이 modular multiply</text>

        {/* Inputs */}
        <g>
          <rect x={20} y={50} width={140} height={70} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1} />
          <text x={90} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">a (Mont form)</text>
          <text x={90} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">aR mod p</text>
          <text x={90} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">4-limb (256 bit)</text>
          <text x={90} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">a[0]..a[3]</text>
        </g>
        <g>
          <rect x={180} y={50} width={140} height={70} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1} />
          <text x={250} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">b (Mont form)</text>
          <text x={250} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">bR mod p</text>
          <text x={250} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">4-limb (256 bit)</text>
          <text x={250} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">b[0]..b[3]</text>
        </g>
        <g>
          <rect x={340} y={50} width={140} height={70} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1} />
          <text x={410} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">p, inv (사전계산)</text>
          <text x={410} y={86} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">prime modulus</text>
          <text x={410} y={100} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">inv = -p^-1 mod 2^64</text>
          <text x={410} y={114} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">curve constant</text>
        </g>

        {/* CIOS Loop */}
        <g>
          <rect x={20} y={140} width={680} height={170} rx={8}
            fill="#8b5cf6" fillOpacity={0.05} stroke="#8b5cf6" strokeWidth={1.4} />
          <text x={W / 2} y={160} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">CIOS 루프 (i = 0..3) — 부분곱 + 환원 동시</text>

          {/* Step 1 */}
          <rect x={40} y={175} width={210} height={120} rx={6}
            fill="#3b82f6" fillOpacity={0.10} stroke="#3b82f6" strokeWidth={1} />
          <text x={145} y={193} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Step 1 — 부분곱 누적</text>
          <text x={145} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">t[j] += a[j] * b[i]</text>
          <text x={145} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">carry propagation</text>
          <text x={145} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">register accumulation</text>
          <text x={145} y={266} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">128-bit math</text>
          <text x={145} y={282} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">5-limb 임시 버퍼</text>

          {/* arrow */}
          <line x1={260} y1={235} x2={290} y2={235} stroke="#94a3b8" strokeWidth={1.2} />
          <polygon points="290,235 284,232 284,238" fill="#94a3b8" />

          {/* Step 2 */}
          <rect x={300} y={175} width={210} height={120} rx={6}
            fill="#f59e0b" fillOpacity={0.10} stroke="#f59e0b" strokeWidth={1} />
          <text x={405} y={193} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">Step 2 — Mont 환원</text>
          <text x={405} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">m = t[0] * inv</text>
          <text x={405} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">t += m * p</text>
          <text x={405} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">나눗셈 X · shift O</text>
          <text x={405} y={266} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">t[0] = 0 보장</text>
          <text x={405} y={282} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">→ 64-bit shift 효과</text>

          <line x1={520} y1={235} x2={550} y2={235} stroke="#94a3b8" strokeWidth={1.2} />
          <polygon points="550,235 544,232 544,238" fill="#94a3b8" />

          {/* Step 3 */}
          <rect x={560} y={175} width={130} height={120} rx={6}
            fill="#10b981" fillOpacity={0.10} stroke="#10b981" strokeWidth={1} />
          <text x={625} y={193} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Step 3</text>
          <text x={625} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">t &gt;= p ?</text>
          <text x={625} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">t -= p (한 번만)</text>
          <text x={625} y={250} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">최종 감산</text>
          <text x={625} y={282} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">결과 = abR mod p</text>
        </g>

        {/* GPU register usage */}
        <g>
          <rect x={20} y={325} width={680} height={45} rx={6}
            fill="#ec4899" fillOpacity={0.06} stroke="#ec4899" strokeWidth={1} strokeDasharray="3 2" />
          <text x={W / 2} y={345} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ec4899">GPU 운영 — 4-limb CIOS = 약 40 레지스터 / thread</text>
          <text x={W / 2} y={361} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">SM 당 점유율과 직접 trade-off · MSM 의 단일 step 비용 결정</text>
        </g>
      </svg>
    </div>
  );
}
