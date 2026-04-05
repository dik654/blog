export default function CcaAttestViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 290" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">CCA Attestation Token 구조 (CoRIM/EAT)</text>

        {/* Outer: CCA token */}
        <rect x={20} y={40} width={440} height={150} rx={10}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1.5} />
        <text x={240} y={58} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
          CCA Attestation Token (COSE_Sign1)
        </text>

        {/* Realm Token */}
        <rect x={40} y={75} width={195} height={100} rx={8}
          fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <text x={137} y={93} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">Realm Token</text>
        <text x={55} y={109} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· Challenge (nonce, 64B)</text>
        <text x={55} y={121} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· RIM (SHA-512, 64B)</text>
        <text x={55} y={133} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· REM[0..3] (64B × 4)</text>
        <text x={55} y={145} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· RPV (64B)</text>
        <text x={55} y={157} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· Hash algorithm ID</text>
        <text x={55} y={169} fontSize={7} fontWeight={600} fill="#10b981">서명: RAK (Realm Attestation Key)</text>

        {/* Platform Token */}
        <rect x={245} y={75} width={195} height={100} rx={8}
          fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
        <text x={342} y={93} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">Platform Token</text>
        <text x={260} y={109} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· Implementation ID</text>
        <text x={260} y={121} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· Instance ID</text>
        <text x={260} y={133} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· Security Lifecycle</text>
        <text x={260} y={145} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· SW Component hashes</text>
        <text x={260} y={157} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">· Profile (PSA/CCA-1)</text>
        <text x={260} y={169} fontSize={7} fontWeight={600} fill="#f59e0b">서명: IAK (Initial Attest. Key)</text>

        {/* Trust chain */}
        <rect x={20} y={205} width={440} height={75} rx={8}
          fill="var(--muted)" opacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={222} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
          신뢰 체인
        </text>
        <text x={35} y={240} fontSize={7.5} fill="var(--muted-foreground)">
          <tspan fontWeight={600} fill="#10b981">RAK</tspan> (Realm 측정값 서명) ← 서명자:
          <tspan fontWeight={600} fill="#f59e0b"> IAK</tspan> (Platform Token에 공개키 포함)
        </text>
        <text x={35} y={253} fontSize={7.5} fill="var(--muted-foreground)">
          <tspan fontWeight={600} fill="#f59e0b">IAK</tspan> (Platform 서명) ← 서명자:
          <tspan fontWeight={600}> Arm/SiP Root CA</tspan>
        </text>
        <text x={35} y={266} fontSize={7} fontStyle="italic" fill="var(--muted-foreground)">
          검증자는 IAK 공개키로 platform 확인 → IAK가 보증한 RAK로 realm 측정 확인
        </text>
      </svg>
    </div>
  );
}
