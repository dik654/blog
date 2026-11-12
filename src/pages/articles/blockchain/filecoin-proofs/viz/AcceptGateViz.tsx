import SceneShell from "./SceneShell";

/**
 * 본문 대응: ModernArticle.tsx #verification-router — A = P_ok ∧ D_ok ∧ S_expected ∧ V(π,S,P).
 * 넷 중 하나라도 0이면 A = 0. 마지막 장면은 본문 interpretation의 "다른 sector order로 만든 proof".
 */
type Bit = 1 | 0 | null;

const GATES = [
  { sym: "P_ok", name: "profile·VK 허용", hint: "proof type, parameters, VK, revision이 허용 목록에 있음" },
  { sym: "D_ok", name: "canonical decode", hint: "길이와 field/group encoding이 유효함" },
  { sym: "S_expected", name: "요청과 같은 statement", hint: "CommD, CommR, prover, sector, randomness와 PoSt면 challenged sector 순서까지 요청과 일치" },
  { sym: "V", name: "암호학적 verify", hint: "profile P의 verifier로 π와 S 검사" },
] as const;

const SCENES = [
  {
    label: "넷 다 1",
    summary: "1 ∧ 1 ∧ 1 ∧ 1 = 1",
    note: "VK는 verification key(검증 키), statement는 proof가 참이라고 주장하는 공개 입력 묶음입니다. 네 조건이 모두 1일 때만 proof receipt를 승인합니다. 이 승인도 암호학적 statement의 완료일 뿐, deadline inclusion은 별개입니다.",
    bits: [1, 1, 1, 1] as const,
  },
  {
    label: "허용 목록 밖의 VK",
    summary: "0 ∧ … = 0",
    note: "proof type·parameters·VK·revision이 허용 목록에 없으면 첫 조건이 0입니다. 본문 순서대로 이 조건과 decode를 통과해야 다음 단계로 갑니다.",
    bits: [0, null, null, null] as const,
  },
  {
    label: "decode 실패",
    summary: "1 ∧ 0 ∧ … = 0",
    note: "길이나 field/group encoding이 맞지 않는 bytes는 statement를 볼 단계까지 가지 않습니다.",
    bits: [1, 0, null, null] as const,
  },
  {
    label: "다른 sector 순서",
    summary: "1 ∧ 1 ∧ 0 ∧ … = 0",
    note: "PoSt에서 다른 sector 순서나 randomness로 만든 proof는 그 자체로 valid해도, 요청에서 만든 statement와 다르므로 S_expected = 0이고 거절합니다. proof bytes만 맞는다고 통과시키지 않는 이유입니다.",
    bits: [1, 1, 0, null] as const,
  },
] as const;

function bitClass(bit: Bit) {
  if (bit === 1) return "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30";
  if (bit === 0) return "border-red-600 bg-red-50 dark:bg-red-950/30";
  return "border-dashed border-border/60 text-muted-foreground/60";
}

export default function AcceptGateViz() {
  return (
    <SceneShell
      eyebrow="Proof 승인 경계"
      title="네 조건이 모두 1이어야 proof receipt를 승인합니다"
      description="칸 하나가 승인 조건 하나입니다. —는 앞 조건이 이미 0이라 A가 0으로 정해졌다는 뜻입니다."
      ariaLabel="profile, decode, statement, verify 네 조건의 AND로 정해지는 proof 승인"
      scenes={SCENES}
      render={(active) => {
        const bits: readonly Bit[] = SCENES[active].bits;
        const accepted = bits.every((bit) => bit === 1);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GATES.map((gate, index) => (
                <div key={gate.sym} className={`min-w-0 rounded-lg border px-2.5 py-2 ${bitClass(bits[index])}`}>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="font-mono text-xs font-bold">{gate.sym}</span>
                    <span className="font-mono text-lg font-bold">{bits[index] === null ? "—" : bits[index]}</span>
                  </div>
                  <p className="mt-1 break-keep text-xs font-semibold leading-5">{gate.name}</p>
                  <p className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground">{gate.hint}</p>
                </div>
              ))}
            </div>
            <div className={`mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${accepted ? "border-emerald-600" : "border-red-600"}`}>
              <span className="text-sm font-bold">A = {accepted ? 1 : 0}</span>
              <span className={`text-sm font-semibold ${accepted ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                {accepted ? "✓ proof receipt 승인" : "✕ 거절"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
