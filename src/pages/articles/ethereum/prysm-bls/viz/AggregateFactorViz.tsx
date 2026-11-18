import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aggregation — 같은 message point에 곱한 scalar는 더해서 한 번에 묶이지만,
 * signing root가 하나라도 다르면 public key를 먼저 더하는 FastAggregateVerify 전제가 깨진다.
 * 세 signature 96 B × 3 = 288 B → aggregate 96 B.
 */
const SIG_BYTES = 96;
const COUNT = 3;
const SEPARATE = SIG_BYTES * COUNT;

interface Sig {
  name: string;
  scalar: string;
  point: string;
  same: boolean;
}

const SAME: readonly Sig[] = [
  { name: "σ₁", scalar: "sk₁", point: "H(r_s)", same: true },
  { name: "σ₂", scalar: "sk₂", point: "H(r_s)", same: true },
  { name: "σ₃", scalar: "sk₃", point: "H(r_s)", same: true },
];

const MIXED: readonly Sig[] = [
  { name: "σ₁", scalar: "sk₁", point: "H(r_s)", same: true },
  { name: "σ₂", scalar: "sk₂", point: "H(r_s)", same: true },
  { name: "σ₃", scalar: "sk₃", point: "H(r_s′)", same: false },
];

const SCENES = [
  {
    label: "같은 signing root",
    summary: "세 signature · 같은 H(r_s)",
    note: "세 validator가 같은 signing root r_s에 서명하면 각 signature는 같은 G2 point H(r_s)에 자기 secret scalar를 곱한 값입니다. 따로 보내면 96 B × 3 = 288 B입니다.",
  },
  {
    label: "더하면 scalar 합 한 번",
    summary: "288 B → 96 B",
    note: "같은 point에 곱한 scalar들은 더한 뒤 한 번 곱한 것과 같습니다. Public key도 같은 세 참여자 것을 더하면 pairing 관계 하나로 검사합니다. 누가 참여했는지는 signature에 남지 않으므로 aggregation bits(참여 validator를 표시하는 bit 목록) 같은 consensus 자료가 따로 보존합니다.",
  },
  {
    label: "root가 하나라도 다르면",
    summary: "한 point로 묶이지 않음",
    note: "Attestation data나 domain이 하나라도 다르면 σ₃는 다른 point H(r_s′) 위에 있습니다. 합을 scalar 합 × 한 point로 쓸 수 없어 public key를 먼저 하나로 더하는 FastAggregateVerify 전제가 깨집니다. 각 (public key, signing root) 쌍을 보존하는 AggregateVerify나 독립 signature batch 경로가 필요합니다.",
  },
] as const;

function SigCard({ sig }: { sig: Sig }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center ${sig.same ? "border-border bg-background" : "border-[#dc2626] bg-background"}`}>
      <span className="block font-mono text-sm font-bold">{sig.name}</span>
      <span className="mt-1 block font-mono text-[11px] leading-5 sm:text-xs">
        {sig.scalar} · <span className={sig.same ? "font-bold text-[#2563eb]" : "font-bold text-[#dc2626]"}>{sig.point}</span>
      </span>
      <span className="block text-[10px] text-muted-foreground sm:text-xs">G2 · {SIG_BYTES} B</span>
    </div>
  );
}

function SizeBar({ label, bytes, color }: { label: string; bytes: number | null; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${((bytes ?? 0) / SEPARATE) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{bytes === null ? "−" : `${bytes} B`}</span>
    </div>
  );
}

export default function AggregateFactorViz() {
  return (
    <SceneShell
      eyebrow="같은 root만 더해서 묶입니다"
      title="Signature를 더하면 scalar가 한 point 앞으로 모입니다"
      description="카드 하나가 validator 한 명의 signature입니다. 파란 글자는 모두 같은 G2 point H(r_s), 빨간 글자는 다른 signing root에서 나온 point입니다. sk₁·sk₂·sk₃는 이름만 붙인 secret scalar이며 값은 정하지 않았습니다."
      ariaLabel="같은 signing root의 세 signature가 하나의 96바이트 aggregate로 합쳐지는 과정과 root가 다를 때 깨지는 전제"
      scenes={SCENES}
      render={(active) => {
        const sigs = active === 2 ? MIXED : SAME;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {sigs.map((sig) => <SigCard key={sig.name} sig={sig} />)}
            </div>
            <div className="rounded-lg border border-border bg-background px-3 py-2">
              {active === 0 && (
                <p className="font-mono text-xs leading-6 text-muted-foreground">아직 더하지 않음 · 세 검증식이 따로 있음</p>
              )}
              {active === 1 && (
                <div className="space-y-1 font-mono text-xs leading-6">
                  <p>σ_A = σ₁+σ₂+σ₃ = (sk₁+sk₂+sk₃) · <span className="font-bold text-[#2563eb]">H(r_s)</span></p>
                  <p>PK_A = PK₁+PK₂+PK₃ = (sk₁+sk₂+sk₃) · G₁</p>
                  <p className="font-bold">e(G₁, σ_A) = e(PK_A, <span className="text-[#2563eb]">H(r_s)</span>) · 관계 1개</p>
                  <p className="text-muted-foreground">aggregation bits: 1 1 1 (signature 밖에 보존)</p>
                </div>
              )}
              {active === 2 && (
                <div className="space-y-1 font-mono text-xs leading-6">
                  <p>σ₁+σ₂+σ₃ = (sk₁+sk₂) · <span className="font-bold text-[#2563eb]">H(r_s)</span> + sk₃ · <span className="font-bold text-[#dc2626]">H(r_s′)</span></p>
                  <p className="font-bold text-[#dc2626]">공통 point가 없음 → FastAggregateVerify 전제 깨짐</p>
                  <p className="text-muted-foreground">→ (PK_i, r_s,i) 쌍 보존: AggregateVerify 또는 batch</p>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <SizeBar label="따로 보내면" bytes={SEPARATE} color="#64748b" />
              <SizeBar label="aggregate" bytes={active === 1 ? SIG_BYTES : null} color="#2563eb" />
            </div>
          </div>
        );
      }}
    />
  );
}
