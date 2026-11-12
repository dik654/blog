import SceneShell from "./SceneShell";

/**
 * 본문 대응: #identity-policy MRENCLAVE·MRSIGNER 카드와 #blob-migration의 K_s = KDF(K_root, I‖p‖v‖u‖g).
 * 같은 platform(같은 K_root)에서 v1 enclave가 급여 서명 키를 봉인했다고 두고(가정),
 * 후보 enclave마다 context 칸 I·p·v·u·g 중 무엇이 달라지는지 비교한다.
 * 결과 문구는 본문 카드와 실패 표("Unapproved signer or lower SVN → key derivation 또는 policy appraisal 거부")를 따른다.
 */
type Mark = "same" | "diff" | "ok";
type Field = readonly [string, string, Mark];

const FIELD_NAMES = [
  ["I", "identity"],
  ["p", "product"],
  ["v", "SVN"],
  ["u", "용도"],
  ["g", "세대"],
] as const;

const SCENES = [
  {
    label: "MRENCLAVE · v1 재부팅",
    summary: "다섯 칸 그대로 → 열림",
    policy: 0,
    candidate: "v1 enclave (봉인한 build 그대로)",
    fields: [["v1 측정값", "v1 측정값", "same"], ["P", "P", "same"], ["최소 SVN", "최소 SVN", "same"], ["급여 서명", "급여 서명", "same"], ["g1", "g1", "same"]] as readonly Field[],
    verdict: "열 수 있음",
    good: true,
    note: "같은 platform에서 같은 build가 다시 요청하면 context 다섯 칸이 봉인 때와 같으니 같은 K_s가 나옵니다. 재부팅 뒤 다시 여는 기본 경우입니다.",
  },
  {
    label: "MRENCLAVE · v1.1",
    summary: "I가 바뀌면 → 다른 K_s",
    policy: 0,
    candidate: "v1.1 enclave (작은 code/config 변경)",
    fields: [["v1 측정값", "v1.1 측정값", "diff"], ["P", "P", "same"], ["최소 SVN", "최소 SVN", "same"], ["급여 서명", "급여 서명", "same"], ["g1", "g1", "same"]] as readonly Field[],
    verdict: "열지 못할 수 있음",
    good: false,
    note: "MRENCLAVE는 정확한 enclave measurement입니다. 작은 code/config 변경도 measurement를 바꿀 수 있고, 바뀌면 I 칸이 달라져 다른 K_s가 파생됩니다. 그래서 엄격하지만 upgrade가 어렵습니다.",
  },
  {
    label: "MRSIGNER · v1.1",
    summary: "signer·product 같음, SVN ≥ 최소",
    policy: 1,
    candidate: "v1.1 enclave (같은 signer S, 같은 product)",
    fields: [["signer S", "signer S", "same"], ["P", "P", "same"], ["최소 SVN", "SVN ≥ 최소", "ok"], ["급여 서명", "급여 서명", "same"], ["g1", "g1", "same"]] as readonly Field[],
    verdict: "열 수 있음",
    good: true,
    note: "MRSIGNER에서는 I 칸이 build가 아니라 signer입니다. 코드를 고쳐도 같은 signer·같은 product이고 SVN이 허용 최소값 이상이면 같은 version 계열로 열 수 있습니다.",
  },
  {
    label: "MRSIGNER · 낮은 SVN",
    summary: "SVN < 최소 → 거부",
    policy: 1,
    candidate: "낮은 SVN의 build (같은 signer S)",
    fields: [["signer S", "signer S", "same"], ["P", "P", "same"], ["최소 SVN", "SVN < 최소", "diff"], ["급여 서명", "급여 서명", "same"], ["g1", "g1", "same"]] as readonly Field[],
    verdict: "거부",
    good: false,
    note: "Signer가 같아도 SVN이 허용 최소값보다 낮으면 key derivation 또는 policy appraisal 단계에서 거부됩니다. 최소 SVN이 downgrade를 막는 칸입니다.",
  },
  {
    label: "MRSIGNER · 다른 product",
    summary: "p가 다름 → 다른 K_s",
    policy: 1,
    candidate: "같은 signer S의 다른 product",
    fields: [["signer S", "signer S", "same"], ["P", "Q", "diff"], ["최소 SVN", "SVN ≥ 최소", "ok"], ["급여 서명", "급여 서명", "same"], ["g1", "g1", "same"]] as readonly Field[],
    verdict: "다른 key",
    good: false,
    note: "Product identity p는 같은 signer 아래 서로 다른 product를 분리하는 칸입니다. Signer가 같아도 p가 다르면 context가 달라져 다른 K_s가 나옵니다.",
  },
  {
    label: "MRSIGNER · 다른 signer",
    summary: "I가 다름 → 거부",
    policy: 1,
    candidate: "다른 signer T의 enclave",
    fields: [["signer S", "signer T", "diff"], ["P", "P", "same"], ["최소 SVN", "SVN ≥ 최소", "ok"], ["급여 서명", "급여 서명", "same"], ["g1", "g1", "same"]] as readonly Field[],
    verdict: "거부",
    good: false,
    note: "승인되지 않은 signer는 key derivation 또는 policy appraisal 단계에서 거부됩니다. 다른 칸이 모두 맞아도 I 칸 하나가 다르면 같은 key를 얻지 못합니다.",
  },
  {
    label: "개봉 범위 비교",
    summary: "build 하나 vs signer 계열",
    policy: 2,
    candidate: "",
    fields: [] as readonly Field[],
    verdict: "",
    good: true,
    note: "MRENCLAVE는 build 하나에, MRSIGNER는 signer가 서명한 허용 version 계열에 개봉 범위를 묶습니다. 넓어진 범위만큼 signer key와 SVN policy가 더 큰 trust anchor(신뢰를 거는 출발점)가 됩니다.",
  },
] as const;

const MARK_TEXT: Record<Mark, string> = { same: "= 같음", ok: "✓ 허용", diff: "≠ 다름" };

const SCOPE = [
  ["v1 (봉인한 build)", true, true],
  ["v1.1 (같은 signer·product, SVN ≥ 최소)", false, true],
  ["SVN < 최소인 build", false, false],
  ["같은 signer의 다른 product", false, false],
  ["다른 signer", false, false],
] as const;

export default function SealScopeViz() {
  return (
    <SceneShell
      eyebrow="누가 다시 열 수 있나"
      title="봉인 때의 context 다섯 칸과 후보 enclave의 칸을 한 칸씩 맞춰 본다"
      description="같은 platform에서 v1 enclave가 급여 서명 키를 봉인했다고 둡니다(가정). Sealing key K_s는 TEE hardware가 보호하는 platform root에 I(identity)·p(product)·v(허용 최소 SVN, security version)·u(용도)·g(blob 세대)를 이어 붙인 context를 넣어 파생되므로, 한 칸이라도 다르면 같은 key가 나오지 않습니다. I 칸은 MRENCLAVE 정책에서 build를 정확히 가리키는 측정값(measurement), MRSIGNER 정책에서 signer입니다. 이름 v1.1·S·T·P·Q는 그림용입니다."
      ariaLabel="MRENCLAVE와 MRSIGNER 정책에서 후보 enclave별로 sealing key context를 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        if (scene.policy === 2) {
          return (
            <div className="min-w-0 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[minmax(0,1fr)_4.75rem_4.75rem] gap-2 bg-muted/40 px-3 py-2 text-[11px] font-semibold sm:grid-cols-[minmax(0,1fr)_7rem_7rem]">
                <span>후보 <span className="font-normal text-muted-foreground">(v1 외 MRENCLAVE ×는 측정값이 달라진 경우)</span></span>
                <span className="text-center">MRENCLAVE</span>
                <span className="text-center">MRSIGNER</span>
              </div>
              {SCOPE.map(([name, enclave, signer]) => (
                <div key={name} className="grid grid-cols-[minmax(0,1fr)_4.75rem_4.75rem] items-center gap-2 border-t border-border px-3 py-1.5 text-xs sm:grid-cols-[minmax(0,1fr)_7rem_7rem]">
                  <span className="min-w-0 break-keep">{name}</span>
                  <span className={`text-center ${enclave ? "font-bold text-primary" : "text-muted-foreground"}`}>{enclave ? "○ 열림" : "× 안 열림"}</span>
                  <span className={`text-center ${signer ? "font-bold text-primary" : "text-muted-foreground"}`}>{signer ? "○ 열림" : "× 안 열림"}</span>
                </div>
              ))}
            </div>
          );
        }
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="min-w-0 text-xs text-muted-foreground">{["MRENCLAVE", "MRSIGNER"][scene.policy]} 정책 · 후보: <span className="font-semibold text-foreground">{scene.candidate}</span></p>
              <p className={`text-sm font-bold ${scene.good ? "text-primary" : "text-amber-700 dark:text-amber-400"}`}>결과: {scene.verdict}</p>
            </div>
            <div className="mt-2 overflow-hidden rounded-lg border border-border">
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_3.75rem] gap-2 bg-muted/40 px-2 py-1.5 text-[11px] font-semibold text-muted-foreground sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem] sm:px-3">
                <span>칸</span>
                <span>봉인 때</span>
                <span>후보</span>
                <span className="text-right">비교</span>
              </div>
              {FIELD_NAMES.map(([symbol, name], index) => {
                const [sealed, now, mark] = scene.fields[index];
                const diff = mark === "diff";
                return (
                  <div key={symbol} className={`grid grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_3.75rem] items-center gap-2 border-t px-2 py-1 text-xs sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)_4.5rem] sm:px-3 ${diff ? "border-amber-600 bg-amber-50 dark:bg-amber-950/30" : "border-border"}`}>
                    <span className="min-w-0"><span className="font-mono font-bold">{symbol}</span> <span className="text-[10px] text-muted-foreground">{name}</span></span>
                    <span className="min-w-0 break-keep">{sealed}</span>
                    <span className={`min-w-0 break-keep ${diff ? "font-bold text-amber-700 dark:text-amber-400" : ""}`}>{now}</span>
                    <span className={`text-right text-[11px] font-semibold ${diff ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>{MARK_TEXT[mark]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
