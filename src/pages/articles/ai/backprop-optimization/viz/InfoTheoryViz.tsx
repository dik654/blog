export default function InfoTheoryViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 720 370" className="w-full h-auto" style={{ maxWidth: 900 }}>
        <text x={360} y={24} textAnchor="middle" fontSize={16} fontWeight={700}
          fill="var(--foreground)">정보이론 계층 — Information → Entropy → CE → KL</text>

        <defs>
          <marker id="it-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* Level 1: Information Content */}
        <rect x={190} y={48} width={340} height={60} rx={10}
          fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={2} />
        <text x={360} y={68} textAnchor="middle" fontSize={13} fontWeight={700} fill="#3b82f6">
          ① Information Content (자기 정보량)
        </text>
        <text x={360} y={84} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          I(x) = −log P(x)
        </text>
        <text x={360} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          확률 낮을수록 정보 많음 (surprise)
        </text>

        <line x1={360} y1={110} x2={360} y2={130} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#it-arr)" />
        <text x={375} y={125} fontSize={10} fill="var(--muted-foreground)">기대값 = E[I(x)]</text>

        {/* Level 2: Entropy */}
        <rect x={190} y={134} width={340} height={60} rx={10}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={2} />
        <text x={360} y={154} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          ② Entropy (불확실성)
        </text>
        <text x={360} y={170} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          H(P) = −Σ P(x) log P(x)
        </text>
        <text x={360} y={186} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          분포 P의 평균 정보량 · Uniform이 최대
        </text>

        {/* Branches to Cross-Entropy */}
        <line x1={360} y1={196} x2={360} y2={220} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#it-arr)" />
        <text x={376} y={214} fontSize={10} fill="var(--muted-foreground)">두 분포 확장 (P→Q)</text>

        {/* Level 3: Cross-Entropy */}
        <rect x={190} y={224} width={340} height={60} rx={10}
          fill="#f59e0b" fillOpacity={0.1} stroke="#f59e0b" strokeWidth={2} />
        <text x={360} y={244} textAnchor="middle" fontSize={13} fontWeight={700} fill="#f59e0b">
          ③ Cross-Entropy (교차 엔트로피)
        </text>
        <text x={360} y={260} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          H(P, Q) = −Σ P(x) log Q(x)
        </text>
        <text x={360} y={276} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          P를 Q로 인코딩 시 평균 bits · H(P,Q) ≥ H(P)
        </text>

        <line x1={360} y1={286} x2={360} y2={306} stroke="#8b5cf6" strokeWidth={2} markerEnd="url(#it-arr)" />
        <text x={376} y={300} fontSize={10} fill="var(--muted-foreground)">H(P,Q) − H(P)</text>

        {/* Level 4: KL Divergence */}
        <rect x={150} y={310} width={420} height={52} rx={10}
          fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={2} />
        <text x={360} y={330} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ef4444">
          ④ KL Divergence (분포 간 거리)
        </text>
        <text x={360} y={348} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
          KL(P‖Q) = Σ P(x) log(P(x)/Q(x)) = H(P,Q) − H(P)
        </text>

        {/* 사이드 박스 — 분류 문제 적용 */}
        <rect x={15} y={48} width={160} height={160} rx={8}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={95} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">분류 문제</text>
        <line x1={25} y1={76} x2={165} y2={76} stroke="#8b5cf6" strokeOpacity={0.3} strokeWidth={0.8} />
        <text x={25} y={94} fontSize={10} fontWeight={700} fill="var(--foreground)">P</text>
        <text x={25} y={108} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          one-hot label
        </text>
        <text x={25} y={126} fontSize={10} fontWeight={700} fill="var(--foreground)">Q</text>
        <text x={25} y={140} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          softmax output
        </text>
        <text x={25} y={164} fontSize={10} fontWeight={700} fill="#10b981">H(P) = 0</text>
        <text x={25} y={180} fontSize={9} fill="var(--muted-foreground)">(one-hot)</text>
        <text x={25} y={200} fontSize={10} fontWeight={700} fill="#f59e0b">→ CE = KL</text>

        <rect x={545} y={48} width={160} height={160} rx={8}
          fill="#06b6d4" fillOpacity={0.08} stroke="#06b6d4" strokeWidth={1.5} />
        <text x={625} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill="#06b6d4">간단 공식</text>
        <line x1={555} y1={76} x2={695} y2={76} stroke="#06b6d4" strokeOpacity={0.3} strokeWidth={0.8} />
        <text x={555} y={96} fontSize={10} fill="var(--foreground)">one-hot 라벨이면</text>
        <text x={555} y={116} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#06b6d4">
          H(P,Q)
        </text>
        <text x={555} y={132} fontSize={10} fontFamily="monospace" fontWeight={700} fill="#06b6d4">
          &nbsp;= −log Q(정답)
        </text>
        <text x={555} y={160} fontSize={9} fill="var(--muted-foreground)">정답 클래스의</text>
        <text x={555} y={174} fontSize={9} fill="var(--muted-foreground)">확률에 −log</text>
        <text x={555} y={194} fontSize={9} fill="var(--muted-foreground)">취하기만 하면 됨</text>
      </svg>
    </div>
  );
}
