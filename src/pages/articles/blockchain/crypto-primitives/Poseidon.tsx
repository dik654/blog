import ExplainedFormula from "@/components/ui/explained-formula";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function Poseidon() {
  return (
    <section id="poseidon" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Poseidon: 회로 비용을 기준으로 설계한 field hash</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          SHA-2처럼 bitwise operation이 많은 hash도 회로에서 구현할 수 있지만, bit decomposition과 boolean constraint가 필요합니다. Poseidon은 증명 시스템이 이미 사용하는 prime field에서 덧셈·곱셈·거듭제곱을 직접 계산하도록 설계했습니다. 핵심은 “항상 빠른 hash”가 아니라 <strong>같은 field arithmetic circuit 안에서 필요한 multiplication constraint를 줄이는 hash</strong>라는 점입니다. CPU native hash와 wall-clock 비교는 별도 benchmark가 필요합니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="poseidon-round" />
      <ExplainedFormula
        question="한 Poseidon round는 state를 어떻게 비선형적으로 섞을까요?"
        idea="Round constant로 대칭을 깨고, S-box로 비선형성을 넣은 뒤, invertible MDS matrix로 한 좌표의 차이를 전체 state에 확산합니다. Partial round는 S-box를 일부 좌표에만 적용해 회로 비용을 줄이되 그만큼 분석된 round 수가 필요합니다."
        formula={String.raw`\mathbf x^{(r+1)}=M\,S_r\!\left(\mathbf x^{(r)}+\mathbf c^{(r)}\right),\qquad S(x)=x^\alpha`}
        terms={[
          { symbol: String.raw`\mathbf x^{(r)}`, name: "state", description: "r번째 round가 받는 t개 field element입니다." },
          { symbol: String.raw`\mathbf c^{(r)}`, name: "round constants", description: "각 round와 위치에 고정된 field constants입니다." },
          { symbol: "S_r", name: "full 또는 partial S-box layer", description: "모든 좌표 또는 지정된 좌표에 x^α를 적용합니다." },
          { symbol: "M", name: "linear mixing matrix", description: "State 차이를 여러 좌표로 퍼뜨리는 invertible matrix입니다." },
        ]}
        assumptions={["α는 해당 field에서 permutation이 되도록 gcd(α,p−1)=1을 만족합니다.", "Round constants·matrix·full/partial round 수는 공개 분석을 거친 하나의 parameter set으로 고정합니다."]}
        interpretation="Fₚ에서 α=5라면 x⁵는 square·square·multiply 세 번으로 계산할 수 있습니다. 그러나 ‘세 multiplication’만으로 hash 한 번의 전체 constraint 수를 말할 수는 없고, width·round 수·linear layer·sponge 흡수 횟수를 모두 세어야 합니다."
      />
      <ExplainedFormula
        question="Sponge의 capacity가 이상적인 collision security 상한을 어떻게 제한할까요?"
        idea="Rate 좌표로 입출력을 주고받아도 capacity 좌표는 내부에 남아 permutation 호출 사이의 숨은 상태를 만듭니다. 이상적 permutation model에서는 capacity c field elements가 제공하는 bit 수와 digest 길이 중 작은 값이 collision search의 상한을 정합니다."
        formula={String.raw`b_{\mathrm{coll}}\lesssim \frac{\min(c\log_2 p,\,n)}{2}`}
        terms={[
          { symbol: "c", name: "capacity width", description: "외부 rate와 분리한 field element 수입니다." },
          { symbol: "p", name: "field modulus", description: "한 field element가 담을 수 있는 상태 수를 정합니다." },
          { symbol: "n", name: "digest bits", description: "외부에 내보내는 digest의 유효 bit 길이입니다." },
          { symbol: "b_{coll}", name: "generic collision work exponent", description: "대략 2^b 시도에 해당하는 이상적 상한입니다." },
        ]}
        assumptions={["Permutation이 ideal에 가깝고 padding·domain separation이 모호하지 않습니다.", "이 상한은 구체 Poseidon parameter에 대한 대수·차분 공격 분석을 대신하지 않습니다."]}
        interpretation="BN254 field element 하나를 capacity로 둔다고 자동으로 정확히 127-bit 보안이 증명되는 것은 아닙니다. Digest encoding과 실제 parameter security analysis가 더 낮은 상한을 만들 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>선택 기준과 반례</h3>
        <p>
          회로의 field·arity·입력 길이, 구현 가능한 검증된 parameter set, 다른 시스템과의 호환성을 먼저 고릅니다. 회로 밖에서만 hash한다면 SHA-2·SHA-3·BLAKE 계열이 더 나을 수 있습니다. “x⁵가 싸다”는 이유로 round 수를 줄이거나 임의 matrix를 쓰면 논문의 security argument가 사라지며, 서로 다른 tree node·leaf·protocol에 같은 encoding을 쓰면 collision resistance가 있어도 구조적 모호성이 생기므로 domain separation을 둡니다.
        </p>
      </div>
    </section>
  );
}
