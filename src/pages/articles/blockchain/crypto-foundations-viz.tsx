import VizFrame from "@/components/viz/VizFrame";
import { MathFlow, MathLedger } from "./math-viz-primitives";

export type CryptoFoundationVizMode =
  | "primitive-map"
  | "poseidon-round"
  | "merkle-path"
  | "schnorr-transcript"
  | "ed25519-transcript"
  | "algebra-contract"
  | "csprng-lifecycle"
  | "dlp-asymmetry"
  | "power-cycle"
  | "bsgs-grid"
  | "jacobian-affine"
  | "pairing-groups";

const CELLS = [1, 3, 9, 10, 13, 5, 15, 11, 16, 14, 8, 7, 4, 12, 2, 6];

function TwoColumnCompare({
  left,
  right,
}: {
  left: { label: string; title: string; lines: readonly string[] };
  right: { label: string; title: string; lines: readonly string[] };
}) {
  return (
    <div className="grid min-w-0 gap-6 md:grid-cols-2">
      {[left, right].map((item) => (
        <section key={item.label} className="min-w-0 border-t border-border pt-4">
          <p className="font-mono text-[11px] font-semibold text-primary">{item.label}</p>
          <h4 className="mt-2 text-sm font-bold leading-6">{item.title}</h4>
          <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
            {item.lines.map((line) => (
              <li key={line} className="break-words [overflow-wrap:anywhere]">
                {line}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function PowerCycle() {
  return (
    <div className="min-w-0">
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[660px] grid-cols-[48px_repeat(16,minmax(32px,1fr))] gap-x-1 gap-y-2 text-center text-xs">
          <span className="text-left font-mono text-muted-foreground">x</span>
          {CELLS.map((_, index) => <span key={`x-${index}`} className="font-mono text-muted-foreground">{index}</span>)}
          <span className="text-left font-mono font-semibold text-primary">3ˣ</span>
          {CELLS.map((value, index) => (
            <span key={`v-${index}`} className={`border py-2 font-mono ${value === 5 ? "border-primary text-primary" : "border-border/70"}`}>
              {value}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-5 border-l border-border pl-4 text-xs leading-5 text-muted-foreground">
        3의 order가 16이라 결과가 1…16을 정확히 한 번씩 방문합니다. y=5의 위치는 x=5이지만, 큰 군에서는 이 표 전체를 만들 수 없습니다.
      </p>
    </div>
  );
}

function BsgsGrid() {
  return (
    <div className="grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)]">
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>j = 열의 baby-step</span><span>i = 행의 giant-step</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {CELLS.map((value, index) => {
            const baby = index < 4;
            const target = value === 5;
            const meet = baby && value === 3;
            return (
              <div key={value} className={`min-w-0 border px-2 py-3 text-center ${target || meet ? "border-primary" : "border-border/70"}`}>
                <p className="font-mono text-[10px] text-muted-foreground">i={Math.floor(index / 4)}, j={index % 4}</p>
                <p className={`mt-1 font-mono text-sm font-bold ${target || meet ? "text-primary" : baby ? "text-foreground" : "text-muted-foreground"}`}>{value}</p>
              </div>
            );
          })}
        </div>
      </div>
      <ol className="min-w-0 space-y-5 border-l border-border pl-5 text-xs leading-5">
        <li><strong>1. 저장</strong><p className="mt-1 text-muted-foreground">baby table: 1→0, 3→1, 9→2, 10→3</p></li>
        <li><strong>2. 이동</strong><p className="mt-1 text-muted-foreground">m=4, g⁻ᵐ=3⁻⁴≡4. y=5에서 5·4≡3으로 이동합니다.</p></li>
        <li><strong>3. 만남</strong><p className="mt-1 text-muted-foreground">3은 baby j=1에 있으므로 i=1, j=1입니다.</p></li>
        <li><strong>4. 복원</strong><p className="mt-1 font-mono text-primary">x=im+j=1·4+1=5</p></li>
      </ol>
    </div>
  );
}

export default function CryptoFoundationsViz({ mode }: { mode: CryptoFoundationVizMode }) {
  if (mode === "dlp-asymmetry") {
    return (
      <VizFrame eyebrow="한 방향은 빠르고, 역방향은 비싸다" title="같은 식을 어느 방향으로 읽느냐가 보안 가정을 만든다" description="작은 예에서는 표로 역산할 수 있지만, 큰 prime-order subgroup에서는 generic attack도 대략 제곱근 규모가 필요합니다." note="‘어렵다’는 증명된 불가능이 아니라, parameter와 공격 모델을 고정했을 때 알려진 공격 비용이 예산을 넘는다는 뜻입니다.">
        <TwoColumnCompare left={{ label: "FORWARD", title: "x=5에서 y=3⁵ mod 17 계산", lines: ["반복 제곱으로 O(log x) group operations", "3²=9, 3⁴=13, 3⁵=5"] }} right={{ label: "REVERSE", title: "y=5에서 x 찾기", lines: ["brute force는 최대 q번", "BSGS·Pollard rho는 약 √q번", "알려진 x 범위나 작은 subgroup이면 더 쉬워짐"] }} />
      </VizFrame>
    );
  }

  if (mode === "power-cycle") {
    return <VizFrame eyebrow="작은 군의 전체 관찰" title="거듭제곱 표는 순환부분군과 이산로그를 동시에 보여 준다" description="g=3, mod 17의 작은 예를 모두 펼쳐 generator의 의미와 역방향 탐색을 눈으로 확인합니다." note="큰 parameter에서 이 표를 만들 수 없다는 사실이 핵심입니다. 작은 예의 뒤섞임 자체는 난이도 증명이 아닙니다."><PowerCycle /></VizFrame>;
  }

  if (mode === "bsgs-grid") {
    return <VizFrame eyebrow="Meet-in-the-middle" title="q개 지수를 √q×√q 격자로 나눠 두 탐색이 만나게 한다" description="첫 행을 저장한 뒤 y에 g⁻ᵐ을 반복 곱해 저장한 값과 만나는 지점을 찾습니다." note="시간 O(√q), 메모리 O(√q)입니다. Pollard rho는 비슷한 기대 시간에 메모리를 줄이지만 확률적 collision 탐색을 사용합니다."><BsgsGrid /></VizFrame>;
  }

  if (mode === "jacobian-affine") {
    return (
      <VizFrame eyebrow="좌표 표현의 비용" title="같은 점을 affine로 읽고 Jacobian으로 계산한다" description="프로젝트 좌표는 점 자체를 바꾸지 않고, 반복 덧셈에서 비싼 field inversion을 마지막 한 번으로 미룹니다." note="Z=0은 point at infinity를 나타내는 구현 convention입니다. 입력 validation·subgroup check는 좌표 변환과 별도입니다.">
        <TwoColumnCompare left={{ label: "AFFINE", title: "저장·직렬화: (x,y)", lines: ["곡선식 y²=x³+ax+b를 직접 검사", "일반 덧셈마다 denominator inverse 필요", "canonical encoding 경계에 적합"] }} right={{ label: "JACOBIAN", title: "반복 연산: (X,Y,Z)", lines: ["x=X/Z², y=Y/Z³", "mul·square로 add/double 수행", "끝에서 batch 또는 단일 inversion으로 affine 복귀"] }} />
      </VizFrame>
    );
  }

  if (mode === "pairing-groups") {
    return (
      <VizFrame eyebrow="Pairing 입력과 출력" title="G1·G2·GT는 같은 점 타입이 아니라 서로 다른 군이다" description="BN254 구현은 G1을 Fp 위에, G2를 twist를 이용해 Fp² 위에 표현하고 pairing 결과를 Fp¹²의 prime-order subgroup에서 다룹니다." note="EIP-197은 G2에 curve equation뿐 아니라 order 검사를 요구합니다. Pairing이 있다고 DLP가 쉬워지는 것은 아니며, 선택한 curve의 구체적 보안 분석이 필요합니다.">
        <MathFlow steps={[
          { label: "G1", title: "E(Fp)[q]", body: "Base field 위 prime-order subgroup", code: "P₁=(1,2)" },
          { label: "G2", title: "E′(Fp²)[q]", body: "Twist 위에서 싸게 표현한 두 번째 입력군", code: "qP₂=O" },
          { label: "PAIR", title: "e(P,Q)", body: "두 additive groups를 bilinear하게 결합", code: "e(aP,bQ)=e(P,Q)ᵃᵇ" },
          { label: "GT", title: "Fp¹²* [q]", body: "Pairing 결과가 놓이는 multiplicative subgroup", code: "∏e(Pᵢ,Qᵢ)=1" },
        ]} />
      </VizFrame>
    );
  }

  const configs = {
    "primitive-map": {
      eyebrow: "보장 조합 지도",
      title: "프리미티브마다 보호하는 질문이 다르다",
      description: "입력·출력·보안 보장·실패 조건을 분리해야 여러 도구를 안전하게 조합할 수 있습니다.",
      note: "서명 성공은 메시지 내용이 참이라는 뜻이 아니고, Merkle proof 성공은 root가 정당한 chain state라는 뜻이 아닙니다.",
      steps: [
        { label: "HASH", title: "Poseidon", body: "긴 field input을 고정 길이 digest로 압축", code: "collision/preimage assumptions" },
        { label: "COMMIT", title: "Merkle·Pedersen", body: "먼저 값을 고정하고 나중에 선택적으로 엽니다.", code: "binding + hiding?" },
        { label: "AUTH", title: "Schnorr·Ed25519", body: "비밀키 소유자가 message를 승인했음을 확인", code: "EUF-CMA target" },
        { label: "ALGEBRA", title: "군·체", body: "덧셈·역원·scalar multiplication의 연산 규칙", code: "not a security property alone" },
      ],
    },
    "poseidon-round": {
      eyebrow: "Field-native permutation",
      title: "상수·비선형성·확산을 반복해 sponge state를 섞는다",
      description: "Poseidon은 bitwise hash를 흉내 내지 않고 증명회로가 직접 계산하기 쉬운 field operations로 permutation을 구성합니다.",
      note: "라운드 수와 MDS matrix는 임의로 줄일 수 있는 tuning knob가 아닙니다. field·width·S-box와 분석을 함께 고정한 parameter set을 사용합니다.",
      steps: [
        { label: "ABSORB", title: "rate에 입력 흡수", body: "capacity는 외부 출력으로 직접 쓰지 않습니다.", code: "state ← state + block" },
        { label: "ARK", title: "round constants", body: "구조적 대칭을 깨뜨립니다.", code: "xᵢ ← xᵢ+cᵢ" },
        { label: "S-BOX", title: "비선형 map", body: "full/partial round에서 적용 범위를 달리합니다.", code: "x ← x^α" },
        { label: "MIX", title: "linear diffusion", body: "한 좌표의 차이를 state 전체로 퍼뜨립니다.", code: "x ← Mx" },
      ],
    },
    "merkle-path": {
      eyebrow: "선택적 opening",
      title: "한 leaf와 sibling path만으로 committed root를 다시 계산한다",
      description: "Verifier는 전체 tree를 받지 않고 leaf, index bit, 각 level의 sibling hash를 순서대로 결합합니다.",
      note: "Membership proof는 collision resistance와 정확한 encoding/domain separation에 의존합니다. Sparse tree의 non-membership은 default leaf 규칙까지 root에 고정해야 합니다.",
      steps: [
        { label: "LEAF", title: "key·value encoding", body: "leaf domain을 내부 node와 분리합니다.", code: "h₀=H(0x00∥k∥v)" },
        { label: "PATH 0", title: "index bit로 순서 선택", body: "왼쪽·오른쪽 순서를 바꾸면 root도 달라집니다.", code: "h₁=H(h₀∥s₀)" },
        { label: "PATH d", title: "sibling을 level마다 결합", body: "proof size와 verify work는 depth에 비례합니다.", code: "hᵢ₊₁=H(order(hᵢ,sᵢ))" },
        { label: "ROOT", title: "commitment와 비교", body: "계산 root가 trusted root와 같을 때만 포함을 승인합니다.", code: "h_d ?= root" },
      ],
    },
    "schnorr-transcript": {
      eyebrow: "Sigma protocol에서 서명으로",
      title: "commitment를 먼저 고정하고 challenge를 message에 묶는다",
      description: "Fiat–Shamir는 verifier의 random challenge를 transcript hash로 바꿔 비대화형 서명을 만듭니다.",
      note: "같은 nonce로 서로 다른 challenge에 응답하면 비밀키가 선형식으로 노출됩니다. Encoding·domain separation·nonce derivation까지 scheme의 일부입니다.",
      steps: [
        { label: "COMMIT", title: "R=kG", body: "비밀 nonce의 공개 group point를 먼저 고정합니다.", code: "k∈Zq" },
        { label: "CHALLENGE", title: "e=H(ctx∥R∥P∥m)", body: "키·메시지·domain을 transcript에 묶습니다.", code: "Fiat–Shamir" },
        { label: "RESPONSE", title: "s=k+ex mod q", body: "nonce와 secret scalar를 challenge로 결합합니다.", code: "signature=(R,s)" },
        { label: "VERIFY", title: "sG ?= R+eP", body: "group equation은 secret을 직접 보지 않고 관계를 검사합니다.", code: "P=xG" },
      ],
    },
    "ed25519-transcript": {
      eyebrow: "RFC 8032 Ed25519",
      title: "secret prefix로 nonce를 결정론적으로 만들고 strict encoding으로 검증한다",
      description: "Ed25519는 EdDSA의 구체적 parameter set이며, 단순히 ‘Schnorr에 SHA-512를 붙인 것’으로 구현하면 호환성과 안전 조건을 놓칩니다.",
      note: "결정론적 nonce는 entropy가 전혀 필요 없다는 뜻이 아닙니다. 최초 secret key 생성과 fault/side-channel 방어는 여전히 필요합니다.",
      steps: [
        { label: "EXPAND", title: "H(secret seed)", body: "clamped scalar a와 nonce prefix를 나눕니다.", code: "A=[a]B" },
        { label: "NONCE", title: "r=H(prefix∥M) mod L", body: "같은 key·message는 같은 r을 만듭니다.", code: "R=[r]B" },
        { label: "CHALLENGE", title: "k=H(R∥A∥M) mod L", body: "commitment·public key·message를 함께 묶습니다.", code: "S=(r+ka) mod L" },
        { label: "VERIFY", title: "[8S]B ?= [8]R+[8k]A", body: "RFC 8032의 cofactored equation 전에 parse range와 point policy를 적용합니다.", code: "signature=R∥S" },
      ],
    },
    "algebra-contract": {
      eyebrow: "연산 계약",
      title: "교환군·환·체는 포함 계보가 아니라 서로 다른 연산 요구다",
      description: "Schnorr는 prime-order additive group과 scalar field를 함께 사용하고, Poseidon은 field arithmetic을 사용합니다.",
      note: "일반적인 field의 덧셈군은 아벨군이고 nonzero 원소는 곱셈군을 이루지만, ‘아벨군→환→체’가 모든 객체의 단순 포함 계보라는 표현은 부정확합니다.",
      steps: [
        { label: "GROUP", title: "한 연산과 inverse", body: "항등원·결합법칙·각 원소의 역원을 요구합니다.", code: "P+O=P" },
        { label: "ABELIAN", title: "교환 가능한 group", body: "순서를 바꿔도 결과가 같습니다.", code: "P+Q=Q+P" },
        { label: "RING", title: "덧셈과 곱셈", body: "덧셈군과 곱셈의 분배법칙을 둡니다.", code: "a(b+c)=ab+ac" },
        { label: "FIELD", title: "0이 아닌 곱셈 inverse", body: "다항식 나눗셈과 보간을 정확히 정의합니다.", code: "a≠0 ⇒ a⁻¹ exists" },
      ],
    },
    "csprng-lifecycle": {
      eyebrow: "Random bit generator lifecycle",
      title: "noise를 검증·conditioning한 뒤 stateful DRBG로 확장한다",
      description: "통계적으로 고르게 보이는 출력과 공격자가 예측할 수 없는 출력은 다릅니다. Seed와 내부 state의 수명이 핵심입니다.",
      note: "Statistical test 통과는 entropy나 compromise resistance의 증거가 아닙니다. OS CSPRNG API를 사용하고 자체 entropy estimate와 DRBG를 조립하지 않는 것이 기본 선택입니다.",
      steps: [
        { label: "NOISE", title: "물리·시스템 관측", body: "공격자가 통제하거나 예측할 수 있는 범위를 모델링합니다.", code: "raw samples" },
        { label: "ASSESS", title: "health test·min-entropy", body: "가장 가능성 높은 결과를 기준으로 보수적으로 평가합니다.", code: "H∞=-log₂ pmax" },
        { label: "INSTANTIATE", title: "conditioning·seed", body: "entropy input과 nonce/personalization으로 state를 만듭니다.", code: "state₀←Instantiate" },
        { label: "GENERATE", title: "output·state update·reseed", body: "출력 뒤 state를 갱신하고 정책에 따라 새 entropy를 섞습니다.", code: "(bits,state′)←Generate" },
      ],
    },
  } as const;

  const config = configs[mode as keyof typeof configs];
  return (
    <VizFrame eyebrow={config.eyebrow} title={config.title} description={config.description} note={config.note}>
      <MathFlow steps={config.steps} />
      {mode === "primitive-map" && (
        <div className="mt-8 border-t border-border pt-6">
          <MathLedger items={[
            { label: "HASH", value: "digest", meaning: "압축·무결성, hiding 아님" },
            { label: "COMMIT", value: "commit/open", meaning: "binding과 hiding을 따로 확인" },
            { label: "SIGN", value: "signature", meaning: "승인·key possession" },
            { label: "GROUP", value: "operation", meaning: "보안 가정의 계산 무대" },
          ]} />
        </div>
      )}
    </VizFrame>
  );
}
